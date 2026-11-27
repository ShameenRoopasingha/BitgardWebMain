import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, verifyBitgardSyncSignature, type Prisma } from '@bitgard/database';

const cancelPayloadSchema = z.object({
  deliveryId: z.string().trim().min(1).max(160),
  companyId: z.string().trim().min(1).max(120),
  bitgardSubscriptionId: z.string().trim().min(1).max(120).optional().nullable(),
  ownerEmail: z.string().trim().email().max(254),
  reason: z.string().trim().max(250).optional(),
});

export async function POST(request: Request) {
  try {
    const syncSecret = process.env.BITGARD_SYNC_SECRET?.trim();
    if (!syncSecret || syncSecret === 'replace-with-shared-hmac-secret') {
      return NextResponse.json(
        { error: 'BITGARD_SYNC_SECRET is not configured on BitgardWeb' },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const verification = verifyBitgardSyncSignature(
      rawBody,
      {
        deliveryId: request.headers.get('x-bitgard-delivery-id'),
        timestamp: request.headers.get('x-bitgard-timestamp'),
        signature: request.headers.get('x-bitgard-signature'),
      },
      syncSecret
    );

    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 401 });
    }

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = cancelPayloadSchema.safeParse(rawJson);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid cancellation request payload' },
        { status: 400 }
      );
    }

    const { deliveryId, bitgardSubscriptionId, ownerEmail, reason, companyId } = parsed.data;
    const normalizedEmail = ownerEmail.toLowerCase();

    const sub =
      (bitgardSubscriptionId
        ? await prisma.vigilSubscription.findUnique({ where: { id: bitgardSubscriptionId } })
        : null) ||
      (await prisma.vigilSubscription.findUnique({ where: { email: normalizedEmail } }));

    if (!sub) {
      return NextResponse.json(
        { error: 'Subscription record not found on Bitgard' },
        { status: 404 }
      );
    }

    if (sub.status === 'LIFETIME') {
      return NextResponse.json(
        { error: 'Lifetime VIP subscriptions cannot be cancelled.' },
        { status: 400 }
      );
    }

    if (sub.status === 'CANCELLED') {
      return NextResponse.json({
        success: true,
        alreadyCancelled: true,
        remoteBillingCancelled: true,
      });
    }

    let remoteBillingCancelled = false;
    const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
    const hasConfiguredApiKey = Boolean(
      apiKey && apiKey !== 'test_your_dodo_api_key_here'
    );

    if (sub.source === 'DODO_PAYMENTS' && sub.dodoSubscriptionId) {
      if (!hasConfiguredApiKey || !apiKey) {
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'Dodo Payments API key is not configured on BitgardWeb' },
            { status: 503 }
          );
        }
      } else {
        const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';
        const baseUrl =
          environment === 'live_mode'
            ? 'https://live.dodopayments.com'
            : 'https://test.dodopayments.com';

        const dodoRes = await fetch(
          `${baseUrl}/subscriptions/${encodeURIComponent(sub.dodoSubscriptionId)}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              status: 'cancelled',
              ...(reason ? { cancellation_comment: reason } : {}),
            }),
            signal: AbortSignal.timeout(15000),
          }
        );

        if (!dodoRes.ok) {
          const errorData = (await dodoRes.json().catch(() => ({}))) as { message?: string };
          console.error('Dodo Payments Cancel Error:', errorData);
          return NextResponse.json(
            {
              error:
                errorData.message ||
                `Failed to cancel recurring subscription on Dodo Payments (${dodoRes.status})`,
            },
            { status: 502 }
          );
        }
        remoteBillingCancelled = true;
      }
    }

    await prisma.vigilSubscription.update({
      where: { id: sub.id },
      data: {
        status: 'CANCELLED',
        lastSyncedAt: new Date(),
        lastSyncStatus: 'SYNCED',
        lastSyncError: null,
      },
    });

    await prisma.vigilSubscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType: 'subscription.cancelled_from_vigil',
        externalEventId: deliveryId,
        actorEmail: normalizedEmail,
        payload: {
          companyId,
          reason: reason || null,
          remoteBillingCancelled,
        } as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      remoteBillingCancelled,
      status: 'CANCELLED',
    });
  } catch (error) {
    console.error('Bitgard Dodo cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription cancellation' },
      { status: 500 }
    );
  }
}
