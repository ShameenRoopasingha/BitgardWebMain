'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface DodoCheckoutProps {
  planName: string;
  price: number;
  currency?: string;
}

export function DodoCheckout({ planName, price, currency = 'LKR' }: DodoCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          price,
          currency,
          email,
          companyName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initiate Dodo Payments checkout.');
      }

      if (data.checkoutUrl) {
        // Redirect to Dodo Payments hosted checkout session
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from Dodo Payments.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white/[0.04] to-black/60 border border-primary/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(232,115,42,0.15)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-white text-xs font-bold uppercase tracking-wider">Dodo Payments</div>
            <div className="text-neutral-400 text-[11px]">Merchant of Record &bull; 256-bit SSL</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-neutral-400">Monthly Plan</div>
          <div className="text-white font-bold text-lg">
            {currency} {price.toLocaleString()}
            <span className="text-neutral-500 text-xs font-normal">/mo</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Fleet / Company Name <span className="text-primary">*</span>
          </label>
          <input
            required
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
            placeholder="e.g. Skyline Tour & Car Rentals"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Business Email (for software license & download) <span className="text-primary">*</span>
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
            placeholder="operations@skylinetours.com"
          />
          <p className="text-[11px] text-neutral-500 mt-1.5">
            Your installer link and Vigil activation key will be linked to this email.
          </p>
        </div>

        {/* Benefits reminder */}
        <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Instant software download link upon checkout</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Commercial license key for {planName} tier</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Recurring monthly billing, cancel anytime</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-primary hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-sm shadow-[0_0_25px_rgba(232,115,42,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to Dodo Payments...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Dodo Payments Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Security Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Global payment methods supported
        </span>
        <span>Cards &bull; Apple Pay &bull; Google Pay</span>
      </div>
    </div>
  );
}

// Re-export as PayHereCheckout for backward compatibility with any other callers
export const PayHereCheckout = DodoCheckout;
