'use server';

import crypto from 'crypto';

export async function generatePayHereHash(orderId: string, amount: number, currency: string) {
    const merchantId = process.env.PAYHERE_MERCHANT_ID || '1234567'; // Use your merchant ID
    const merchantSecret = process.env.PAYHERE_SECRET || 'sandbox_secret_here';

    // Amount must be formatted to 2 decimal places as string for hashing
    const formattedAmount = amount.toFixed(2);

    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;
    const finalHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return {
        merchantId,
        hash: finalHash,
        formattedAmount
    };
}
