"use client";

import Image from 'next/image';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartItemComponentProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  // Extract variant information
  const selectedVariant = item.product.selectedVariant;
  const selectedSize = item.product.selectedSize;
  const selectedColor = item.product.selectedColor;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0]?.src}
                alt={item.product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.product.name}</h3>
              
              {/* Variant Information */}
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedVariant && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedVariant.title}
                  </Badge>
                )}
                {selectedSize && (
                  <Badge variant="outline" className="text-xs">
                    Size: {selectedSize}
                  </Badge>
                )}
                {selectedColor && (
                  <Badge variant="outline" className="text-xs">
                    Color: {selectedColor}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                ${item.product.price} each
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}