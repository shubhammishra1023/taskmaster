import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function geocodeAddress(address: string) {
  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    if (response.data.results.length === 0) {
      throw new Error('No results found');
    }

    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;
    
    // Extract address components
    const addressComponents = result.address_components;
    let city = '';
    let state = '';
    let zipCode = '';
    
    for (const component of addressComponents) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (component.types.includes('postal_code')) {
        zipCode = component.long_name;
      }
    }

    return {
      latitude: lat,
      longitude: lng,
      formattedAddress: result.formatted_address,
      city,
      state,
      zipCode,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}