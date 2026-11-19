'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';
import { PRODUCTS, CATEGORIES, COLLECTIONS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialCollection = searchParams.get('collection') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedEdition, setSelectedEdition] = useState('all');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter (support virtual/tag categories like fan-editions, custom-jerseys)
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'fan-editions') {
          if (product.editionType !== 'Fan Edition' && product.categoryId !== 'cat-3') return false;
        } else if (selectedCategory === 'player-editions') {
          if (product.editionType !== 'Player Edition' && product.categoryId !== 'cat-4') return false;
        } else if (selectedCategory === 'custom-jerseys') {
          if (!product.allowsCustomization && product.categoryId !== 'cat-5') return false;
        } else {
          const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
          if (cat && product.categoryId !== cat.id) return false;
        }
      }

      // Collection filter
      if (selectedCollection !== 'all') {
        const col = COLLECTIONS.find((c) => c.slug === selectedCollection);
        if (col && product.collectionId !== col.id) return false;
      }

      // Special 'filter' query param (new, bestseller, featured)
      if (activeFilter === 'new' && !product.isNewArrival) {
        return false;
      }
      if (activeFilter === 'bestseller' && !product.isBestseller) {
        return false;
      }
      if (activeFilter === 'featured' && !product.isFeatured) {
        return false;
      }

      // Edition type filter
      if (selectedEdition !== 'all' && product.editionType !== selectedEdition) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesTeam = product.teamLabel?.toLowerCase().includes(query);
        const matchesSeason = product.season?.toLowerCase().includes(query);
        const matchesEdition = product.editionType.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTeam && !matchesSeason && !matchesEdition && !matchesSku) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePriceMinor || a.regularPriceMinor;
      const priceB = b.salePriceMinor || b.regularPriceMinor;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, selectedCollection, selectedEdition, searchQuery, sortBy, activeFilter]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCollection !== 'all' ||
    selectedEdition !== 'all' ||
    activeFilter !== 'all' ||
    searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedEdition('all');
    setActiveFilter('all');
    setSearchQuery('');
    setSortBy('featured');
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-[#090F21] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#176B43] mb-2">
            <span>OFFICIAL STORE</span>
            <span>•</span>
            <span>MATCHDAY CATALOGUE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            ALL FOOTBALL <span className="text-[#F5E8C9]">KITS & GEAR</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Explore authentic club editions, national tournament jerseys, custom player printing, and matchday gear with fast Cash on Delivery across Bangladesh.
          </p>
        </div>

        {/* Search & Mobile Filter Toggle Strip */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#101D40]/80 border border-[#1E3368] rounded-xl p-4 mb-8">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search club, national team, player, or kit SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#F5E8C9]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#090F21] border border-[#1E3368] rounded-lg px-3 py-2.5 text-xs font-bold text-[#F5E8C9] uppercase focus:outline-none focus:border-[#F5E8C9]"
              >
                <option value="featured">Featured / Best</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#15244E] text-[#F5E8C9] text-xs font-bold border border-[#1E3368]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Badges Strip */}
        <div className={`md:flex flex-col gap-4 mb-8 ${mobileFilterOpen ? 'flex' : 'hidden md:flex'}`}>
          {/* Category Filter Pills */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#176B43] text-white shadow-md shadow-[#176B43]/30'
                    : 'bg-[#101D40] text-slate-300 hover:bg-[#15244E] border border-[#1E3368]'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[#176B43] text-white shadow-md shadow-[#176B43]/30'
                      : 'bg-[#101D40] text-slate-300 hover:bg-[#15244E] border border-[#1E3368]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter Pills */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Collection
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                  selectedCollection === 'all'
                    ? 'bg-[#F5E8C9] text-[#101D40] font-black'
                    : 'bg-[#101D40] text-slate-300 hover:bg-[#15244E] border border-[#1E3368]'
                }`}
              >
                All Collections
              </button>
              {COLLECTIONS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                    selectedCollection === col.slug
                      ? 'bg-[#F5E8C9] text-[#101D40] font-black'
                      : 'bg-[#101D40] text-slate-300 hover:bg-[#15244E] border border-[#1E3368]'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Edition Filter Pills */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Jersey Edition
            </span>
            <div className="flex flex-wrap gap-2">
              {['all', 'Fan Edition', 'Player Edition', 'Retro', 'Training Wear', 'Accessory'].map((ed) => (
                <button
                  key={ed}
                  onClick={() => setSelectedEdition(ed)}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                    selectedEdition === ed
                      ? 'bg-white text-[#101D40] font-bold'
                      : 'bg-[#090F21] text-slate-400 hover:text-white border border-[#1E3368]'
                  }`}
                >
                  {ed === 'all' ? 'All Editions' : ed}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters button if active */}
          {hasActiveFilters && (
            <div className="pt-2 flex items-center justify-between border-t border-[#1E3368]">
              <span className="text-xs text-slate-400">
                Found <span className="text-[#F5E8C9] font-bold">{filteredProducts.length}</span> kits matching your criteria
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold uppercase text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#101D40]/40 rounded-2xl border border-[#1E3368]">
            <div className="w-16 h-16 rounded-full bg-[#101D40] flex items-center justify-center mx-auto mb-4 border border-[#1E3368]">
              <Filter className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold uppercase text-white tracking-wider mb-2">
              No matching football kits found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your category, collection, or search terms to discover more matchday jerseys.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090F21] flex items-center justify-center text-[#F5E8C9]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#176B43] border-t-[#F5E8C9] rounded-full animate-spin"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Loading matchday kits...</span>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
