// components/seo/seo-dashboard.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { 
  Search,
  TrendingUp,
  Wrench,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  ArrowRight,
  Loader2,
  BarChart3,
  Globe,
  MessageCircle
} from 'lucide-react';
import { seoOptimizer, type SeoAnalysis, type ContentSuggestion } from '../../lib/seo/seo-optimizer';
import { useUser } from '../../hooks/use-user';

interface SeoDashboardProps {
  storeId?: string;
}

export function SeoDashboard({ storeId }: SeoDashboardProps) {
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysis | null>(null);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'content'>('overview');
  const { user } = useUser();

  useEffect(() => {
    const fetchSeoData = async () => {
      setLoading(true);
      try {
        // Fetch SEO analysis
        const analysis = await seoOptimizer.getSeoAnalysis(storeId || 'default');
        if (analysis) {
          setSeoAnalysis(analysis);
        }
        
        // Fetch content suggestions
        const suggestions = await seoOptimizer.getContentSuggestions();
        setContentSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Analyzing your store's SEO...</span>
      </div>
    );
  }

  if (!seoAnalysis) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">SEO Analysis Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Could not load SEO analysis for your store
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Search className="w-6 h-6" />
                SEO Dashboard
              </CardTitle>
              <CardDescription>
                Analyze and optimize your store for better search visibility
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{seoAnalysis.overallScore}/100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {seoAnalysis.pages.filter(p => p.score >= 80).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Good Pages</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {seoAnalysis.pages.filter(p => p.score >= 50 && p.score < 80).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Needs Work</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                {seoAnalysis.pages.filter(p => p.score < 50).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Poor Performance</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              Quick Recommendations
            </h3>
            <ul className="space-y-2">
              {seoAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'pages'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('pages')}
        >
          Page Analysis
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'content'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content Suggestions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>SEO Performance Overview</CardTitle>
            <CardDescription>
              Detailed analysis of your store's SEO performance across different metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Page Performance
                </h3>
                <div className="space-y-3">
                  {seoAnalysis.pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{page.url}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={page.score >= 80 ? 'default' : page.score >= 50 ? 'secondary' : 'destructive'}
                          className={
                            page.score >= 80 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : page.score >= 50 
                                ? 'bg-yellow-500 hover:bg-yellow-600' 
                                : 'bg-red-500 hover:bg-red-600'
                          }
                        >
                          {page.score}/100
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  Optimization Suggestions
                </h3>
                <div className="space-y-3">
                  {seoAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start">
                        <Wrench className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pages' && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Page-by-Page Analysis</CardTitle>
            <CardDescription>
              Detailed SEO analysis for each page in your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoAnalysis.pages.map((page) => (
                <Card key={page.id} className="border-0 shadow-md bg-white/50 dark:bg-slate-700/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{page.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={page.score >= 80 ? 'default' : page.score >= 50 ? 'secondary' : 'destructive'}
                          className={
                            page.score >= 80 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : page.score >= 50 
                                ? 'bg-yellow-500 hover:bg-yellow-600' 
                                : 'bg-red-500 hover:bg-red-600'
                          }
                        >
                          {page.score}/100
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Meta Information</h4>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Title:</span> {page.title}</div>
                          <div><span className="font-medium">Description:</span> {page.description}</div>
                          <div>
                            <span className="font-medium">Keywords:</span>{' '}
                            {page.keywords.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Suggestions</h4>
                        <ul className="text-sm space-y-1">
                          {page.suggestions.slice(0, 3).map((suggestion, idx) => (
                            <li key={idx} className="flex items-start">
                              <AlertTriangle className="w-3 h-3 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'content' && contentSuggestions.length > 0 && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Content Suggestions</CardTitle>
            <CardDescription>
              AI-powered suggestions to improve your store's content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentSuggestions.map((suggestion, index) => (
                <Card key={index} className="border-0 shadow-md bg-white/50 dark:bg-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{suggestion.content}</p>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-2">
                        {suggestion.suggestions.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}