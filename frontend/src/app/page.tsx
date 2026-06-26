import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/sections/home/Hero';
import Stats from '@/components/sections/home/Stats';
import AboutSnippet from '@/components/sections/home/AboutSnippet';
import GoldDivider from '@/components/ui/GoldDivider';
import FeaturedVenues from '@/components/sections/home/FeaturedVenues';
import ExperienceShowcase from '@/components/sections/home/ExperienceShowcase';
import VisualPillars from '@/components/sections/home/VisualPillars';
import WhyChooseUs from '@/components/sections/home/WhyChooseUs';
import PlanningJourney from '@/components/sections/home/PlanningJourney';
import FaqAccordion from '@/components/sections/home/FaqAccordion';
import CTABand from '@/components/sections/home/CTABand';
import Footer from '@/components/shared/Footer';

export default function Home() {
  // LocalBusiness JSON-LD structured data for superior local SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Grandeur Hall',
    'image': 'https://grandeurhall.com/images/hero-estate.png',
    'telephone': '+91-98765-43210',
    'email': 'hello@grandeurhall.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Grandeur Hall Estate',
      'addressLocality': 'Nagpur',
      'addressRegion': 'Maharashtra',
      'postalCode': '440001',
      'addressCountry': 'IN',
    },
    'url': 'https://grandeurhall.com',
    'priceRange': '$$$$',
    'description': 'An Awwwards-caliber, ultra-luxury celebration hall and estate in Nagpur, India, catering to royal weddings, corporate galas, and bespoke events.',
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      
      {/* Hero section */}
      <Hero />
      
      {/* Stats bar */}
      <Stats />
      
      {/* About snippet */}
      <AboutSnippet />
      
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <GoldDivider />
      </div>
      
      {/* Featured Venues */}
      <FeaturedVenues />
      
      {/* Experience Showcase (Weddings, Corporate, Milestone Soirees) */}
      <ExperienceShowcase />

      {/* Visual Pillars (Scenic Highlights of the Estate) */}
      <VisualPillars />
      
      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Planning Journey (Process Steps) */}
      <PlanningJourney />

      {/* Frequently Asked Questions Accordion */}
      <FaqAccordion />
      
      {/* Call To Action Band */}
      <CTABand />
      
      <Footer />
    </>
  );
}
