'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AnimatedText from '@/components/ui/AnimatedText';

export default function CTABand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (!reduceMotion) {
        // Very slow, barely perceptible GSAP rotation loop for the background ray
        gsap.to(rayRef.current, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: 'none',
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-36 bg-obsidian overflow-hidden border-t border-walnut/20 flex items-center justify-center text-center"
      aria-label="Begin planning your event"
    >
      {/* Slow Rotating Radial Gradient Ray */}
      <div
        ref={rayRef}
        className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2 opacity-15 pointer-events-none origin-center"
        style={{
          background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 60%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-3xl flex flex-col items-center">
        {/* Eyebrow */}
        <span className="font-display text-3xl md:text-5xl text-gold italic leading-none mb-3">
          Your Perfect Day Awaits
        </span>

        {/* H2 Heading */}
        <AnimatedText
          text="Let's Create an Unforgettable Legacy"
          tag="h2"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide text-champagne mb-6 leading-tight"
        />

        {/* Rich CTA Paragraph */}
        <p className="font-sans text-xs sm:text-sm text-champagne/70 leading-relaxed max-w-2xl mb-10 text-center">
          Whether you are planning an intimate twilight wedding under our ancient walnut trees or a grand crystal-chandelier banquet for a thousand esteemed guests, our estate planners are prepared to translate your vision into a flawless legacy. Contact us today to schedule your private tour of the grounds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Link href="/contact" className="w-48 py-3.5 text-xs tracking-[0.08em] bg-gold text-obsidian font-medium hover:bg-palegold transition-colors duration-300 uppercase font-sans">
            Book a Private Tour
          </Link>
          
          <Link href="/packages" className="btn-ghost-sweep w-48 py-3.5 text-xs tracking-[0.08em]">
            <span>Explore Packages</span>
            <span className="btn-ghost-sweep-overlay">Explore Packages</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
