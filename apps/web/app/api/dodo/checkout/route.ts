import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import {
  checkDistributedRateLimit,
  mapBillingCycle,
  mapPlanToTier,
  prisma,
  type VigilBillingCycle,
  type VigilTier,
} from '@bitgard/database';

const checkoutSchema = z
  .object({
    planName: z.string().trim().min(1).max(40),
    billingCycle: z.enum(['MONTHLY', 'ANNUAL']).optional().default('MONTHLY'),
    email: z.string().trim().email().max(254),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(128, 'Password is too long.'),
    confirmPassword: z.string().min(8).max(128),
    companyName: z.string().trim().min(2).max(120),
    contactName: z.string().trim().max(120).optional().default(''),
    phone: z.string().trim().max(40).optional().default(''),
    address: z.string().trim().max(240).optional().default(''),
    country: z.string().trim().min(2).max(2).optional().default('LK'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password do not match.',
    path: ['confirmPassword'],
  });

function resolveDodoProductId(tier: VigilTier, billingCycle: VigilBillingCycle): string {
  const isAnnual = billingCycle === 'ANNUAL';
  if (tier === 'ENTERPRISE') {
    return (
      (isAnnual
        ? process.env.VIGIL_PRODUCT_ID_ENTERPRISE_ANNUAL || process.env.DODO_PRODUCT_ID_ENTERPRISE_ANNUAL
        : process.env.VIGIL_PRODUCT_ID_ENTERPRISE_MONTHLY || process.env.DODO_PRODUCT_ID_ENTERPRISE_MONTHLY) ||
      process.env.VIGIL_PRODUCT_ID_ENTERPRISE ||
      process.env.DODO_PRODUCT_ID_ENTERPRISE ||
      'pdt_vigil_enterprise'
    );
  }
  if (tier === 'PROFESSIONAL') {
    return (
      (isAnnual
        ? process.env.VIGIL_PRODUCT_ID_PROFESSIONAL_ANNUAL || process.env.DODO_PRODUCT_ID_PROFESSIONAL_ANNUAL
        : process.env.VIGIL_PRODUCT_ID_PROFESSIONAL_MONTHLY || process.env.DODO_PRODUCT_ID_PROFESSIONAL_MONTHLY) ||
      process.env.VIGIL_PRODUCT_ID_PROFESSIONAL ||
      process.env.DODO_PRODUCT_ID_PROFESSIONAL ||
      'pdt_vigil_professional'
    );
  }
  return (
    (isAnnual
      ? process.env.VIGIL_PRODUCT_ID_STARTER_ANNUAL || process.env.DODO_PRODUCT_ID_STARTER_ANNUAL
      : process.env.VIGIL_PRODUCT_ID_STARTER_MONTHLY || process.env.DODO_PRODUCT_ID_STARTER_MONTHLY) ||
    process.env.VIGIL_PRODUCT_ID_STARTER ||
    process.env.DODO_PRODUCT_ID_STARTER ||
    'pdt_vigil_starter'
  );
}

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const rl = await checkDistributedRateLimit(`dodo-checkout:${clientIp}`, 30, 15 * 60 * 1000);
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many checkout requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const parsed = checkoutSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid checkout payload' },
        { status: 400 }
      );
    }

    const tier = mapPlanToTier(parsed.data.planName);
    const billingCycle = mapBillingCycle(parsed.data.billingCycle);
    const email = parsed.data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const companyName = parsed.data.companyName;
    const contactName = parsed.data.contactName || '';
    const phone = parsed.data.phone || '';
    const address = parsed.data.address || '';
    const country = (parsed.data.country || 'LK').toUpperCase();

    const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
    const hasConfiguredApiKey = Boolean(apiKey && apiKey !== 'test_your_dodo_api_key_here');
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';
    const baseUrl =
      environment === 'live_mode'
        ? 'https://live.dodopayments.com'
        : 'https://test.dodopayments.com';

    const productId = resolveDodoProductId(tier, billingCycle);
    const canonicalOrigin =
      process.env.NEXT_PUBLIC_WEB_URL?.trim() ||
      request.headers.get('origin') ||
      'http://localhost:3000';

    const returnUrl = `${canonicalOrigin.replace(/\/+$/, '')}/products/vigil?status=success&plan=${encodeURIComponent(
      tier
    )}&billing=${encodeURIComponent(billingCycle.toLowerCase())}&session_id={CHECKOUT_SESSION_ID}`;

    if (hasConfiguredApiKey && apiKey) {
      const dodoRes = await fetch(`${baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          product_cart: [{ product_id: productId, quantity: 1 }],
          customer: { email, name: contactName || companyName },
          billing_address: { country },
          return_url: returnUrl,
          metadata: {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            country,
            plan: tier,
            billing_cycle: billingCycle,
            software: 'Vigil',
          },
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!dodoRes.ok) {
        const errorData = await dodoRes.json().catch(() => ({}));
        console.error('Dodo Payments Checkout Error:', errorData);
        return NextResponse.json(
          { error: errorData.message || `Dodo Payments error: ${dodoRes.statusText}` },
          { status: dodoRes.status }
        );
      }

      const dodoData = await dodoRes.json();
      const dodoSessionId = typeof dodoData.session_id === 'string' ? dodoData.session_id.trim() : '';
      if (dodoSessionId) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await prisma.pendingCheckoutSetup
          .deleteMany({ where: { expiresAt: { lt: new Date() } } })
          .catch(() => {});
        await prisma.pendingCheckoutSetup.upsert({
          where: { sessionId: dodoSessionId },
          update: { email, passwordHash, expiresAt, consumedAt: null },
          create: { sessionId: dodoSessionId, email, passwordHash, expiresAt },
        });
      }

      return NextResponse.json({
        checkoutUrl: dodoData.checkout_url,
        sessionId: dodoData.session_id,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Payment gateway is not configured in production.' },
        { status: 503 }
      );
    }

    console.warn('DODO_PAYMENTS_API_KEY is not configured. Returning sandbox checkout redirect.');
    return NextResponse.json({
      checkoutUrl: returnUrl.replace('{CHECKOUT_SESSION_ID}', `dodo_test_${Date.now()}`),
      sessionId: `dodo_mock_${Date.now()}`,
      isMock: true,
    });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
