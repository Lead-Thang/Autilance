// app/api/seo/route.ts

import { NextRequest } from 'next/server';

// Mock data for SEO analysis
const seoAnalysisData = {
  storeId: 'store-123',
  pages: [
    {
      id: 'home',
      url: '/',
      title: 'Autilance - Build AI-Powered E-commerce Stores',
      description: 'Create professional e-commerce stores with AI in minutes. Like v0 for building apps, but designed for online marketplaces and stores.',
      keywords: ['ecommerce', 'ai store builder', 'online store', 'dropshipping'],
      metaTags: {
        ogTitle: 'Autilance - AI E-commerce Builder',
        ogDescription: 'Build professional stores with AI - like v0 but for e-commerce',
        ogImage: '/og-image.jpg',
        twitterCard: 'summary_large_image',
      },
      score: 85,
      suggestions: [
        'Add more specific keywords to your title',
        'Include your main keyword in the first 100 words',
        'Add more internal links to related products',
      ]
    },
    {
      id: 'product-1',
      url: '/products/wireless-headphones',
      title: 'Wireless Bluetooth Headphones - Premium Audio Experience',
      description: 'Shop the latest wireless Bluetooth headphones with noise cancellation and 30-hour battery life. Free shipping available.',
      keywords: ['wireless headphones', 'bluetooth', 'audio', 'noise cancellation'],
      metaTags: {
        ogTitle: 'Wireless Bluetooth Headphones',
        ogDescription: 'Premium wireless headphones with noise cancellation',
        ogImage: '/products/headphones-og.jpg',
        twitterCard: 'summary_large_image',
      },
      score: 78,
      suggestions: [
        'Add product schema markup',
        'Optimize image alt text with keywords',
        'Include customer reviews in structured data',
      ]
    }
  ],
  overallScore: 82,
  recommendations: [
    'Optimize product images for faster loading',
    'Create location pages if serving local markets',
    'Set up Google Analytics and Search Console',
    'Add a blog section for fresh content',
    'Optimize your store for mobile devices',
  ]
};

