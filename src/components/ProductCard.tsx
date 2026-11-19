'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatBDT } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || 'M');
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.imageUrl ||
    product.images[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80';

  const selectedVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;

  const currentPrice = product.salePriceMinor || product.regularPriceMinor;
  const hasDiscount = !!product.salePriceMinor && product.salePriceMinor < product.regularPriceMinor;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant || !inStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      imageUrl: primaryImage,
      size: selectedSize,
      editionType: product.editionType,
      unitPriceMinor: currentPrice,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group card-stadium rounded-xl overflow-hidden flex flex-col h-full relative">
      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#101D40]">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Edition & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#101D40]/90 text-[#F5E8C9] border border-[#1E3368] backdrop-blur-sm">
            {product.editionType}
          </span>
          {product.teamLabel && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#090F21]/80 text-white backdrop-blur-sm">
              {product.teamLabel}
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#176B43] text-white shadow-md">
              SALE
            </span>
          </div>
        )}

        {product.allowsCustomization && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#101D40]/90 text-[#F5E8C9] border border-[#F5E8C9]/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#176B43]" />
              Customizable
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#0F1A3A]/90">
        <div>
          {/* Season / SKU */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span>{product.season || '2024/25 Season'}</span>
            <span className="text-[10px] text-[#D8C59C]">{inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F5E8C9] transition-colors line-clamp-2 uppercase">
              {product.title}
            </h3>
          </Link>

          {/* Size Pill Selector */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedSize(variant.size)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                  selectedSize === variant.size
                    ? 'bg-[#F5E8C9] text-[#101D40]'
                    : 'bg-[#101D40] text-slate-300 hover:bg-[#1E3368]'
                } ${variant.stockQuantity === 0 ? 'opacity-40 line-through' : ''}`}
                disabled={variant.stockQuantity === 0}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#1E3368] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                {formatBDT(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatBDT(product.regularPriceMinor)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Cash on Delivery / bKash</p>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className={`p-2.5 rounded-lg font-bold transition-all duration-200 ${
              added
                ? 'bg-[#176B43] text-white scale-95'
                : inStock
                ? 'bg-[#15244E] hover:bg-[#176B43] text-[#F5E8C9] hover:text-white border border-[#1E3368] hover:border-transparent'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title={inStock ? 'Quick Add to Bag' : 'Out of Stock'}
            aria-label="Add to bag"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
