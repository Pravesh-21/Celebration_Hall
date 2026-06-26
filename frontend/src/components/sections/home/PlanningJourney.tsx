'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: '01',
    title: 'Private Walkthrough',
    slogan: 'Explore the estate grounds and align your vision with our curator team.'
  },
  {
    num: '02',
    title: 'Bespoke Curation',
    slogan: 'Select custom structural scenography, floral concepts, and culinary tastings.'
  },
  {
    num: '03',
    title: 'Flawless Execution',
    slogan: 'Experience stress-free hosting supported by dedicated white-glove butler services.'
  }
];

export default function PlanningJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        gsap.fromTo(stepsRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      } else {
        gsap.fromTo(stepsRef.current?.children || [],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.25,
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
      className="py-20 md:py-32 bg-slate border-b border-walnut/20"
      aria-labelledby="journey-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-display text-3xl text-gold italic leading-none mb-2">
            The Process
          </span>
          <AnimatedText
            text="The Planning Journey"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
          />
          <div className="w-12 h-[1px] bg-gold mt-6" />
        </div>

        {/* Steps Grid */}
        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10 z-0" />

          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center group relative z-10 p-6 bg-obsidian/30 border border-walnut/10 hover:border-gold/30 hover:shadow-[0_10px_25px_rgba(212,175,55,0.04)] transition-all duration-500"
            >
              {/* Step Number Badge */}
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-obsidian text-gold font-serif text-lg font-semibold mb-6 group-hover:scale-105 group-hover:border-gold transition-all duration-500 relative shadow-inner">
                <span className="z-10">{step.num}</span>
                {/* Micro-glow effect */}
                <div className="absolute inset-0 rounded-full bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Step Info */}
              <h3 className="font-serif text-lg text-champagne font-medium tracking-wide mb-3 group-hover:text-gold transition-colors duration-300">
                {step.title}
              </h3>
              <p className="font-sans text-xs text-champagne/60 leading-relaxed max-w-xs">
                {step.slogan}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
