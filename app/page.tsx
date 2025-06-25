import { getProducts } from '@/lib/printify';
import { PrintifyProduct } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/product/product-grid';
import { HeroSection } from '@/components/HeroSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product/product-card';

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

export default async function Home() {
  // Fetch the first 8 products for the featured section
  const printifyProducts = await getProducts(1, 8);
  const products = printifyProducts.map(adaptPrintifyProduct);

  // Fetch best sellers (with 'bestseller' tag)
  let bestSellerPrintify = await getProducts(1, 8, 'bestseller');
  let bestSellers = bestSellerPrintify.map(adaptPrintifyProduct);
  // Fallback: if no bestsellers, show next 8 recent products
  if (bestSellers.length === 0) {
    const moreProducts = await getProducts(2, 8);
    bestSellers = moreProducts.map(adaptPrintifyProduct);
  }

  // Dynamically generate categories from product tags
  const allTags = Array.from(new Set(printifyProducts.flatMap(p => p.tags)));
  const categories = allTags.map(tag => ({ id: tag, name: tag }));

  return (
    <div className="space-y-20">
      <HeroSection />
      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={{ pathname: '/shop', query: { category: cat.id } }}>
                <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:scale-105 transition-transform">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="relative">
            <Carousel opts={{ align: 'start', slidesToScroll: 1, loop: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-8" />
              <CarouselNext className="-right-4 md:-right-8" />
            </Carousel>
          </div>
        </section>
      )}
      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Best Sellers</h2>
          <ProductGrid products={bestSellers} />
        </section>
      )}
      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl text-center p-12 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Express Your Style?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of customers who trust Thrills for their fashion accessory needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="secondary">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}