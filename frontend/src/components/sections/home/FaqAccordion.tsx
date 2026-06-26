'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/AnimatedText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FAQS = [
  {
    q: 'How do we arrange a private viewing of the Grandeur Hall estate?',
    a: 'Private consultations and guided tours of our estate grounds, grand halls, and private suites are available exclusively by appointment. Please submit a request through our online booking planner or contact our guest services desk directly to schedule an exquisite, personalized walk-through.'
  },
  {
    q: 'What is included in the Signature and Grandeur package tiers?',
    a: 'Our luxury packages are comprehensive and designed for seamless coordination. The Signature tier features custom ambient lighting, live gourmet stations, and high-end catering. The Grandeur tier elevates your celebration with full 3D projection mapping, couture floral installations, bespoke scenography, and a dedicated team of operational managers.'
  },
  {
    q: 'Do you permit external culinary partners or beverage curators?',
    a: 'To maintain our rigorous culinary standards, Grandeur Hall features an elite team of in-house chefs specializing in global and traditional gourmet cuisine. However, we do welcome external culinary partners for specialized traditional delicacies upon prior coordination and approval by our estate director.'
  },
  {
    q: 'What are the guest capacities for the different celebration spaces?',
    a: 'Our estate hosts celebrations of all scales. The Champagne Lounge and Walnut Grove comfortably accommodate intimate gatherings of 80 to 250 guests. The Royal Pavilion and Grand Ballroom cater to grand spectacles, hosting between 500 to 1,200 esteemed guests in luxurious configurations.'
  },
  {
    q: 'Is there dedicated on-site accommodation for the hosting family and guests?',
    a: 'Yes, the Grandeur Hall estate features the Imperial Bridal Suites and four luxury dressing villas. These offer private sanctuary spaces equipped with plush seating, grand vanity mirrors, gourmet refreshment bars, and dedicated butler services during your event day.'
  },
  {
    q: 'Is parking and valet service provided on the estate grounds?',
    a: 'Yes, Grandeur Hall offers secure on-site parking for up to 400 vehicles, alongside a complimentary white-glove valet service for all your guests. Our paved driveway and parking areas are fully illuminated, paved, and monitored by 24/7 security personnel to ensure absolute peace of mind.'
  },
  {
    q: 'Can we hire our own external decor planners and theme designers?',
    a: 'While we highly recommend our award-winning in-house scenography team for their unparalleled knowledge of our structural dimensions, rigging parameters, and electrical capacities, we do welcome certified external planners and decor designers upon approval and coordination with our technical director.'
  },
  {
    q: 'What is your policy for event cancellations or date rescheduling?',
    a: 'We understand that plans can evolve. Reservation dates can be rescheduled up to 180 days prior to the event, subject to venue availability and estate calendar coordination. Cancellations are managed according to a tiered refund schedule detailed in our private hosting contract.'
  }
];

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        gsap.fromTo(listRef.current?.children || [],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      } else {
        gsap.fromTo(listRef.current?.children || [],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.12,
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
      className="py-20 md:py-32 bg-obsidian border-b border-walnut/20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <span className="font-display text-3xl text-gold italic leading-none mb-2">
            Discerning Details
          </span>
          <AnimatedText
            text="Frequently Asked Questions"
            tag="h2"
            className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-champagne"
          />
          <div className="w-12 h-[1px] bg-gold mt-6" />
        </div>

        {/* Accordion List */}
        <div ref={listRef} className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-walnut/20 bg-slate/35 hover:border-gold/30 transition-colors duration-300"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group focus-visible:ring-1 focus-visible:ring-gold"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm md:text-base text-champagne font-medium tracking-wide pr-4 group-hover:text-gold transition-colors duration-300">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`text-gold/60 transition-transform duration-500 shrink-0 ${
                      isOpen ? 'rotate-180 text-gold' : 'group-hover:text-gold'
                    }`}
                    size={18}
                    strokeWidth={1.5}
                  />
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-walnut/15 pt-4">
                        <p className="font-sans text-xs md:text-sm text-champagne/70 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
