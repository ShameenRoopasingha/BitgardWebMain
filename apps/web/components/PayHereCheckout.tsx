'use client';

import { useState } from 'react';

interface PayHereCheckoutProps {
  planName: string;
  price: number;
}

export function PayHereCheckout({ planName, price }: PayHereCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = `SUB-${Date.now()}`;
    const currency = 'LKR';

    try {
      // 1. Get Hash from API route
      const response = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: price, currency })
      });
      
      const { merchantId, hash, formattedAmount } = await response.json();

      // 2. Submit form to PayHere
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Use sandbox for testing

      const inputs = {
        merchant_id: merchantId,
        return_url: window.location.origin + '/products/vehicle-hire?status=success',
        cancel_url: window.location.origin + '/products/vehicle-hire?status=cancel',
        notify_url: 'https://your-tourbiller-api-url.com/api/webhooks/subscription', // THIS WILL BE THE API URL
        first_name: companyName,
        last_name: 'Owner',
        email: email,
        phone: '0700000000',
        address: 'Sri Lanka',
        city: 'Colombo',
        country: 'Sri Lanka',
        order_id: orderId,
        items: `TourBiller ${planName} Subscription`,
        currency: currency,
        recurrence: '1 Month', // Automatic recurring monthly
        duration: 'Forever',
        amount: formattedAmount,
        hash: hash,
        // We pass the password inside custom_1 so PayHere sends it back to the webhook!
        custom_1: password, 
        custom_2: companyName,
      };

      Object.entries(inputs).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-xl mt-4">
      <h4 className="text-white font-bold mb-2">Create your account</h4>
      
      <div>
        <label className="text-xs text-neutral-400">Company Name</label>
        <input 
          required 
          type="text" 
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white mt-1 text-sm" 
          placeholder="My Tours" 
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400">Email Address (Login)</label>
        <input 
          required 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white mt-1 text-sm" 
          placeholder="admin@mytours.com" 
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400">Password</label>
        <input 
          required 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white mt-1 text-sm" 
          placeholder="••••••••" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 mt-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ${price} LKR & Subscribe`}
      </button>
    </form>
  );
}
