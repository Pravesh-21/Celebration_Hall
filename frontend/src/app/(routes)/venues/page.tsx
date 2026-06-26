import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import VenueCard from '@/components/shared/VenueCard';
import GoldDivider from '@/components/ui/GoldDivider';
import { VENUES } from '@/lib/constants/venues';
import AnimatedText from '@/components/ui/AnimatedText';
import TestimonialsSection from '@/components/sections/testimonials/TestimonialsSection';

export const metadata: Metadata = {
  title: 'Our Venues',
  description: 'Explore the cinematic venues at Grandeur Hall. From the Grand Ballroom to the outdoor Royal Pavilion, discover the perfect luxury space for your celebration.',
};

export default function VenuesPage() {
  return (
    <>
      <Navbar />
      
      {/* Spacer to push below fixed navbar */}
      <div className="h-24 md:h-32 bg-obsidian" />

      <main className="flex-1 bg-obsidian py-12 md:py-20" aria-labelledby="venues-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
              Our Spaces
            </span>
            
            <AnimatedText
              text="The Venues"
              tag="h1"
              className="font-serif text-4xl md:text-6xl text-champagne font-medium tracking-wide mb-4"
            />

            <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
              Hand-crafted architectural masterworks tailored to your narrative.
            </p>
          </div>

          {/* Gold Divider */}
          <GoldDivider className="mb-16" />

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            {VENUES.map((venue, idx) => (
              <VenueCard key={venue.id} venue={venue} expandable={true} index={idx} />
            ))}
          </div>

        </div>
      </main>

      <TestimonialsSection />

      <Footer />
    </>
  );
}
