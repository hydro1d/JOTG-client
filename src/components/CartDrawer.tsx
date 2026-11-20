'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/currency';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animations';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotalMinor } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isCartOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  // Entrance GSAP animation
  useEffect(() => {
    if (isCartOpen && drawerRef.current && backdropRef.current && !prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          drawerRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.4, ease: 'power3.out' }
        );
      });
      return () => ctx.revert();
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleClose = () => {
    if (prefersReducedMotion() || !drawerRef.current || !backdropRef.current) {
      setIsCartOpen(false);
      return;
    }
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(drawerRef.current, {
      x: '100%',
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => setIsCartOpen(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-[#090F21] border-l border-[#1E3368] text-white flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#1E3368] flex items-center justify-between bg-[#101D40]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F5E8C9]" />
              <h2 className="text-base font-black tracking-widest uppercase text-white font-mono">
                MATCHDAY BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#101D40] flex items-center justify-center mx-auto mb-4 border border-[#1E3368]">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-base font-bold text-white uppercase tracking-wider mb-2">
                  Your bag is empty
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  Add your favourite club or national team kit to begin.
                </p>
                <Link
                  href="/products"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-wider rounded-md inline-block shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Explore Kits
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemKeySuffix = `${item.customization?.playerName || ''}_${item.customization?.playerNumber || ''}_${item.customization?.additionalNotes || ''}`;
                return (
                  <div
                    key={`${item.variantId}_${itemKeySuffix}`}
                    className="flex gap-4 p-3 rounded-lg bg-[#101D40]/60 border border-[#1E3368] hover:border-[#1E3368]/90 transition-colors"
                  >
                    <div className="relative w-20 h-24 rounded overflow-hidden bg-[#090F21] flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase text-white line-clamp-1">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId, itemKeySuffix)}
                            className="text-slate-400 hover:text-red-400 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="font-bold text-[#F5E8C9]">Size: {item.size}</span>
                          <span>•</span>
                          <span>{item.editionType}</span>
                        </div>

                        {/* Customization Details preview */}
                        {item.customization?.playerName && (
                          <div className="mt-1.5 p-1.5 bg-[#090F21] rounded text-[10px] text-[#F5E8C9] border border-[#1E3368]/60 font-mono">
                            <span className="font-bold">Custom:</span> #{item.customization.playerNumber || ''} {item.customization.playerName}
                            {item.customization.sleevePatch && (
                              <span className="block text-slate-400 font-sans">Patch: {item.customization.sleevePatch}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#1E3368] rounded bg-[#090F21]">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1, itemKeySuffix)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold text-white font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1, itemKeySuffix)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#F5E8C9] font-mono">
                          {formatBDT(
                            (item.unitPriceMinor + (item.customization?.customizationFeeMinor || 0)) *
                              item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#1E3368] bg-[#101D40]/90 space-y-4">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Bag Subtotal
                </span>
                <span className="text-lg font-black text-white">
                  {formatBDT(subtotalMinor)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#176B43]" />
                <span>Cash on Delivery & bKash / Nagad verified checkout</span>
              </div>

              <Link
                href="/checkout"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-md shadow-lg shadow-[#176B43]/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
