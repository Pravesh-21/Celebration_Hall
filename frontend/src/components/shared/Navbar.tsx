'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/venues', label: 'Venues' },
  { href: '/packages', label: 'Packages' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isHome = pathname === '/';
  const isDarkNavbar = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Background transparency toggle
      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Hide on scroll down, show on scroll up
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add('lenis-stopped');
    } else {
      document.body.classList.remove('lenis-stopped');
    }
    return () => document.body.classList.remove('lenis-stopped');
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-obsidian/85 backdrop-blur-md border-b border-walnut/50 py-3' 
            : 'bg-transparent py-6'
        } ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col focus-visible:outline-none" aria-label="Grandeur Hall Home">
            <span className="font-serif text-xl md:text-2xl font-medium tracking-[0.2em] text-gold leading-none">
              GRANDEUR
            </span>
            <span className={`font-sans text-[9px] md:text-[10px] tracking-[0.4em] leading-none mt-1 pl-[2px] uppercase transition-colors duration-300 ${
              isDarkNavbar ? 'text-ivory/70' : 'text-champagne/70'
            }`}>
              Hall
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-2 text-xs uppercase tracking-[0.08em] font-sans font-medium transition-colors duration-300 hover:text-gold"
                  style={{ 
                    color: isActive 
                      ? 'var(--color-gold)' 
                      : (isDarkNavbar ? 'var(--color-ivory)' : 'var(--color-champagne)') 
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger Button */}
          <button
            className={`md:hidden hover:text-gold focus:outline-none p-2 transition-colors duration-300 ${
              isDarkNavbar ? 'text-ivory' : 'text-champagne'
            }`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 bg-obsidian flex flex-col justify-center px-8 md:px-16"
          >
            {/* Elegant Diamond Pattern Background */}
            <div className="absolute inset-0 gold-diamond-pattern opacity-4 pointer-events-none" />

            {/* Logo in Overlay */}
            <div className="absolute top-6 left-6">
              <div className="flex flex-col">
                <span className="font-serif text-xl font-medium tracking-[0.2em] text-gold leading-none">
                  GRANDEUR
                </span>
                <span className="font-sans text-[9px] tracking-[0.4em] text-champagne/70 leading-none mt-1 pl-[2px] uppercase">
                  Hall
                </span>
              </div>
            </div>

            {/* Close Button in Overlay */}
            <button
              className="absolute top-6 right-6 text-champagne hover:text-gold p-2"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>

            {/* Staggered Navigation Links */}
            <nav className="flex flex-col space-y-6 text-left max-w-sm mt-8">
              {NAV_LINKS.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      className="inline-block text-2xl font-serif tracking-wider hover:text-gold transition-colors duration-300"
                      style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-champagne)' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Footer Area */}
            <div className="absolute bottom-12 left-8 right-8 flex flex-col space-y-2 border-t border-walnut/40 pt-6">
              <p className="text-[10px] uppercase tracking-widest text-champagne/40 font-sans">
                Nagpur, India
              </p>
              <p className="text-[10px] uppercase tracking-widest text-champagne/60 font-sans">
                hello@grandeurhall.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
