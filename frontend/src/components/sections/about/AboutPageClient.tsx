'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedText from '@/components/ui/AnimatedText';
import GoldDivider from '@/components/ui/GoldDivider';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Shield, Award } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const VISION_VALUES = [
  {
    icon: Star,
    title: 'Artistry',
    slogan: 'Couture scenography and bespoke floral sets designed by master decorators.'
  },
  {
    icon: Shield,
    title: 'Precision',
    slogan: 'White-glove butler hospitality managing every operational second with quiet elegance.'
  },
  {
    icon: Award,
    title: 'Splendor',
    slogan: 'Soaring glass walls, crystal vaulted ceilings, and lush woodland backdrops.'
  }
];

const HISTORY_MILESTONES = [
  {
    year: '2011',
    title: 'The Foundation',
    desc: 'Acquisition of the 20-acre estate and construction of the Grand Ballroom.'
  },
  {
    year: '2018',
    title: 'The Glass House',
    desc: 'Unveiling of our modern double-glazed glass pavilion woodland sanctuary.'
  },
  {
    year: '2025',
    title: 'The Royal Canopy',
    desc: 'Opening of the open-air marquee pavilion and five luxury dressing villas.'
  }
];

export default function AboutPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heritageRef = useRef<HTMLDivElement>(null);
  const distinctionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
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
        gsap.fromTo([img1Ref.current, img2Ref.current], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.2 });
        gsap.fromTo(distinctionRef.current?.children || [], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.2 });
        gsap.fromTo(valuesRef.current?.children || [], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 });
        gsap.fromTo(timelineRef.current?.children || [], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 });
      } else {
        // Stacked Image Parallax Reveal
        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: heritageRef.current,
            start: 'top 85%',
            once: true
          }
        });

        revealTl.fromTo(img1Ref.current, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' })
                .fromTo(img2Ref.current, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.9');

        // Continuous Scroll Parallax for stacked images
        gsap.fromTo(img1Ref.current, { y: 30 }, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: heritageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.0
          }
        });

        gsap.fromTo(img2Ref.current, { y: 60 }, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: heritageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3
          }
        });

        // Distinction Section Reveal
        gsap.fromTo(distinctionRef.current?.children || [],
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: distinctionRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );

        // Values Stagger
        gsap.fromTo(valuesRef.current?.children || [],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: valuesRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );

        // Timeline Stagger
        gsap.fromTo(timelineRef.current?.children || [],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-obsidian text-champagne">
      {/* Hero Section */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden bg-black">
        <Image
          src="/images/about-hero.png"
          alt="Grandeur Hall classical European estate daytime facade"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-obsidian pointer-events-none" />
        
        <div className="relative z-10 text-center px-6 mt-16">
          <p className="font-display text-2xl md:text-3xl text-gold italic leading-none mb-3">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl tracking-wide text-ivory font-medium uppercase leading-none">
            The Legacy
          </h1>
        </div>
      </section>

      {/* Heritage Section (Stacked Images) */}
      <section ref={heritageRef} className="py-20 md:py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Stacked Images */}
        <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] md:h-[600px] w-full select-none">
          <div
            ref={img1Ref}
            className="absolute left-0 bottom-0 w-[60%] h-[80%] overflow-hidden border border-walnut/20 shadow-lg"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <Image
              src="/images/about-ceremony.png"
              alt="Luxury wedding ceremony couple"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover"
            />
          </div>

          <div
            ref={img2Ref}
            className="absolute right-0 top-0 w-[55%] h-[75%] overflow-hidden border border-gold/20 shadow-xl z-10"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
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

        {/* Right Column: Copywriting */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6">
          <span className="font-display text-3xl md:text-4xl text-gold italic leading-none">
            Nagpur's Premier Estate
          </span>
          <AnimatedText
            text="Crafting Eras of Cinematic Celebrations"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne leading-tight"
          />
          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            Grandeur Hall is more than a venue; it is an architectural symphony custom-designed to host life’s most profound milestones. Built upon fifteen years of award-winning hospitality, our estate seamlessly blends classical grandeur with cutting-edge design, ensuring your celebration resonates with absolute luxury.
          </p>
          <p className="text-sm text-champagne/70 leading-relaxed font-sans max-w-xl">
            From our soaring glass house reflecting woodland silhouettes to the sweeping ballroom with crystal chandeliers, every corner is a canvas for cinematic memories. We curate bespoke experiences, ensuring your celebration is hosted with effortless grace.
          </p>
        </div>
      </section>

      {/* Distinction Section (Bespoke Scale & Specialties) */}
      <section
        id="distinction"
        className="py-20 md:py-32 bg-slate border-t border-b border-walnut/20"
        aria-labelledby="distinction-heading"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Section Heading */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <span className="font-display text-3xl text-gold italic leading-none mb-2">
              The Distinction
            </span>
            <AnimatedText
              text="Our Specialties & Spatial Scale"
              tag="h2"
              className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
            />
            <div className="w-12 h-[1px] bg-gold mt-6" />
          </div>

          <div ref={distinctionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Spatial Scale & Area Specs */}
            <div className="lg:col-span-5 flex flex-col space-y-8 p-8 bg-obsidian border border-walnut/25 shadow-sm">
              <h3 className="font-serif text-xl text-gold font-medium tracking-wide border-b border-walnut/20 pb-4">
                The Estate Specifications
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-bold mb-1">
                    20-Acre Private Grounds
                  </h4>
                  <p className="font-sans text-[11px] text-champagne/60 leading-relaxed">
                    Expansive manicured lawns, winding stone pathways, and romantic European garden backdrops.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-bold mb-1">
                    6 Architectural Venues
                  </h4>
                  <p className="font-sans text-[11px] text-champagne/60 leading-relaxed">
                    Six indoor and outdoor masterworks offering distinct atmospheric styles for any scale.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-bold mb-1">
                    5,000+ Sqm Paved Celebration Area
                  </h4>
                  <p className="font-sans text-[11px] text-champagne/60 leading-relaxed">
                    Spacious, beautifully paved courtyards and open-air decks optimized for guest movement.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider text-champagne font-bold mb-1">
                    1,200 Guest Comfort Capacity
                  </h4>
                  <p className="font-sans text-[11px] text-champagne/60 leading-relaxed">
                    Comfortably accommodates large-scale events with climate-controlled zones and premium infrastructure.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Specialties */}
            <div className="lg:col-span-7 flex flex-col space-y-8 pt-2">
              <h3 className="font-serif text-xl text-champagne font-medium tracking-wide">
                What Sets Grandeur Hall Apart
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-2">
                  <h4 className="font-serif text-lg leading-none text-champagne">
                    <span className="text-gold mr-2 font-sans">✦</span>Daily Estate Exclusivity
                  </h4>
                  <p className="font-sans text-xs text-champagne/70 leading-relaxed">
                    We host only one single celebration per day across our entire 20-acre grounds. This guarantees absolute privacy, dedicated security, and the undivided focus of our hospitality team.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <h4 className="font-serif text-lg leading-none text-champagne">
                    <span className="text-gold mr-2 font-sans">✦</span>Technical & Visual FX
                  </h4>
                  <p className="font-sans text-xs text-champagne/70 leading-relaxed">
                    Unlike standard halls, we feature in-house technical directors who customize 3D projection mapping, synchronized intelligent lighting, and acoustic calibration for immersive soundscapes.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <h4 className="font-serif text-lg leading-none text-champagne">
                    <span className="text-gold mr-2 font-sans">✦</span>Culinary Theater
                  </h4>
                  <p className="font-sans text-xs text-champagne/70 leading-relaxed">
                    Our Michelin-inspired chefs design custom theatrical dining experiences, including interactive live kitchens, curated mixology lounges, and couture dessert patisseries.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <h4 className="font-serif text-lg leading-none text-champagne">
                    <span className="text-gold mr-2 font-sans">✦</span>Zero-Friction Care
                  </h4>
                  <p className="font-sans text-xs text-champagne/70 leading-relaxed">
                    Every booking is supported by a personal bridal concierge and dedicated host butler coordinators who manage all logistics so you can enjoy your day in absolute peace.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Gold Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <GoldDivider />
      </div>

      {/* Vision Values section (3 columns, text-light) */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-display text-2xl text-gold italic leading-none mb-2 block">
            Our Foundations
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-wide text-champagne">
            The Pillars of Grandeur
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {VISION_VALUES.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 border border-walnut/20 bg-slate/10 hover:border-gold/45 hover:shadow-[0_0_20px_rgba(212,175,55,0.06)] transition-all duration-500"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-gold/40 text-gold mb-6 bg-gold/10">
                  <Icon strokeWidth={1} size={24} />
                </div>
                <h3 className="font-serif text-lg text-champagne font-medium tracking-wide mb-3">
                  {value.title}
                </h3>
                <p className="font-sans text-xs text-champagne/60 leading-relaxed max-w-xs">
                  {value.slogan}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historical Timeline Section */}
      <section className="py-20 md:py-32 bg-slate border-t border-b border-walnut/20">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16 md:mb-24">
            <span className="font-display text-2xl text-gold italic leading-none mb-2 block">
              Our Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-wide text-champagne">
              Historical Milestones
            </h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </div>

          {/* Timeline Stack */}
          <div ref={timelineRef} className="space-y-12 relative before:absolute before:top-0 before:bottom-0 before:left-[18px] md:before:left-1/2 before:w-[1px] before:bg-gold/30">
            {HISTORY_MILESTONES.map((stone, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-stretch relative ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[18px] md:left-1/2 top-0 -translate-x-1/2 w-9 h-9 rounded-full border border-gold/40 bg-obsidian flex items-center justify-center text-[10px] text-gold font-serif font-bold z-10 shadow-md">
                  {stone.year.slice(2)}
                </div>

                {/* Blank Space for alignment */}
                <div className="w-full md:w-1/2 hidden md:block" />

                {/* Timeline Content Block */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 flex flex-col justify-start">
                  <div className="p-6 bg-obsidian border border-walnut/15 hover:border-gold/35 transition-colors duration-300">
                    <span className="font-serif text-xs text-gold font-semibold tracking-widest block mb-1">
                      {stone.year}
                    </span>
                    <h3 className="font-serif text-base text-champagne font-medium tracking-wide mb-2">
                      {stone.title}
                    </h3>
                    <p className="font-sans text-xs text-champagne/60 leading-relaxed">
                      {stone.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-obsidian text-center px-6">
        <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-champagne mb-4">
          Experience the Grandeur in Person
        </h3>
        <p className="font-sans text-xs text-champagne/60 max-w-md mx-auto mb-8 leading-relaxed">
          Align your vision with our curator planners and tour the estate grounds during a private guided consultation.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/contact" className="w-44 py-3 text-xs tracking-widest bg-gold text-obsidian font-medium hover:bg-palegold transition-colors duration-300 uppercase font-sans">
            Book a Tour
          </Link>
        </div>
      </section>
    </div>
  );
}
