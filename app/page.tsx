"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { ThemeToggle } from "../components/theme-toggle"
import { FloatingAIChat } from "../components/floating-ai-chat"
import { createBrowserClient } from "@supabase/ssr"
import { Session } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { ThemeAwareLogo } from "@/components/theme-aware-logo"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  ArrowRight,
  Sparkles,
  Store,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  Briefcase,
  Star,
  Rocket,
  Brain,
  DollarSign,
} from "lucide-react"

const features = [
  {
    icon: { name: "Store" },
    title: "AI Store Builder",
    description: "Create professional e-commerce stores with AI-powered design, optimization, and product management.",
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/storefront",
  },
  {
    icon: { name: "MessageSquare" },
    title: "Multi-AI Assistant",
    description: "Chat with Mistral, Grok, and Gemini AI models for personalized business guidance and support.",
    color: "from-purple-500 to-pink-500",
    href: "/dashboard/assistant",
  },
  {
    icon: { name: "TrendingUp" },
    title: "Analytics & Insights",
    description: "Advanced analytics powered by AI to track performance, identify trends, and optimize growth.",
    color: "from-green-500 to-emerald-500",
    href: "/dashboard/analytics",
  },
  {
    icon: { name: "Users" },
    title: "Team Collaboration",
    description: "Collaborate with your team using AI-enhanced tools for project management and communication.",
    color: "from-orange-500 to-red-500",
    href: "/dashboard/feed",
  },
  {
    icon: { name: "Zap" },
    title: "Automation Hub",
    description: "Automate repetitive tasks and workflows with intelligent AI-powered automation tools.",
    color: "from-yellow-500 to-orange-500",
    href: "/dashboard/tasks",
  },
  {
    icon: { name: "DollarSign" },
    title: "Make Money",
    description: "Consolidated money-making features including investments, partnerships, marketplace, and store management.",
    color: "from-green-600 to-emerald-600",
    href: "/dashboard/make-money",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Founder",
    company: "TechStyle Co.",
    content:
      "Autilance transformed my business. The AI store builder created a professional site in minutes, and sales increased by 300%!",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "GrowthLab",
    content:
      "The multi-AI assistant is incredible. Having Mistral, Grok, and Gemini in one platform gives me diverse perspectives for every challenge.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Watson",
    role: "Startup CEO",
    company: "InnovateCorp",
    content:
      "The analytics insights helped us identify key growth opportunities we never would have found manually. Game-changing platform!",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const stats = [
  { label: "On Marketplace", value: "Buy & Sell", icon: { name: "Store" } },
  { label: "Stores Created", value: "25,000+", icon: { name: "Users" } },
  { label: "AI Conversations", value: "1M+", icon: { name: "MessageSquare" } },
  { label: "Apply or Employ", value: "Job & Task", icon: { name: "Briefcase" } },
]

export default function LandingPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setEmail("")
    // Show success message
  }

  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  // Generate deterministic values for star animation to prevent hydration errors
  // Using pre-defined fixed values to ensure exact match between server and client
  const generateStarValues = () => {
    // Pre-calculated fixed values to ensure exact match between server and client
    const fixedValues = [
      { left: 89.3788977833, delay: 4.1114995803, duration: 3.5791005233, starSize: 1.6448636801 },
      { left: 94.0498132382, delay: 4.8306431650, duration: 5.5076143817, starSize: 2.2317890123 },
      { left: 12.5234987654, delay: 1.2345678901, duration: 4.3210987654, starSize: 1.9876543210 },
      { left: 67.8901234567, delay: 3.4567890123, duration: 5.6789012345, starSize: 2.3456789012 },
      { left: 45.6789012345, delay: 2.3456789012, duration: 3.2109876543, starSize: 1.4567890123 },
      { left: 23.4567890123, delay: 1.8765432109, duration: 4.5678901234, starSize: 2.7890123456 },
      { left: 78.9012345678, delay: 3.2109876543, duration: 3.8765432109, starSize: 1.2345678901 },
      { left: 34.5678901234, delay: 2.7654321098, duration: 5.4321098765, starSize: 2.5678901234 },
      { left: 56.7890123456, delay: 3.6543210987, duration: 4.7654321098, starSize: 1.7890123456 },
      { left: 89.0123456789, delay: 4.5432109876, duration: 3.6543210987, starSize: 2.8901234567 },
      { left: 12.3456789012, delay: 1.4321098765, duration: 5.3210987654, starSize: 1.3210987654 },
      { left: 45.6789012345, delay: 2.5432109876, duration: 4.2109876543, starSize: 2.2109876543 },
      { left: 78.9012345678, delay: 3.6543210987, duration: 3.0987654321, starSize: 1.0987654321 },
      { left: 23.4567890123, delay: 1.7654321098, duration: 4.9876543210, starSize: 2.9876543210 },
      { left: 56.7890123456, delay: 2.8765432109, duration: 5.8765432109, starSize: 1.8765432109 }
    ];
    
    return fixedValues.map((fixedValue, i) => {
      return {
        id: i,
        left: fixedValue.left,
        delay: fixedValue.delay,
        duration: fixedValue.duration,
        starSize: fixedValue.starSize,
        trails: Array.from({ length: 5 }, (_, j) => {
          return {
            id: j,
            size: 0.5 + (j * 0.3),
            opacity: parseFloat((1 - (j * 0.2)).toFixed(10)),
            top: -j * 10,
            trailDelay: j * 0.1
          }
        })
      }
    });
  };
  
  // Use useMemo with an empty dependency array to ensure values are consistent between server and client
  const starValues = useMemo(generateStarValues, []);
  
  const phrases = [
    { 
      primary: "Earn remotely & locally", 
      secondary: "with Autilance!" 
    },
    { 
      primary: "Buy & Sell products", 
      secondary: "physical or digital" 
    },
    { 
      primary: "Find yourself a co-founder", 
      secondary: "as ambitious as you are" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ThemeAwareLogo alt="Autilance Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-white">
                Autilance
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Dashboard
                    <DynamicIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        {/* Raining Stars Effect with Trails */}
        <div className="absolute inset-0 overflow-hidden">
          {starValues.map((star) => (
            <div
              key={star.id}
              className="absolute top-[-20px] animate-star-container"
              style={
                {
                  '--star-left': `${star.left.toFixed(10)}%`,
                  '--star-delay': `${star.delay.toFixed(10)}s`,
                  '--star-duration': `${star.duration.toFixed(10)}s`,
                } as React.CSSProperties
              }
            >
              {/* Main star */}
              <div className="absolute rounded-full bg-white animate-star-main" 
                style={
                  {
                    '--star-size': `${star.starSize.toFixed(10)}px`,
                  } as React.CSSProperties
                }
              />
              {/* Trail elements */}
              {star.trails.map((trail) => (
                <div
                  key={trail.id}
                  className="absolute rounded-full bg-white animate-star-trail"
                  style={
                    {
                      '--trail-size': `${trail.size.toFixed(10)}px`,
                      '--trail-opacity': trail.opacity.toFixed(10),
                      '--trail-top': `${trail.top}px`,
                      '--trail-delay': `${trail.trailDelay.toFixed(10)}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600 px-4 py-2">
              <DynamicIcon name="Sparkles" className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>

            <div className="mb-8 h-32 flex items-center justify-center">
              <div className="transition-opacity duration-1000 ease-in-out">
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {phrases[currentPhrase].primary}
                </h1>
                <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {phrases[currentPhrase].secondary}
                </p>
              </div>
            </div>

            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create AI-powered stores, chat with multiple AI assistants, and automate your business processes. The
              complete platform for modern entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg"
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      Start Now!
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    >
                      Explore Features
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name={stat.icon.name as any} className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive AI-powered tools designed to accelerate your business growth and streamline operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={session ? feature.href : "/auth/signup"}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-slate-800 hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <DynamicIcon name={feature.icon.name as any} className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 border-purple-300 dark:border-purple-600">
                <DynamicIcon name="Brain" className="w-4 h-4 mr-2" />
                Multi-AI Intelligence
              </Badge>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Three AI Minds,
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Infinite Possibilities
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Access Mistral AI for professional insights, Grok for creative solutions, and Gemini for comprehensive
                analysis. Each AI brings unique strengths to solve your business challenges.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { name: "Mistral AI", specialty: "Professional business guidance", icon: "🧠" },
                  { name: "Grok (xAI)", specialty: "Creative problem-solving", icon: "⚡" },
                  { name: "Google Gemini", specialty: "Comprehensive analysis", icon: "💎" },
                ].map((ai, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm"
                  >
                    <div className="text-2xl">{ai.icon}</div>
                    <div>
                      <div className="font-semibold">{ai.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{ai.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>

              {session ? (
                <Link href="/dashboard/assistant">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <DynamicIcon name="MessageSquare" className="w-5 h-5 mr-3" />
                    Start AI Conversation
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <DynamicIcon name="MessageSquare" className="w-5 h-5 mr-3" />
                    Try AI Assistant
                  </Button>
                </Link>
              )}
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/ai-marketplace-interface.jpeg"
                  alt="AI-powered interface showing multiple AI assistants"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating AI badges */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="text-lg">🧠</div>
                  <div className="text-sm font-medium">Mistral AI</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="text-lg">⚡</div>
                  <div className="text-sm font-medium">Grok</div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="text-lg">💎</div>
                  <div className="text-sm font-medium">Gemini</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Loved by
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Entrepreneurs
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful business owners who've transformed their operations with Autilance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
              <div className="relative">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs who've accelerated their growth with AI-powered tools.
                </p>

                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                      <DynamicIcon name="Rocket" className="w-6 h-6 mr-3" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/auth/signup">
                      <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg px-8 py-4 text-lg"
                      >
                        <DynamicIcon name="Rocket" className="w-6 h-6 mr-3" />
                        Start Now!
                      </Button>
                    </Link>
                    <p className="text-sm opacity-75">No credit card required • 14-day free trial</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Get the latest AI insights and platform updates delivered to your inbox.
          </p>

          <form onSubmit={handleNewsletterSignup} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="Sparkles" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Autilance</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering businesses with AI-powered tools for the modern entrepreneur.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard/storefront" className="hover:text-white transition-colors">
                    AI Store Builder
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/assistant" className="hover:text-white transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/analytics" className="hover:text-white transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/automation" className="hover:text-white transition-colors">
                    Automation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2024 Autilance. All rights reserved.</p>
            <div className="flex items-center gap-6 text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Chat */}
      <FloatingAIChat />
    </div>
  )
}

