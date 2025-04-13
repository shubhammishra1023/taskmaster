import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IReview {
  _id?: string;
  providerId: mongoose.Types.ObjectId;
  consumerId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
ReviewSchema.index({ providerId: 1 });
ReviewSchema.index({ consumerId: 1 });
ReviewSchema.index({ bookingId: 1 });

export default models.Review || model<IReview>('Review', ReviewSchema);