'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';
import { Sparkles, Calendar, Award } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EXPERIENCES = [
  {
    title: 'Royal Weddings',
    subtitle: 'Where Love Becomes Legend',
    desc: 'A fairy-tale celebration curated to your legacy. We weave couture floral scenography and Michelin-caliber banquets into timeless memories.',
    image: '/images/gallery-3.jpg',
    features: [
      'Personal Bridal Concierge & Butler',
      'Couture Floral Artistry & Set Styling',
      'Plated Banquet Dining & Custom Cake Design',
      'Live Orchestra & Instrumental Soundscapes',
      'Private Family Preparation Villas'
    ],
    icon: Sparkles
  },
  {
    title: 'Corporate Galas & Summits',
    subtitle: 'Elevate Your Corporate Narrative',
    desc: 'Establish your brand distinction. Elegant award ceremonies and executive summits supported by state-of-the-art visual FX and acoustics.',
    image: '/images/gallery-11.jpg',
    features: [
      '3D Projection Mapping & Laser FX',
      'Custom Brand Scenography & Banners',
      'State-of-the-Art Acoustic Tuning',
      'VIP Green Rooms & Executive Lounges',
      'High-Speed Fiber Connectivity & Broadcast Feeds'
    ],
    icon: Award
  },
  {
    title: 'Milestone Soirees',
    subtitle: 'Artfully Crafted Celebrations',
    desc: 'Celebrate life\'s grand chapters. Host sophisticated anniversaries, birthday banquets, and champagne receptions under starlit canopies.',
    image: '/images/gallery-15.jpg',
    features: [
      'Curated Mixology Bars & Sommeliers',
      'Ambient Garden Lighting & Uplights',
      'Live Entertainment & Performance Stages',
      'Valet Parking & White-Glove Arrivals',
      'Bespoke Dessert Salons & Fine Patisserie'
    ],
    icon: Calendar
  }
];

export default function ExperienceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        gsap.fromTo(gridRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      } else {
        gsap.fromTo(gridRef.current?.children || [],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
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
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-display text-3xl text-gold italic leading-none mb-2">
            Curated Experiences
          </span>
          <AnimatedText
            text="Signature Celebrations"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
          />
          <div className="w-12 h-[1px] bg-gold mt-6" />
        </div>

        {/* Experiences Grid */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {EXPERIENCES.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col bg-obsidian border border-walnut/20 overflow-hidden hover:border-gold/45 hover:shadow-[0_15px_30px_rgba(212,175,55,0.06)] transition-all duration-500 flex-1"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-64 w-full overflow-hidden border-b border-walnut/15">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  />
                  {/* Premium soft vignette overlay */}
                  <div className="vignette-overlay bg-radial-gradient" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-obsidian/90 backdrop-blur-sm border border-gold/30 px-3 py-1.5 z-10">
                    <Icon className="text-gold" size={14} strokeWidth={1.5} />
                    <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-champagne font-medium">
                      {exp.title}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-champagne font-medium tracking-wide mb-2 group-hover:text-gold transition-colors duration-300">
                      {exp.title}
                    </h3>
                    <p className="font-display text-xs text-gold italic tracking-wide mb-4">
                      {exp.subtitle}
                    </p>
                    <p className="font-sans text-xs text-champagne/75 leading-relaxed mb-6">
                      {exp.desc}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="border-t border-walnut/15 pt-6 mt-auto">
                    <h4 className="font-sans text-[10px] tracking-[0.1em] uppercase text-champagne/40 font-medium mb-3">
                      Exclusive Amenities
                    </h4>
                    <ul className="space-y-2">
                      {exp.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gold rounded-full" />
                          <span className="font-sans text-xs text-champagne/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Link to Booking */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 group focus-visible:outline-none"
          >
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-champagne group-hover:text-gold transition-colors duration-300">
              Customize Your Experience
            </span>
            <span className="w-6 h-[1px] bg-champagne group-hover:bg-gold group-hover:w-10 transition-all duration-300" />
          </Link>
        </div>

      </div>
    </section>
  );
}
