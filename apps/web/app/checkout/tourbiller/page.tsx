'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DodoCheckout } from '@/components/DodoCheckout';
import Link from 'next/link';
import { ArrowLeft, Shield, Download, CheckCircle2, Package } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tier = (searchParams.get('tier') || 'starter').toLowerCase();

  let planName = 'Starter';
  let price = 5000;
  let vehicleLimit = 'Up to 10 Vehicles';

  if (tier === 'professional' || tier === 'pro') {
    planName = 'Professional';
    price = 10000;
    vehicleLimit = 'Up to 50 Vehicles';
  } else if (tier === 'enterprise') {
    planName = 'Enterprise';
    price = 25000;
    vehicleLimit = 'Unlimited Fleet';
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Product Banner */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Vigil &bull; Fleet Management Software</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
          Subscribe to Vigil
        </h1>
        <p className="text-neutral-400 text-sm">
          Commercial license & software access for{' '}
          <span className="text-primary font-bold">{planName}</span> tier ({vehicleLimit}).
        </p>
      </div>

      {/* Plan Switcher Pills */}
      <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-8">
        {[
          { id: 'starter', label: 'Starter', price: 'Rs 5,000' },
          { id: 'professional', label: 'Professional', price: 'Rs 10,000' },
          { id: 'enterprise', label: 'Enterprise', price: 'Rs 25,000' },
        ].map((p) => {
          const isActive = planName.toLowerCase() === p.id;
          return (
            <Link
              key={p.id}
              href={`/checkout/tourbiller?tier=${p.id}`}
              className={`flex-1 py-2.5 px-3 rounded-xl text-center text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(232,115,42,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <div>{p.label}</div>
              <div className="text-[11px] opacity-80">{p.price}/mo</div>
            </Link>
          );
        })}
      </div>

      {/* Dodo Payments Component */}
      <DodoCheckout planName={planName} price={price} currency="LKR" />

      {/* What happens next */}
      <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          What happens after checkout?
        </h3>
        <ol className="space-y-3 text-xs text-neutral-400">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">
              1
            </span>
            <span>
              Your Dodo Payments transaction will be processed instantly and confirmed.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">
              2
            </span>
            <span>
              You will be redirected to the download portal with your Vigil Windows installer (.exe).
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">
              3
            </span>
            <span>
              Your software license key will be issued to your registered business email for instant workstation activation.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default function VigilCheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-28 relative font-body">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60vw] h-[30vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <Link
          href="/products/vehicle-hire"
          className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Vigil Overview & Pricing
        </Link>

        <Suspense
          fallback={
            <div className="text-white text-center py-20 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-neutral-400">Loading Vigil subscription checkout...</span>
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
