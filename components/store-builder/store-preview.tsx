"use client"

import { useState, Fragment, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import Head from 'next/head'
import { StoreData, StoreComponent } from '../../lib/store-ai';
import { 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Check
} from "lucide-react";

interface StorePreviewProps {
  store: StoreData;
  compact?: boolean;
}

export function StorePreview({ store, compact = false }: StorePreviewProps) {
  // Use free domain if available, otherwise use regular domain
  const effectiveDomain = store.seo.freeDomain || store.seo.canonicalUrl || `https://${store.domain}.autilance.com`;
  
  // Add Google Analytics tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && store.seo.gaId) {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${store.seo.gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // Set up GA tracking
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      function gtag(...args: any[]) {
        w.dataLayer.push(arguments);
      }
      
      w.gtag = gtag;
      gtag('js', new Date());
      gtag('config', store.seo.gaId);
    }
  }, [store.seo.gaId]);
  
  return (
    <Fragment>
      <Head>
        <title>{store.seo.title}</title>
        <meta name="description" content={store.seo.description} />
        <meta name="keywords" content={store.seo.keywords.join(',')} />
        <link rel="canonical" href={effectiveDomain} />
        <meta name="robots" content={store.seo.robots || 'index, follow'} />
        <meta property="og:title" content={store.seo.title} />
        <meta property="og:description" content={store.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={effectiveDomain} />
        {/* Add more Open Graph tags as needed */}
      </Head>
      
      <div
        className="bg-white min-h-full"
        style={{
          transform: compact ? `scale(0.5)` : undefined,
          transformOrigin: "top left",
          width: compact ? "200%" : "100%",
          height: compact ? "200%" : "100%",
        }}
      >
        {store.components
          .sort((a: StoreComponent, b: StoreComponent) => a.position - b.position)
          .map((component: StoreComponent) => (
            <Fragment key={component.id}>
              {component.type === "header" && (
                <header
                  className="border-b"
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                    color: component.styles.textColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="text-2xl font-bold">{component.content.logo}</div>
                    <nav className="hidden md:flex space-x-6">
                      {(component.content.navigation || []).map((item: string, index: number) => (
                        <a key={index} href="#" className="hover:underline">
                          {item}
                        </a>
                      ))}
                    </nav>
                    <Button variant="outline" size="sm">
                      Cart (0)
                    </Button>
                  </div>
                </header>
              )}

              {component.type === "hero" && (
                <div
                  className="relative bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${component.content.backgroundImage})`,
                    backgroundColor: component.styles.backgroundColor,
                    padding: component.styles.padding,
                    textAlign: component.styles.textAlign,
                    color: component.styles.textColor,
                    minHeight: "400px",
                  }}
                >
                  <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">{component.content.title}</h1>
                    <p className="text-xl mb-8 opacity-90">{component.content.subtitle}</p>
                    <Button
                      size="lg"
                      style={{
                        backgroundColor: store.theme.primaryColor,
                        color: "white",
                      }}
                    >
                      {component.content.ctaText}
                    </Button>
                  </div>
                </div>
              )}

              {component.type === "product-grid" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div
                      className="grid gap-6"
                      style={{
                        gridTemplateColumns: `repeat(${component.styles.columns || 3}, 1fr)`,
                        gap: component.styles.gap,
                      }}
                    >
                      {(component.content.products || []).map((product: any) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold" style={{ color: store.theme.primaryColor }}>
                                {product.price}
                              </span>
                              <Button size="sm" style={{ backgroundColor: store.theme.primaryColor }}>
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {component.type === "about" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                    textAlign: component.styles.textAlign,
                  }}
                >
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">{component.content.title}</h2>
                    <div className="text-lg leading-relaxed whitespace-pre-wrap">{component.content.description}</div>
                    {component.content.image && (
                      <div className="mt-8">
                        <img 
                          src={component.content.image} 
                          alt="About" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {component.type === "testimonials" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {(component.content.testimonials || []).map((testimonial: any) => (
                        <Card key={testimonial.id} className="p-6">
                          <div className="flex items-center mb-4">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                              <h3 className="font-semibold">{testimonial.name}</h3>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 italic">"{testimonial.content}"</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {component.type === "faq" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="space-y-4">
                      {(component.content.faqs || []).map((faq: any) => (
                        <div key={faq.id} className="border rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {component.type === "newsletter" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">{component.content.title}</h2>
                    <p className="text-lg mb-6">{component.content.description}</p>
                    <div className="flex">
                      <input
                        type="email"
                        placeholder={component.content.placeholder}
                        className="flex-1 p-3 border rounded-l-lg"
                      />
                      <Button 
                        className="rounded-l-none"
                        style={{ backgroundColor: store.theme.primaryColor }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {component.type === "team" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      {(component.content.members || []).map((member: any) => (
                        <Card key={member.id} className="text-center p-6">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                          />
                          <h3 className="text-xl font-semibold">{member.name}</h3>
                          <p className="text-gray-600 mb-2">{member.role}</p>
                          <p className="text-gray-700">{member.bio}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {component.type === "pricing" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      {(component.content.plans || []).map((plan: any) => (
                        <Card key={plan.id} className="p-6 text-center">
                          <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                          <div className="mb-6">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-gray-600">/{plan.period}</span>
                          </div>
                          <ul className="mb-6 space-y-2">
                            {(plan.features || []).map((feature: string, index: number) => (
                              <li key={index} className="flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full"
                            style={{ backgroundColor: store.theme.primaryColor }}
                          >
                            {plan.cta}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {component.type === "contact" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-gray-600">{component.content.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-gray-600">{component.content.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Address</p>
                              <p className="text-gray-600">{component.content.address}</p>
                            </div>
                          </div>
                        </div>
                        
                        {component.content.hours && (
                          <div className="mt-8">
                            <h4 className="font-semibold mb-3">Business Hours</h4>
                            <p className="text-gray-600 whitespace-pre-line">{component.content.hours}</p>
                          </div>
                        )}
                        
                        {(component.content.facebook || component.content.twitter || component.content.instagram) && (
                          <div className="mt-8">
                            <h4 className="font-semibold mb-3">Follow Us</h4>
                            <div className="flex space-x-4">
                              {component.content.facebook && (
                                <a href={component.content.facebook} className="text-gray-600 hover:text-primary">
                                  <Facebook className="w-6 h-6" />
                                </a>
                              )}
                              {component.content.twitter && (
                                <a href={component.content.twitter} className="text-gray-600 hover:text-primary">
                                  <Twitter className="w-6 h-6" />
                                </a>
                              )}
                              {component.content.instagram && (
                                <a href={component.content.instagram} className="text-gray-600 hover:text-primary">
                                  <Instagram className="w-6 h-6" />
                                </a>
                              )}
                              {component.content.youtube && (
                                <a href={component.content.youtube} className="text-gray-600 hover:text-primary">
                                  <Youtube className="w-6 h-6" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <form className="space-y-4">
                          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
                          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
                          <textarea placeholder="Your Message" rows={4} className="w-full p-3 border rounded" />
                          <Button 
                            type="submit" 
                            className="w-full"
                            style={{ backgroundColor: store.theme.primaryColor }}
                          >
                            Send Message
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {component.type === "footer" && (
                <footer
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                    textAlign: component.styles.textAlign,
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <p>{component.content.copyright}</p>
                      <div className="flex space-x-6 mt-4 md:mt-0">
                        {(component.content.links || []).map((link: string, index: number) => (
                          <a key={index} href="#" className="hover:underline">
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </footer>
              )}

              {component.type === "image" && (
                <div
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                    textAlign: component.styles.textAlign as any,
                  }}
                >
                  <div className="max-w-4xl mx-auto">
                    {component.content.link ? (
                      <a href={component.content.link} target="_blank" rel="noopener noreferrer">
                        <img
                          src={component.content.src}
                          alt={component.content.alt}
                          className="w-full h-auto rounded-lg"
                        />
                      </a>
                    ) : (
                      <img
                        src={component.content.src}
                        alt={component.content.alt}
                        className="w-full h-auto rounded-lg"
                      />
                    )}
                    {component.content.caption && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {component.content.caption}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
      </div>
    </Fragment>
  )
}

export default StorePreview
