'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function GoldDivider({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Fallback for reduced motion (just opacity fade)
        gsap.fromTo(containerRef.current, 
          { opacity: 0 }, 
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              once: true,
            }
          }
        );
      } else {
        // Premium scale-out and spin reveal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          }
        });

        tl.fromTo(lineRef.current, 
          { scaleX: 0, opacity: 0 }, 
          { scaleX: 1, opacity: 0.4, duration: 1.4, ease: 'power3.inOut' }
        )
        .fromTo(diamondRef.current,
          { scale: 0, rotation: 45, opacity: 0 },
          { scale: 1, rotation: 225, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
          '-=0.6'
        );
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center w-full py-6 ${className}`}>
      {/* 1px Gold Line */}
      <div ref={lineRef} className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent origin-center opacity-0" />
      
      {/* Centered Diamond Ornament */}
      <span ref={diamondRef} className="absolute text-gold text-[10px] select-none opacity-0 bg-obsidian px-4">◆</span>
    </div>
  );
}
