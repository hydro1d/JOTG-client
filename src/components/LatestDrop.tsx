'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import { getStoredProducts } from '@/lib/api';
import ProductCard from './ProductCard';

export default function LatestDrop() {
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    setProducts(getStoredProducts());
    const onUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('jotg_products_updated', onUpdate);
    return () => window.removeEventListener('jotg_products_updated', onUpdate);
  }, []);

  const newProducts = products.filter((p) => p.isNewArrival && p.isActive !== false).slice(0, 4);

  return (
    <section className="py-20 bg-[#090F21] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#176B43] mb-2">
              <Flame className="w-4 h-4" />
              <span>NEW SEASON 2026/27</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              THE LATEST <span className="text-[#F5E8C9]">DROP</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Fresh kits. New season energy.
            </p>
          </div>

          <Link
            href="/products?filter=new"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F5E8C9] hover:text-white transition-colors group"
          >
            <span>SHOP NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
