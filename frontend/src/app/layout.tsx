import type { Metadata } from 'next';
import { Corinthia, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import ScrollProvider from '@/components/shared/ScrollProvider';

const corinthia = Corinthia({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-corinthia',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Grandeur Hall — Premium Celebration Hall',
    default: 'Grandeur Hall | Premium Celebration Hall & Luxury Estate',
  },
  description: 'Experience an Awwwards-caliber, cinematic luxury celebration hall in Nagpur, India. Hand-crafted, modular spaces tailored for royal weddings, grand galas, and timeless memories.',
  metadataBase: new URL('https://grandeurhall.com'),
  openGraph: {
    title: 'Grandeur Hall | Premium Celebration Hall',
    description: 'Cinematic luxury celebration hall and estate. Tailored for weddings, grand galas, and corporate events.',
    images: [
      {
        url: '/images/hero-estate.png',
        width: 1200,
        height: 630,
        alt: 'Grandeur Hall Ballroom',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grandeur Hall | Premium Celebration Hall',
    description: 'Cinematic luxury celebration hall and estate in Nagpur, India.',
    images: ['/images/hero-estate.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${corinthia.variable} ${playfair.variable} ${inter.variable} lenis-smooth`}>
      <body className="bg-obsidian text-champagne font-sans antialiased min-h-screen flex flex-col selection:bg-gold selection:text-obsidian">
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-gold focus:text-obsidian focus:px-6 focus:py-3 focus:rounded-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to content
        </a>
        
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
