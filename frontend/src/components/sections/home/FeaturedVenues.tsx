'use client';

import Link from 'next/link';
import VenueCard from '@/components/shared/VenueCard';
import { VENUES } from '@/lib/constants/venues';
import AnimatedText from '@/components/ui/AnimatedText';

export default function FeaturedVenues() {
  // Take the first 3 venues for the homepage teaser
  const featuredVenues = VENUES.slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-walnut/5 border-t border-walnut/10" aria-labelledby="featured-venues-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="flex flex-col items-start">
            <span className="font-display text-3xl text-gold italic leading-none mb-2">
              The Estate
            </span>
            <AnimatedText
              text="Featured Celebration Spaces"
              tag="h2"
              className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
            />
          </div>
          
          <Link href="/venues" className="btn-ghost-sweep px-5 py-3 text-[10px] tracking-widest font-sans">
            <span>View All Spaces</span>
            <span className="btn-ghost-sweep-overlay">View All Spaces</span>
          </Link>
        </div>

        {/* CSS Scroll-Snap Grid for Mobile / Grid for Desktop */}
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:gap-8">
          {featuredVenues.map((venue, idx) => (
            <div
              key={venue.id}
              className="flex-shrink-0 w-[85vw] snap-center sm:w-[60vw] md:w-full md:snap-align-none"
            >
              <VenueCard venue={venue} featured={idx === 0} index={idx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
