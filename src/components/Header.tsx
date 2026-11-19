'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Shield, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const router = useRouter();
  const { totalItems, setIsCartOpen, mounted } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'NEW ARRIVALS', href: '/products?filter=new' },
    { name: 'CLUB JERSEYS', href: '/products?category=club-jerseys' },
    { name: 'NATIONAL TEAMS', href: '/products?category=national-teams' },
    { name: 'CUSTOM JERSEYS', href: '/products?category=custom-jerseys' },
    { name: 'TRAINING WEAR', href: '/products?category=training-wear' },
    { name: 'ACCESSORIES', href: '/products?category=accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090F21]/95 backdrop-blur-md border-b border-[#1E3368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F5E8C9] hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 overflow-hidden rounded-lg bg-[#101D40] border border-[#1E3368] p-0.5 group-hover:border-[#F5E8C9] transition-colors">
                <Image
                  src="/brand/logo.png"
                  alt="JERSEY ON THE GO"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-white text-base sm:text-lg uppercase leading-tight font-sans">
                  JERSEY <span className="text-[#F5E8C9]">ON THE GO</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#D8C59C] uppercase font-semibold">
                  WEAR IT. OWN IT.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold tracking-widest text-[#F5E8C9]/85 hover:text-white transition-colors py-2 uppercase relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#176B43] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#F5E8C9] hover:text-white p-2 rounded-full hover:bg-[#101D40] transition-colors"
              aria-label="Search kit catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Track Order */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#F5E8C9] hover:text-white bg-[#101D40] border border-[#1E3368] px-3 py-1.5 rounded-md hover:border-[#F5E8C9] transition-colors"
              title="Track your order"
            >
              <Package className="w-4 h-4 text-[#176B43]" />
              <span>Track</span>
            </Link>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2 py-1.5 rounded-md transition-colors"
              title="Admin Atelier"
            >
              <Shield className="w-4 h-4 text-[#F5E8C9]" />
              <span className="text-[11px] uppercase tracking-wider">Staff</span>
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#176B43] hover:bg-[#1FA365] text-white px-3.5 py-2 rounded-md font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-[#176B43]/20 transition-all hover:scale-105"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">BAG</span>
              {mounted && totalItems > 0 && (
                <span className="bg-[#F5E8C9] text-[#101D40] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {searchOpen && (
          <div className="py-3 border-t border-[#1E3368] animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  setMobileMenuOpen(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search club, nation, player name or edition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#101D40] border border-[#1E3368] rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#F5E8C9]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-[#F5E8C9] text-[#101D40] font-bold text-xs uppercase px-4 py-2 rounded-md hover:bg-white transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090F21] border-b border-[#1E3368] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold tracking-wider text-[#F5E8C9] hover:text-white py-2 border-b border-[#1E3368]/40"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-400">
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-[#F5E8C9]"
            >
              <Package className="w-4 h-4 text-[#176B43]" />
              Track Existing Order
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-400"
            >
              <Shield className="w-4 h-4 text-[#F5E8C9]" />
              Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
