// Simple test for ipgeolocation API
async function testIPLocation() {
  try {
    const apiKey = '972af010f3e5437c933bd5b58e5dc1bc';
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('IP Geolocation Data:', data);
    console.log(`Location: ${data.city}, ${data.country_name}`);
    console.log(`Coordinates: ${data.latitude}, ${data.longitude}`);
    
    return data;
  } catch (error) {
    console.error('Error fetching IP location:', error);
  }
}

testIPLocation();