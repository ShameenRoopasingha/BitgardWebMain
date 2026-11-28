import { NextResponse } from 'next/server';
import {
  checkDistributedRateLimit,
  computePeriodEnd,
  generateVigilLicenseKey,
  mapBillingCycle,
  mapPlanToTier,
  prisma,
  pushSubscriptionSyncToVigil,
  verifyDodoWebhookSignature,
  type Prisma,
  type VigilSubscriptionStatus,
} from '@bitgard/database';

interface DodoWebhookPayload {
  business_id?: string;
  type?: string;
  event_type?: string;
  timestamp?: string;
  data?: {
    id?: string;
    subscription_id?: string;
    payment_id?: string;
    product_id?: string;
    status?: string;
    next_billing_date?: string;
    expires_at?: string;
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
  };
}

const ACTIVATION_EVENTS = new Set([
  'payment.succeeded',
  'checkout.session.completed',
  'subscription.active',
  'subscription.renewed',
]);

const HOLD_EVENTS = new Set(['subscription.on_hold', 'payment.failed']);
const CANCEL_EVENTS = new Set(['subscription.cancelled']);
const EXPIRE_EVENTS = new Set(['subscription.expired']);

function mapDodoEventToStatus(eventType: string): VigilSubscriptionStatus | null {
  if (ACTIVATION_EVENTS.has(eventType)) return 'ACTIVE';
  if (HOLD_EVENTS.has(eventType)) return 'PAST_DUE';
  if (CANCEL_EVENTS.has(eventType)) return 'CANCELLED';
  if (EXPIRE_EVENTS.has(eventType)) return 'EXPIRED';
  return null;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const rl = await checkDistributedRateLimit(`dodo-webhook:${ip}`, 120, 60 * 1000);
    if (rl.limited) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim();
    if (!webhookSecret || webhookSecret === 'whsec_your_webhook_secret_here') {
      console.error('Dodo webhook rejected: DODO_PAYMENTS_WEBHOOK_KEY is not configured.');
      return NextResponse.json(
        { error: 'Webhook verification secret is not configured' },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const webhookId = request.headers.get('webhook-id');
    const verification = verifyDodoWebhookSignature(
      rawBody,
      {
        webhookId,
        webhookTimestamp: request.headers.get('webhook-timestamp'),
        webhookSignature: request.headers.get('webhook-signature'),
      },
      webhookSecret
    );

    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 401 });
    }

    let payload: DodoWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as DodoWebhookPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON webhook payload' }, { status: 400 });
    }

    const expectedBusinessId = process.env.DODO_PAYMENTS_BUSINESS_ID?.trim();
    if (expectedBusinessId && payload.business_id !== expectedBusinessId) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 403 });
    }

    const eventType = payload.type || payload.event_type || '';
    const mappedStatus = mapDodoEventToStatus(eventType);
    if (!mappedStatus) {
      return NextResponse.json({ received: true, ignored: true, eventType });
    }

    const data = payload.data;
    if (eventType === 'payment.succeeded' && data?.status && data.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment status not succeeded' }, { status: 400 });
    }

    if (webhookId) {
      const existingEvent = await prisma.vigilSubscriptionEvent.findUnique({
        where: { externalEventId: webhookId },
        select: { id: true },
      });
      if (existingEvent) {
        return NextResponse.json({ received: true, duplicate: true });
      }
    }

    const dodoSubId = data?.subscription_id?.trim() || null;
    const rawEmail = data?.customer?.email?.trim().toLowerCase() || '';

    const existingSub =
      (rawEmail
        ? await prisma.vigilSubscription.findUnique({ where: { email: rawEmail } })
        : null) ||
      (dodoSubId
        ? await prisma.vigilSubscription.findUnique({ where: { dodoSubscriptionId: dodoSubId } })
        : null);

    const email = rawEmail || existingSub?.email || '';
    const companyName =
      data?.metadata?.company_name?.trim() ||
      data?.metadata?.companyName?.trim() ||
      data?.customer?.name?.trim() ||
      existingSub?.companyName ||
      '';
    const contactName =
      data?.metadata?.contact_name?.trim() ||
      data?.metadata?.contactName?.trim() ||
      data?.customer?.name?.trim() ||
      existingSub?.contactName ||
      null;
    const phone =
      data?.metadata?.phone?.trim() ||
      data?.customer?.phone_number?.trim() ||
      existingSub?.phone ||
      null;
    const billingFormatted = [
      data?.billing?.street,
      data?.billing?.city,
      data?.billing?.state,
      data?.billing?.zipcode,
    ]
      .filter(Boolean)
      .join(', ');
    const address =
      data?.metadata?.address?.trim() ||
      (billingFormatted ? billingFormatted : null) ||
      existingSub?.address ||
      null;
    const country =
      (
        data?.metadata?.country?.trim() ||
        data?.billing?.country?.trim() ||
        existingSub?.country ||
        'LK'
      ).toUpperCase();

    if (!email || !companyName) {
      return NextResponse.json(
        { error: 'Missing required customer email or companyName' },
        { status: 400 }
      );
    }

    // Never downgrade a manually granted LIFETIME license from automated billing lifecycle events
    if (existingSub?.status === 'LIFETIME' && mappedStatus !== 'ACTIVE') {
      await prisma.vigilSubscriptionEvent.create({
        data: {
          subscriptionId: existingSub.id,
          eventType: `${eventType}:ignored_for_lifetime`,
          externalEventId: webhookId || undefined,
          payload: payload as unknown as Prisma.InputJsonValue,
        },
      });
      return NextResponse.json({ received: true, preservedLifetime: true });
    }

    const tier = mapPlanToTier(data?.metadata?.plan || data?.product_id || existingSub?.tier);
    const billingCycle =
      existingSub?.status === 'LIFETIME'
        ? 'LIFETIME'
        : mapBillingCycle(
            data?.metadata?.billing_cycle ||
              data?.metadata?.billingCycle ||
              data?.product_id ||
              existingSub?.billingCycle
          );

    const now = new Date();
    const nextBillingRaw = data?.next_billing_date || data?.expires_at;
    const parsedPeriodEnd = nextBillingRaw ? new Date(nextBillingRaw) : null;
    const currentPeriodEnd =
      mappedStatus === 'ACTIVE'
        ? parsedPeriodEnd && !Number.isNaN(parsedPeriodEnd.getTime())
          ? parsedPeriodEnd
          : computePeriodEnd(billingCycle, now)
        : existingSub?.currentPeriodEnd ?? null;

    const effectiveStatus: VigilSubscriptionStatus =
      existingSub?.status === 'LIFETIME' ? 'LIFETIME' : mappedStatus;

    const subscription = await prisma.vigilSubscription.upsert({
      where: { email },
      update: {
        companyName,
        contactName,
        phone,
        address,
        country,
        tier,
        billingCycle,
        status: effectiveStatus,
        dodoCustomerId: data?.customer?.customer_id || existingSub?.dodoCustomerId,
        dodoSubscriptionId: dodoSubId || existingSub?.dodoSubscriptionId,
        dodoLastPaymentId: data?.payment_id || existingSub?.dodoLastPaymentId,
        currentPeriodStart: mappedStatus === 'ACTIVE' ? now : existingSub?.currentPeriodStart,
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
        dodoCustomerId: data?.customer?.customer_id || null,
        dodoSubscriptionId: dodoSubId,
        dodoLastPaymentId: data?.payment_id || null,
        licenseKey: generateVigilLicenseKey(),
        currentPeriodStart: now,
        currentPeriodEnd,
      },
    });

    const deliveryId = webhookId || `dodo_${Date.now()}_${subscription.id}`;
    await prisma.vigilSubscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        eventType,
        externalEventId: webhookId || undefined,
        actorEmail: email,
        payload: payload as unknown as Prisma.InputJsonValue,
      },
    });

    const pendingSetup =
      mappedStatus === 'ACTIVE'
        ? await prisma.pendingCheckoutSetup.findFirst({
            where: {
              email,
              consumedAt: null,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
          })
        : null;

    const syncResult = await pushSubscriptionSyncToVigil({
      deliveryId,
      eventType,
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
      initialAdminPasswordHash: pendingSetup?.passwordHash || undefined,
    });

    if (syncResult.synced && pendingSetup) {
      await prisma.pendingCheckoutSetup
        .update({
          where: { id: pendingSetup.id },
          data: { consumedAt: new Date(), passwordHash: '' },
        })
        .catch(() => {});
    }

    await prisma.vigilSubscription.update({
      where: { id: subscription.id },
      data: {
        lastSyncedAt: syncResult.synced ? new Date() : subscription.lastSyncedAt,
        lastSyncStatus: syncResult.status,
        lastSyncError: syncResult.error || null,
      },
    });

    return NextResponse.json({
      received: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      syncStatus: syncResult.status,
    });
  } catch (err: unknown) {
    console.error('Dodo Payments Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
