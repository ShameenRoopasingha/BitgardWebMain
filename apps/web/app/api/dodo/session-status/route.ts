import { NextResponse } from 'next/server';
import {
  computePeriodEnd,
  generateVigilLicenseKey,
  mapBillingCycle,
  mapPlanToTier,
  prisma,
  pushSubscriptionSyncToVigil,
  signBitgardSyncPayload,
  type VigilBillingCycle,
  type VigilSubscriptionStatus,
  type VigilTier,
} from '@bitgard/database';

const DEFAULT_EXE_URL =
  'https://zrlsaiygvlgaizedpbdr.supabase.co/storage/v1/object/public/bitgard-releases/vigil/Vigil-Setup-v0.1.0-x64.exe';
const DEFAULT_MSI_URL =
  'https://zrlsaiygvlgaizedpbdr.supabase.co/storage/v1/object/public/bitgard-releases/vigil/Vigil-Setup-v0.1.0-x64.msi';

function resolveVigilBaseUrl(): string {
  const syncUrl =
    process.env.VIGIL_SYNC_URL?.trim() ||
    'https://vigil-pos.vercel.app/api/bitgard/subscription-sync';
  try {
    return new URL(syncUrl).origin;
  } catch {
    return 'https://vigil-pos.vercel.app';
  }
}

interface DodoCheckoutSessionResponse {
  id?: string;
  payment_id?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
}

