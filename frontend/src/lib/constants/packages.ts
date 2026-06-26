export interface Package {
  id: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  isFeatured?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: 'essential',
    name: 'The Essential',
    price: '₹2,50,000',
    tagline: 'Refined elegance for intimate family gatherings, bespoke corporate conferences, and seamless milestone celebrations.',
    features: [
      '6 Hours Exclusive Venue Access (Single Signature Hall)',
      'Elegant Banquet Dining Setup (Fine Belgian Silver Linens)',
      'Designer Stage Architecture & Ambient LED Uplighting System',
      'Curated Culinary Experience (2 Gourmet Appetizers, 4 Mains, 2 Artisanal Desserts)',
      'Professional Concert-Grade Sound & PA Audio System',
      'Dedicated Event Operations Lead & Technical Coordinator',
      'Professional Valet Parking Service (up to 50 cars)',
      '1 Executive Preparation Suite with Private Dressing Amenities'
    ]
  },
  {
    id: 'signature',
    name: 'The Signature',
    price: '₹5,00,000',
    tagline: 'Bespoke high-fidelity production, rich multi-cuisine choices, and stunning custom floral scenography.',
    features: [
      '10 Hours Dual Space Access (Seamless transition between outdoor Lawn and indoor Hall)',
      'Exquisite Custom Floral Artistry & Theme Table Scenography',
      'Cinematic Intelligent Stage Lighting & Custom Monogram/Gobo Projection',
      'Rich Gastronomic Buffet & 2 Interactive Live Culinary Counters (4 Appetizers, 6 Mains, 3 Desserts)',
      'State-of-the-Art Concert Sound & High-Resolution LED visual wall (16x9ft)',
      'Personal Bridal Concierge & Dedicated Guest Relations Manager',
      'Premium Valet Service with Unlimited Fleet Parking',
      '2 Ultra-Luxury Preparation & Overnight Suites',
      'Exclusive Pre-Event Rehearsal and Photo Session (2 Hours)'
    ],
    isFeatured: true
  },
  {
    id: 'grandeur',
    name: 'The Grandeur',
    price: '₹10,00,000',
    tagline: 'The pinnacle of luxury. An exclusive, full-estate buyout giving you complete keys to the entire sanctuary.',
    features: [
      'Full-Day Exclusive Buyout (Access to all 6 indoor and outdoor venues across the estate)',
      'Couture Bespoke Floral Architecture & Full-Scale Ceiling Installations',
      'Advanced Production: 3D Projection Mapping, Laser FX, & Cinematic Scenic Lighting',
      'Bespoke Fine Dining Plated Service or Custom Luxury Buffet (Unlimited Elite Menu)',
      'Integrated Multi-Camera 4K Live Broadcast & High-Fidelity Audio Sync',
      'Dedicated Executive Event Director & VIP Guest Services Team',
      'Elite Airport Transfers in Luxury Sedans & VIP Fleet Valet Parking',
      '4 Grand Estate suites with 24-Hour Private Butler & Room Service',
      'Pre-Reception Champagne Toast & Signature Welcome Cocktail Mixology Bar'
    ]
  }
];
