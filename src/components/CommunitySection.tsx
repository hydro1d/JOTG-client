'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function CommunitySection() {
  const socialPosts = [
    {
      handle: '@jerseyonthego',
      image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80',
      caption: 'Matchday ready in Dhaka 🇧🇩',
    },
    {
      handle: '@jerseyonthego',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80',
      caption: 'Albiceleste 3-Star pride #JOTG',
    },
    {
      handle: '@jerseyonthego',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
      caption: 'North London is Red under stadium lights',
    },
    {
      handle: '@jerseyonthego',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
      caption: 'Weekend 7-a-side warmup in custom kits',
    },
  ];

  return (
    <section className="py-20 bg-[#090F21] border-t border-[#1E3368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-2">
              <svg className="w-4 h-4 text-[#176B43]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@JERSEYONTHEGO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              SEEN ON <span className="text-[#F5E8C9]">THE GO.</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Show us how you wear your colours.
            </p>
          </div>

          <a
            href="https://instagram.com/jerseyonthego"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F5E8C9] hover:text-white transition-colors"
          >
            <span>JOIN OUR COMMUNITY</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialPosts.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com/jerseyonthego"
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-xl overflow-hidden aspect-square bg-[#101D40] border border-[#1E3368] hover:border-[#F5E8C9] transition-all"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-80 group-hover:brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-[#F5E8C9]">{post.handle}</span>
                <p className="text-[11px] text-white font-medium line-clamp-1">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
