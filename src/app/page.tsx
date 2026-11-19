import React from 'react';
import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import LatestDrop from '@/components/LatestDrop';
import ShopByCollection from '@/components/ShopByCollection';
import MatchdayCampaign from '@/components/MatchdayCampaign';
import Bestsellers from '@/components/Bestsellers';
import WhyShopWithUs from '@/components/WhyShopWithUs';
import Lookbook from '@/components/Lookbook';
import CustomJerseyFeature from '@/components/CustomJerseyFeature';
import CommunitySection from '@/components/CommunitySection';
import Newsletter from '@/components/Newsletter';
import FinalCTA from '@/components/FinalCTA';

export const metadata = {
  title: 'JERSEY ON THE GO — Wear It. Own It. | Football Kits in Bangladesh',
  description:
    'Shop authentic club jerseys, national team kits, player editions, fan editions, custom-name kits, and training gear with Cash on Delivery and bKash across Bangladesh.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* A. Hero — ENTER MATCHDAY MODE */}
      <Hero />

      {/* B. Football Category Strip */}
      <CategoryStrip />

      {/* C. NEW SEASON / LATEST DROP */}
      <LatestDrop />

      {/* D. SHOP BY COLLECTION */}
      <ShopByCollection />

      {/* E. MATCHDAY CAMPAIGN */}
      <MatchdayCampaign />

      {/* F. BESTSELLERS */}
      <Bestsellers />

      {/* G. WHY SHOP WITH US? */}
      <WhyShopWithUs />

      {/* H. FOOTBALL CULTURE / LOOKBOOK */}
      <Lookbook />

      {/* I. CUSTOM JERSEY FEATURE */}
      <CustomJerseyFeature />

      {/* J. SOCIAL COMMUNITY */}
      <CommunitySection />

      {/* K. Newsletter */}
      <Newsletter />

      {/* L. Final CTA */}
      <FinalCTA />
    </div>
  );
}
