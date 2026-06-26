import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory bookings database for demonstration
const bookings: any[] = [];

// Zod Validation Schema matching the frontend spec
const bookingSchema = z.object({
  eventType: z.string().min(1, 'Event type is required'),
  guestCount: z.number().min(10, 'Minimum guest count is 10').max(2000, 'Maximum guest count is 2000'),
  dateFlexibility: z.enum(['fixed', 'flexible']),
  venueId: z.string().min(1, 'Venue selection is required'),
  date: z.string().min(1, 'Date is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  notes: z.string().optional(),
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Grandeur Hall Backend API is running.' });
});

// Bookings endpoints
app.get('/api/bookings', (req: Request, res: Response) => {
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const result = bookingSchema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return res.status(400).json({ success: false, fieldErrors });
  }

  // Generate a premium confirmation reference number (e.g. GH-2026-XXXX)
  const refNum = `GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newBooking = {
    id: refNum,
    ...result.data,
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  console.log(`[Grandeur Hall API] Booking created: ${refNum}`, newBooking);

  return res.status(201).json({
    success: true,
    referenceNumber: refNum,
    message: 'Booking request received successfully.',
  });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  GRANDEUR HALL — Premium Backend Server           `);
  console.log(`  Running on http://localhost:${PORT}             `);
  console.log(`===================================================`);
});
