'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Flag, Users, Zap, Sparkles, Dumbbell } from 'lucide-react';

export default function CategoryStrip() {
  const categories = [
    { name: 'CLUB JERSEYS', slug: 'club-jerseys', icon: Shield, tag: 'UCL & Leagues' },
    { name: 'NATIONAL TEAMS', slug: 'national-teams', icon: Flag, tag: 'World Tournaments' },
    { name: 'FAN EDITIONS', slug: 'fan-editions', icon: Users, tag: 'Supporter Fit' },
    { name: 'PLAYER-INSPIRED', slug: 'player-editions', icon: Zap, tag: 'Aero Match Pro' },
    { name: 'CUSTOM KITS', slug: 'custom-jerseys', icon: Sparkles, tag: 'Name & Number' },
    { name: 'TRAINING WEAR', slug: 'training-wear', icon: Dumbbell, tag: 'Pre-Match Gear' },
  ];

  return (
    <section className="bg-[#101D40] border-y border-[#1E3368] py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-lg bg-[#090F21]/60 border border-[#1E3368] hover:border-[#F5E8C9] hover:bg-[#15244E] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#101D40] border border-[#1E3368] group-hover:border-[#176B43] flex items-center justify-center mb-2.5 transition-colors">
                  <Icon className="w-5 h-5 text-[#F5E8C9] group-hover:text-[#176B43] transition-colors" />
                </div>
                <span className="text-xs font-black tracking-wider text-white uppercase group-hover:text-[#F5E8C9] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                  {cat.tag}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
