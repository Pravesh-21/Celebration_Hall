import Link from 'next/link';
import GoldDivider from '@/components/ui/GoldDivider';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      label: 'Pinterest',
      href: 'https://pinterest.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-3.69 19.3c-.08-.65-.15-1.65.03-2.37l1.43-6.05s-.37-.73-.37-1.8c0-1.69.98-2.95 2.2-2.95 1.04 0 1.54.78 1.54 1.72 0 1.04-.66 2.6-1 4.05-.29 1.22.61 2.22 1.82 2.22 2.18 0 3.86-2.3 3.86-5.63 0-2.94-2.11-5-5.13-5-3.5 0-5.55 2.62-5.55 5.33 0 1.06.41 2.19.92 2.8a.3.3 0 01.07.28c-.08.33-.26 1.07-.3 1.22-.05.2-.18.27-.4.16-1.5-.7-2.43-2.9-2.43-4.66 0-3.8 2.76-7.29 7.96-7.29 4.18 0 7.42 2.98 7.42 6.96 0 4.15-2.62 7.5-6.26 7.5-1.22 0-2.37-.63-2.76-1.37l-.75 2.87c-.27 1.04-.99 2.34-1.48 3.14A10 10 0 1012 2z" />
        </svg>
      )
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      )
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-obsidian border-t border-walnut/20 relative" aria-label="Grandeur Hall Directory">
      {/* Shared Gold Divider as top border */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <GoldDivider className="py-0 mt-[-1px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        
        {/* Column 1: Logo & Brand Tagline */}
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl font-medium tracking-[0.2em] text-gold leading-none">
              GRANDEUR
            </span>
            <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] text-champagne/70 leading-none mt-1 pl-[2px] uppercase">
              Hall
            </span>
          </div>
          <p className="text-xs text-champagne/60 leading-relaxed font-sans max-w-xs">
            Crafting cinematic celebrations and luxury experiences. A breathtaking estate where architectural masterworks meet timeless moments.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.1em] text-gold uppercase">Quick Links</h3>
          <ul className="space-y-2 text-xs font-sans text-champagne/70">
            <li>
              <Link href="/" className="hover:text-gold transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold transition-colors duration-300">About</Link>
            </li>
            <li>
              <Link href="/venues" className="hover:text-gold transition-colors duration-300">Venues</Link>
            </li>
            <li>
              <Link href="/packages" className="hover:text-gold transition-colors duration-300">Packages</Link>
            </li>
            <li>
              <Link href="/gastronomy" className="hover:text-gold transition-colors duration-300">Gastronomy</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-gold transition-colors duration-300">Gallery</Link>
            </li>
            <li>
              <Link href="/testimonials" className="hover:text-gold transition-colors duration-300">Testimonials</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold transition-colors duration-300">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Venues */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.1em] text-gold uppercase">Our Spaces</h3>
          <ul className="space-y-2 text-xs font-sans text-champagne/70">
            <li>
              <Link href="/venues#grand-ballroom" className="hover:text-gold transition-colors duration-300">The Grand Ballroom</Link>
            </li>
            <li>
              <Link href="/venues#royal-pavilion" className="hover:text-gold transition-colors duration-300">The Royal Pavilion</Link>
            </li>
            <li>
              <Link href="/venues#glass-house" className="hover:text-gold transition-colors duration-300">The Glass House</Link>
            </li>
            <li>
              <Link href="/venues#walnut-grove" className="hover:text-gold transition-colors duration-300">The Walnut Grove</Link>
            </li>
            <li>
              <Link href="/venues#imperial-courtyard" className="hover:text-gold transition-colors duration-300">The Imperial Courtyard</Link>
            </li>
            <li>
              <Link href="/venues#champagne-lounge" className="hover:text-gold transition-colors duration-300">The Champagne Lounge</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.1em] text-gold uppercase">Contact</h3>
          <ul className="space-y-3 text-xs font-sans text-champagne/70">
            <li className="flex items-start space-x-2">
              <span className="text-gold mt-[2px]">📍</span>
              <span>Nagpur, India</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-gold mt-[2px]">📞</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-gold mt-[2px]">✉️</span>
              <a href="mailto:hello@grandeurhall.com" className="hover:text-gold transition-colors duration-300">
                hello@grandeurhall.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bg-walnut/15 border-t border-walnut/10 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-widest text-champagne/40 text-center sm:text-left">
            © {currentYear} Grandeur Hall. All rights reserved. Hand-crafted with absolute luxury.
          </p>
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne/50 hover:text-gold transition-colors duration-300"
                aria-label={social.label}
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