interface DodoPaymentDetailResponse {
  payment_id?: string;
  subscription_id?: string | null;
  status?: string;
  product_cart?: Array<{ product_id?: string }>;
  customer?: {
    customer_id?: string;
    email?: string;
    name?: string;
    phone_number?: string;
  };
  billing?: {
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  metadata?: {
    company_name?: string;
    companyName?: string;
    contact_name?: string;
    contactName?: string;
    phone?: string;
    address?: string;
    country?: string;
    plan?: string;
    billing_cycle?: string;
    billingCycle?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id')?.trim() || '';
    const planParam = searchParams.get('plan')?.trim() || '';
    const billingParam = searchParams.get('billing')?.trim() || '';

    const windowsExeUrl = process.env.NEXT_PUBLIC_VIGIL_WINDOWS_EXE_URL?.trim() || DEFAULT_EXE_URL;
    const windowsMsiUrl = process.env.NEXT_PUBLIC_VIGIL_WINDOWS_MSI_URL?.trim() || DEFAULT_MSI_URL;
    const vigilBaseUrl = resolveVigilBaseUrl();

    if (!sessionId || sessionId === '{CHECKOUT_SESSION_ID}' || sessionId.length < 6) {
      return NextResponse.json(
        { verified: false, error: 'Missing or invalid checkout session ID.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
    if (!apiKey || apiKey === 'test_your_dodo_api_key_here') {
      return NextResponse.json(
        { verified: false, error: 'Payment verification is not configured.' },
        { status: 503 }
      );
    }

    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';
    const dodoBaseUrl =
      environment === 'live_mode'
        ? 'https://live.dodopayments.com'
        : 'https://test.dodopayments.com';

    const sessionRes = await fetch(
      `${dodoBaseUrl}/checkouts/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json(
        { verified: false, error: 'Unable to verify checkout session with Dodo Payments.' },
        { status: 404 }
      );
    }

    const sessionData = (await sessionRes.json()) as DodoCheckoutSessionResponse;
    const paymentStatus = (sessionData.payment_status || '').toLowerCase();

    let paymentDetail: DodoPaymentDetailResponse | null = null;
    if (sessionData.payment_id) {
      const payRes = await fetch(
        `${dodoBaseUrl}/payments/${encodeURIComponent(sessionData.payment_id)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(12000),
        }
      );
      if (payRes.ok) {
        paymentDetail = (await payRes.json()) as DodoPaymentDetailResponse;
      }
    }

    const isSucceeded =
      paymentStatus === 'succeeded' ||
      (paymentDetail?.status || '').toLowerCase() === 'succeeded';

    if (!isSucceeded) {
      return NextResponse.json({
        verified: false,
        pending: true,
        paymentStatus: sessionData.payment_status || 'processing',
        portalLoginUrl: `${vigilBaseUrl}/login`,
        downloadUrls: { windowsExe: windowsExeUrl, windowsMsi: windowsMsiUrl },
      });
    }

    const email = (
      paymentDetail?.customer?.email ||
      sessionData.customer_email ||
      ''
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { verified: false, error: 'Customer email missing on checkout record.' },
        { status: 400 }
      );
    }

    const meta = paymentDetail?.metadata;
    const contactName =
      meta?.contact_name?.trim() ||
      meta?.contactName?.trim() ||
      paymentDetail?.customer?.name?.trim() ||
      sessionData.customer_name?.trim() ||
      null;
    const companyName =
      meta?.company_name?.trim() ||
      meta?.companyName?.trim() ||
      contactName ||
      email.split('@')[0];
    const phone =
      meta?.phone?.trim() ||
      paymentDetail?.customer?.phone_number?.trim() ||
      null;
    const billingFormatted = [
      paymentDetail?.billing?.street,
      paymentDetail?.billing?.city,
      paymentDetail?.billing?.state,
      paymentDetail?.billing?.zipcode,
    ]
      .filter(Boolean)
      .join(', ');
    const address =
      meta?.address?.trim() ||
      (billingFormatted ? billingFormatted : null);
    const country = (
      meta?.country?.trim() ||
      paymentDetail?.billing?.country?.trim() ||
      'LK'
    ).toUpperCase();

    const productId = paymentDetail?.product_cart?.[0]?.product_id;
    const existingSub = await prisma.vigilSubscription.findUnique({ where: { email } });

    const tier: VigilTier = mapPlanToTier(
      meta?.plan || productId || planParam || existingSub?.tier
    );
    const billingCycle: VigilBillingCycle =
      existingSub?.status === 'LIFETIME'
        ? 'LIFETIME'
        : mapBillingCycle(
            meta?.billing_cycle ||
              meta?.billingCycle ||
              productId ||
              billingParam ||
              existingSub?.billingCycle
          );

    const now = new Date();
    const effectiveStatus: VigilSubscriptionStatus =
      existingSub?.status === 'LIFETIME' ? 'LIFETIME' : 'ACTIVE';
    const currentPeriodEnd =
      effectiveStatus === 'LIFETIME'
        ? null
        : existingSub?.currentPeriodEnd && existingSub.currentPeriodEnd > now
        ? existingSub.currentPeriodEnd
        : computePeriodEnd(billingCycle, now);

    const subscription = await prisma.vigilSubscription.upsert({
      where: { email },
      update: {
        companyName,
        contactName: contactName || existingSub?.contactName,
        phone: phone || existingSub?.phone,
        address: address || existingSub?.address,
        country: country || existingSub?.country,
        tier,
        billingCycle,
        status: effectiveStatus,
        dodoCustomerId: paymentDetail?.customer?.customer_id || existingSub?.dodoCustomerId,
        dodoSubscriptionId: paymentDetail?.subscription_id || existingSub?.dodoSubscriptionId,
        dodoLastPaymentId: sessionData.payment_id || existingSub?.dodoLastPaymentId,
        currentPeriodStart: existingSub?.currentPeriodStart || now,
        currentPeriodEnd,
      },
      create: {
        email,
        companyName,
        contactName,
        phone,
        address,
        country,
        tier,
        billingCycle,
        status: effectiveStatus,
        source: 'DODO_PAYMENTS',
        dodoCustomerId: paymentDetail?.customer?.customer_id || null,
        dodoSubscriptionId: paymentDetail?.subscription_id || null,
        dodoLastPaymentId: sessionData.payment_id || null,
        licenseKey: generateVigilLicenseKey(),
        currentPeriodStart: now,
        currentPeriodEnd,
      },
    });

    const deliveryId = `checkout_${sessionId}`;
    await prisma.vigilSubscriptionEvent.upsert({
      where: { externalEventId: deliveryId },
      update: {},
      create: {
        subscriptionId: subscription.id,
        eventType: 'checkout.session.verified',
        externalEventId: deliveryId,
        actorEmail: email,
        payload: {
          sessionId,
          paymentId: sessionData.payment_id,
          tier,
          billingCycle,
        },
      },
    });

    const syncResult = await pushSubscriptionSyncToVigil({
      deliveryId,
      eventType: 'checkout.session.verified',
      email: subscription.email,
      companyName: subscription.companyName,
      contactName: subscription.contactName,
      phone: subscription.phone,
      address: subscription.address,
      country: subscription.country,
      tier: subscription.tier,
      billingCycle: subscription.billingCycle,
      status: subscription.status,
      source: subscription.source,
      isLifetime: subscription.status === 'LIFETIME',
      licenseKey: subscription.licenseKey,
      bitgardSubscriptionId: subscription.id,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() ?? null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      note: subscription.grantNote,
    });

    if (syncResult.synced) {
      await prisma.vigilSubscription.update({
        where: { id: subscription.id },
        data: {
          lastSyncedAt: new Date(),
          lastSyncStatus: 'SYNCED',
          lastSyncError: null,
        },
      });
    }

    let setupUrl: string | null = syncResult.setupUrl || null;
    const syncSecret = process.env.BITGARD_SYNC_SECRET?.trim();
    if (!setupUrl && syncSecret) {
      const tokenDeliveryId = `onboard_${sessionId}_${Date.now()}`;
      const rawBody = JSON.stringify({
        email: subscription.email,
        sessionId,
      });
      const headers = signBitgardSyncPayload(rawBody, syncSecret, tokenDeliveryId);
      const tokenRes = await fetch(`${vigilBaseUrl}/api/bitgard/onboarding-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: rawBody,
        signal: AbortSignal.timeout(8000),
      }).catch(() => null);

      if (tokenRes?.ok) {
        const tokenData = (await tokenRes.json().catch(() => ({}))) as { setupUrl?: string | null };
        setupUrl = tokenData.setupUrl || null;
      }
    }

    return NextResponse.json({
      verified: true,
      paymentStatus: 'succeeded',
      email: subscription.email,
      companyName: subscription.companyName,
      contactName: subscription.contactName,
      tier: subscription.tier,
      billingCycle: subscription.billingCycle,
      licenseKey: subscription.licenseKey,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      setupUrl,
      portalLoginUrl: `${vigilBaseUrl}/login`,
      forgotPasswordUrl: `${vigilBaseUrl}/forgot-password`,
      downloadUrls: {
        windowsExe: windowsExeUrl,
        windowsMsi: windowsMsiUrl,
      },
    });
  } catch (error) {
    console.error('Dodo session verification error:', error);
    return NextResponse.json(
      { verified: false, error: 'Failed to verify checkout session.' },
      { status: 500 }
    );
  }
}
