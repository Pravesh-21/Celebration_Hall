import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import PackagesPageClient from '@/components/sections/packages/PackagesPageClient';

export const metadata: Metadata = {
  title: 'Our Packages',
  description: 'Explore the bespoke packages at Grandeur Hall. Choose between Essential, Signature, and Grandeur tiers, all tailored to create a luxury experience.',
};

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      
      {/* Spacer to push below fixed navbar */}
      <div className="h-24 md:h-32 bg-obsidian" />

      <PackagesPageClient />

      <Footer />
    </>
  );
}
