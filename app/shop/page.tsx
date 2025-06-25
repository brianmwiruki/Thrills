import { Suspense } from 'react';
import { getProducts } from '@/lib/printify';
import { PrintifyProduct } from '@/types';
import { ProductGrid } from '@/components/product/product-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ShopClient from './ShopClient';
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton';

export const dynamic = 'force-dynamic';

function adaptPrintifyProduct(printifyProduct: PrintifyProduct) {
  return {
    id: printifyProduct.id,
    name: printifyProduct.title,
    description: printifyProduct.description,
    price: printifyProduct.variants[0]?.price / 100 || 0,
    originalPrice: undefined, // You might need to add logic for this
    inStock: printifyProduct.variants.some(v => v.is_enabled),
    images: printifyProduct.images.map(img => img.src),
    tags: printifyProduct.tags,
    category: printifyProduct.tags[0] || 'Uncategorized',
  };
}

interface ShopPageProps {
  searchParams?: { page?: string; category?: string };
}

export default async function ShopPage(props: any) {
  // Await searchParams if it's a Promise (Next.js 14+/15+ dynamic API)
  const searchParams = typeof props.searchParams?.then === 'function' ? await props.searchParams : props.searchParams;
  const params = searchParams || {};
  const page = parseInt(params.page || '1', 10);
  const limit = 20;
  const category = params.category || 'all';
  const printifyProducts = await getProducts(page, limit, category);
  const products = printifyProducts.map(adaptPrintifyProduct);

  // Dynamically generate categories from product tags (from this page's products)
  const allTags = Array.from(new Set(printifyProducts.flatMap(p => p.tags)));
  const categories = [
    { id: 'all', name: 'All Categories', icon: '' },
    ...allTags.map(tag => ({ id: tag, name: tag, icon: '' })),
  ];

  // For a real app, you might want to fetch total count for page controls
  // Here, we'll just pass the current page and limit
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ShopClient products={products} page={page} limit={limit} categories={categories} />
    </Suspense>
  );
}