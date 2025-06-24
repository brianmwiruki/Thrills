"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/product/product-grid';
import { featuredProducts, categories } from '@/lib/data/products';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Badge variant="outline" className="text-sm">
              New Collection Available
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Express Your
              <span className="text-primary block">Unique Style</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium fashion accessories and lifestyle items that make a statement. 
              From trendy jewelry to cutting-edge tech accessories.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl"
        />
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of fashion accessories and lifestyle items
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-4xl">{category.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked items that are trending right now
          </p>
        </motion.div>
        
        <ProductGrid products={featuredProducts} />
        
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Thrills?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best shopping experience with quality products
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'Free shipping on all orders over $50. Fast and reliable delivery worldwide.'
              },
              {
                icon: Shield,
                title: 'Quality Guarantee',
                description: 'All our products come with a quality guarantee. Your satisfaction is our priority.'
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                description: 'Our customer support team is available 24/7 to help with any questions.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 h-full">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Join the Thrills Community
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Be the first to know about new arrivals, exclusive deals, and style tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md text-foreground"
                />
                <Button variant="secondary">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}