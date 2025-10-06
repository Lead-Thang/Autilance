// lib/seo/seo-optimizer.ts

interface SeoPageData {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  metaTags: Record<string, string>;
  score: number;
  suggestions: string[];
}

interface SeoAnalysis {
  storeId: string;
  pages: SeoPageData[];
  overallScore: number;
  recommendations: string[];
}

interface ContentSuggestion {
  id: string;
  type: string;
  title: string;
  content: string;
  suggestions: string[];
}

interface SeoSuggestion {
  id: string;
  type: string; // 'title', 'description', 'content', etc.
  current: string;
  suggested: string;
  reason: string;
}

interface ContentOptimizationData {
  pageUrl: string;
  contentType: string;
  suggestions: SeoSuggestion[];
}

interface SeoAnalysisResult {
  pageUrl: string;
  title: string;
  description: string;
  content: string;
  score: number;
  issues: string[];
  recommendations: string[];
}

interface MetaTagsData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

class SeoOptimizer {
  private apiUrl: string;

  constructor() {
    this.apiUrl = '/api/seo';
  }

  /**
   * Get comprehensive SEO analysis for a store
   * @param storeId The ID of the store to analyze
   * @returns SEO analysis results
   */
  async getSeoAnalysis(storeId: string): Promise<SeoAnalysis | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}?type=analysis&storeId=${storeId}`,
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

      const data = await response.json();
      
      if (data.success) {
        return data.data as SeoAnalysis;
      } else {
        throw new Error(data.error || 'Failed to get SEO analysis');
      }
    } catch (error) {
      console.error('Error fetching SEO analysis:', error);
      return null;
    }
  }

  /**
   * Get content suggestions for improving SEO
   * @returns Content suggestions
   */
  async getContentSuggestions(): Promise<ContentSuggestion[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}?type=suggestions`,
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

      const data = await response.json();
      
      if (data.success) {
        return data.data as ContentSuggestion[];
      } else {
        throw new Error(data.error || 'Failed to get content suggestions');
      }
    } catch (error) {
      console.error('Error fetching content suggestions:', error);
      return [];
    }
  }

  /**
   * Optimize content for SEO
   * @param pageUrl URL of the page
   * @param contentType Type of content (page, product, blog)
   * @param currentTitle Current title
   * @param currentDescription Current description
   * @param currentContent Current content (optional)
   * @param keywords Focus keywords
   * @returns Optimized content suggestions
   */
  async optimizeContent(
    pageUrl: string, 
    contentType: string, 
    currentTitle: string, 
    currentDescription: string, 
    currentContent?: string,
    keywords: string[] = []
  ): Promise<ContentOptimizationData | null> {
    try {
      const params = new URLSearchParams({
        type: 'optimize-content',
        pageUrl,
        contentType,
        currentTitle,
        currentDescription,
        keywords: keywords.join(','),
      });
      
      if (currentContent) {
        params.append('currentContent', currentContent);
      }

      const response = await fetch(
        `${this.apiUrl}?${params}`,
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

      const data = await response.json();
      
      if (data.success) {
        return data.data as ContentOptimizationData;
      } else {
        throw new Error(data.error || 'Failed to optimize content');
      }
    } catch (error) {
      console.error('Error optimizing content:', error);
      return null;
    }
  }

  /**
   * Analyze a specific page for SEO issues
   * @param pageData Page data to analyze
   * @returns Analysis results
   */
  async analyzePage(pageData: {
    pageUrl: string;
    title: string;
    description: string;
    content?: string;
  }): Promise<SeoAnalysisResult | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze-page',
          data: pageData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.analysis as SeoAnalysisResult;
      } else {
        throw new Error(data.error || 'Failed to analyze page');
      }
    } catch (error) {
      console.error('Error analyzing page:', error);
      return null;
    }
  }

  /**
   * Generate optimized meta tags for a page
   * @param title Page title
   * @param description Page description
   * @param type Content type (website, article, product, etc.)
   * @param imageUrl Image URL for social sharing
   * @returns Optimized meta tags
   */
  async generateMetaTags(
    title: string, 
    description: string, 
    type: string = 'website', 
    imageUrl?: string
  ): Promise<MetaTagsData | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-meta-tags',
          data: {
            title,
            description,
            type,
            imageUrl
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.metaTags as MetaTagsData;
      } else {
        throw new Error(data.error || 'Failed to generate meta tags');
      }
    } catch (error) {
      console.error('Error generating meta tags:', error);
      return null;
    }
  }

  /**
   * Optimize content using AI
   * @param text Content to optimize
   * @param focusKeywords Keywords to focus on
   * @param contentPurpose Purpose of the content (marketing, informational, etc.)
   * @returns Optimized content
   */
  async optimizeText(
    text: string, 
    focusKeywords: string[], 
    contentPurpose: string = 'marketing'
  ): Promise<{
    original: string;
    optimized: string;
    suggestions: string[];
  } | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'optimize-content',
          data: {
            text,
            focusKeywords,
            contentPurpose
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data as {
          original: string;
          optimized: string;
          suggestions: string[];
        };
      } else {
        throw new Error(data.error || 'Failed to optimize text');
      }
    } catch (error) {
      console.error('Error optimizing text:', error);
      return null;
    }
  }
}

// Create a singleton instance
const seoOptimizer = new SeoOptimizer();

// Export the instance and types
export { 
  seoOptimizer, 
  SeoOptimizer, 
  type SeoAnalysis, 
  type ContentSuggestion, 
  type SeoSuggestion, 
  type ContentOptimizationData,
  type SeoAnalysisResult,
  type MetaTagsData
};