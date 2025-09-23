import { geolocationManager } from '@/lib/geolocationService';

async function testGeolocation() {
  console.log('Testing geolocation services...');
  
  try {
    // Test available providers
    const providers = geolocationManager.getAvailableProviders();
    console.log('Available providers:', providers);
    
    // Test getting location
    console.log('Getting current location...');
    const location = await geolocationManager.getCurrentLocation();
    console.log('Location result:', location);
    
  } catch (error) {
    console.error('Error testing geolocation:', error);
  }
}

testGeolocation();