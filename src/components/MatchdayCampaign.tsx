'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { animateSectionReveal } from '@/lib/animations';

export default function MatchdayCampaign() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateSectionReveal(sectionRef.current);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-[#090F21] border-y border-[#1E3368]">
      {/* Stadium Floodlight Backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=2000&q=85"
          alt="Stadium tunnel night match"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-40 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090F21] via-[#101D40]/80 to-[#090F21]/90"></div>
        <div className="absolute inset-0 pitch-grid opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176B43]/30 border border-[#176B43] text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-6">
            <Trophy className="w-4 h-4 text-[#F5E8C9]" />
            <span>MATCHDAY CULTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
            THIS IS MORE <br />
            <span className="text-[#F5E8C9]">THAN A JERSEY.</span>
          </h2>

          <p className="text-base sm:text-xl text-slate-200 mt-6 font-light leading-relaxed italic">
            “It's the colours you grew up with. The number you remember. The moments you never forget.”
          </p>

          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-md bg-[#176B43] hover:bg-[#1FA365] text-white text-sm font-extrabold uppercase tracking-widest shadow-xl shadow-[#176B43]/30 hover:scale-105 active:scale-95 transition-all group"
            >
              <span>FIND YOUR JERSEY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
