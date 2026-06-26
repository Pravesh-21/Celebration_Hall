export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  eventType: string;
  date: string;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Aishwarya & Rohan',
    quote: 'From the moment we stepped into Grandeur Hall, we knew it was where our forever would begin. The Grand Ballroom was absolute magic, and the concierge team handled every detail flawlessly. Our guests are still talking about the bespoke lighting and the incredible banquet service.',
    eventType: 'Royal Wedding Reception',
    date: 'December 18, 2025',
    image: '/images/avatar-sarah.jpg'
  },
  {
    id: '2',
    name: 'Vikram Malhotra',
    quote: 'We hosted our company’s 15th anniversary gala at The Glass House. The integration of modern architecture with the surrounding greenery created a sophisticated atmosphere that perfectly aligned with our brand. The audio-visual production was flawless, resembling an international concert stage.',
    eventType: 'Corporate Anniversary Gala',
    date: 'October 12, 2025',
    image: '/images/avatar-michael.jpg'
  },
  {
    id: '3',
    name: 'Meera & Kabir',
    quote: 'The Royal Pavilion was the perfect outdoor setting for our pheras. The team transformed the lawns into a dreamscape with exquisite floral styling and fairy-light canopies. The butler service in our bridal suite made us feel like royalty. It was a truly cinematic experience.',
    eventType: 'Sunset Lawn Wedding',
    date: 'November 24, 2025',
    image: '/images/avatar-emily.jpg'
  },
  {
    id: '4',
    name: 'Dr. Aditya Sen',
    quote: 'Celebrating my daughter’s milestone birthday at the Champagne Lounge was unforgettable. The plush, intimate setting and the custom craft cocktails were stellar. The staff went above and beyond, tailoring the entire evening to her exact tastes. It was worth every single rupee.',
    eventType: 'Intimate Birthday Soiree',
    date: 'January 05, 2026',
    image: '/images/avatar-rajesh.jpg'
  }
];
