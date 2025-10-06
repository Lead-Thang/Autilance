// components/recommendations/product-recommendations.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { recommendationEngine, type Product } from '../../lib/recommendations/recommendation-engine';
import { useUser } from '../../hooks/use-user';
import { 
  TrendingUp, 
  ShoppingCart, 
  Star, 
  ArrowRight,
  Loader2
} from 'lucide-react';

interface ProductRecommendationsProps {
  userId?: string;
  productId?: string; // If provided, show similar products to this one
  title?: string; // Custom title for the recommendations section
  limit?: number; // Number of recommendations to show
  variant?: 'carousel' | 'grid'; // Display style
}

export function ProductRecommendations({
  userId,
  productId,
  title = 'Recommended For You',
  limit = 4,
  variant = 'grid'
}: ProductRecommendationsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let products: Product[] = [];
        
        if (productId) {
          // Get similar products based on a specific product
          products = await recommendationEngine.getSimilarProducts(productId, limit);
        } else {
          // Get personalized recommendations for the user
          const id = userId || user?.id || 'guest';
          if (id) {
            products = await recommendationEngine.getRecommendations(id, limit);
          } else {
            // Fallback: get trending products
            products = await recommendationEngine.getTrendingProducts(limit);
          }
        }
        
        setRecommendedProducts(products);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is loaded (if using user-specific recommendations)
    if (!productId && userId) {
      fetchRecommendations();
    } else if (productId) {
      fetchRecommendations();
    } else if (!userLoading) {
      // User is loaded, fetch recommendations
      fetchRecommendations();
    }
  }, [user?.id, userLoading, productId, userId, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <div className={`grid ${variant === 'carousel' ? 'grid-flow-col grid-rows-1 overflow-x-auto gap-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <TrendingUp className="h-10 w-10 mx-auto text-destructive mb-2" />
        <h2 className="text-xl font-semibold mb-1">Recommendations Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendedProducts.length === 0) {
    return null; // Don't render anything if there are no recommendations
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="outline" size="sm">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className={`grid ${variant === 'carousel' ? 'grid-flow-col grid-rows-1 overflow-x-auto gap-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
        {recommendedProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`group overflow-hidden transition-all hover:shadow-lg ${variant === 'carousel' ? 'min-w-[250px]' : ''}`}
          >
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="bg-white/80 backdrop-blur">
                  {Math.round(((product.retailPrice - product.price) / product.retailPrice) * 100)}% OFF
                </Badge>
              </div>
              
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" className="rounded-full">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                {product.status !== 'available' && (
                  <Badge variant={product.status === 'out-of-stock' ? 'destructive' : 'default'}>
                    {product.status.replace('-', ' ')}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(128)</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  {product.retailPrice !== product.price && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      ${product.retailPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}