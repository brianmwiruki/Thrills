"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Mail, 
  Truck, 
  ArrowLeft,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';

export default function OrderSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart on success page load
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Order #THR-{Date.now().toString().slice(-6)}
          </Badge>
        </div>

        {/* Order Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm">You'll receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm">We'll notify you when your order ships</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <p>
            Expected delivery: 5-7 business days
          </p>
        </div>
      </motion.div>
    </div>
  );
} 