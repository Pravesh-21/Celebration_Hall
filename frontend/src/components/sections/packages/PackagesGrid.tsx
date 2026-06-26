'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PACKAGES } from '@/lib/constants/packages';
import { Check } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PackagesGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Reduced motion: simple fade-in
        gsap.fromTo(gridRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 88%',
              once: true,
            }
          }
        );
      } else {
        // Premium staggered slide-up reveal
        gsap.fromTo(gridRef.current?.children || [],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 88%',
              once: true,
            }
          }
        );
      }
    });
  }, { scope: gridRef });

  return (
    <div 
      ref={gridRef} 
      className="flex flex-col md:flex-row md:items-stretch gap-8 lg:gap-6 md:pt-8"
    >
      {PACKAGES.map((pkg) => {
        const isSignature = pkg.isFeatured;

        return (
          <div
            key={pkg.id}
            className={`flex-1 flex flex-col justify-between p-8 border relative select-none transition-all duration-500 opacity-0 ${
              isSignature
                ? 'order-1 md:order-2 bg-walnut/30 border-gold ring-1 ring-gold shadow-2xl md:-translate-y-6 z-10'
                : 'order-2 sm:order-none md:order-1 bg-slate border-walnut/30 hover:border-gold/30'
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* "Most Chosen" Corinthia Tag for Signature */}
            {isSignature && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold px-4 py-1 border border-gold">
                <span className="font-display text-sm text-obsidian italic font-semibold tracking-wide">
                  Most Chosen
                </span>
              </div>
            )}

            {/* Card Top Details */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="font-serif text-2xl text-champagne font-medium tracking-wide mb-1">
                  {pkg.name}
                </h2>
                <p className="text-[10px] text-champagne/40 uppercase tracking-widest font-sans mb-4">
                  {isSignature ? 'Ultimate Luxury Production' : 'Refined Celebrations'}
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-2xl font-serif text-gold font-medium">{pkg.price}</span>
                  <span className="text-[10px] text-champagne/50 uppercase tracking-widest font-sans">/ event starting from</span>
                </div>
              </div>

              <p className="text-xs text-champagne/70 leading-relaxed font-sans text-center md:text-left">
                {pkg.tagline}
              </p>

              {/* Features Checklist */}
              <ul className="space-y-3 pt-4 border-t border-walnut/20 font-sans text-xs">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={14} className="text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-champagne/80 leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card Action Button */}
            <div className="pt-8">
              <Link
                href="/contact"
                className={`w-full py-3 text-xs tracking-widest text-center block font-sans uppercase font-medium transition-colors duration-300 ${
                  isSignature
                    ? 'bg-gold text-obsidian hover:bg-palegold'
                    : 'btn-ghost-sweep'
                }`}
              >
                {isSignature ? (
                  <span>Enquire Now</span>
                ) : (
                  <>
                    <span>Enquire</span>
                    <span className="btn-ghost-sweep-overlay">Enquire</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
