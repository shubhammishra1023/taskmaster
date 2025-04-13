import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ServiceProvider from '@/models/ServiceProvider';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseInt(searchParams.get('radius') || '10000'); // Default 10km
  const serviceType = searchParams.get('serviceType');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Find providers near the specified location
    const query: any = {
      role: 'provider',
      'location.type': 'Point',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    };

    const providers = await User.find(query).lean();

    // Get additional provider details
    const providerIds = providers.map(provider => provider._id);
    
    let serviceProviderQuery: any = { userId: { $in: providerIds } };
    if (serviceType) {
      serviceProviderQuery.serviceType = serviceType;
    }
    
    const serviceProviders = await ServiceProvider.find(serviceProviderQuery).lean();

    // Combine user and service provider data
    const result = providers.map(provider => {
      const serviceProviderData = serviceProviders.find(
        sp => sp.userId.toString() === provider._id
      );
      
      if (!serviceProviderData) return null;
      
      // Remove sensitive information
      const { password, ...userInfo } = provider;
      
      return {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        location: provider.location,
        serviceType: serviceProviderData.serviceType,
        description: serviceProviderData.description,
        hourlyRate: serviceProviderData.hourlyRate,
        rating: serviceProviderData.rating,
        reviewCount: serviceProviderData.reviewCount,
        verified: serviceProviderData.verified,
      };
    }).filter(Boolean);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Nearby providers error:', error);
    return NextResponse.json(
      { error: 'Failed to find nearby providers' },
      { status: 500 }
    );
  }
}