'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PayHereCheckout } from '@/components/PayHereCheckout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || 'starter';

  let planName = 'Starter';
  let price = 5000;

  if (tier === 'professional') {
    planName = 'Professional';
    price = 10000;
  } else if (tier === 'enterprise') {
    planName = 'Enterprise';
    price = 25000;
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h1>
        <p className="text-neutral-400 text-sm">
          You are subscribing to the <span className="text-primary font-bold">{planName}</span> plan.
        </p>
      </div>

      <PayHereCheckout planName={planName} price={price} />
    </div>
  );
}

export default function TourBillerCheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 relative">
      <div className="container mx-auto px-6">
        <Link href="/products/vehicle-hire" className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pricing
        </Link>
        <Suspense fallback={<div className="text-white text-center py-12">Loading...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
