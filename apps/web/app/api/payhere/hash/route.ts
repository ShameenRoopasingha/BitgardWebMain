import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, amount, currency } = body;

        const merchantId = process.env.PAYHERE_MERCHANT_ID || '1234567';
        const merchantSecret = process.env.PAYHERE_SECRET || 'sandbox_secret_here';

        const formattedAmount = Number(amount).toFixed(2);
        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;
        const finalHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

        return NextResponse.json({
            merchantId,
            hash: finalHash,
            formattedAmount
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
