'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const val1Ref = useRef<HTMLSpanElement>(null);
  const val2Ref = useRef<HTMLSpanElement>(null);
  const val3Ref = useRef<HTMLSpanElement>(null);
  const val4Ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        if (val1Ref.current) val1Ref.current.innerText = '500+';
        if (val2Ref.current) val2Ref.current.innerText = '15';
        if (val3Ref.current) val3Ref.current.innerText = '4.9★';
        if (val4Ref.current) val4Ref.current.innerText = '1,200+';
      } else {
        const trigger = containerRef.current;

        // Stat 1: 500+ Events
        const count1 = { val: 0 };
        gsap.to(count1, {
          val: 500,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 85%', once: true },
          onUpdate: () => {
            if (val1Ref.current) val1Ref.current.innerText = `${Math.floor(count1.val)}+`;
          }
        });

        // Stat 2: 15 Years
        const count2 = { val: 0 };
        gsap.to(count2, {
          val: 15,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 85%', once: true },
          onUpdate: () => {
            if (val2Ref.current) val2Ref.current.innerText = String(Math.floor(count2.val));
          }
        });

        // Stat 3: 4.9★ Rating
        const count3 = { val: 0 };
        gsap.to(count3, {
          val: 4.9,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 85%', once: true },
          onUpdate: () => {
            if (val3Ref.current) val3Ref.current.innerText = `${count3.val.toFixed(1)}★`;
          }
        });

        // Stat 4: 1,200+ Capacity
        const count4 = { val: 0 };
        gsap.to(count4, {
          val: 1200,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 85%', once: true },
          onUpdate: () => {
            if (val4Ref.current) val4Ref.current.innerText = `${Math.floor(count4.val).toLocaleString()}+`;
          }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="bg-walnut/20 border-t border-b border-walnut/30 py-10 md:py-16"
      aria-label="Key highlights"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 text-center items-center divide-x divide-walnut/30">
        
        {/* Stat 1 */}
        <div className="flex flex-col space-y-2">
          <span ref={val1Ref} className="font-serif text-3xl sm:text-4xl md:text-6xl text-gold font-medium leading-none">
            0+
          </span>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
            Grand Events
          </span>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col space-y-2">
          <span ref={val2Ref} className="font-serif text-3xl sm:text-4xl md:text-6xl text-gold font-medium leading-none">
            0
          </span>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
            Years of Legacy
          </span>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col space-y-2">
          <span ref={val3Ref} className="font-serif text-3xl sm:text-4xl md:text-6xl text-gold font-medium leading-none">
            0★
          </span>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
            Guest Rating
          </span>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col space-y-2">
          <span ref={val4Ref} className="font-serif text-3xl sm:text-4xl md:text-6xl text-gold font-medium leading-none">
            0+
          </span>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
            Guest Capacity
          </span>
        </div>

      </div>
    </section>
  );
}
