// app/api/recommendations/route.ts

import { NextRequest } from 'next/server';

// Mock data for user preferences and browsing history
const userPreferences = {
  userId: 'user-123',
  browsingHistory: [
    { productId: '1', category: 'electronics', timestamp: Date.now() - 3600000 }, // 1 hour ago
    { productId: '3', category: 'home', timestamp: Date.now() - 86400000 },     // 1 day ago
    { productId: '5', category: 'electronics', timestamp: Date.now() - 172800000 }, // 2 days ago
  ],
  purchaseHistory: [
    { productId: '2', category: 'accessories', timestamp: Date.now() - 259200000 }, // 3 days ago
  ],
  preferences: {
    categories: ['electronics', 'accessories'],
    priceRange: { min: 10, max: 100 },
    brands: ['TechBrand', 'AccessoriesRUs']
  }
};

// Mock product database
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'electronics',
    price: 12.99,
    retailPrice: 39.99,
    stock: 125,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available',
    brand: 'TechBrand',
    tags: ['audio', 'wireless', 'bluetooth']
  },
  {
    id: '2',
    name: 'Phone Case with MagSafe',
    category: 'accessories',
    price: 3.45,
    retailPrice: 19.99,
    stock: 0,
    imageUrl: 'https://placehold.co/200x200',
    status: 'out-of-stock',
    brand: 'AccessoriesRUs',
    tags: ['protection', 'magsafe', 'mobile']
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle',
    category: 'home',
    price: 8.75,
    retailPrice: 24.99,
    stock: 3,
    imageUrl: 'https://placehold.co/200x200',
    status: 'low-stock',
    brand: 'HomeEssentials',
    tags: ['drinkware', 'eco-friendly', 'durable']
  },
  {
    id: '4',
    name: 'Fitness Tracker Watch',
    category: 'electronics',
    price: 24.99,
    retailPrice: 59.99,
    stock: 42,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available',
    brand: 'TechBrand',
    tags: ['fitness', 'health', 'smartwatch']
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    category: 'electronics',
    price: 15.49,
    retailPrice: 34.99,
    stock: 18,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available',
    brand: 'AccessoriesRUs',
    tags: ['charging', 'wireless', 'accessories']
  },
  {
    id: '6',
    name: 'Ergonomic Office Chair',
    category: 'furniture',
    price: 129.99,
    retailPrice: 249.99,
    stock: 7,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available',
    brand: 'FurniturePlus',
    tags: ['ergonomic', 'office', 'comfort']
  },
  {
    id: '7',
    name: 'Smart Home Security Camera',
    category: 'electronics',
    price: 49.99,
    retailPrice: 89.99,
    stock: 15,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available',
    brand: 'TechBrand',
    tags: ['security', 'smart-home', 'camera']
  }
];

// Calculate similarity score between products based on category, tags, and brand
function calculateSimilarity(product1: any, product2: any): number {
  let score = 0;
  
  // Category match
  if (product1.category === product2.category) score += 3;
  
  // Brand match
  if (product1.brand === product2.brand) score += 2;
  
  // Tag matches
  const commonTags = product1.tags.filter((tag: string) => product2.tags.includes(tag));
  score += commonTags.length;
  
  return score;
}

// Get recommended products based on user behavior
function getRecommendations(userId: string, limit: number = 5) {
  // For this example, we'll use a simple algorithm
  // In a real application, this would use more sophisticated ML models
  
  const userPrefs = userPreferences;
  const recommendedProducts: any[] = [];
  
  // Start with products from user's preferred categories
  const categoryBased = products.filter(p => 
    userPrefs.preferences.categories.includes(p.category) && 
    p.id !== userPrefs.browsingHistory[0]?.productId // Don't recommend the same product
  );
  
  // Add products from recently browsed categories
  const recentCategories = [...new Set(userPrefs.browsingHistory.map(item => item.category))];
  const recentCategoryBased = products.filter(p => 
    recentCategories.includes(p.category) && 
    !categoryBased.some(cp => cp.id === p.id) && // Avoid duplicates
    p.id !== userPrefs.browsingHistory[0]?.productId
  );
  
  // Add products similar to recently viewed items
  const recentlyViewed = userPrefs.browsingHistory[0] 
    ? products.find(p => p.id === userPrefs.browsingHistory[0].productId)
    : null;
    
  let similarProducts: any[] = [];
  if (recentlyViewed) {
    similarProducts = products
      .filter(p => 
        p.id !== recentlyViewed.id && 
        !categoryBased.some(cp => cp.id === p.id) && 
        !recentCategoryBased.some(rp => rp.id === p.id)
      )
      .sort((a, b) => 
        calculateSimilarity(recentlyViewed, b) - calculateSimilarity(recentlyViewed, a)
      )
      .slice(0, 3);
  }
  
  // Combine all recommendations
  const allRecommendations = [...categoryBased, ...recentCategoryBased, ...similarProducts];
  
  // Sort by relevance score (simplified)
  const scoredRecommendations = allRecommendations.map(p => {
    let score = 0;
    
    // Category preference boost
    if (userPrefs.preferences.categories.includes(p.category)) {
      score += 10;
    }
    
    // Price range preference
    if (p.price >= userPrefs.preferences.priceRange.min && 
        p.price <= userPrefs.preferences.priceRange.max) {
      score += 5;
    }
    
    // Brand preference boost
    if (userPrefs.preferences.brands.includes(p.brand)) {
      score += 3;
    }
    
    // Recently browsed category boost
    if (recentCategories.includes(p.category)) {
      score += 2;
    }
    
    return { ...p, score };
  }).sort((a, b) => b.score - a.score);
  
  // Return top recommendations
  return scoredRecommendations.slice(0, limit);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'user-123';
  const limit = parseInt(searchParams.get('limit') || '5');
  
  try {
    const recommendations = getRecommendations(userId, limit);
    return Response.json({
      success: true,
      recommendations,
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to generate recommendations' 
      }, 
      { status: 500 }
    );
  }
}

// POST endpoint to track user interactions and improve recommendations
export async function POST(request: NextRequest) {
  try {
    const interaction = await request.json();
    
    // In a real app, this would store the interaction in a database
    // to improve future recommendations
    console.log('User interaction tracked:', interaction);
    
    return Response.json({
      success: true,
      message: 'Interaction recorded successfully'
    });
  } catch (error) {
    console.error('Error recording interaction:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to record interaction' 
      }, 
      { status: 500 }
    );
  }
}