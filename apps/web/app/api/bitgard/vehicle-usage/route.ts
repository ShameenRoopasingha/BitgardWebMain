import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  checkDistributedRateLimit,
  getVigilTierVehiclePricing,
  prisma,
  verifyBitgardSyncSignature,
  type VigilTier,
} from '@bitgard/database';

export const dynamic = 'force-dynamic';

const usageReportSchema = z.object({
  deliveryId: z.string().trim().min(1).max(160),
  companyId: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  vehicleCount: z.number().int().min(0).max(50000),
});

function resolveDodoMeterEventName(tier: VigilTier): string {
  if (tier === 'ENTERPRISE') {
    return (
      process.env.DODO_METER_EVENT_ENTERPRISE?.trim() ||
      process.env.DODO_METER_EVENT_VEHICLE_OVERAGE?.trim() ||
      'vigil.extra_vehicle.enterprise'
    );
  }
  if (tier === 'PROFESSIONAL') {
    return (
      process.env.DODO_METER_EVENT_PROFESSIONAL?.trim() ||
      process.env.DODO_METER_EVENT_VEHICLE_OVERAGE?.trim() ||
      'vigil.extra_vehicle.professional'
    );
  }
  return (
    process.env.DODO_METER_EVENT_STARTER?.trim() ||
    process.env.DODO_METER_EVENT_VEHICLE_OVERAGE?.trim() ||
    'vigil.extra_vehicle.starter'
  );
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const rl = await checkDistributedRateLimit(`web-vehicle-usage:${ip}`, 120, 60 * 1000);
    if (rl.limited) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const syncSecret = process.env.BITGARD_SYNC_SECRET?.trim();
    if (!syncSecret) {
      return NextResponse.json(
        { success: false, error: 'BITGARD_SYNC_SECRET is not configured' },
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
      return NextResponse.json(
        { success: false, error: verification.reason },
        { status: 401 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = usageReportSchema.safeParse(rawJson);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid usage payload' },
        { status: 400 }
      );
    }

    const { deliveryId, companyId, vehicleCount } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const duplicate = await prisma.vigilSubscriptionEvent.findUnique({
      where: { externalEventId: deliveryId },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ success: true, duplicate: true, deliveryId });
    }

    const subscription = await prisma.vigilSubscription.findUnique({
      where: { email },
    });
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No subscription found for workspace email' },
        { status: 404 }
      );
    }

    const tier = subscription.tier as VigilTier;
    const pricing = getVigilTierVehiclePricing(tier);
    const isLifetime = subscription.status === 'LIFETIME';
    const extraVehicles = isLifetime ? 0 : Math.max(0, vehicleCount - pricing.includedVehicles);
    const extraVehicleRateUsd = isLifetime ? 0 : pricing.extraVehicleRateUsd;
    const monthlyOverageUsd = isLifetime
      ? 0
      : Number((extraVehicles * extraVehicleRateUsd).toFixed(2));

    let dodoIngestStatus: string = 'SKIPPED';
    const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
    const hasConfiguredKey = Boolean(apiKey && apiKey !== 'test_your_dodo_api_key_here');

    if (
      !isLifetime &&
      subscription.status === 'ACTIVE' &&
      subscription.source === 'DODO_PAYMENTS' &&
      subscription.dodoCustomerId &&
      hasConfiguredKey &&
      apiKey
    ) {
      const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';
      const dodoBaseUrl =
        environment === 'live_mode'
          ? 'https://live.dodopayments.com'
          : 'https://test.dodopayments.com';
      const eventName = resolveDodoMeterEventName(tier);

      try {
        const ingestRes = await fetch(`${dodoBaseUrl}/events/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            events: [
              {
                event_id: deliveryId,
                customer_id: subscription.dodoCustomerId,
                event_name: eventName,
                timestamp: new Date().toISOString(),
                metadata: {
                  company_id: companyId,
                  subscription_id: subscription.dodoSubscriptionId || subscription.id,
                  tier,
                  included_vehicles: String(pricing.includedVehicles),
                  total_vehicles: String(vehicleCount),
                  extra_vehicles: String(extraVehicles),
                  unit_rate_usd: extraVehicleRateUsd.toFixed(2),
                  estimated_overage_usd: monthlyOverageUsd.toFixed(2),
                },
              },
            ],
          }),
          signal: AbortSignal.timeout(8000),
        });
        dodoIngestStatus = ingestRes.ok ? 'INGESTED' : `HTTP_${ingestRes.status}`;
      } catch {
        dodoIngestStatus = 'NETWORK_ERROR';
      }
    }

    await prisma.vigilSubscription.update({
      where: { id: subscription.id },
      data: {
        vehicleCount,
        includedVehicles: pricing.includedVehicles,
        extraVehicles,
        extraVehicleRateUsd,
        monthlyOverageUsd,
        lastUsageReportedAt: new Date(),
      },
    });

    await prisma.vigilSubscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        eventType: 'usage.vehicles_reported',
        externalEventId: deliveryId,
        actorEmail: email,
        payload: {
          companyId,
          tier,
          vehicleCount,
          includedVehicles: pricing.includedVehicles,
          extraVehicles,
          extraVehicleRateUsd,
          monthlyOverageUsd,
          dodoIngestStatus,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        tier,
        vehicleCount,
        includedVehicles: pricing.includedVehicles,
        extraVehicles,
        extraVehicleRateUsd,
        monthlyOverageUsd,
        dodoIngestStatus,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Bitgard vehicle usage report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vehicle usage report' },
      { status: 500 }
    );
  }
}
