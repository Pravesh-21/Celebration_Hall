'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    title: 'Woodland Canopy',
    desc: 'Whispering walnut trees framing starlit wedding vows.',
    image: '/images/venue-grove.png'
  },
  {
    title: 'Marble Fountains',
    desc: 'Classical European stone features illuminated at twilight.',
    image: '/images/venue-courtyard.png'
  },
  {
    title: 'Crystal Vaults',
    desc: 'Soaring ballroom ceilings crowned by custom crystal chandeliers.',
    image: '/images/hero-ballroom.png'
  },
  {
    title: 'Elite Chambers',
    desc: 'Private sanctuary villas complete with dedicated butler services.',
    image: '/images/about-ceremony.png'
  }
];

export default function VisualPillars() {
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
        gsap.fromTo(gridRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      } else {
        gsap.fromTo(gridRef.current?.children || [],
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            stagger: 0.18,
            ease: 'power2.out',
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
      className="py-20 md:py-32 bg-obsidian border-b border-walnut/20"
      aria-labelledby="pillars-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-display text-3xl text-gold italic leading-none mb-2">
            Estate Visuals
          </span>
          <AnimatedText
            text="The Scenic Highlights"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
          />
          <div className="w-12 h-[1px] bg-gold mt-6" />
        </div>

        {/* Visual Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="group relative h-[380px] sm:h-[420px] overflow-hidden border border-walnut/15 bg-slate/10 flex items-end p-6 select-none cursor-pointer"
            >
              {/* Background Image */}
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />

              {/* Softer dark espresso overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-50 group-hover:opacity-75 z-10"
                style={{
                  background: 'linear-gradient(to top, rgba(16, 12, 8, 0.95) 0%, rgba(16, 12, 8, 0.4) 50%, rgba(16, 12, 8, 0.1) 100%)'
                }}
              />

              {/* Card Content */}
              <div className="relative z-20 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Micro-glow line on hover */}
                <div className="w-8 h-[1px] bg-gold mb-3 transition-all duration-500 group-hover:w-16" />
                
                <h3 className="font-serif text-lg text-ivory font-medium tracking-wide mb-1 group-hover:text-gold transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="font-sans text-[11px] text-ivory/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
