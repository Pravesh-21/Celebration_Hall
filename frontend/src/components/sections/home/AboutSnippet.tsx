'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';

// Register ScrollTrigger safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSnippet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        // Reduced motion: standard fade-in
        gsap.fromTo([img1Ref.current, img2Ref.current], 
          { opacity: 0 }, 
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              once: true,
            }
          }
        );
      } else {
        // 1. Reveal Phase: Butter-smooth scale & fade-in reveal when entering the viewport
        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          }
        });

        revealTl.fromTo(img1Ref.current,
          { 
            scale: 0.94,
            opacity: 0
          },
          { 
            scale: 1,
            opacity: 1,
            duration: 1.4, 
            ease: 'power3.out' 
          }
        )
        .fromTo(img2Ref.current,
          { 
            scale: 0.94,
            opacity: 0
          },
          { 
            scale: 1,
            opacity: 1,
            duration: 1.4, 
            ease: 'power3.out' 
          },
          '-=1.1' // Elegant overlap
        );

        // 2. Parallax Phase: Continuous scroll-linked vertical translation
        // Background image: moves slower
        gsap.fromTo(img1Ref.current,
          { y: 40 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.0, // smooth lag for premium feel
            }
          }
        );

        // Foreground image: moves faster to create dramatic overlapping depth
        gsap.fromTo(img2Ref.current,
          { y: 80 },
          {
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3, // different speed and lag for true 3D parallax!
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-20 md:py-32 bg-slate text-champagne scroll-mt-24"
      aria-label="About our estate"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Offset Stacked Portrait Images */}
        <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] md:h-[600px] w-full select-none">
          {/* Base/Back Image */}
          <div
            ref={img1Ref}
            className="absolute left-0 bottom-0 w-[60%] h-[80%] overflow-hidden border border-walnut/20 shadow-lg"
            style={{ 
              opacity: 0,
              willChange: 'transform, opacity' 
            }}
          >
            <Image
              src="/images/venue-glasshouse.png"
              alt="Modern glass house sanctuary"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover"
            />
          </div>

          {/* Top/Offset Image */}
          <div
            ref={img2Ref}
            className="absolute right-0 top-0 w-[55%] h-[75%] overflow-hidden border border-gold/20 shadow-xl z-10"
            style={{ 
              opacity: 0,
              willChange: 'transform, opacity' 
            }}
          >
            <Image
              src="/images/venue-lounge.png"
              alt="Sophisticated champagne lounge"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Column: Copywriting & Content */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6">
          <span className="font-display text-3xl md:text-4xl text-gold italic leading-none">
            Our Philosophy
          </span>
          
          <AnimatedText
            text="A Blank Canvas for Unforgettable Memories"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne leading-tight"
          />

          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            At Grandeur Hall, we believe a great celebration is an art form. Our 20-acre estate is designed as a private sanctuary where your dreams are translated into reality, combining classical architectural triumphs with nature's tranquil beauty.
          </p>
          
          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            Whether you choose the soaring glass pavilion reflecting whispering woodland silhouettes or the intimate, velvet-draped champagne lounge, we ensure your event carries a unique, cinematic character that resonates with your personal story.
          </p>

          {/* Core Highlights List - minimal and punchy */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 w-full pt-4 max-w-xl">
            <div className="flex items-center gap-3 border-b border-walnut/15 pb-2">
              <span className="text-gold font-serif text-base">✦</span>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-champagne font-semibold">Couture Scenography</span>
            </div>
            <div className="flex items-center gap-3 border-b border-walnut/15 pb-2">
              <span className="text-gold font-serif text-base">✦</span>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-champagne font-semibold">Michelin Culinary</span>
            </div>
            <div className="flex items-center gap-3 border-b border-walnut/15 pb-2">
              <span className="text-gold font-serif text-base">✦</span>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-champagne font-semibold">White-Glove Butler</span>
            </div>
            <div className="flex items-center gap-3 border-b border-walnut/15 pb-2">
              <span className="text-gold font-serif text-base">✦</span>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-champagne font-semibold">Technical FX</span>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/venues" className="btn-ghost-sweep px-6 py-3 text-xs tracking-widest">
              <span>Explore Our Spaces</span>
              <span className="btn-ghost-sweep-overlay">Explore Our Spaces</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
