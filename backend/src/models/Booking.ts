import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

export interface IBooking extends Document {
  id: string;
  eventType: string;
  guestCount: number;
  dateFlexibility: 'fixed' | 'flexible';
  venueId: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  referenceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventType: { type: String, required: true },
    guestCount: { type: Number, required: true, min: 10, max: 2000 },
    dateFlexibility: { type: String, enum: ['fixed', 'flexible'], required: true },
    venueId: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
    referenceNumber: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ email: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
