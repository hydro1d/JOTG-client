'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { animateSectionReveal } from '@/lib/animations';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateSectionReveal(sectionRef.current);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#090F21] border-t border-[#1E3368] text-center relative overflow-hidden">
      <div className="absolute inset-0 stadium-glow opacity-50 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
          YOUR COLOURS. <span className="text-[#F5E8C9]">YOUR GAME.</span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 font-light max-w-xl mx-auto mb-8 italic">
          “Whatever the fixture. Wherever the pitch. Wear it. Own it.”
        </p>

        <Link
          href="/products"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-md bg-[#176B43] hover:bg-[#1FA365] text-white text-sm sm:text-base font-extrabold uppercase tracking-widest transition-all duration-200 shadow-2xl shadow-[#176B43]/40 hover:scale-105 active:scale-95 group"
        >
          <span>SHOP ALL JERSEYS</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
