// app/api/marketplace/route.ts

import { NextRequest } from 'next/server';

// Mock data for marketplace apps
const marketplaceApps = [
  {
    id: 'app-1',
    name: 'Social Media Connector',
    developer: 'Autilance Labs',
    description: 'Connect your store to social media platforms for automated posting and engagement tracking',
    category: 'marketing',
    price: 19.99,
    rating: 4.7,
    reviews: 128,
    installs: 2450,
    featured: true,
    tags: ['social', 'automation', 'marketing'],
    compatibility: ['shopify', 'woocommerce'],
    lastUpdated: '2024-01-15',
    version: '2.3.1',
    documentationUrl: '/docs/social-connector',
    supportUrl: '/support/social-connector',
    icon: '/app-icons/social-connector.png',
    screenshots: ['/screenshots/social1.png', '/screenshots/social2.png'],
    pricingModel: 'monthly',
    freeTrial: 14, // days
    isVerified: true
  },
  {
    id: 'app-2',
    name: 'Advanced Analytics',
    developer: 'Data Insights Pro',
    description: 'Deep analytics and reporting for your store performance with predictive insights',
    category: 'analytics',
    price: 49.99,
    rating: 4.9,
    reviews: 89,
    installs: 1200,
    featured: true,
    tags: ['analytics', 'ai', 'reporting'],
    compatibility: ['shopify', 'woocommerce', 'bigcommerce'],
    lastUpdated: '2024-01-20',
    version: '1.8.3',
    documentationUrl: '/docs/advanced-analytics',
    supportUrl: '/support/advanced-analytics',
    icon: '/app-icons/analytics.png',
    screenshots: ['/screenshots/analytics1.png', '/screenshots/analytics2.png'],
    pricingModel: 'monthly',
    freeTrial: 30,
    isVerified: true
  },
  {
    id: 'app-3',
    name: 'AI Product Descriptions',
    developer: 'CopyGen AI',
    description: 'Generate compelling product descriptions using AI based on your product data',
    category: 'copywriting',
    price: 29.99,
    rating: 4.5,
    reviews: 156,
    installs: 3100,
    featured: false,
    tags: ['ai', 'copywriting', 'seo'],
    compatibility: ['all'],
    lastUpdated: '2024-01-18',
    version: '3.1.0',
    documentationUrl: '/docs/ai-descriptions',
    supportUrl: '/support/ai-descriptions',
    icon: '/app-icons/ai-descriptions.png',
    screenshots: ['/screenshots/ai-desc1.png', '/screenshots/ai-desc2.png'],
    pricingModel: 'per-product',
    freeTrial: 7,
    isVerified: true
  },
  {
    id: 'app-4',
    name: 'Inventory Pro',
    developer: 'StockMaster',
    description: 'Advanced inventory management with automated reordering and demand forecasting',
    category: 'inventory',
    price: 39.99,
    rating: 4.6,
    reviews: 92,
    installs: 1800,
    featured: false,
    tags: ['inventory', 'automation', 'forecasting'],
    compatibility: ['shopify', 'bigcommerce'],
    lastUpdated: '2024-01-10',
    version: '2.5.2',
    documentationUrl: '/docs/inventory-pro',
    supportUrl: '/support/inventory-pro',
    icon: '/app-icons/inventory.png',
    screenshots: ['/screenshots/inventory1.png', '/screenshots/inventory2.png'],
    pricingModel: 'monthly',
    freeTrial: 14,
    isVerified: false
  },
  {
    id: 'app-5',
    name: 'Email Marketing Suite',
    developer: 'MailFlow',
    description: 'Complete email marketing solution with automation, segmentation, and A/B testing',
    category: 'marketing',
    price: 24.99,
    rating: 4.4,
    reviews: 203,
    installs: 4200,
    featured: true,
    tags: ['email', 'marketing', 'automation'],
    compatibility: ['all'],
    lastUpdated: '2024-01-22',
    version: '4.2.1',
    documentationUrl: '/docs/email-marketing',
    supportUrl: '/support/email-marketing',
    icon: '/app-icons/email-marketing.png',
    screenshots: ['/screenshots/email1.png', '/screenshots/email2.png'],
    pricingModel: 'tiered',
    freeTrial: 14,
    isVerified: true
  }
];

// Mock categories
const categories = [
  { id: 'all', name: 'All Apps', count: marketplaceApps.length },
  { id: 'marketing', name: 'Marketing', count: marketplaceApps.filter(app => app.category === 'marketing').length },
  { id: 'analytics', name: 'Analytics', count: marketplaceApps.filter(app => app.category === 'analytics').length },
  { id: 'inventory', name: 'Inventory', count: marketplaceApps.filter(app => app.category === 'inventory').length },
  { id: 'copywriting', name: 'Copywriting', count: marketplaceApps.filter(app => app.category === 'copywriting').length },
  { id: 'payment', name: 'Payment', count: marketplaceApps.filter(app => app.category === 'payment').length },
];

