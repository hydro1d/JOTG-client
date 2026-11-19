'use client';

import React from 'react';
import { ShieldCheck, Ruler, Truck, Banknote, Smartphone, Award } from 'lucide-react';

export default function WhyShopWithUs() {
  const benefits = [
    {
      icon: Award,
      title: 'Premium Kit Quality',
      description: 'Carefully curated authentic fabric weave, breathable aero-mesh, and accurate club detailing.',
    },
    {
      icon: Ruler,
      title: 'Clear Size & Fit Measurements',
      description: 'Accurate chest and length guides for Fan Edition standard fit and Player Edition athletic cut.',
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery Nationwide',
      description: 'Inspect your package and pay cash directly to the delivery rider anywhere in Bangladesh.',
    },
    {
      icon: Smartphone,
      title: 'Direct bKash & Nagad Verification',
      description: 'Manual transaction ID verification for fast, safe mobile payment processing without extra card fees.',
    },
    {
      icon: Truck,
      title: 'Transparent Shipping Rates',
      description: 'Clear fixed delivery fees: ৳80 inside Dhaka City and ৳130 across all districts with order tracking.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private Checkout',
      description: 'Your contact details and delivery address are strictly protected and never shared with third parties.',
    },
  ];

  return (
    <section className="py-20 bg-[#101D40]/60 border-t border-[#1E3368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B43]">
            THE JERSEY ON THE GO PROMISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-2">
            WHY SHOP <span className="text-[#F5E8C9]">WITH US?</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            We are dedicated to giving football fans in Bangladesh an honest, premium, and reliable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="p-6 rounded-xl bg-[#090F21]/80 border border-[#1E3368] hover:border-[#F5E8C9]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-[#15244E] border border-[#1E3368] flex items-center justify-center text-[#F5E8C9] mb-4">
                  <Icon className="w-6 h-6 text-[#176B43]" />
                </div>
                <h3 className="text-base font-bold uppercase text-white tracking-wide mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
