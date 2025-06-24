import { products } from '@/lib/data/products';
import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage(props: any) {
  const { params } = props;
  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}

export function generateStaticParams() {
  return products.map(product => ({ id: product.id }));
}