'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import AnimatedText from '@/components/ui/AnimatedText';
import GoldDivider from '@/components/ui/GoldDivider';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChefHat, Flame, Wine, Cake } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CULINARY_PILLARS = [
  {
    icon: ChefHat,
    title: 'Imperial Banquets',
    desc: 'Multi-course plated service presenting heritage flavors and international fusion.',
    image: '/images/gallery-4.jpg'
  },
  {
    icon: Flame,
    title: 'Theatrical Counters',
    desc: 'Interactive cooking stations where master culinary artists prepare fresh delicacies.',
    image: '/images/gallery-5.jpg'
  },
  {
    icon: Wine,
    title: 'Bespoke Mixology',
    desc: 'Curated champagne bars, vintage pairings, and signature craft cocktails.',
    image: '/images/gallery-15.jpg'
  },
  {
    icon: Cake,
    title: 'Couture Patisserie',
    desc: 'Exquisite dessert salons featuring fine French pastries and custom cakes.',
    image: '/images/about-detail.png'
  }
];

const MENU_TABS = [
  {
    id: 'banquet',
    label: 'Grand Banquets',
    items: [
      { name: 'Saffron Infused Lobster', desc: 'Poached lobster tail in a velvety cardamon-saffron cream.' },
      { name: 'Truffle Dum Biryani', desc: 'Slow-cooked heritage basmati rice layered with winter truffles.' },
      { name: 'Rosemary Crusted Lamb', desc: 'Charred lamb chops served with roasted root purée and jus.' },
      { name: 'Imperial Paneer Kofta', desc: 'Stuffed cottage cheese dumplings in a rich, smoked cashew gravy.' }
    ]
  },
  {
    id: 'starters',
    label: 'Hors d’oeuvres',
    items: [
      { name: 'Crispy Gold Leaves Gazpacho', desc: 'Chilled heirloom tomato broth crowned with edible gold leaf.' },
      { name: 'Wood-Fired Portobello Bites', desc: 'Stuffed mushrooms glazed with aged balsamic and wild herbs.' },
      { name: 'Smoked Salmon Carpaccio', desc: 'Thinly sliced oak-smoked salmon with dill emulsion and capers.' },
      { name: 'Artisanal Burrata Crostini', desc: 'Creamy burrata over grilled sourdough, topped with organic figs.' }
    ]
  },
  {
    id: 'mixology',
    label: 'Craft Cocktails',
    items: [
      { name: 'The Grandeur Elixir', desc: 'Single malt scotch, gold dust, honey-lavender syrup, and bitters.' },
      { name: 'Blush Linen Mimosa', desc: 'Premium French champagne, fresh wild raspberry purée, and mint.' },
      { name: 'Espresso Royale', desc: 'House-blend cold brew, vanilla liqueur, and a dusting of dark cocoa.' },
      { name: 'Botanical Garden Gin', desc: 'Infused dry gin, cucumber tonic, rosemary sprig, and elderflower.' }
    ]
  }
];

export default function GastronomyPage() {
  const [activeTab, setActiveTab] = useState('banquet');
  const containerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        gsap.fromTo(pillarsRef.current?.children || [], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 });
        gsap.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      } else {
        // Pillars Stagger Reveal
        gsap.fromTo(pillarsRef.current?.children || [],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );

        // Menu Section Reveal
        gsap.fromTo(menuRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: menuRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-obsidian text-champagne">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden bg-black">
        <Image
          src="/images/about-detail.png"
          alt="Luxury Gastronomy at Grandeur Hall"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-obsidian pointer-events-none" />
        
        <div className="relative z-10 text-center px-6 mt-16">
          <p className="font-display text-2xl md:text-3xl text-gold italic leading-none mb-3">
            Gastronomic Artistry
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl tracking-wide text-ivory font-medium uppercase leading-none">
            Culinary Curation
          </h1>
        </div>
      </section>

      {/* Introduction Text Block */}
      <section className="py-16 md:py-24 text-center px-6 max-w-3xl mx-auto">
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold font-semibold mb-3 block">
          A Symphony of Fine Dining
        </span>
        <AnimatedText
          text="Curated Gastronomy for Grand Celebrations"
          tag="h2"
          className="font-serif text-2xl sm:text-4xl font-medium tracking-wide text-champagne mb-6"
        />
        <p className="font-sans text-xs sm:text-sm text-champagne/70 leading-relaxed max-w-2xl mx-auto">
          We believe that an exceptional celebration is defined by unforgettable flavors. Our elite culinary artists craft highly personalized menus tailored to your exact taste, elevating fine dining into an immersive, theatrical journey of taste and style.
        </p>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-8" />
      </section>

      {/* Culinary Pillars Visual Grid */}
      <section className="pb-20 md:pb-32 px-6 max-w-7xl mx-auto">
        <div ref={pillarsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CULINARY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative h-[360px] overflow-hidden border border-walnut/15 bg-slate/10 flex items-end p-6 select-none cursor-pointer"
              >
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-80 z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(16, 12, 8, 0.95) 0%, rgba(16, 12, 8, 0.4) 50%, rgba(16, 12, 8, 0.1) 100%)'
                  }}
                />
                
                <div className="relative z-20 w-full transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="w-10 h-10 border border-gold/40 text-gold flex items-center justify-center mb-4 bg-black/40">
                    <Icon strokeWidth={1} size={20} />
                  </div>
                  <h3 className="font-serif text-lg text-ivory font-medium tracking-wide mb-1 group-hover:text-gold transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[11px] text-ivory/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <GoldDivider />
      </div>

      {/* Interactive Menu Preview Section */}
      <section ref={menuRef} className="py-20 md:py-32 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-display text-2xl text-gold italic leading-none mb-2 block">
            Signature Flavors
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-wide text-champagne">
            Curated Menu Previews
          </h2>
          <p className="font-sans text-xs text-champagne/50 tracking-wide mt-2">
            A small selection of fine creations designed by our master chefs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center border-b border-walnut/20 mb-12 overflow-x-auto pb-1 gap-6 sm:gap-10">
          {MENU_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-sans text-xs uppercase tracking-[0.2em] pb-3 shrink-0 focus:outline-none focus-visible:text-gold transition-colors duration-300 relative ${
                activeTab === tab.id ? 'text-gold' : 'text-champagne/60 hover:text-champagne'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeMenuTab"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[250px] bg-slate/15 border border-walnut/15 p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {MENU_TABS.map((tab) => {
              if (tab.id !== activeTab) return null;
              return (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
                >
                  {tab.items.map((item, index) => (
                    <div key={index} className="flex flex-col border-b border-walnut/10 pb-4">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h4 className="font-serif text-sm md:text-base text-champagne font-medium tracking-wide">
                          {item.name}
                        </h4>
                        <span className="w-2 h-2 rounded-full bg-gold/50" />
                      </div>
                      <p className="font-sans text-[11px] text-champagne/60 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-walnut/15 border-t border-walnut/20 text-center px-6">
        <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-champagne mb-4">
          Ready to Craft Your Customized Menu?
        </h3>
        <p className="font-sans text-xs text-champagne/60 max-w-md mx-auto mb-8 leading-relaxed">
          Incorporate custom culinary curations, live counters, or champagne bars into your private reservation planner.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/contact" className="w-44 py-3 text-xs tracking-widest bg-gold text-obsidian font-medium hover:bg-palegold transition-colors duration-300 uppercase font-sans">
            Customize Menu
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
