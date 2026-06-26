export interface Venue {
  id: string;
  name: string;
  image: string;
  sqm: number;
  capacity: number;
  floorPlanNote: string;
  indoorOutdoor: 'Indoor' | 'Outdoor' | 'Both';
  description: string;
}

export const VENUES: Venue[] = [
  {
    id: 'grand-ballroom',
    name: 'The Grand Ballroom',
    image: '/images/hero-ballroom.png',
    sqm: 1200,
    capacity: 800,
    floorPlanNote: 'Features soaring 20ft ceilings, custom crystal chandeliers, and a massive built-in mahogany stage.',
    indoorOutdoor: 'Indoor',
    description: 'The crown jewel of our estate. A majestic architectural masterpiece featuring soaring 20ft ceilings, sweeping double staircases for cinematic grand entrances, and custom-engineered crystal chandeliers that cast a warm, starlit glow. Designed to host royal weddings, high-society galas, and historic celebrations with absolute splendor.'
  },
  {
    id: 'royal-pavilion',
    name: 'The Royal Pavilion',
    image: '/images/venue-pavilion.png',
    sqm: 850,
    capacity: 500,
    floorPlanNote: 'Stately open-air marquee structure with ivory draping and integrated fairy-light canopy.',
    indoorOutdoor: 'Outdoor',
    description: 'An elegant open-air sanctuary enveloped by meticulously manicured emerald lawns and blooming white rosebeds. Featuring stately ivory draping, structural arches, and an integrated fairy-light canopy that mimics a celestial dome, the Pavilion offers a dreamlike backdrop for romantic vows under the golden hour sun.'
  },
  {
    id: 'glass-house',
    name: 'The Glass House',
    image: '/images/venue-glasshouse.png',
    sqm: 600,
    capacity: 350,
    floorPlanNote: '360-degree double-glazed glass walls, fully climate-controlled, with retractable roof sections.',
    indoorOutdoor: 'Both',
    description: 'A modern architectural triumph crafted from high-performance, double-glazed glass walls. Offering panoramic 360-degree views of the surrounding whispering woodlands, this climate-controlled sanctuary features retractable roof panels, letting you dine under the stars while enjoying absolute comfort and luxury.'
  },
  {
    id: 'walnut-grove',
    name: 'The Walnut Grove',
    image: '/images/venue-grove.png',
    sqm: 950,
    capacity: 400,
    floorPlanNote: 'Rustic wooden pergola, hanging festoon lanterns, and natural stone pathways.',
    indoorOutdoor: 'Outdoor',
    description: 'A charming, organic woodland setting shaded by century-old, towering walnut trees. Bordered by winding stone pathways and illuminated by hanging festoon lanterns, the Grove features a rustic-chic wooden pergola and long hand-carved oak tables, making it ideal for bohemian banquets, romantic twilight dinners, and intimate ceremonies.'
  },
  {
    id: 'imperial-courtyard',
    name: 'The Imperial Courtyard',
    image: '/images/venue-courtyard.png',
    sqm: 750,
    capacity: 450,
    floorPlanNote: 'Italian marble paving, centralized grand limestone water fountain, and ambient uplighting.',
    indoorOutdoor: 'Outdoor',
    description: 'An exquisite European-style courtyard paved with hand-selected Italian white marble. Bordered by grand limestone columns, sweeping archways, and featuring a majestic, centralized stone fountain with cascading illuminated water, this space provides an opulent outdoor setting for high-end cocktail hours and twilight receptions.'
  },
  {
    id: 'champagne-lounge',
    name: 'The Champagne Lounge',
    image: '/images/venue-lounge.png',
    sqm: 400,
    capacity: 200,
    floorPlanNote: 'Plush velvet seating, custom brass bar wrap, and private VIP alcoves.',
    indoorOutdoor: 'Indoor',
    description: 'A sophisticated, intimate lounge designed for private VIP gatherings, cocktail hours, and exclusive afterparties. Styled with plush velvet seating in emerald and deep rose, dark walnut paneling, private alcoves, and a glowing brass-wrapped bar, the Lounge offers a curated selection of fine vintages, craft cocktails, and absolute privacy.'
  }
];
