import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planName, price, email, companyName } = body;

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';
    const isLive = environment === 'live_mode';

    const baseUrl = isLive
      ? 'https://live.dodopayments.com'
      : 'https://test.dodopayments.com';

    // Map plan to product ID from env or fallback product identifiers
    let productId = process.env.DODO_PRODUCT_ID_STARTER || 'pdt_vigil_starter';
    const normalizedPlan = (planName || '').toLowerCase();
    if (normalizedPlan.includes('pro')) {
      productId = process.env.DODO_PRODUCT_ID_PROFESSIONAL || 'pdt_vigil_professional';
    } else if (normalizedPlan.includes('ent')) {
      productId = process.env.DODO_PRODUCT_ID_ENTERPRISE || 'pdt_vigil_enterprise';
    }

    // Determine the origin URL for return_url
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_WEB_URL ||
      'http://localhost:3000';

    const returnUrl = `${origin}/products/vehicle-hire?status=success&plan=${encodeURIComponent(
      planName || 'Starter'
    )}&session_id={CHECKOUT_SESSION_ID}`;

    // If an API key is provided and not a placeholder, call Dodo Payments API
    if (apiKey && apiKey !== 'test_your_dodo_api_key_here') {
      const dodoRes = await fetch(`${baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          product_cart: [
            {
              product_id: productId,
              quantity: 1,
            },
          ],
          customer: {
            email: email,
            name: companyName,
          },
          billing_address: {
            country: 'LK',
          },
          return_url: returnUrl,
          metadata: {
            company_name: companyName,
            plan: planName,
            software: 'Vigil',
          },
        }),
      });

      if (!dodoRes.ok) {
        const errorData = await dodoRes.json().catch(() => ({}));
        console.error('Dodo Payments Checkout Error:', errorData);
        return NextResponse.json(
          {
            error:
              errorData.message ||
              `Dodo Payments error: ${dodoRes.statusText}`,
          },
          { status: dodoRes.status }
        );
      }

      const dodoData = await dodoRes.json();
      return NextResponse.json({
        checkoutUrl: dodoData.checkout_url,
        sessionId: dodoData.session_id,
      });
    }

    // Development / Sandbox Fallback when API key is not yet set
    // Redirects directly to the success page simulating a completed checkout
    console.warn(
      'DODO_PAYMENTS_API_KEY is not set or using placeholder. Simulating Dodo Payments redirect.'
    );
    return NextResponse.json({
      checkoutUrl: returnUrl.replace('{CHECKOUT_SESSION_ID}', `dodo_test_${Date.now()}`),
      sessionId: `dodo_mock_${Date.now()}`,
      isMock: true,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
