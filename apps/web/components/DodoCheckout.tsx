'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface DodoCheckoutProps {
  planName: string;
  price: number;
  currency?: string;
  billingCycle?: 'MONTHLY' | 'ANNUAL';
}

export function DodoCheckout({
  planName,
  price,
  currency = 'USD',
  billingCycle = 'MONTHLY',
}: DodoCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('LK');
  const [error, setError] = useState<string | null>(null);
  const isAnnual = billingCycle === 'ANNUAL';
  const passwordsMismatch = Boolean(confirmPassword && password !== confirmPassword);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          billingCycle,
          email,
          password,
          confirmPassword,
          companyName,
          contactName,
          phone,
          address,
          country,
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
          <div className="text-xs text-neutral-400">
            {isAnnual ? 'Annual Plan' : 'Monthly Plan'}
          </div>
          <div className="text-white font-bold text-lg">
            {currency === 'USD' ? `$${price.toLocaleString()}` : `${currency} ${price.toLocaleString()}`}
            <span className="text-neutral-500 text-xs font-normal">
              {isAnnual ? '/yr' : '/mo'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="e.g. Skyline Tour & Rentals"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Owner / Contact Name <span className="text-primary">*</span>
            </label>
            <input
              required
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
              placeholder="e.g. Kasun Perera"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Phone / WhatsApp Number <span className="text-primary">*</span>
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
              placeholder="+94 77 123 4567"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Country <span className="text-primary">*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-3 text-white text-sm transition-all outline-none"
            >
              <option value="LK">Sri Lanka (LK)</option>
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="AU">Australia (AU)</option>
              <option value="NZ">New Zealand (NZ)</option>
              <option value="AE">UAE (AE)</option>
              <option value="SG">Singapore (SG)</option>
              <option value="IN">India (IN)</option>
              <option value="MV">Maldives (MV)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Business Address <span className="text-primary">*</span>
          </label>
          <input
            required
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-black/60 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
            placeholder="e.g. 125 Galle Road, Colombo 03"
          />
        </div>

        {/* Workspace Login Credentials */}
        <div className="rounded-2xl bg-primary/[0.06] border border-primary/25 p-4 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Lock className="w-3.5 h-3.5" />
              <span>Vigil Login Credentials (Web &amp; Windows App)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Login Username (Business Email) <span className="text-primary">*</span>
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/70 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
              placeholder="operations@skylinetours.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Create Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/70 border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-4 pr-10 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Confirm Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-black/70 border rounded-xl pl-4 pr-10 py-3 text-white placeholder-neutral-600 text-sm transition-all outline-none ${
                    passwordsMismatch
                      ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-white/15 focus:border-primary focus:ring-1 focus:ring-primary'
                  }`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-[11px] text-red-400 mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-neutral-400">
          After payment, log in to Vigil Web or your installed Windows desktop app (.exe) using this{' '}
          <span className="text-white font-medium">Business Email</span> and{' '}
          <span className="text-white font-medium">Password</span>. Your password is hashed immediately and never shared with the payment gateway.
        </p>

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
            <span>
              {isAnnual
                ? 'Recurring annual billing (2 months free), cancel anytime'
                : 'Recurring monthly billing, cancel anytime'}
            </span>
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
