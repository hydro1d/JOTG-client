'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090F21] text-slate-400 border-t border-[#1E3368] pt-16 pb-12">
      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1E3368]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 bg-[#101D40]/50 p-4 rounded-xl border border-[#1E3368]">
            <div className="w-12 h-12 rounded-lg bg-[#15244E] flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-[#176B43]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Fast BD Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">24-48h Dhaka City, 2-4 days nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#101D40]/50 p-4 rounded-xl border border-[#1E3368]">
            <div className="w-12 h-12 rounded-lg bg-[#15244E] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#F5E8C9]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">COD & Verified bKash</h4>
              <p className="text-xs text-slate-400 mt-0.5">Cash on delivery or direct mobile verification</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#101D40]/50 p-4 rounded-xl border border-[#1E3368]">
            <div className="w-12 h-12 rounded-lg bg-[#15244E] flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-[#176B43]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Fit & Size Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic match weave, easy size exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#101D40] border border-[#1E3368]">
                <Image
                  src="/brand/logo.png"
                  alt="JERSEY ON THE GO"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-wider uppercase">
                  JERSEY <span className="text-[#F5E8C9]">ON THE GO</span>
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#D8C59C] font-semibold uppercase">
                  WEAR IT. OWN IT.
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              Curated for football lovers in Bangladesh. We bring matchday energy, club heritage, and national team pride right to your doorstep.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-[#176B43]" />
                <span>+880 1755 998844 (Hotline & WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-[#F5E8C9]" />
                <span>support@jerseyonthego.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#176B43]" />
                <span>Banani, Dhaka - 1213, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">SHOP</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/products?filter=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=club-jerseys" className="hover:text-white transition-colors">Club Jerseys</Link></li>
              <li><Link href="/products?category=national-teams" className="hover:text-white transition-colors">National Teams</Link></li>
              <li><Link href="/products?category=fan-editions" className="hover:text-white transition-colors">Fan Editions</Link></li>
              <li><Link href="/products?category=custom-jerseys" className="hover:text-white transition-colors">Custom Jerseys</Link></li>
              <li><Link href="/products?category=training-wear" className="hover:text-white transition-colors">Training Wear</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">HELP</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors text-[#F5E8C9]">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* ABOUT & FOLLOW */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">ABOUT</h4>
            <ul className="space-y-2 text-xs font-semibold mb-6">
              <li><Link href="/our-story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/quality" className="hover:text-white transition-colors">Quality & Fit</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>

            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">FOLLOW</h4>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <a href="https://facebook.com/jerseyonthegobd" target="_blank" rel="noreferrer" className="hover:text-[#F5E8C9]">Facebook</a>
              <span>•</span>
              <a href="https://instagram.com/jerseyonthego" target="_blank" rel="noreferrer" className="hover:text-[#F5E8C9]">Instagram</a>
              <span>•</span>
              <a href="https://tiktok.com/@jerseyonthego" target="_blank" rel="noreferrer" className="hover:text-[#F5E8C9]">TikTok</a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1E3368] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 JERSEY ON THE GO. All Rights Reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium tracking-wider text-[#D8C59C] uppercase text-[11px]">
          WEAR IT. OWN IT.
        </p>
      </div>
    </footer>
  );
}
