'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface AnimatedTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
}

export default function AnimatedText({
  text,
  tag = 'h2',
  className = '',
  delay = 0,
}: AnimatedTextProps) {
  const elementRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Fallback for reduced motion (just opacity fade)
        gsap.fromTo(elementRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            delay,
            scrollTrigger: {
              trigger: elementRef.current,
              start: 'top 85%',
              once: true,
            }
          }
        );
      } else {
        // Premium clip-path and translate-up cinematic reveal
        gsap.fromTo(elementRef.current,
          { 
            y: 40, 
            opacity: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' 
          },
          {
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            duration: 0.9,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
              trigger: elementRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      }
    });
  }, { scope: elementRef, dependencies: [text, delay] });

  const Tag = tag;

  return (
    <Tag
      ref={elementRef as any}
      className={`inline-block opacity-0 ${className}`}
      style={{ willChange: 'transform, opacity, clip-path' }}
    >
      {text}
    </Tag>
  );
}
