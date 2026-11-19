'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  Check,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Info,
  Ruler,
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import { formatBDT } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#090F21] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black uppercase text-white mb-2">Kit Not Found</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          The football jersey or gear you are looking for might have been retired or moved.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-widest rounded-md"
        >
          Browse All Kits
        </Link>
      </div>
    );
  }

  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || 'M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Customization state
  const [enableCustomization, setEnableCustomization] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [customPatch, setCustomPatch] = useState('UCL Starball + 15 Badge');
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'care'>('details');

  const selectedVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const stockCount = selectedVariant ? selectedVariant.stockQuantity : 0;

  const basePriceMinor = product.salePriceMinor || product.regularPriceMinor;
  const customizationFeeMinor = enableCustomization ? product.customizationFeeMinor || 20000 : 0;
  const unitTotalMinor = basePriceMinor + customizationFeeMinor;
  const grandTotalMinor = unitTotalMinor * quantity;

  const currentImage = product.images[selectedImageIndex]?.imageUrl || product.images[0]?.imageUrl || '';
  const relatedKits = getRelatedProducts(product.id, 4);

  const handleOpenSizeGuide = () => {
    setActiveTab('sizing');
    document.getElementById('product-specs-tabs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      imageUrl: currentImage,
      size: selectedSize,
      editionType: product.editionType,
      unitPriceMinor: basePriceMinor,
      quantity,
      customization: enableCustomization
        ? {
            playerName: customName.toUpperCase().trim() || undefined,
            playerNumber: customNumber.trim() || undefined,
            sleevePatch: customPatch !== 'None' ? customPatch : undefined,
            customizationFeeMinor,
          }
        : undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090F21] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <Link href="/products" className="hover:text-white transition-colors">Kits</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="text-[#F5E8C9] font-bold uppercase truncate">{product.title}</span>
        </nav>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#101D40] border border-[#1E3368] shadow-2xl group">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#101D40]/90 text-[#F5E8C9] border border-[#1E3368] backdrop-blur-md">
                  {product.editionType}
                </span>
                {product.teamLabel && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#090F21]/80 text-white backdrop-blur-md">
                    {product.teamLabel}
                  </span>
                )}
              </div>

              {product.salePriceMinor && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#176B43] text-white shadow-lg">
                    SPECIAL OFFER
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-[#101D40] ${
                      selectedImageIndex === idx
                        ? 'border-[#F5E8C9] scale-105 shadow-md'
                        : 'border-[#1E3368] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || product.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Customization Configuration */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Season & SKU Info */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span className="text-[#176B43] tracking-widest uppercase">
                  {product.season || '2024/25 Season'}
                </span>
                <span className="font-mono text-slate-500">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Price Display */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatBDT(basePriceMinor)}
                </span>
                {product.salePriceMinor && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {formatBDT(product.regularPriceMinor)}
                  </span>
                )}
                <span className="text-xs text-[#176B43] font-bold bg-[#176B43]/20 px-2.5 py-0.5 rounded border border-[#176B43]/40">
                  Tax & Duty Included
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6 pt-6 border-t border-[#1E3368]">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F5E8C9]">
                    Select Size
                  </label>
                  <button
                    onClick={handleOpenSizeGuide}
                    className="text-xs text-[#F5E8C9] hover:text-white flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.variants.map((v) => {
                    const isAvailable = v.stockQuantity > 0;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedSize(v.size)}
                        disabled={!isAvailable}
                        className={`py-2.5 rounded-lg text-xs font-black uppercase transition-all ${
                          selectedSize === v.size
                            ? 'bg-[#F5E8C9] text-[#101D40] shadow-md'
                            : isAvailable
                            ? 'bg-[#101D40] text-white hover:bg-[#15244E] border border-[#1E3368]'
                            : 'bg-[#101D40]/30 text-slate-600 border border-[#1E3368]/30 line-through cursor-not-allowed'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock notice */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Selected size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <span
                    className={`font-bold ${
                      stockCount > 5
                        ? 'text-[#176B43]'
                        : stockCount > 0
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {stockCount > 5
                      ? 'In Stock (Ready to dispatch)'
                      : stockCount > 0
                      ? `Only ${stockCount} left in stock!`
                      : 'Sold Out in this size'}
                  </span>
                </div>
              </div>

              {/* Official Custom Printing Studio Accordion / Toggle */}
              {product.allowsCustomization && (
                <div className="mt-6 p-4 rounded-xl bg-[#101D40] border border-[#1E3368]">
                  <div
                    onClick={() => setEnableCustomization(!enableCustomization)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F5E8C9]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        CUSTOM PLAYER PRINTING (+{formatBDT(product.customizationFeeMinor || 20000)})
                      </span>
                    </div>
                    <div className="relative inline-flex items-center">
                      <div className={`w-9 h-5 rounded-full transition-colors ${enableCustomization ? 'bg-[#176B43]' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableCustomization ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5 ml-0.5`}></div>
                      </div>
                    </div>
                  </div>

                  {enableCustomization && (
                    <div className="mt-4 pt-4 border-t border-[#1E3368]/60 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                            Player Name (Max 12)
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. MESSI"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                            className="w-full bg-[#090F21] border border-[#1E3368] rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#F5E8C9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                            Number (0-99)
                          </label>
                          <input
                            type="text"
                            maxLength={2}
                            placeholder="e.g. 10"
                            value={customNumber}
                            onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-[#090F21] border border-[#1E3368] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#F5E8C9]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                          Tournament Sleeve Patch
                        </label>
                        <select
                          value={customPatch}
                          onChange={(e) => setCustomPatch(e.target.value)}
                          className="w-full bg-[#090F21] border border-[#1E3368] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#F5E8C9]"
                        >
                          <option value="UCL Starball + 15 Badge">UEFA Champions League Starball + 15 Badge</option>
                          <option value="Premier League Sleeve Patch">Premier League Lion Badge</option>
                          <option value="La Liga EA Sports Badge">La Liga EA Sports Badge</option>
                          <option value="World Cup Champions Gold Patch">World Cup Champions Gold Patch</option>
                          <option value="None">None (Plain Sleeve)</option>
                        </select>
                      </div>

                      {customName && (
                        <div className="p-2 bg-[#090F21] rounded border border-[#1E3368] text-center">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Live Print Preview</span>
                          <span className="text-sm font-black text-[#F5E8C9] tracking-widest">
                            {customNumber ? `#${customNumber} ` : ''}{customName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Picker & Add To Bag */}
              <div className="mt-6 pt-6 border-t border-[#1E3368] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#1E3368] rounded-lg bg-[#101D40]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-sm text-slate-300 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-white min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-sm text-slate-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="text-[11px] text-slate-400">Total payable:</div>
                    <div className="text-xl font-black text-white">{formatBDT(grandTotalMinor)}</div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`w-full py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    added
                      ? 'bg-[#176B43] text-white scale-98'
                      : inStock
                      ? 'bg-[#176B43] hover:bg-[#1FA365] text-white shadow-xl shadow-[#176B43]/30 hover:scale-[1.01]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>ADDED TO MATCHDAY BAG!</span>
                    </>
                  ) : inStock ? (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>ADD TO MATCHDAY BAG</span>
                    </>
                  ) : (
                    <span>CURRENTLY OUT OF STOCK</span>
                  )}
                </button>
              </div>

              {/* Value Props / Guarantees */}
              <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-[#1E3368] text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-[#176B43] mb-1.5" />
                  <span className="text-[11px] font-bold text-white uppercase">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400">Pay after inspection</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-[#F5E8C9] mb-1.5" />
                  <span className="text-[11px] font-bold text-white uppercase">Authentic Fit</span>
                  <span className="text-[10px] text-slate-400">High-grade aero fabric</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-[#176B43] mb-1.5" />
                  <span className="text-[11px] font-bold text-white uppercase">Easy Exchange</span>
                  <span className="text-[10px] text-slate-400">7-Day size replacement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section (Details, Sizing, Care) */}
        <div id="product-specs-tabs" className="mt-16 bg-[#101D40]/50 rounded-2xl border border-[#1E3368] p-6 sm:p-8 scroll-mt-24">
          <div className="flex border-b border-[#1E3368] gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative ${
                activeTab === 'details' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kit Specifications
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sizing')}
              className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative ${
                activeTab === 'sizing' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Size Chart & Fit Guide
              {activeTab === 'sizing' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative ${
                activeTab === 'care' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wash & Care Instructions
              {activeTab === 'care' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
              )}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
                <div>
                  <h4 className="font-bold uppercase text-white mb-2">Matchday Construction</h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-400">
                    <li>Engineered moisture-wicking AEROREADY / Dri-FIT polyester weave</li>
                    <li>Embroidered club and tournament crest with authentic high-definition thread count</li>
                    <li>Ergonomic cut optimized for movement on pitch and comfort off pitch</li>
                    <li>Ribbed crew neck collar and reinforced sleeve seams</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold uppercase text-white mb-2">Delivery & Returns</h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-400">
                    <li>Inside Dhaka: 24 to 48 hours delivery via express courier (৳80)</li>
                    <li>Outside Dhaka: 2 to 4 business days nationwide delivery (৳130)</li>
                    <li>Cash on Delivery accepted across all 64 districts</li>
                    <li>Instant verification for bKash & Nagad payments</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-[#090F21] text-[#F5E8C9] uppercase text-[11px] font-bold">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest (Inches)</th>
                      <th className="p-3">Length (Inches)</th>
                      <th className="p-3">Recommended Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3368]">
                    <tr>
                      <td className="p-3 font-bold text-white">S</td>
                      <td className="p-3">38"</td>
                      <td className="p-3">27"</td>
                      <td className="p-3">50 – 62 kg</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">M</td>
                      <td className="p-3">40"</td>
                      <td className="p-3">28"</td>
                      <td className="p-3">63 – 72 kg</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">L</td>
                      <td className="p-3">42"</td>
                      <td className="p-3">29"</td>
                      <td className="p-3">73 – 82 kg</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">XL</td>
                      <td className="p-3">44"</td>
                      <td className="p-3">30"</td>
                      <td className="p-3">83 – 92 kg</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">XXL</td>
                      <td className="p-3">46"</td>
                      <td className="p-3">31"</td>
                      <td className="p-3">93+ kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-3">
                <p>
                  To preserve the lifespan of your custom heat-pressed nameset and embroidered crests:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                  <li>Always wash inside out in cold water (maximum 30°C).</li>
                  <li>Do not use fabric softeners or chlorine bleach.</li>
                  <li>Hang dry naturally; never tumble dry in a hot machine.</li>
                  <li>Do NOT iron directly over printed player names, numbers, or sponsor badges.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related / Matchday Drops Carousel */}
        {relatedKits.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#176B43]">
                  COMPLETE THE LOOK
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  RELATED MATCHDAY KITS
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold uppercase tracking-wider text-[#F5E8C9] hover:text-white flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedKits.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
