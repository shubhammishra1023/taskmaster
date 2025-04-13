/*import mongoose from 'mongoose';
import { Schema, models } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'consumer' | 'provider';
  location?: {
    type: string;
    coordinates: number[];
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['consumer', 'provider'],
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
      city: String,
      state: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

// Create a geospatial index for location-based queries
UserSchema.index({ location: '2dsphere' });

export default models.User || mongoose.model<IUser>('User', UserSchema);*/
import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'consumer' | 'provider';
  location?: {
    type: string;
    coordinates: number[];
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['consumer', 'provider'],
      required: [true, 'Role is required'],
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
      city: String,
      state: String,
      zipCode: String,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a geospatial index for location-based queries
UserSchema.index({ location: '2dsphere' });

// Export the model
export default models.User || model<IUser>('User', UserSchema);