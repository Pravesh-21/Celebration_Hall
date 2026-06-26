'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollContext = createContext<Lenis | null>(null);

export const useScroll = () => useContext(ScrollContext);

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium smooth cubic-bezier easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      // Disable autoRaf so we can drive Lenis via GSAP's ticker
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // 2. Disable GSAP lag smoothing to prevent scroll desyncs
    gsap.ticker.lagSmoothing(0);

    // 3. Drive Lenis RAF via GSAP ticker
    const updateLenis = (time: number) => {
      // time is in seconds, lenis.raf expects milliseconds
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    // 4. Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Refresh ScrollTrigger after initializing
    ScrollTrigger.refresh();

    // 6. Same-page smooth scroll for anchor links using Lenis scrollTo
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href) as HTMLElement | null;
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            duration: 1.5,
          });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // 7. Cross-page smooth scroll for hash links on load
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const targetElement = document.querySelector(hash) as HTMLElement | null;
      if (targetElement) {
        // Delay slightly to allow the page to mount and transitions to complete
        setTimeout(() => {
          lenis.scrollTo(targetElement, {
            duration: 1.8,
            immediate: false,
          });
        }, 600);
      }
    }

    return () => {
      gsap.ticker.remove(updateLenis);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollContext.Provider value={lenisRef.current}>
      {children}
    </ScrollContext.Provider>
  );
}
