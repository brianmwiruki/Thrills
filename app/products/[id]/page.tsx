import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProduct, getProducts } from '@/lib/printify';
import { PrintifyProduct } from '@/types';
// import { PageProps } from 'next';

// This function tells Next.js which product pages to generate at build time.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ id: product.id }));
}

// This function converts a PrintifyProduct to a format your client component expects.
// You can adjust this as your components evolve.
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
    category: printifyProduct.tags[0] || 'Uncategorized', // Example category
  };
}

export default async function ProductDetailPage(props: any) {
  // Await params if it's a Promise (Next.js 14+/15+ dynamic API)
  const params = typeof props.params?.then === 'function' ? await props.params : props.params;
  const printifyProduct = await getProduct(params.id);

  if (!printifyProduct) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const adaptedProduct = adaptPrintifyProduct(printifyProduct);

  // Fetch related products (up to 4 that share a tag, excluding the current product)
  const allProducts = await getProducts(1, 30); // Fetch more for better matching
  const related = allProducts
    .filter(p => p.id !== printifyProduct.id && p.tags.some(tag => printifyProduct.tags.includes(tag)))
    .slice(0, 4)
    .map(adaptPrintifyProduct);

  return <ProductDetailClient product={adaptedProduct} relatedProducts={related} />;
}