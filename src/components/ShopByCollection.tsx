'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { COLLECTIONS } from '@/lib/data';
import gsap from 'gsap';
import { animateSectionReveal } from '@/lib/animations';

export default function ShopByCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateSectionReveal(sectionRef.current);
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('[data-collection-card]');
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="collections" className="py-20 bg-[#101D40] border-t border-[#1E3368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B43]">
            CURATED MATCHDAY EDITIONS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mt-2">
            SHOP BY <span className="text-[#F5E8C9]">COLLECTION</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Engineered for performance on the pitch, tailored for everyday supporter pride.
          </p>
        </div>

        {/* Dynamic Bento-style Collection Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, index) => (
            <Link
              key={col.id}
              href={`/products?collection=${col.slug}`}
              data-collection-card
              className={`group relative rounded-2xl overflow-hidden card-stadium min-h-[320px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1 ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={col.heroImageUrl}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-60 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090F21] via-[#101D40]/60 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#101D40]/80 border border-[#F5E8C9]/40 flex items-center justify-center text-[#F5E8C9] mb-3 group-hover:bg-[#176B43] group-hover:border-transparent transition-colors">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {col.name}
                </h3>
                <p className="text-sm font-semibold text-[#F5E8C9] mt-1.5 italic">
                  “{col.tagline}”
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
