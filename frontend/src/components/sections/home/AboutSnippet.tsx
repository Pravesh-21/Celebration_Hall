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
      ref={containerRef}
      className="py-20 md:py-32 bg-slate text-champagne"
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
              src="/images/about-ceremony.png"
              alt="Luxury wedding ceremony couple"
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
              src="/images/about-detail.png"
              alt="Opulent table setting details"
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
            text="Crafting Unforgettable Eras of Celebration"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne leading-tight"
          />

          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            Grandeur Hall is more than a venue; it is an architectural symphony custom-designed to host life’s most profound milestones. Built upon fifteen years of award-winning hospitality, our estate seamlessly blends classical grandeur with cutting-edge design.
          </p>
          
          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            From our soaring glass house reflecting woodland silhouettes to the sweeping ballroom with crystal chandeliers, every corner is a canvas for cinematic memories. We curate bespoke experiences, ensuring your celebration resonates with absolute luxury.
          </p>

          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            We believe that a legendary event requires perfect alignment of sensory details. Our estate director leads an elite team of designers who create custom floral structures tailored to your theme, while our culinary curators craft personalized menus that elevate fine dining into an interactive, theatrical experience.
          </p>

          {/* Core Highlights List */}
          <div className="grid grid-cols-2 gap-4 w-full pt-2 max-w-xl">
            <div className="flex items-start gap-2">
              <span className="text-gold font-serif text-sm mt-0.5">✦</span>
              <div>
                <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-semibold">Couture Scenography</h4>
                <p className="font-sans text-[10px] text-champagne/60 leading-normal">Bespoke themed styling and floral sets.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-serif text-sm mt-0.5">✦</span>
              <div>
                <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-semibold">Michelin-Inspired Culinary</h4>
                <p className="font-sans text-[10px] text-champagne/60 leading-normal">Custom menus crafted by elite chefs.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-serif text-sm mt-0.5">✦</span>
              <div>
                <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-semibold">White-Glove Valet & Butler</h4>
                <p className="font-sans text-[10px] text-champagne/60 leading-normal">Pristine assistance for hosts and VIPs.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-serif text-sm mt-0.5">✦</span>
              <div>
                <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-semibold">Advanced Technical FX</h4>
                <p className="font-sans text-[10px] text-champagne/60 leading-normal">Complete 3D mapping and acoustics.</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
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
