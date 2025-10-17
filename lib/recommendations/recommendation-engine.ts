// lib/recommendations/recommendation-engine.ts

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  retailPrice: number;
  stock: number;
  imageUrl: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
  brand: string;
  tags: string[];
  score?: number;
}

interface UserInteraction {
  userId: string;
  productId: string;
  type: 'view' | 'click' | 'add-to-cart' | 'purchase';
  timestamp: number;
}

interface RecommendationResponse {
  success: boolean;
  recommendations: Product[];
  userId: string;
  timestamp: string;
  error?: string;
}

class RecommendationEngine {
  private apiUrl: string;

  constructor() {
    this.apiUrl = '/api/recommendations';
  }

  /**
   * Get product recommendations for a specific user
   * @param userId The ID of the user
   * @param limit Number of recommendations to return (default: 5)
   * @returns Recommended products
   */
  async getRecommendations(userId: string, limit: number = 5): Promise<Product[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}?userId=${userId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      
      if (data.success) {
        return data.recommendations;
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Track user interaction to improve recommendations
   * @param interaction The interaction to track
   * @returns Success status
   */
  async trackInteraction(interaction: UserInteraction): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  }

  /**
   * Get recommendations based on a specific product (customers also bought/w viewed)
   * @param productId The ID of the product
   * @param limit Number of similar products to return
   * @returns Similar products
   */
  async getSimilarProducts(productId: string, limit: number = 5): Promise<Product[]> {
    // In a real implementation, we would have a separate endpoint for this
    // For now, we'll use the general recommendations API with additional parameters
    try {
      const response = await fetch(
        `${this.apiUrl}?userId=similar-${productId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      
      if (data.success) {
        return data.recommendations;
      } else {
        throw new Error(data.error || 'Failed to get similar products');
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  }

  /**
   * Get trending products
   * @param limit Number of trending products to return
   * @returns Trending products
   */
  async getTrendingProducts(limit: number = 5): Promise<Product[]> {
    try {
      // In a real app, this would call a specific trending endpoint
      // For now, we'll just return a selection of products
      const response = await fetch(
        `${this.apiUrl}?userId=trending&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      
      if (data.success) {
        return data.recommendations;
      } else {
        throw new Error(data.error || 'Failed to get trending products');
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }
  }
}

// Create a singleton instance
const recommendationEngine = new RecommendationEngine();

// Export the instance and types
export { recommendationEngine, RecommendationEngine, type Product, type UserInteraction, type RecommendationResponse };