"use client";
import Link from "next/link";
import { Button, Badge } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [counters, setCounters] = useState({
    products: 0,
    customers: 0,
    support: 0,
    shipping: 0
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, [isMounted]);

  useEffect(() => {
    if (isVisible && isMounted) {
      const animateCounter = (key: keyof typeof counters, target: number, duration: number = 2000) => {
        const startTime = Date.now();
        const startValue = 0;

        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

          setCounters(prev => ({
            ...prev,
            [key]: currentValue
          }));

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        updateCounter();
      };

      
      setTimeout(() => animateCounter('products', 1000), 200);
      setTimeout(() => animateCounter('customers', 50000), 400);
      setTimeout(() => animateCounter('support', 24), 600);
      setTimeout(() => animateCounter('shipping', 100), 800);
    }
  }, [isVisible, isMounted]);
  return (
    <div className="min-h-screen">
      
      <section id="hero-section" className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Load Cart
                <span className="block text-3xl lg:text-4xl font-normal mt-2">
                  Your Ultimate Shopping Experience
                </span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Discover amazing products, enjoy fast delivery, and shop with confidence. 
                Your one-stop destination for everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-purple-700 w-40 hover:bg-gray-100 cursor-pointer">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" className="border-2 border-white text-white w-40 hover:bg-white hover:text-purple-700 cursor-pointer">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/20 rounded-lg p-4 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/30">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="text-3xl font-bold text-white">
                      {isMounted ? counters.products.toLocaleString() : '0'}+
                    </div>
                    <div className="text-sm text-purple-100">Products</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/30">
                    <div className="text-2xl mb-2">😊</div>
                    <div className="text-3xl font-bold text-white">
                      {isMounted ? `${(counters.customers / 1000).toFixed(0)}K+` : '0K+'}
                    </div>
                    <div className="text-sm text-purple-100">Happy Customers</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/30">
                    <div className="text-2xl mb-2">🛠️</div>
                    <div className="text-3xl font-bold text-white">
                      {isMounted ? `${counters.support}/7` : '0/7'}
                    </div>
                    <div className="text-sm text-purple-100">Support</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/30">
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="text-3xl font-bold text-white">
                      {isMounted ? `${counters.shipping}%` : '0%'}
                    </div>
                    <div className="text-sm text-purple-100">Free Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Load Cart?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional service and quality products to make your shopping experience unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered within 24-48 hours with our express shipping.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% authentic products with quality assurance and easy returns.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with regular discounts and special offers.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support to help you with any queries.</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Best Selling Products</h2>
            <p className="text-xl text-purple-100">Discover our most popular and trending items</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 89.99,
                originalPrice: 129.99,
                rating: 4.8,
                reviews: 1247,
                image: "🎧",
                badge: "Best Seller"
              },
              {
                id: 2,
                name: "Smart Fitness Watch",
                price: 199.99,
                originalPrice: 249.99,
                rating: 4.9,
                reviews: 892,
                image: "⌚",
                badge: "Trending"
              },
              {
                id: 3,
                name: "Portable Power Bank",
                price: 39.99,
                originalPrice: 59.99,
                rating: 4.7,
                reviews: 2156,
                image: "🔋",
                badge: "Popular"
              },
              {
                id: 4,
                name: "Bluetooth Speaker",
                price: 79.99,
                originalPrice: 99.99,
                rating: 4.6,
                reviews: 1834,
                image: "🔊",
                badge: "Hot Deal"
              }
            ].map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge color="failure">{product.badge}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 font-semibold cursor-pointer">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}