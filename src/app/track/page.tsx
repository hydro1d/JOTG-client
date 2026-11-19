'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { INITIAL_ORDERS } from '@/lib/orders';

export default function TrackSearchPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const demoOrders = INITIAL_ORDERS.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tokenInput.trim();
    if (!clean) {
      setErrorMsg('Please enter a valid tracking token or Order Number (e.g. JOTG-1001).');
      return;
    }
    router.push(`/track/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen bg-[#090F21] py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176B43]/20 border border-[#176B43] text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-3">
            <Package className="w-4 h-4 text-[#176B43]" />
            <span>LIVE MATCHDAY TRACKER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            TRACK YOUR <span className="text-[#F5E8C9]">ORDER</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Enter your secure tracking token or order number (e.g. <span className="font-mono text-[#F5E8C9]">JOTG-1001</span>) to check fulfillment milestones and payment verification status.
          </p>
        </div>

        {/* Search Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101D40] border border-[#1E3368] shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Tracking Token or Order ID (e.g. JOTG-1001)..."
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-[#090F21] border border-[#1E3368] rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#F5E8C9]"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#176B43]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>LOOKUP MATCHDAY ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          {demoOrders.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#1E3368]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Or Quick Test with Recent Sample Orders:
              </span>
              <div className="space-y-2">
                {demoOrders.map((ord) => (
                  <Link
                    key={ord.id}
                    href={`/track/${ord.trackingToken}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#090F21] hover:bg-[#15244E] border border-[#1E3368] transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-white group-hover:text-[#F5E8C9]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        ({ord.items?.[0]?.productTitleSnapshot || 'Kit'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#101D40] text-[#D8C59C] border border-[#1E3368]">
                        {ord.paymentStatus}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
