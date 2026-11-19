'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#090F21]">
      {/* Background Stadium Night Lighting & Imagery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=2000&q=85"
          alt="Football matchday stadium floodlights"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-50 contrast-125"
        />
        {/* Navy Vignette and Tactical Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090F21] via-[#101D40]/75 to-[#090F21]/80"></div>
        <div className="absolute inset-0 pitch-grid opacity-30"></div>
        <div className="absolute inset-0 stadium-glow"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Matchday Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101D40]/90 border border-[#F5E8C9]/30 backdrop-blur-md mb-6 shadow-lg shadow-[#101D40]/50">
          <Flame className="w-4 h-4 text-[#176B43]" />
          <span className="text-xs font-bold tracking-widest text-[#F5E8C9] uppercase">
            ENTER MATCHDAY MODE • 2026/27 DROPS
          </span>
        </div>

        {/* Brand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-4 leading-none">
          JERSEY <span className="text-[#F5E8C9] drop-shadow-sm">ON THE GO</span>
        </h1>

        {/* Brand Slogan */}
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-[#F5E8C9] uppercase mb-4">
          WEAR IT. OWN IT.
        </p>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-light italic">
          “Your colours. Your club. Your game.”
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md bg-[#176B43] hover:bg-[#1FA365] text-white text-sm sm:text-base font-extrabold tracking-widest uppercase transition-all duration-200 shadow-xl shadow-[#176B43]/30 hover:shadow-[#176B43]/50 hover:scale-105 group"
          >
            <span>SHOP JERSEYS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={() => {
              document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-md bg-[#101D40]/80 hover:bg-[#101D40] text-[#F5E8C9] hover:text-white border border-[#F5E8C9]/40 hover:border-[#F5E8C9] text-sm sm:text-base font-extrabold tracking-widest uppercase backdrop-blur-sm transition-all duration-200 cursor-pointer"
          >
            EXPLORE COLLECTIONS
          </button>
        </div>

        {/* Football Culture Footnote */}
        <div className="pt-6 border-t border-[#1E3368]/60 max-w-lg mx-auto">
          <p className="text-[11px] sm:text-xs tracking-[0.25em] text-[#D8C59C] uppercase font-bold">
            BUILT FOR MATCHDAY. MADE FOR FOOTBALL CULTURE.
          </p>
        </div>
      </div>
    </section>
  );
}
