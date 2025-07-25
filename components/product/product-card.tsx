"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cart';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const productDescriptionProse = `text-sm text-muted-foreground prose prose-xs max-w-none line-clamp-2\n  dark:prose-invert\n  [&_table]:w-full\n  [&_th]:bg-muted [&_td]:bg-background\n  [&_th]:font-semibold [&_th]:text-left [&_td]:text-left\n  dark:[&_th]:bg-muted/40 dark:[&_td]:bg-background/40\n  dark:[&_th]:text-white dark:[&_td]:text-white dark:text-white\n`;

function stripHtml(html: string): string {
  // Always use regex for deterministic SSR/CSR output
  return html.replace(/<[^>]+>/g, '');
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // If product has variants, check for at least one enabled variant
    if (product.variants && product.variants.length > 0) {
      const enabledVariant = product.variants.find(v => v.is_enabled);
      if (!enabledVariant) {
        toast.error('This product is currently out of stock.');
        return;
      }
      // Add product with selectedVariant info
      addItem({
        ...product,
        selectedVariant: enabledVariant,
        price: enabledVariant.price / 100, // assuming price is in cents
      });
      toast.success('Added to cart!');
      return;
    }
    // No variants, add as before
    addItem(product);
    toast.success('Added to cart!');
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="block group" tabIndex={-1}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden cursor-pointer">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.src}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {!product.inStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">{discountPercentage}% OFF</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8" tabIndex={-1}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
                tabIndex={0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {stripHtml(product.description)}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                tabIndex={-1}
                onClick={e => {
                  e.preventDefault();
                  window.location.href = `/products/${product.id}`;
                }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}