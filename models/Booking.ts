import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IBooking {
  _id?: string;
  providerId: mongoose.Types.ObjectId;
  consumerId: mongoose.Types.ObjectId;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  startTime: string;
  endTime: string;
  location?: {
    type: string;
    coordinates: number[];
    address?: string;
  };
  price?: number;
  notes?: string;
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    consumerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
      address: String,
    },
    price: {
      type: Number,
    },
    notes: {
      type: String,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
BookingSchema.index({ providerId: 1 });
BookingSchema.index({ consumerId: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ status: 1 });

export default models.Booking || model<IBooking>('Booking', BookingSchema);