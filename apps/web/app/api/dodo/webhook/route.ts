import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = payload.event_type || payload.type;

    console.log('[Dodo Payments Webhook Received]:', eventType, {
      id: payload.data?.id,
      customer: payload.data?.customer,
      status: payload.data?.status,
    });

    switch (eventType) {
      case 'payment.succeeded':
      case 'checkout.session.completed':
        // Handle successful payment: activate subscription, issue license key
        console.log('Payment succeeded for customer:', payload.data?.customer?.email);
        break;

      case 'subscription.active':
        console.log('Subscription active:', payload.data?.id);
        break;

      case 'subscription.cancelled':
      case 'subscription.expired':
        console.log('Subscription cancelled/expired:', payload.data?.id);
        break;

      default:
        console.log('Unhandled Dodo Payments event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Dodo Payments Webhook error:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
