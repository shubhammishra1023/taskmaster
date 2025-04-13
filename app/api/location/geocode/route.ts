/*import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/location-service';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  try {
    const locationData = await geocodeAddress(address);
    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    );
  }
}*/
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // For this example, we'll use a mock response
    // In a real application, you would use Google Maps Geocoding API
    // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    // const data = await response.json();
    
    // Mock response for demonstration
    const mockResponse = {
      latitude: 40.7128,
      longitude: -74.0060,
      formattedAddress: address,
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    );
  }
}