'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Venue } from '@/lib/constants/venues';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { Maximize2, Minimize2, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface VenueCardProps {
  venue: Venue;
  expandable?: boolean;
  featured?: boolean;
  index?: number;
}

export default function VenueCard({ venue, expandable = false, featured = false, index }: VenueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const updateField = useBookingStore((state) => state.updateField);
  const setStep = useBookingStore((state) => state.setStep);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (!reduceMotion) {
        gsap.fromTo(cardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            delay: index ? index * 0.15 : 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 90%',
              once: true,
            }
          }
        );
      } else {
        gsap.fromTo(cardRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 90%',
              once: true,
            }
          }
        );
      }
    });
  }, { scope: cardRef, dependencies: [index] });

  const handleCheckAvailability = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling expand state
    updateField('venueId', venue.id);
    setStep(2); // Jump to Step 2 (Venue + Date)
    router.push('/contact');
  };

  const toggleExpand = () => {
    if (!expandable) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      ref={cardRef}
      layout="position"
      onClick={toggleExpand}
      className={`group relative bg-slate border border-walnut/30 overflow-hidden select-none transition-all duration-500 ${
        expandable ? 'cursor-pointer' : ''
      } ${
        isExpanded ? 'ring-1 ring-gold border-gold' : 'hover:border-gold/50'
      }`}
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
          priority={featured}
        />
        {/* Cinematic Vignette Overlay */}
        <div className="vignette-overlay" />

        {/* Info Overlay (Standard view) */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-display text-2xl text-gold italic leading-none mb-1">
                {venue.indoorOutdoor} Space
              </p>
              <h3 className="font-serif text-xl md:text-2xl text-ivory font-medium tracking-wide">
                {venue.name}
              </h3>
            </div>
            
            {/* Quick Specs */}
            <div className="text-right font-sans text-[10px] uppercase tracking-widest text-ivory/80">
              <p>{venue.sqm} SQM</p>
              <p>Capacity: {venue.capacity}</p>
            </div>
          </div>
        </div>

        {/* Expand Indicator (Desktop only) */}
        {expandable && (
          <div className="absolute top-4 right-4 z-20 bg-obsidian/70 backdrop-blur-sm p-2 border border-gold/30 text-gold hover:bg-gold hover:text-obsidian transition-colors duration-300">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </div>
        )}
      </div>

      {/* Inline Expanded Content (Framer Motion) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden border-t border-walnut/30 bg-walnut/30"
          >
            <div className="p-6 md:p-8 space-y-6">
              {/* Full Description */}
              <p className="text-xs text-champagne/80 leading-relaxed font-sans">
                {venue.description}
              </p>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-walnut/20 py-4 font-sans text-xs">
                <div>
                  <p className="text-champagne/50 uppercase tracking-widest text-[9px] mb-1">Area Size</p>
                  <p className="font-serif text-sm text-gold">{venue.sqm} sqm ({Math.round(venue.sqm * 10.764)} sq ft)</p>
                </div>
                <div>
                  <p className="text-champagne/50 uppercase tracking-widest text-[9px] mb-1">Max Guests</p>
                  <p className="font-serif text-sm text-gold">{venue.capacity} seated</p>
                </div>
                <div>
                  <p className="text-champagne/50 uppercase tracking-widest text-[9px] mb-1">Setting Type</p>
                  <p className="font-serif text-sm text-gold">{venue.indoorOutdoor}</p>
                </div>
              </div>

              {/* Floor Plan & Architecture Notes */}
              <div className="bg-obsidian/50 p-4 border-l-2 border-gold font-sans text-xs">
                <p className="text-champagne/50 uppercase tracking-widest text-[9px] mb-1 font-medium">Architecture & Floor Plan Note</p>
                <p className="text-champagne/80 italic leading-relaxed">{venue.floorPlanNote}</p>
              </div>

              {/* Action Button: Pre-fill & Redirect */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCheckAvailability}
                  className="btn-ghost-sweep px-5 py-2.5 text-xs tracking-widest flex items-center gap-2 group/btn"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  <span className="btn-ghost-sweep-overlay">
                    Check Availability
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
