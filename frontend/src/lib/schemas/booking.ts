import { z } from 'zod';

export const bookingSchema = z.object({
  eventType: z.string().min(1, 'Please select an event type'),
  
  guestCount: z.number()
    .min(10, 'Minimum guest count is 10')
    .max(2000, 'Maximum guest count is 2,000 guests'),
    
  dateFlexibility: z.enum(['fixed', 'flexible']),
  
  venueId: z.string().min(1, 'Please select a venue'),
  
  date: z.string().min(1, 'Please select a date'),
  
  name: z.string().min(2, 'Name must be at least 2 characters'),
  
  email: z.string().email('Please enter a valid email address'),
  
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid 10-15 digit phone number (e.g., +919876543210 or 9876543210)'),
  
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
