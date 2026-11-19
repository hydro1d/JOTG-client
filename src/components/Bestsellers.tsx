'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import ProductCard from './ProductCard';

export default function Bestsellers() {
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="py-20 bg-[#090F21]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-2">
              <Trophy className="w-4 h-4 text-[#176B43]" />
              <span>MOST REQUESTED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              THE FAN <span className="text-[#F5E8C9]">FAVOURITES</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Kits that speak before you do.
            </p>
          </div>

          <Link
            href="/products?filter=bestseller"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F5E8C9] hover:text-white transition-colors group"
          >
            <span>VIEW ALL BESTSELLERS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
