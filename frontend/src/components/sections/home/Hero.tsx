'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Reduced motion: skip parallax & loops, just fade in
        gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });
        gsap.fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 0.8, duration: 1.2, delay: 0.5 });
      } else {
        // Parallax background scroll (0.4x scroll speed)
        gsap.to(bgRef.current, {
          yPercent: 25, // translate down as we scroll
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Content fade & lift reveal
        gsap.fromTo(
          contentRef.current?.children || [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
        );

        // Gentle floating loop for the text content
        gsap.fromTo(contentRef.current,
          { y: 0 },
          {
            y: 8,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 1.5,
          }
        );

        // Scroll cue bounce loop (yoyo)
        gsap.fromTo(
          scrollCueRef.current,
          { y: 0 },
          { y: 12, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut' }
        );

        // Scroll cue fade out past 100px scroll
        gsap.to(scrollCueRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=100',
            scrub: true,
          },
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-svh w-full flex items-center justify-center overflow-hidden bg-black"
      aria-label="Welcome to Grandeur Hall"
    >
      {/* Parallax Background Image */}
      <div ref={bgRef} className="absolute inset-0 h-[130%] w-full -top-[15%] origin-top">
        <Image
          src="/images/hero-estate.png"
          alt="Grandeur Hall Ballroom"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cinematic dark overlay to make text pop against the bright ballroom image */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(10, 7, 5, 0.55) 0%, rgba(10, 7, 5, 0.85) 100%)',
          }}
        />
      </div>

      {/* Hero Content Stack */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
        {/* Corinthia script Eyebrow */}
        <p className="font-display text-3xl md:text-5xl text-gold italic tracking-[0.02em] mb-2">
          Where Forever Begins
        </p>

        {/* Playfair H1 clamp(52px, 8vw, 120px) */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-[100px] text-ivory font-medium tracking-[0.04em] leading-none mb-6">
          GRANDEUR HALL
        </h1>

        {/* 80px Gold Rule */}
        <div className="w-20 h-[1px] bg-gold mb-6" />

        {/* Subtitle */}
        <p className="font-sans text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] text-gold font-medium mb-4">
          Luxury Celebrations. Timeless Memories.
        </p>

        {/* Detailed Hero Description */}
        <p className="font-sans text-xs sm:text-sm text-ivory/75 max-w-2xl mb-10 leading-relaxed text-center">
          Our majestic 20-acre estate combines classical European architecture with modern glasshouse design to create Nagpur's most prestigious venue for royal weddings, grand corporate galas, and bespoke milestone celebrations. Every detail is curated to offer an Awwwards-caliber experience, from couture floral scenography to Michelin-inspired dining.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Link href="/venues" className="btn-ghost-sweep btn-light w-48 py-3.5 text-xs tracking-[0.08em]">
            <span>Explore Venues</span>
            <span className="btn-ghost-sweep-overlay">Explore Venues</span>
          </Link>
          
          <Link href="/contact" className="w-48 py-3.5 text-xs tracking-[0.08em] bg-gold text-obsidian font-medium hover:bg-palegold transition-colors duration-300 uppercase text-center font-sans">
            Book a Tour
          </Link>
        </div>
      </div>

      {/* Scroll Cue (Chevron) */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-10 z-10 flex flex-col items-center cursor-pointer text-gold opacity-80"
        onClick={() => {
          const nextSection = containerRef.current?.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans text-ivory/60 mb-2">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}
