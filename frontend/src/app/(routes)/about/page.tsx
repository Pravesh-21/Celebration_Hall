import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import AboutPageClient from '@/components/sections/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — Grandeur Hall',
  description: 'Discover the rich heritage, meticulous philosophy, and spatial distinction of Grandeur Hall. Learn about Nagpur’s premier 20-acre celebration estate.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutPageClient />
      <Footer />
    </>
  );
}
