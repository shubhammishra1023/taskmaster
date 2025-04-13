/*import mongoose from 'mongoose';
import { Schema, models } from 'mongoose';

export interface IServiceProvider {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  serviceType: string;
  description?: string;
  hourlyRate?: number;
  availability?: {
    monday?: { start?: string; end?: string; available: boolean };
    tuesday?: { start?: string; end?: string; available: boolean };
    wednesday?: { start?: string; end?: string; available: boolean };
    thursday?: { start?: string; end?: string; available: boolean };
    friday?: { start?: string; end?: string; available: boolean };
    saturday?: { start?: string; end?: string; available: boolean };
    sunday?: { start?: string; end?: string; available: boolean };
  };
  skills?: string[];
  rating?: number;
  reviewCount?: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    hourlyRate: {
      type: Number,
    },
    availability: {
      monday: { start: String, end: String, available: Boolean },
      tuesday: { start: String, end: String, available: Boolean },
      wednesday: { start: String, end: String, available: Boolean },
      thursday: { start: String, end: String, available: Boolean },
      friday: { start: String, end: String, available: Boolean },
      saturday: { start: String, end: String, available: Boolean },
      sunday: { start: String, end: String, available: Boolean },
    },
    skills: [String],
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.ServiceProvider || mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);*/
import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IServiceProvider {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  serviceType: string;
  description?: string;
  hourlyRate?: number;
  availability?: {
    monday?: { start?: string; end?: string; available: boolean };
    tuesday?: { start?: string; end?: string; available: boolean };
    wednesday?: { start?: string; end?: string; available: boolean };
    thursday?: { start?: string; end?: string; available: boolean };
    friday?: { start?: string; end?: string; available: boolean };
    saturday?: { start?: string; end?: string; available: boolean };
    sunday?: { start?: string; end?: string; available: boolean };
  };
  skills?: string[];
  rating?: number;
  reviewCount?: number;
  verified: boolean;
  businessName?: string;
  businessLicense?: string;
  yearsOfExperience?: number;
  gallery?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    hourlyRate: {
      type: Number,
    },
    availability: {
      monday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      tuesday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      wednesday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      thursday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      friday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      saturday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
      sunday: { 
        start: String, 
        end: String, 
        available: { type: Boolean, default: false } 
      },
    },
    skills: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    businessName: {
      type: String,
    },
    businessLicense: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    gallery: [String],
  },
  { timestamps: true }
);

// Create index for faster queries
ServiceProviderSchema.index({ userId: 1 });
ServiceProviderSchema.index({ serviceType: 1 });

export default models.ServiceProvider || model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);