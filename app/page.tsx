"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Session } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { ThemeAwareLogo } from "@/components/theme-aware-logo"
import { AnimatedStatsCard } from "@/components/animated-stats-card"
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
    icon: Store,
    title: "AI Store Builder",
    description: "Create professional e-commerce stores with AI-powered design, optimization, and product management.",
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/storefront",
  },
  {
    icon: MessageSquare,
    title: "Multi-AI Assistant",
    description: "Chat with Mistral, Grok, and Gemini AI models for personalized business guidance and support.",
    color: "from-purple-500 to-pink-500",
    href: "/dashboard/assistant",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Advanced analytics powered by AI to track performance, identify trends, and optimize growth.",
    color: "from-green-500 to-emerald-500",
    href: "/dashboard/analytics",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Collaborate with your team using AI-enhanced tools for project management and communication.",
    color: "from-orange-500 to-red-500",
    href: "/dashboard/feed",
  },
  {
    icon: Zap,
    title: "Automation Hub",
    description: "Automate repetitive tasks and workflows with intelligent AI-powered automation tools.",
    color: "from-yellow-500 to-orange-500",
    href: "/dashboard/tasks",
  },
  {
    icon: DollarSign,
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
  { label: "On Marketplace", value: "Buy & Sell", icon: Store },
  { label: "Stores Created", value: "25,000+", icon: Users },
  { label: "AI Conversations", value: "1M+", icon: MessageSquare },
  { label: "Apply or Employ", value: "Job & Task", icon: Briefcase },
]

export default function LandingPage() {
  const supabase = createClient()
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
  
  // Generate deterministic values for star effects to prevent hydration errors
  // Using a simple seeded random approach to ensure server and client generate the same values
  const generateStarValues = () => {
    // Simple seeded random number generator
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 15 }, (_, i) => {
      const seed1 = i * 10;
      const seed2 = i * 10 + 1;
      const seed3 = i * 10 + 2;
      const seed4 = i * 10 + 3;
      
      return {
        left: seededRandom(seed1) * 100,
        delay: seededRandom(seed2) * 5,
        duration: seededRandom(seed3) * 3 + 3,
        starSize: seededRandom(seed4) * 2 + 1,
        trails: Array.from({ length: 5 }, (_, j) => {
          const trailSeed1 = (i * 100) + (j * 10);
          const trailSeed2 = (i * 100) + (j * 10) + 1;
          const trailSeed3 = (i * 100) + (j * 10) + 2;
          const trailSeed4 = (i * 100) + (j * 10) + 3;
          
          return {
            size: seededRandom(trailSeed1) * 1.5 + 0.5,
            opacity: 1 - (j * 0.2),
            top: -j * 10,
            trailDelay: j * 0.1
          }
        })
      }
    });
  };
  
  // Use useState instead of useRef to ensure values are consistent between server and client
  const [starValues] = useState(generateStarValues);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <style>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
        .animate-orbit {
          animation: orbit 3s linear infinite;
        }
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ThemeAwareLogo alt="Autilance Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-white">
                Autilance
              </span>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
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
          {starValues.map((star, i) => (
            <div
              key={i}
              className="absolute top-[-20px] animate-star-container"
              style={
                {
                  '--star-left': `${star.left}%`,
                  '--star-delay': `${star.delay}s`,
                  '--star-duration': `${star.duration}s`,
                } as React.CSSProperties
              }
            >
              {/* Main star */}
              <div className="absolute rounded-full bg-white animate-star-main" 
                style={
                  {
                    '--star-size': `${star.starSize}px`,
                  } as React.CSSProperties
                }
              />
              {/* Trail elements */}
              {star.trails.map((trail, j) => (
                <div
                  key={j}
                  className="absolute rounded-full bg-white animate-star-trail"
                  style={
                    {
                      '--trail-size': `${trail.size}px`,
                      '--trail-opacity': trail.opacity,
                      '--trail-top': `${trail.top}px`,
                      '--trail-delay': `${trail.trailDelay}s`,
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
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>

            <div className="mb-8 h-32 flex items-center justify-center">
              <div className="transition-opacity duration-1000 ease-in-out">
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  {currentPhrase === 0 ? (
                    <>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Earn</span>
                      <span className="text-white"> remotely & locally</span>
                    </>
                  ) : currentPhrase === 1 ? (
                    <>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Buy & Sell</span>
                      <span className="text-white"> products</span>
                    </>
                  ) : (
                    <>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Find</span>
                      <span className="text-white"> yourself a </span>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Co-founder</span>
                    </>
                  )}
                </h1>
                <p className="text-5xl lg:text-6xl font-bold">
                  {currentPhrase === 0 ? (
                    <span className="text-white">with Autilance!</span>
                  ) : currentPhrase === 1 ? (
                    <span className="text-white">physical or digital</span>
                  ) : (
                    <>
                      <span className="text-white">as ambitious as you are</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 mx-auto leading-relaxed readable-text">
               Revolutionize the way you earn! Find jobs or recruit partners, be a freelancer or a client, buy & sell products,...
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {session ? (
                <Link href="/dashboard">
                  <div className="relative inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-purple-500/30">
                    <Button
                      size="lg"
                      className="bg-slate-900 text-white shadow-xl transition-all duration-300 px-8 py-4 text-lg rounded-md relative z-10"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      Go to Dashboard
                    </Button>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <div className="relative inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-purple-500/30">
                      <Button
                        size="lg"
                        className="bg-slate-900 text-white shadow-xl transition-all duration-300 px-8 py-4 text-lg rounded-md relative z-10"
                      >
                        <Rocket className="w-6 h-6 mr-3" />
                        Start Now!
                      </Button>
                    </div>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="h-36 flex items-center justify-center">
                <AnimatedStatsCard stat={stat} />
              </div>
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
                      <feature.icon className="w-7 h-7 text-white" />
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
                <Brain className="w-4 h-4 mr-2" />
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
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Start AI Conversation
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
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
                      <Rocket className="w-6 h-6 mr-3" />
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
                        <Rocket className="w-6 h-6 mr-3" />
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
                  <Sparkles className="w-5 h-5 text-white" />
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

      {/* Floating AI Chat is now in the main layout */}
    </div>
  )
}