// Mock developer data
const developers = [
  { id: 'dev-1', name: 'Autilance Labs', apps: 5, rating: 4.8, verified: true },
  { id: 'dev-2', name: 'Data Insights Pro', apps: 3, rating: 4.7, verified: true },
  { id: 'dev-3', name: 'CopyGen AI', apps: 2, rating: 4.5, verified: true },
  { id: 'dev-4', name: 'StockMaster', apps: 4, rating: 4.3, verified: true },
  { id: 'dev-5', name: 'MailFlow', apps: 6, rating: 4.6, verified: true },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'all';
  const category = searchParams.get('category') || '';
  const developer = searchParams.get('developer') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured');
  const sortBy = searchParams.get('sortBy') || 'popularity';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let filteredApps = [...marketplaceApps];
    
    // Apply filters
    if (category && category !== 'all') {
      filteredApps = filteredApps.filter(app => app.category === category);
    }
    
    if (developer) {
      filteredApps = filteredApps.filter(app => app.developer.toLowerCase().includes(developer.toLowerCase()));
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredApps = filteredApps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) || 
        app.description.toLowerCase().includes(searchTerm) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (featured === 'true') {
      filteredApps = filteredApps.filter(app => app.featured);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filteredApps.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredApps.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'price-low':
        filteredApps.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredApps.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        filteredApps.sort((a, b) => b.installs - a.installs);
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApps = filteredApps.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredApps.length / limit);

    // Return different data based on action
    if (action === 'categories') {
      return Response.json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString()
      });
    } else if (action === 'developers') {
      return Response.json({
        success: true,
        data: developers,
        timestamp: new Date().toISOString()
      });
    } else if (action === 'featured') {
      const featuredApps = marketplaceApps.filter(app => app.featured);
      return Response.json({
        success: true,
        data: {
          apps: featuredApps,
          categories,
          developers: developers.slice(0, 3) // Just top 3 developers
        },
        timestamp: new Date().toISOString()
      });
    } else if (action === 'app-details') {
      const appId = searchParams.get('appId');
      if (!appId) {
        return Response.json(
          { success: false, error: 'App ID is required for app details' }, 
          { status: 400 }
        );
      }
      
      const app = marketplaceApps.find(a => a.id === appId);
      if (!app) {
        return Response.json(
          { success: false, error: 'App not found' }, 
          { status: 404 }
        );
      }
      
      return Response.json({
        success: true,
        data: app,
        timestamp: new Date().toISOString()
      });
    } else {
      // Default: return all apps with pagination
      return Response.json({
        success: true,
        data: {
          apps: paginatedApps,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: filteredApps.length,
            itemsPerPage: limit
          },
          categories,
          developers
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in marketplace API:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process marketplace data' 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'install-app') {
      // Simulate app installation
      const { appId, storeId, userId } = data;
      
      // In a real app, this would record the installation in a database
      console.log(`App ${appId} installed for store ${storeId} by user ${userId}`);
      
      return Response.json({
        success: true,
        message: 'App installed successfully',
        data: {
          appId,
          storeId,
          installationDate: new Date().toISOString()
        }
      });
    } else if (action === 'submit-app') {
      // Process app submission
      const { 
        name, 
        description, 
        category, 
        developer, 
        price, 
        pricingModel,
        compatibility,
        documentationUrl,
        supportUrl,
        icon,
        screenshots
      } = data;
      
      // In a real app, this would validate and save the app to a database
      console.log(`New app submitted: ${name} by ${developer}`);
      
      // Return mock submission result
      return Response.json({
        success: true,
        message: 'App submission received, awaiting review',
        data: {
          submissionId: `sub-${Date.now()}`,
          status: 'pending',
          submittedAt: new Date().toISOString()
        }
      });
    } else if (action === 'review-app') {
      // Process app review
      const { appId, userId, rating, reviewText } = data;
      
      // In a real app, this would save the review to a database
      console.log(`Review for app ${appId} by user ${userId}`);
      
      return Response.json({
        success: true,
        message: 'Review submitted successfully',
        data: {
          appId,
          userId,
          rating,
          reviewText,
          reviewDate: new Date().toISOString()
        }
      });
    }

    return Response.json(
      { 
        success: false, 
        error: 'Invalid action' 
      }, 
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in marketplace POST API:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process request' 
      }, 
      { status: 500 }
    );
  }
}