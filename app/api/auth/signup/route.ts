import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ServiceProvider from '@/models/ServiceProvider';

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role, 
      serviceType = null,
      location = null
    } = await req.json();

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone,
      role,
      location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
      } : undefined,
    });

    await newUser.save();

    // If user is a service provider, create a service provider profile
    if (role === 'provider' && serviceType) {
      const newServiceProvider = new ServiceProvider({
        userId: newUser._id,
        serviceType,
        verified: false,
      });

      await newServiceProvider.save();
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully',
        userId: newUser._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}