'use server';

import { bookingSchema, BookingFormData } from '@/lib/schemas/booking';

interface SubmissionResult {
  success: boolean;
  fieldErrors?: Record<string, string>;
  referenceNumber?: string;
  message?: string;
}

export async function submitBooking(data: unknown): Promise<SubmissionResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Server-side validation using Zod
  const result = bookingSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      const path = err.path[0];
      if (path) {
        fieldErrors[path as string] = err.message;
      }
    });
    return { success: false, fieldErrors };
  }

  const validatedData = result.data;

  // Try to sync with the Express backend if it is running
  try {
    const response = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
      // Set a short timeout so the Next.js server action doesn't hang if Express is down
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const apiResult = await response.json();
      return {
        success: true,
        referenceNumber: apiResult.referenceNumber,
        message: 'Successfully synced with backend API.',
      };
    }
  } catch (error) {
    // Express server is offline or unreachable, fall back to local generation
    console.log('[Server Action] Standalone backend is offline. Falling back to local confirmation generation.');
  }

  // Fallback local generation of booking confirmation reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const localRefNumber = `GH-${new Date().getFullYear()}-${randomSuffix}`;

  return {
    success: true,
    referenceNumber: localRefNumber,
    message: 'Booking request confirmed locally.',
  };
}
