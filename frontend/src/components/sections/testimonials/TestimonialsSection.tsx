'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/constants/testimonials';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import AnimatedText from '@/components/ui/AnimatedText';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const nextQuote = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevQuote = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Autoplay Logic
  useEffect(() => {
    if (isPaused) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(() => {
      nextQuote();
    }, 6000);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPaused, activeIndex]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section className="py-20 md:py-32 bg-obsidian" aria-labelledby="testimonials-title">
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
            Their Stories
          </span>
          
          <AnimatedText
            text="Client Testimonials"
            tag="h2"
            className="font-serif text-3xl md:text-5xl text-champagne font-medium tracking-wide mb-4"
          />

          <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
            Hear from those who celebrated their eras with us.
          </p>
        </div>

        {/* Single-Column Carousel Box */}
        <div
          className="relative border border-walnut/30 bg-slate p-8 md:p-16 min-h-[380px] md:min-h-[420px] flex flex-col justify-between select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Big Corinthia Opening Quote Mark */}
          <div className="absolute top-4 left-6 md:top-8 md:left-12 pointer-events-none select-none text-gold/15">
            <span className="font-display text-[150px] md:text-[200px] leading-none select-none">
              “
            </span>
          </div>

          {/* Quote Transition Box */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col items-center text-center"
              >
                {/* Client Headshot */}
                <div className="relative w-20 h-20 rounded-full border border-gold/40 p-1 flex-shrink-0 overflow-hidden">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={current.image}
                      alt={current.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </div>

                {/* Quote Body */}
                <p className="font-sans text-sm md:text-base text-champagne/90 leading-relaxed max-w-2xl italic">
                  {current.quote}
                </p>

                {/* Author Meta */}
                <div>
                  <h3 className="font-serif text-lg text-gold font-medium tracking-wide mb-1">
                    {current.name}
                  </h3>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-champagne/50">
                    {current.eventType} · {current.date}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: Dots & Arrows */}
          <div className="relative z-10 flex items-center justify-between mt-12 border-t border-walnut/20 pt-6">
            
            {/* Arrow Left */}
            <button
              type="button"
              onClick={prevQuote}
              className="text-champagne/60 hover:text-gold transition-colors p-2 focus:outline-none"
              aria-label="Previous quote"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      isActive ? 'bg-gold w-6' : 'bg-champagne/20 hover:bg-champagne/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Arrow Right */}
            <button
              type="button"
              onClick={nextQuote}
              className="text-champagne/60 hover:text-gold transition-colors p-2 focus:outline-none"
              aria-label="Next quote"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

        <GoldDivider className="mt-20" />

      </div>
    </section>
  );
}
