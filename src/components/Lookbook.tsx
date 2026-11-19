'use client';

import React from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function Lookbook() {
  const editorialItems = [
    {
      title: 'Matchday in the City',
      tag: 'Urban Culture',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Under the Floodlights',
      tag: 'Pitch Performance',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'The Supporter Stand',
      tag: 'Match Atmosphere',
      image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Streetwear Fusion',
      tag: 'Everyday Styling',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-20 bg-[#090F21] border-t border-[#1E3368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-2">
              <Camera className="w-4 h-4 text-[#176B43]" />
              <span>EDITORIAL LOOKBOOK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              MORE THAN <span className="text-[#F5E8C9]">90 MINUTES.</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              From the stadium roar to the city streets — football is how we live.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorialItems.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-[#101D40] border border-[#1E3368] hover:border-[#F5E8C9] transition-all"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090F21] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E8C9] bg-[#101D40]/80 px-2 py-0.5 rounded border border-[#1E3368]">
                  {item.tag}
                </span>
                <h3 className="text-base font-black uppercase text-white mt-2 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
