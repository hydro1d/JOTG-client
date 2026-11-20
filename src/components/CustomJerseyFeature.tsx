'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/currency';
import { PRODUCTS } from '@/lib/data';
import gsap from 'gsap';
import { animateSectionReveal } from '@/lib/animations';

export default function CustomJerseyFeature() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateSectionReveal(sectionRef.current);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { addItem } = useCart();
  // Find a product that allows customization, e.g. Real Madrid or Argentina
  const customizableProduct = PRODUCTS.find((p) => p.allowsCustomization) || PRODUCTS[0];

  const [name, setName] = useState('BELLINGHAM');
  const [number, setNumber] = useState('5');
  const [size, setSize] = useState('L');
  const [patch, setPatch] = useState('UCL Starball + 15 Badge');
  const [added, setAdded] = useState(false);

  const basePriceMinor = customizableProduct.salePriceMinor || customizableProduct.regularPriceMinor;
  const customizationFeeMinor = 20000; // ৳200
  const totalPriceMinor = basePriceMinor + customizationFeeMinor;

  const handleAddCustom = () => {
    const variant = customizableProduct.variants.find((v) => v.size === size) || customizableProduct.variants[0];

    addItem({
      variantId: variant.id,
      productId: customizableProduct.id,
      title: `${customizableProduct.title} (Custom Print)`,
      slug: customizableProduct.slug,
      imageUrl: customizableProduct.images[0]?.imageUrl || '',
      size,
      editionType: customizableProduct.editionType,
      unitPriceMinor: basePriceMinor,
      quantity: 1,
      customization: {
        playerName: name.toUpperCase().trim(),
        playerNumber: number.trim(),
        sleevePatch: patch,
        customizationFeeMinor,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#101D40] border-t border-[#1E3368] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B43]/30 border border-[#176B43] text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-3">
            <Sparkles className="w-4 h-4 text-[#F5E8C9]" />
            <span>AUTHENTIC HEAT PRESS PRINTING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            MAKE IT <span className="text-[#F5E8C9]">YOURS.</span>
          </h2>
          <p className="text-base text-slate-300 mt-2 font-light italic">
            “Your name. Your number. Your game.”
          </p>
        </div>

        {/* Interactive Customization Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#090F21] rounded-2xl border border-[#1E3368] p-6 sm:p-10 shadow-2xl">
          {/* Live Jersey Back Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl bg-gradient-to-b from-[#15244E] to-[#101D40] border-2 border-[#1E3368] p-6 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
              <div className="absolute inset-0 pitch-grid opacity-15 pointer-events-none"></div>

              {/* Collar Simulation */}
              <div className="w-24 h-6 border-b-2 border-slate-400 rounded-b-full mb-8 opacity-40"></div>

              {/* Player Name */}
              <div className="font-black text-2xl sm:text-3xl tracking-[0.25em] text-[#F5E8C9] uppercase drop-shadow-md break-all">
                {name || 'YOUR NAME'}
              </div>

              {/* Squad Number */}
              <div className="font-black text-8xl sm:text-9xl tracking-tighter text-[#F5E8C9] leading-none my-4 drop-shadow-xl font-mono">
                {number || '10'}
              </div>

              {/* Tournament Sleeve Patch Preview */}
              <div className="mt-auto inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#090F21]/80 border border-[#1E3368] text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                <span>{patch}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Official typography font match • Heat-press applied
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-[#176B43] tracking-wider">Base Kit</span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase text-white mt-1">
                {customizableProduct.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Includes original embroidered crest, breathable aero-mesh, and full back customization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Player Name Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#F5E8C9] tracking-wider mb-2">
                  Player Name (Max 12 chars)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="e.g. ZIDANE"
                  className="w-full bg-[#101D40] border border-[#1E3368] rounded-md px-3.5 py-2.5 text-white font-mono uppercase tracking-wider text-sm focus:outline-none focus:border-[#F5E8C9]"
                />
              </div>

              {/* Player Number Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#F5E8C9] tracking-wider mb-2">
                  Jersey Number (1-99)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={number}
                  onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 10"
                  className="w-full bg-[#101D40] border border-[#1E3368] rounded-md px-3.5 py-2.5 text-white font-mono tracking-wider text-sm focus:outline-none focus:border-[#F5E8C9]"
                />
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#F5E8C9] tracking-wider mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                      size === s
                        ? 'bg-[#F5E8C9] text-[#101D40]'
                        : 'bg-[#101D40] text-slate-300 hover:bg-[#15244E] border border-[#1E3368]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleeve Tournament Patch */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#F5E8C9] tracking-wider mb-2">
                Tournament Sleeve Badge
              </label>
              <select
                value={patch}
                onChange={(e) => setPatch(e.target.value)}
                className="w-full bg-[#101D40] border border-[#1E3368] rounded-md px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5E8C9]"
              >
                <option value="UCL Starball + 15 Badge">UEFA Champions League Starball + 15 Badge</option>
                <option value="Premier League Sleeve Patch">Premier League Lion Badge</option>
                <option value="La Liga EA Sports Badge">La Liga EA Sports Badge</option>
                <option value="World Cup Champions Gold Patch">World Cup Champions Gold Patch</option>
                <option value="None">None (Plain Sleeve)</option>
              </select>
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-4 border-t border-[#1E3368] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">
                  Base Kit: {formatBDT(basePriceMinor)} + Customization: {formatBDT(customizationFeeMinor)}
                </div>
                <div className="text-2xl font-black text-white mt-0.5">
                  Total: {formatBDT(totalPriceMinor)}
                </div>
              </div>

              <button
                onClick={handleAddCustom}
                className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${
                  added
                    ? 'bg-[#176B43] text-white'
                    : 'bg-[#176B43] hover:bg-[#1FA365] text-white shadow-xl shadow-[#176B43]/30 hover:scale-105'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>CUSTOM KIT ADDED!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD CUSTOM KIT TO BAG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
