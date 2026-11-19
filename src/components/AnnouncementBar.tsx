'use client';

import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#101D40] text-[#F5E8C9] border-b border-[#1E3368] py-2 px-4 text-xs font-semibold tracking-widest uppercase text-center relative overflow-hidden">
      <div className="flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#176B43] animate-pulse"></span>
        <span>YOUR NEXT MATCHDAY STARTS HERE • NATIONWIDE DELIVERY ACROSS BANGLADESH</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#176B43] animate-pulse"></span>
      </div>
    </div>
  );
}
