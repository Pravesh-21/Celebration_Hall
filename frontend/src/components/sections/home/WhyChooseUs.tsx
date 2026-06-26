'use client';

import { useRef } from 'react';
import { Sparkles, Utensils, ConciergeBell, Crown, Volume2, Bed } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    icon: Sparkles,
    title: 'Bespoke Scenography',
    desc: 'Custom styling, curated palettes, and structural floral sets designed by master decorators.'
  },
  {
    icon: Utensils,
    title: 'Gastronomic Artistry',
    desc: 'Chef-designed dining options, interactive live counters, and bespoke plated banquets.'
  },
  {
    icon: ConciergeBell,
    title: 'White-Glove Service',
    desc: 'Personal bridal concierges and estate butler teams managing every operational second.'
  },
  {
    icon: Crown,
    title: 'Cinematic Architecture',
    desc: 'Soaring glass walls, crystal ceilings, and lush woodland backdrops for rich visuals.'
  },
  {
    icon: Volume2,
    title: 'Acoustics & Visual FX',
    desc: 'Intelligent lighting rigs, 3D projection mapping, and professional acoustic tuning.'
  },
  {
    icon: Bed,
    title: 'Imperial Guest Suites',
    desc: 'Sanctuary dressing villas equipped with refreshment bars and private butler care.'
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Reduced motion: standard fade
        gsap.fromTo(gridRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      } else {
        // Premium staggered slide-up entrance
        gsap.fromTo(gridRef.current?.children || [],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-32 bg-walnut/10 border-t border-b border-walnut/20"
      aria-labelledby="why-us-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-display text-3xl text-gold italic leading-none mb-2">
            The Standard
          </span>
          <AnimatedText
            text="Why Choose Grandeur Hall"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
          />
          <div className="w-12 h-[1px] bg-gold mt-6" />
        </div>

        {/* 6 Pillars Grid (3 columns on desktop) */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 border border-walnut/20 bg-obsidian/50 hover:border-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.12)] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 flex items-center justify-center border border-gold/40 text-gold mb-6 rounded-none bg-walnut/5">
                  <Icon strokeWidth={1} size={24} />
                </div>

                {/* Pillar Info */}
                <h3 className="font-serif text-base text-champagne font-medium tracking-wide mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-xs text-champagne/60 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
