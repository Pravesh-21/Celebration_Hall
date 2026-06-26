import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import GoldDivider from '@/components/ui/GoldDivider';
import AnimatedText from '@/components/ui/AnimatedText';
import PackagesGrid from '@/components/sections/packages/PackagesGrid';

export const metadata: Metadata = {
  title: 'Our Packages',
  description: 'Explore the bespoke packages at Grandeur Hall. Choose between Essential, Signature, and Grandeur tiers, all tailored to create a luxury experience.',
};

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      
      {/* Spacer to push below fixed navbar */}
      <div className="h-24 md:h-32 bg-obsidian" />

      <main className="flex-1 bg-obsidian py-12 md:py-20 animate-fadeIn" aria-labelledby="packages-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
              Tailored For You
            </span>
            
            <AnimatedText
              text="Bespoke Tiers"
              tag="h1"
              className="font-serif text-4xl md:text-6xl text-champagne font-medium tracking-wide mb-4"
            />

            <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
              Exclusive pricing tiers designed for extraordinary milestones.
            </p>
          </div>

          {/* Pricing Grid */}
          <PackagesGrid />

          {/* Gold Dividers between cards on mobile (hidden on desktop) */}
          <div className="md:hidden mt-12 space-y-12">
            <GoldDivider />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