// Mock content suggestions
const contentSuggestions = [
  {
    id: 'cs-1',
    type: 'product-description',
    title: 'Product Description Optimization',
    content: 'Your product descriptions should include relevant keywords naturally while focusing on benefits rather than just features. Use active voice and emotional triggers to persuade customers.',
    suggestions: [
      'Use power words like "proven", "exclusive", "premium"',
      'Focus on benefits rather than features',
      'Include sensory words that help customers imagine using the product'
    ]
  },
  {
    id: 'cs-2',
    type: 'blog-post',
    title: 'Blog Post Ideas',
    content: 'Content marketing can drive organic traffic to your store. Here are some blog post ideas based on your products:',
    suggestions: [
      'Top 10 Wireless Headphones for Working Professionals',
      'How to Choose the Right Headphones for Your Workout',
      'A Complete Guide to Bluetooth Audio Quality',
      'Noise Cancellation Technology Explained',
    ]
  },
  {
    id: 'cs-3',
    type: 'meta-tag',
    title: 'Meta Tags Optimization',
    content: 'Optimize your meta tags to improve click-through rates from search engines.',
    suggestions: [
      'Keep titles under 60 characters',
      'Keep descriptions under 160 characters',
      'Include target keywords in titles and descriptions',
      'Use action words to encourage clicks',
    ]
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const storeId = searchParams.get('storeId') || 'store-123';

  try {
    if (type === 'analysis') {
      // Return SEO analysis data
      return Response.json({
        success: true,
        data: seoAnalysisData,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'suggestions') {
      // Return content suggestions
      return Response.json({
        success: true,
        data: contentSuggestions,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'optimize-content') {
      // Return specific content optimization suggestions
      const pageUrl = searchParams.get('pageUrl');
      const contentType = searchParams.get('contentType') || 'page';
      
      // Generate content suggestions based on content type
      let suggestions: any[] = [];
      
      if (contentType === 'product') {
        suggestions = [
          {
            id: 'prod-title',
            type: 'title',
            current: searchParams.get('currentTitle') || 'Product Title',
            suggested: enhanceTitle(searchParams.get('currentTitle') || 'Product Title', searchParams.get('keywords') || ''),
            reason: 'Added target keywords and power words to improve click-through rate'
          },
          {
            id: 'prod-desc',
            type: 'description',
            current: searchParams.get('currentDescription') || 'Product description',
            suggested: enhanceDescription(searchParams.get('currentDescription') || 'Product description', searchParams.get('keywords') || ''),
            reason: 'Improved readability and included target keywords naturally'
          }
        ];
      } else {
        suggestions = [
          {
            id: 'page-title',
            type: 'title',
            current: searchParams.get('currentTitle') || 'Page Title',
            suggested: enhanceTitle(searchParams.get('currentTitle') || 'Page Title', searchParams.get('keywords') || ''),
            reason: 'Optimized for search visibility and click-through rate'
          },
          {
            id: 'page-content',
            type: 'content',
            current: searchParams.get('currentContent') || 'Page content',
            suggested: enhanceContent(searchParams.get('currentContent') || 'Page content', searchParams.get('keywords') || ''),
            reason: 'Improved keyword density and readability'
          }
        ];
      }
      
      return Response.json({
        success: true,
        data: {
          pageUrl,
          contentType,
          suggestions
        },
        timestamp: new Date().toISOString()
      });
    } else {
      // Default: return all SEO data
      return Response.json({
        success: true,
        analysis: seoAnalysisData,
        suggestions: contentSuggestions,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in SEO API:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process SEO data' 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'analyze-page') {
      // Analyze a specific page for SEO
      const { pageUrl, title, description, content } = data;
      
      // Perform mock analysis (in a real app, this would use NLP/ML)
      const mockAnalysis = {
        pageUrl,
        title: title || 'Page Title',
        description: description || 'Page description',
        content: content || 'Page content',
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        issues: [
          'Title could be more descriptive',
          'Description doesn\'t include target keywords',
          'Content could use better internal linking',
        ],
        recommendations: [
          'Add target keywords to title',
          'Include primary keyword in first 100 words',
          'Add 2-3 internal links to related products',
        ]
      };

      return Response.json({
        success: true,
        analysis: mockAnalysis
      });
    } else if (action === 'generate-meta-tags') {
      // Generate optimized meta tags
      const { title, description, type = 'website', imageUrl } = data;
      
      const metaTags = {
        title: title || 'Autilance Store',
        description: description || 'Professional e-commerce store built with AI',
        ogTitle: title || 'Autilance Store',
        ogDescription: description || 'Professional e-commerce store built with AI',
        ogType: type,
        ogImage: imageUrl || '/default-og-image.jpg',
        twitterCard: 'summary_large_image',
        twitterTitle: title || 'Autilance Store',
        twitterDescription: description || 'Professional e-commerce store built with AI',
        twitterImage: imageUrl || '/default-twitter-image.jpg',
      };

      return Response.json({
        success: true,
        metaTags
      });
    } else if (action === 'optimize-content') {
      // Optimize content based on provided text
      const { text, focusKeywords, contentPurpose } = data;
      
      // In a real app, this would use AI to enhance content
      // For now, we'll return some enhanced content based on focus keywords
      const optimizedContent = enhanceContent(text, focusKeywords.join(', '));
      
      return Response.json({
        success: true,
        original: text,
        optimized: optimizedContent,
        suggestions: [
          `Content now includes focus keywords: ${focusKeywords.join(', ')}`,
          `Optimized for ${contentPurpose || 'general'} purpose`,
          'Improved readability and keyword density'
        ]
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
    console.error('Error in SEO POST API:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process request' 
      }, 
      { status: 500 }
    );
  }
}

// Helper functions for content enhancement
function enhanceTitle(currentTitle: string, keywords: string): string {
  // In a real app, this would use AI to enhance the title
  // For now, we'll add keywords to the title if they're not already there
  const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
  const titleLower = currentTitle.toLowerCase();
  
  // Check if any keywords are already in the title
  const missingKeywords = keywordList.filter(kw => !titleLower.includes(kw));
  
  if (missingKeywords.length > 0 && missingKeywords.length <= 2) {
    return `${currentTitle} - ${missingKeywords.join(' ')}`;
  }
  
  return currentTitle;
}

function enhanceDescription(currentDesc: string, keywords: string): string {
  // In a real app, this would use AI to enhance the description
  // For now, we'll ensure keywords are included in the description
  const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
  const descLower = currentDesc.toLowerCase();
  
  // Check if any keywords are missing from the description
  const missingKeywords = keywordList.filter(kw => !descLower.includes(kw));
  
  if (missingKeywords.length > 0) {
    return `${currentDesc} ${missingKeywords.join(', ')}.`;
  }
  
  return currentDesc;
}

function enhanceContent(currentContent: string, keywords: string): string {
  // In a real app, this would use AI to restructure content
  // For now, we'll just ensure keywords are mentioned
  const keywordList = keywords.split(',').map(k => k.trim());
  let enhanced = currentContent;
  
  // Add keywords if they're not already present
  keywordList.forEach(kw => {
    if (!currentContent.toLowerCase().includes(kw.toLowerCase())) {
      enhanced += ` ${kw}`;
    }
  });
  
  return enhanced;
}