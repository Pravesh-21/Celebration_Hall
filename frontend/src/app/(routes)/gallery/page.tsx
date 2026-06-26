'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import GoldDivider from '@/components/ui/GoldDivider';
import AnimatedText from '@/components/ui/AnimatedText';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  category: 'ceremony' | 'reception' | 'floral' | 'architecture';
  alt: string;
  span: 'landscape' | 'portrait';
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: '1',
    url: '/images/gallery-1.jpg',
    category: 'ceremony',
    alt: 'Royal wedding vows exchange',
    span: 'portrait'
  },
  {
    id: '2',
    url: '/images/gallery-2.jpg',
    category: 'ceremony',
    alt: 'Grand wedding canopy floral altar',
    span: 'landscape'
  },
  {
    id: '3',
    url: '/images/gallery-3.jpg',
    category: 'ceremony',
    alt: 'Golden aisle walkway decorated with candles',
    span: 'landscape'
  },
  {
    id: '4',
    url: '/images/gallery-4.jpg',
    category: 'ceremony',
    alt: 'Bridesmaids and bride walk down the aisle',
    span: 'portrait'
  },
  {
    id: '5',
    url: '/images/gallery-5.jpg',
    category: 'reception',
    alt: 'Opulent banquet tables under grand chandeliers',
    span: 'portrait'
  },
  {
    id: '6',
    url: '/images/gallery-6.jpg',
    category: 'reception',
    alt: 'Modern glass house indoor dinner reception',
    span: 'landscape'
  },
  {
    id: '7',
    url: '/images/gallery-7.jpg',
    category: 'reception',
    alt: 'Cinematic first dance of bride and groom',
    span: 'portrait'
  },
  {
    id: '8',
    url: '/images/gallery-8.jpg',
    category: 'reception',
    alt: 'Fine dining gold-rimrimmed plates and champagne',
    span: 'landscape'
  },
  {
    id: '9',
    url: '/images/gallery-9.jpg',
    category: 'floral',
    alt: 'Suspended wisteria and crystal installations',
    span: 'portrait'
  },
  {
    id: '10',
    url: '/images/gallery-10.jpg',
    category: 'floral',
    alt: 'Lush white orchid and rose centerpieces',
    span: 'landscape'
  },
  {
    id: '11',
    url: '/images/gallery-11.jpg',
    category: 'floral',
    alt: 'Bespoke entrance floral arch styling',
    span: 'landscape'
  },
  {
    id: '12',
    url: '/images/gallery-12.jpg',
    category: 'architecture',
    alt: 'Soaring ivory marquee pavilion under starry sky',
    span: 'portrait'
  },
  {
    id: '13',
    url: '/images/gallery-13.jpg',
    category: 'architecture',
    alt: 'Stately courtyard columns and centralized fountain',
    span: 'portrait'
  },
  {
    id: '14',
    url: '/images/gallery-14.jpg',
    category: 'architecture',
    alt: 'Rustic-chic walnut wood grove and hanging lanterns',
    span: 'landscape'
  },
  {
    id: '15',
    url: '/images/gallery-15.jpg',
    category: 'architecture',
    alt: 'Plush velvet champagne lounge seating',
    span: 'landscape'
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'reception', label: 'Reception' },
  { value: 'floral', label: 'Floral' },
  { value: 'architecture', label: 'Architecture' }
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = filter === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <>
      <Navbar />
      
      {/* Spacer */}
      <div className="h-24 md:h-32 bg-obsidian" />

      <main className="flex-1 bg-obsidian py-12 md:py-20" aria-labelledby="gallery-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
              Moments We&apos;ve Created
            </span>
            
            <AnimatedText
              text="The Gallery"
              tag="h1"
              className="font-serif text-4xl md:text-6xl text-champagne font-medium tracking-wide mb-4"
            />

            <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
              A cinematic journey through our most opulent affairs.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12" role="tablist" aria-label="Filter gallery by event type">
            {CATEGORIES.map((cat) => {
              const isActive = filter === cat.value;
              return (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(cat.value)}
                  className={`px-5 py-2 text-[10px] uppercase tracking-widest font-medium transition-all duration-500 rounded-none ${
                    isActive
                      ? 'bg-gold text-obsidian font-bold border border-gold'
                      : 'border border-walnut/40 text-champagne hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Masonry Image Grid (CSS Grid with Varied Row-Spans) */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[220px] md:auto-rows-[280px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, idx) => {
                const isPortrait = img.span === 'portrait';
                return (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => openLightbox(idx)}
                    className={`group relative overflow-hidden border border-walnut/20 cursor-pointer bg-walnut/5 select-none ${
                      isPortrait ? 'row-span-2 h-full' : 'row-span-1 h-full'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    {/* Dark vignette overlay */}
                    <div className="vignette-overlay opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

                    {/* Simple overlay label */}
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                        {img.alt}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <GoldDivider className="mt-20" />

        </div>
      </main>

      {/* Lightbox Modal (Custom component, no external packages) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery lightbox"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-ivory/80 hover:text-gold p-2 z-50 focus:outline-none"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 text-ivory/80 hover:text-gold p-3 bg-black/50 border border-walnut/30 hover:border-gold/50 rounded-none z-50 transition-colors focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Main Lightbox Image View */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full h-[70vh] md:h-[80vh] flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing
            >
              <div className="relative w-full h-full">
                <Image
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              {/* Caption */}
              <p className="text-center text-xs text-ivory/70 mt-4 font-sans tracking-wide">
                {filteredImages[lightboxIndex].alt}
              </p>
            </motion.div>

            {/* Right navigation arrow */}
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 text-ivory/80 hover:text-gold p-3 bg-black/50 border border-walnut/30 hover:border-gold/50 rounded-none z-50 transition-colors focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
