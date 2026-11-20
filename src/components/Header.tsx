'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Shield,
  Package,
  ChevronDown,
  User,
  Phone,
  Flame,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getStoredProducts } from '@/lib/api';
import { Product } from '@/types';
import { formatBDT } from '@/lib/currency';
import { animateDropdownReveal } from '@/lib/animations';

interface NavItem {
  name: string;
  href: string;
  isActive?: boolean;
  dropdown?: {
    title?: string;
    items: Array<{ name: string; href: string; badge?: string; subtitle?: string }>;
  };
}

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems, setIsCartOpen, mounted } = useCart();

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Refs for click outside & keyboard control
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Current query params for active state
  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');
  const currentSearch = searchParams.get('search');

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation: Escape key dismisses modals, dropdowns, and mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveDropdown(null);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
      // Quick search shortcut (Ctrl+K or /)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu or search overlay is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Live search as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const products = getStoredProducts();
    const matches = products
      .filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.teamLabel?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.editionType.toLowerCase().includes(q)
        );
      })
      .slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !target.closest('[data-dropdown-trigger]')) {
        setActiveDropdown(null);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate dropdown when opened
  useEffect(() => {
    if (activeDropdown && dropdownRef.current) {
      animateDropdownReveal(dropdownRef.current);
    }
  }, [activeDropdown]);

  // Comprehensive Navigation Structure
  const navItems: NavItem[] = [
    {
      name: 'NEW DROPS',
      href: '/products?filter=new',
      isActive: currentFilter === 'new',
    },
    {
      name: 'CLUBS',
      href: '/products?category=club-jerseys',
      isActive:
        currentCategory === 'club-jerseys' ||
        Boolean(currentSearch && ['real madrid', 'arsenal', 'barcelona', 'manchester city'].includes(currentSearch.toLowerCase())),
      dropdown: {
        title: 'Premier European Clubs',
        items: [
          { name: 'Real Madrid CF', href: '/products?search=Real+Madrid', subtitle: 'La Liga Champions' },
          { name: 'Arsenal FC', href: '/products?search=Arsenal', subtitle: 'Premier League Away & Home' },
          { name: 'FC Barcelona', href: '/products?search=Barcelona', subtitle: '125th Anniversary Kits' },
          { name: 'Manchester City', href: '/products?search=Manchester+City', subtitle: 'Definitely City 4th Kit' },
          { name: '→ Browse All Club Jerseys', href: '/products?category=club-jerseys', badge: 'Full Catalog' },
        ],
      },
    },
    {
      name: 'NATIONAL TEAMS',
      href: '/products?category=national-teams',
      isActive:
        currentCategory === 'national-teams' ||
        Boolean(currentSearch && ['argentina', 'brazil', 'portugal', 'germany'].includes(currentSearch.toLowerCase())),
      dropdown: {
        title: 'International Pride',
        items: [
          { name: 'Argentina (3-Star)', href: '/products?search=Argentina', subtitle: 'World Champions Home & Away' },
          { name: 'Brazil (Seleção)', href: '/products?search=Brazil', subtitle: 'Copa America Editions' },
          { name: 'Portugal', href: '/products?search=Portugal', subtitle: 'Azulejo Euro Away & Home' },
          { name: 'Germany', href: '/products?search=Germany', subtitle: 'Euro Eagle Diamond Edition' },
          { name: '→ Browse All National Teams', href: '/products?category=national-teams', badge: 'Tournaments' },
        ],
      },
    },
    {
      name: 'EDITIONS',
      href: '/products',
      isActive: ['fan-editions', 'player-editions', 'training-wear', 'accessories'].includes(currentCategory || ''),
      dropdown: {
        title: 'Football Kit Editions',
        items: [
          { name: 'Fan Edition Jerseys', href: '/products?category=fan-editions', subtitle: 'Embroidered Supporter Fit' },
          { name: 'Player Edition (HEAT.RDY)', href: '/products?category=player-editions', subtitle: 'Slim Athletic Cut', badge: 'Pro Match' },
          { name: 'Custom Name Kits', href: '/products?category=custom-jerseys', subtitle: 'Name, Number & Badges', badge: 'Popular' },
          { name: 'Training Wear', href: '/products?category=training-wear', subtitle: 'Pre-match tops & track pants' },
          { name: 'Accessories', href: '/products?category=accessories', subtitle: 'Grip socks & kit essentials' },
        ],
      },
    },
    {
      name: 'CUSTOMIZE',
      href: '/products?category=custom-jerseys',
      isActive: currentCategory === 'custom-jerseys',
    },
    {
      name: 'ALL KITS',
      href: '/products',
      isActive: pathname === '/products' && !currentCategory && !currentFilter && !currentSearch,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleNavClick = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090F21]/95 backdrop-blur-md border-b border-[#1E3368] shadow-2xl py-2 sm:py-2.5'
            : 'bg-[#090F21]/85 backdrop-blur-sm border-b border-[#1E3368]/70 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#F5E8C9] hover:text-white p-2 rounded-lg hover:bg-[#101D40] transition-colors focus:outline-none"
                aria-label="Toggle navigation drawer"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#F5E8C9]" /> : <Menu className="w-6 h-6 text-[#F5E8C9]" />}
              </button>
            </div>

            {/* Brand Logo & Slogan */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group" onClick={handleNavClick}>
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-lg bg-[#101D40] border border-[#1E3368] p-0.5 group-hover:border-[#F5E8C9] transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/brand/logo.png"
                    alt="JERSEY ON THE GO"
                    fill
                    sizes="44px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-wider text-white text-base sm:text-lg uppercase leading-tight font-sans">
                    JERSEY <span className="text-[#F5E8C9]">ON THE GO</span>
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-[#D8C59C] uppercase font-bold">
                    WEAR IT. OWN IT.
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links & Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3" aria-label="Main Navigation">
              {navItems.map((item) => {
                const hasDropdown = Boolean(item.dropdown);
                const isDropdownOpen = activeDropdown === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        data-dropdown-trigger={item.name}
                        className={`text-xs font-bold tracking-widest px-3 py-2 uppercase transition-all flex items-center gap-1 relative ${
                          item.isActive
                            ? 'text-[#F5E8C9] font-black'
                            : 'text-slate-300 hover:text-white hover:bg-[#101D40]/50 rounded-md'
                        }`}
                      >
                        <span>{item.name}</span>
                        {hasDropdown && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 text-[#F5E8C9]/70 ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                        {/* Active indicator bar */}
                        {item.isActive && (
                          <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#176B43] shadow-[0_0_8px_#176B43]"></span>
                        )}
                      </Link>
                    </div>

                    {/* Desktop Dropdown Menu */}
                    {hasDropdown && isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        <div className="bg-[#101D40] border border-[#1E3368] rounded-xl p-3 shadow-2xl backdrop-blur-md">
                          {item.dropdown?.title && (
                            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#F5E8C9]/80 border-b border-[#1E3368] mb-1">
                              {item.dropdown.title}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            {item.dropdown?.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={handleNavClick}
                                data-dropdown-item
                                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#090F21] transition-colors group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="group-hover:translate-x-0.5 transition-transform">
                                    {subItem.name}
                                  </span>
                                  {subItem.badge && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#176B43]/30 border border-[#176B43]/50 text-emerald-300">
                                      {subItem.badge}
                                    </span>
                                  )}
                                </div>
                                {subItem.subtitle && (
                                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                                    {subItem.subtitle}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Action Icons (Search, Account, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-[#F5E8C9] hover:text-white p-2 rounded-full hover:bg-[#101D40] transition-colors relative"
                aria-label="Open search dialog"
                title="Search kit catalog (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Order Track Quick Link */}
              <Link
                href="/track"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#F5E8C9] hover:text-white bg-[#101D40] border border-[#1E3368] px-3 py-1.5 rounded-lg hover:border-[#F5E8C9] transition-all"
                title="Track your order status"
              >
                <Package className="w-4 h-4 text-[#176B43]" />
                <span className="hidden xl:inline">Track Order</span>
                <span className="xl:hidden">Track</span>
              </Link>

              {/* User / Account Navigation Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="text-slate-300 hover:text-[#F5E8C9] p-2 rounded-full hover:bg-[#101D40] transition-colors"
                  aria-label="User Account and Support"
                  title="Account and Support"
                >
                  <User className="w-5 h-5" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#101D40] border border-[#1E3368] rounded-xl p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-[#1E3368] mb-1">
                      <div className="text-xs font-black uppercase text-white">Jersey On The Go</div>
                      <div className="text-[10px] text-slate-400 font-mono">Support & Account</div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/track"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#090F21] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#176B43]" />
                        <span>Track My Order</span>
                      </Link>
                      <a
                        href="tel:+8801755998844"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#090F21] transition-colors"
                      >
                        <Phone className="w-4 h-4 text-[#F5E8C9]" />
                        <span>Support: +880 1755 998844</span>
                      </a>
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#090F21] transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#F5E8C9]" />
                        <span>Staff Control Room</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-[#176B43] hover:bg-[#1FA365] text-white px-3.5 py-2 rounded-lg font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-[#176B43]/20 transition-all hover:scale-105 active:scale-95"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline font-mono">BAG</span>
                {mounted && totalItems > 0 && (
                  <span className="bg-[#F5E8C9] text-[#101D40] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* FULL-WIDTH SEARCH MODAL / OVERLAY */}
      {/* =================================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl mx-auto my-auto bg-[#101D40] border border-[#1E3368] rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#090F21]"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="mt-2">
              <label className="block text-xs font-black uppercase tracking-widest text-[#F5E8C9] mb-2">
                Search Matchday Kit Catalog
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Enter club name, country, player name, or edition (e.g. Real Madrid, Argentina, Bellingham)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#090F21] border border-[#1E3368] rounded-xl pl-11 pr-24 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Trending Suggestions */}
            <div className="mt-4 pt-3 border-t border-[#1E3368]/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#176B43]" />
                Trending:
              </span>
              {['Real Madrid', 'Argentina', 'Player Edition', 'Arsenal', 'Custom Kit', 'Training Top'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    router.push(`/products?search=${encodeURIComponent(tag)}`);
                    setSearchOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#090F21] hover:bg-[#15244E] border border-[#1E3368] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Instant Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1E3368] space-y-2 max-h-72 overflow-y-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Instant Matches ({searchResults.length}):
                </div>
                {searchResults.map((kit) => (
                  <Link
                    key={kit.id}
                    href={`/products/${kit.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#090F21] hover:bg-[#15244E] border border-transparent hover:border-[#1E3368] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-slate-900 rounded overflow-hidden relative shrink-0">
                        {kit.images[0]?.imageUrl && (
                          <img src={kit.images[0].imageUrl} alt={kit.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{kit.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {kit.editionType} • {kit.season || '2024/25'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-[#F5E8C9] font-mono">
                      {formatBDT(kit.salePriceMinor || kit.regularPriceMinor)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MOBILE NAVIGATION DRAWER */}
      {/* =================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-sm bg-[#090F21] border-r border-[#1E3368] text-white flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#1E3368] flex items-center justify-between bg-[#101D40]">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded bg-[#101D40] border border-[#1E3368] overflow-hidden">
                    <Image src="/brand/logo.png" alt="Logo" fill sizes="32px" className="object-cover" />
                  </div>
                  <span className="font-extrabold text-sm uppercase text-white font-sans">
                    JERSEY <span className="text-[#F5E8C9]">ON THE GO</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-md"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Quick Search Bar */}
              <div className="p-4 border-b border-[#1E3368]/60 bg-[#101D40]/30">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search kits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F5E8C9]"
                  />
                </form>
              </div>

              {/* Navigation List & Accordions */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* 1. New Drops */}
                <Link
                  href="/products?filter=new"
                  onClick={handleNavClick}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#101D40]/40 text-xs font-bold uppercase text-[#F5E8C9] hover:bg-[#101D40]"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#176B43]" />
                    <span>NEW ARRIVALS 2026/27</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* 2. Clubs Accordion */}
                <div className="rounded-lg bg-[#101D40]/30 border border-[#1E3368]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileAccordion(mobileAccordion === 'clubs' ? null : 'clubs')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold uppercase text-white hover:bg-[#101D40]/60"
                  >
                    <span>CLUB JERSEYS</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#F5E8C9] transition-transform ${
                        mobileAccordion === 'clubs' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileAccordion === 'clubs' && (
                    <div className="px-3 pb-3 space-y-1 bg-[#090F21]/60 text-xs border-t border-[#1E3368]/40">
                      <Link
                        href="/products?search=Real+Madrid"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Real Madrid CF
                      </Link>
                      <Link
                        href="/products?search=Arsenal"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Arsenal FC
                      </Link>
                      <Link
                        href="/products?search=Barcelona"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        FC Barcelona
                      </Link>
                      <Link
                        href="/products?search=Manchester+City"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Manchester City
                      </Link>
                      <Link
                        href="/products?category=club-jerseys"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-[#F5E8C9] font-bold"
                      >
                        → View All Club Kits
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. National Teams Accordion */}
                <div className="rounded-lg bg-[#101D40]/30 border border-[#1E3368]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileAccordion(mobileAccordion === 'nations' ? null : 'nations')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold uppercase text-white hover:bg-[#101D40]/60"
                  >
                    <span>NATIONAL TEAMS</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#F5E8C9] transition-transform ${
                        mobileAccordion === 'nations' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileAccordion === 'nations' && (
                    <div className="px-3 pb-3 space-y-1 bg-[#090F21]/60 text-xs border-t border-[#1E3368]/40">
                      <Link
                        href="/products?search=Argentina"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Argentina (3-Star)
                      </Link>
                      <Link
                        href="/products?search=Brazil"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Brazil Seleção
                      </Link>
                      <Link
                        href="/products?search=Portugal"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Portugal Euro Kit
                      </Link>
                      <Link
                        href="/products?search=Germany"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Germany Away
                      </Link>
                      <Link
                        href="/products?category=national-teams"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-[#F5E8C9] font-bold"
                      >
                        → View All National Teams
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. Editions Accordion */}
                <div className="rounded-lg bg-[#101D40]/30 border border-[#1E3368]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileAccordion(mobileAccordion === 'editions' ? null : 'editions')}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold uppercase text-white hover:bg-[#101D40]/60"
                  >
                    <span>EDITIONS & GEAR</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#F5E8C9] transition-transform ${
                        mobileAccordion === 'editions' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileAccordion === 'editions' && (
                    <div className="px-3 pb-3 space-y-1 bg-[#090F21]/60 text-xs border-t border-[#1E3368]/40">
                      <Link
                        href="/products?category=fan-editions"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Fan Edition
                      </Link>
                      <Link
                        href="/products?category=player-editions"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Player Edition (Pro Match)
                      </Link>
                      <Link
                        href="/products?category=custom-jerseys"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Custom Jerseys
                      </Link>
                      <Link
                        href="/products?category=training-wear"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Training Wear
                      </Link>
                      <Link
                        href="/products?category=accessories"
                        onClick={handleNavClick}
                        className="block py-2 px-2 text-slate-300 hover:text-white"
                      >
                        Accessories & Socks
                      </Link>
                    </div>
                  )}
                </div>

                {/* 5. Custom Jerseys */}
                <Link
                  href="/products?category=custom-jerseys"
                  onClick={handleNavClick}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#101D40]/20 text-xs font-bold uppercase text-slate-200 hover:bg-[#101D40]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F5E8C9]" />
                    <span>CUSTOMIZE YOUR KIT</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* 6. All Kits */}
                <Link
                  href="/products"
                  onClick={handleNavClick}
                  className="block p-3 rounded-lg bg-[#101D40]/20 text-xs font-bold uppercase text-slate-200 hover:bg-[#101D40]"
                >
                  BROWSE ALL KITS
                </Link>
              </div>

              {/* Drawer Footer Utility Links */}
              <div className="p-4 border-t border-[#1E3368] bg-[#101D40]/60 space-y-2">
                <Link
                  href="/track"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 text-xs font-semibold text-[#F5E8C9] hover:text-white"
                >
                  <Package className="w-4 h-4 text-[#176B43]" />
                  <span>Track Existing Order</span>
                </Link>
                <a
                  href="tel:+8801755998844"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <Phone className="w-4 h-4 text-[#F5E8C9]" />
                  <span>Hotline: +880 1755 998844</span>
                </a>
                <Link
                  href="/admin"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <Shield className="w-4 h-4 text-[#F5E8C9]" />
                  <span>Staff / Admin Atelier</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 bg-[#090F21]/95 border-b border-[#1E3368] py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between" />
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
