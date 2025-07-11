"use client"

import { useState, Fragment, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Head from 'next/head'
import { StoreData, StoreComponent } from '@/lib/store-ai';

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
          transform: compact ? `scale(${compact ? 0.5 : 1})` : undefined,
          transformOrigin: "top left",
          width: compact ? "200%" : "100%",
          height: compact ? "200%" : "100%",
        }}
      >
        {store.components
          .sort((a: StoreComponent, b: StoreComponent) => a.position - b.position)
          .map((component: StoreComponent) => (
            <Fragment key={component.id}>
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
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                        <div className="space-y-3">
                          <p>
                            <strong>Email:</strong> {component.content.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {component.content.phone}
                          </p>
                          <p>
                            <strong>Address:</strong> {component.content.address}
                          </p>
                        </div>
                      </div>
                      <div>
                        <form className="space-y-4">
                          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
                          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
                          <textarea placeholder="Your Message" rows={4} className="w-full p-3 border rounded" />
                          <Button type="submit" style={{ backgroundColor: store.theme.primaryColor }}>
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

              {component.type === "text" && (
                <div
                  className="max-w-4xl mx-auto"
                  style={{
                    padding: component.styles.padding,
                    backgroundColor: component.styles.backgroundColor,
                    color: component.styles.textColor,
                    fontFamily: component.styles.fontFamily || 'Inter',
                    fontWeight: component.styles.fontWeight,
                    fontStyle: component.styles.fontStyle,
                    textDecoration: component.styles.textDecoration,
                    lineHeight: component.styles.lineHeight,
                    letterSpacing: component.styles.letterSpacing,
                  }}
                >
                  <h2 
                    className="text-2xl font-bold mb-4"
                    style={{ 
                      textAlign: component.content.alignment,
                      fontFamily: component.styles.fontFamily || 'Inter',
                      letterSpacing: component.styles.letterSpacing,
                    }}
                  >
                    {component.content.heading}
                  </h2>
                  <div
                    className="prose"
                    style={{ 
                      fontSize: component.styles.fontSize,
                      textAlign: component.content.alignment,
                      fontFamily: component.styles.fontFamily || 'Inter',
                      fontWeight: component.styles.fontWeight,
                      fontStyle: component.styles.fontStyle,
                      textDecoration: component.styles.textDecoration,
                      lineHeight: component.styles.lineHeight,
                      letterSpacing: component.styles.letterSpacing,
                    }}
                  >
                    {component.content.listType === 'none' && (
                      <p>{component.content.text}</p>
                    )}
                    {component.content.listType === 'bulleted' && (
                      <ul className="list-disc pl-5 space-y-2">
                        {component.content.text.split('\n').map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {component.content.listType === 'numbered' && (
                      <ol className="list-decimal pl-5 space-y-2">
                        {component.content.text.split('\n').map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                  <style jsx>{`
                    @media (max-width: 768px) {
                      .responsive-text {
                        fontSize: ${component.styles.mobileFontSize} !important;
                      }
                    }
                    @media (min-width: 769px) and (max-width: 1024px) {
                      .responsive-text {
                        fontSize: ${component.styles.tabletFontSize} !important;
                      }
                    }
                  `}</style>
                </div>
              )}
            </Fragment>
          ))}
      </div>
    </Fragment>
  )
}

export default StorePreview
