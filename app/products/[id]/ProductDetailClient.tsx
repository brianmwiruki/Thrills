"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/store/cart';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ProductGrid } from '@/components/product/product-grid';
import { PrintifyVariant, PrintifyOption, PrintifyImage, Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product/product-card';

// Helper: Extract color and size from variant title (e.g., "Black / M")
function parseVariantTitle(title: string) {
  const [color, size] = title.split('/').map((s) => s.trim());
  return { color, size };
}

// Helper: Map images to color options using Printify's variant_ids
function mapImagesToColors(images: PrintifyImage[], options: PrintifyOption[], variants: PrintifyVariant[]): Record<string, PrintifyImage[]> {
  // Find the color option
  const colorOption = options?.find(opt => opt.type === 'color');
  if (!colorOption) return {};
  // Build a map: color name -> [variant ids]
  const colorToVariantIds: Record<string, number[]> = {};
  colorOption.values.forEach(val => {
    // Find all variant ids for this color
    const ids = variants
      .filter((variant: PrintifyVariant) => variant.title.split('/')[0].trim() === val.title)
      .map((variant: PrintifyVariant) => variant.id);
    colorToVariantIds[val.title] = ids;
  });
  // Map color name -> images
  const colorToImages: Record<string, PrintifyImage[]> = {};
  for (const color in colorToVariantIds) {
    const variantIds = colorToVariantIds[color];
    colorToImages[color] = images.filter(img =>
      Array.isArray(img.variant_ids) && img.variant_ids.some((id: number) => variantIds.includes(id))
    );
  }
  return colorToImages;
}

export default function ProductDetailClient({ product, relatedProducts = [] }: { product: any, relatedProducts?: any[] }) {
  // Extract color options and hex codes from options array
  const colorOption: PrintifyOption | undefined = product.options?.find((opt: any) => opt.type === 'color');
  const colorValues = colorOption?.values || [];
  // Map color name to hex code
  const colorHexMap: Record<string, string | undefined> = {};
  colorValues.forEach((val: any) => {
    colorHexMap[val.title] = val.colors?.[0];
  });

  // Extract all unique colors and sizes from variants
  const variants: PrintifyVariant[] = product.variants || [];
  // Only include enabled variants
  const enabledVariants: PrintifyVariant[] = variants.filter((v: PrintifyVariant) => v.is_enabled);

  // Extract all unique colors and sizes from enabled variants
  const colorSet = new Set<string>();
  const sizeSet = new Set<string>();
  const colorToVariantIds: Record<string, number[]> = {};
  enabledVariants.forEach((variant: PrintifyVariant) => {
    const [color, size] = variant.title.split('/').map((s: string) => s.trim());
    if (color) {
      colorSet.add(color);
      if (!colorToVariantIds[color]) colorToVariantIds[color] = [];
      colorToVariantIds[color].push(variant.id);
    }
    if (size) sizeSet.add(size);
  });
  const colors = Array.from(colorSet);
  const sizes = Array.from(sizeSet);

  // State
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  // Dynamically compute all possible sizes for the selected color
  const allSizeVariantsForColor = (variants || []).filter((variant: PrintifyVariant) => {
    const [color] = variant.title.split('/').map((s: string) => s.trim());
    return color === selectedColor;
  });
  const allSizesForColor: string[] = Array.from(new Set(
    allSizeVariantsForColor
      .map((variant: PrintifyVariant) => {
        const [, size] = variant.title.split('/').map((s: string) => s.trim());
        return typeof size === 'string' ? size : '';
      })
      .filter((size: string) => !!size)
  ));
  // Which sizes are enabled for the selected color?
  const enabledSizesForColor: Set<string> = new Set(
    enabledVariants
      .filter((variant: PrintifyVariant) => {
        const [color] = variant.title.split('/').map((s: string) => s.trim());
        return color === selectedColor;
      })
      .map((variant: PrintifyVariant) => {
        const [, size] = variant.title.split('/').map((s: string) => s.trim());
        return typeof size === 'string' ? size : '';
      })
      .filter((size: string) => !!size)
  );

  // Selected size state, default to first available size for selected color
  const [selectedSize, setSelectedSize] = useState<string>(allSizesForColor[0] || '');

  // When selectedColor changes, update selectedSize if needed
  useEffect(() => {
    if (!allSizesForColor.includes(selectedSize)) {
      setSelectedSize(allSizesForColor[0] || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, product.id, allSizesForColor.join(",")]);

  const [quantity, setQuantity] = useState(1);
  // Find the enabled variant matching the selected color and size
  const selectedVariant = enabledVariants.find((variant: PrintifyVariant) => {
    const [color, size] = variant.title.split('/').map((s: string) => s.trim());
    return color === selectedColor && size === selectedSize;
  });

  // Automatic mapping: images for each color
  const colorToImages = mapImagesToColors(product.images || [], product.options || [], product.variants || []);
  const validImagesForColor = (colorToImages[selectedColor] || []).filter((img: PrintifyImage) => img && typeof img.src === 'string' && img.src.length > 0);
  // Only show images for the selected color. If none, show no images.
  const validImagesForDisplay = validImagesForColor;
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  // Set the default color only on initial mount or when the product ID changes
  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // When the user selects a color, set selectedImageIdx to a random index from 4 to 8 (if enough images), else random available index
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Find images for the selected color
    const imagesForColor = (mapImagesToColors(product.images || [], product.options || [], product.variants || [])[color] || []).filter((img: PrintifyImage) => img && typeof img.src === 'string' && img.src.length > 0);
    let randomIdx = 0;
    if (imagesForColor.length > 8) {
      randomIdx = Math.floor(Math.random() * 5) + 4; // 4 to 8 inclusive
    } else if (imagesForColor.length > 4) {
      const min = 4;
      const max = imagesForColor.length - 1;
      randomIdx = Math.floor(Math.random() * (max - min + 1)) + min;
    } else if (imagesForColor.length > 0) {
      randomIdx = Math.floor(Math.random() * imagesForColor.length);
    }
    setSelectedImageIdx(randomIdx);
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a valid color and size');
      return;
    }
    const productToAdd = {
      ...product,
      selectedVariant,
      selectedSize,
      selectedColor,
      price: selectedVariant.price / 100,
    };
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const currentPrice = selectedVariant ? selectedVariant.price / 100 : product.price;

  // Only show colors that have at least one enabled variant and at least one image
  const availableColors = colors.filter(color => {
    // Must have at least one enabled variant
    const hasVariant = enabledVariants.some((variant: PrintifyVariant) => variant.title.split('/')[0].trim() === color);
    // Must have at least one image
    const hasImage = (colorToImages[color] || []).some((img: PrintifyImage) => img && typeof img.src === 'string' && img.src.length > 0);
    return hasVariant && hasImage;
  });

  // State for description expansion
  const [descExpanded, setDescExpanded] = useState<boolean>(false);

  // Helper to get first ~200 words as plain text
  function getFirstWordsPlainText(html: string, wordLimit: number): string {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              {validImagesForDisplay.length > 0 && validImagesForDisplay[selectedImageIdx]?.src ? (
                <Image
                  src={validImagesForDisplay[selectedImageIdx].src}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground">No image available</div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                </div>
              )}
            </div>
            {/* Carousel Thumbnails */}
            {validImagesForDisplay.length > 1 && (
              <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent className="-ml-2">
                  {validImagesForDisplay.map((img: PrintifyImage, idx: number) => (
                    <CarouselItem key={img.src || idx} className="basis-1/4 pl-2">
                      {img && typeof img.src === 'string' && img.src.length > 0 ? (
                        <button
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all w-full h-20 ${
                            selectedImageIdx === idx
                              ? 'border-primary'
                              : 'border-muted hover:border-muted-foreground'
                          }`}
                        >
                          <Image
                            src={img.src}
                            alt={`${product.name} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ) : null}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6" />
                <CarouselNext className="-right-6" />
              </Carousel>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8 out of 5)</span>
              </div>
              <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none
                [&_table]:w-full
                [&_th]:bg-muted [&_td]:bg-background
                [&_th]:font-semibold [&_th]:text-left [&_td]:text-left
                dark:[&_th]:bg-muted/40 dark:[&_td]:bg-background/40
                dark:[&_th]:text-white dark:[&_td]:text-white dark:text-white
              ">
                <div className="relative">
                  <div
                    className={descExpanded ? '' : 'line-clamp-3 overflow-hidden'}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <button
                    className="mt-2 text-primary underline text-sm focus:outline-none"
                    onClick={() => setDescExpanded((v) => !v)}
                  >
                    {descExpanded ? 'Show less' : 'Read more'}
                  </button>
                </div>
              </div>
            </div>
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Color</label>
              <Select value={selectedColor} onValueChange={handleColorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {availableColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      <span className="flex items-center gap-2">
                        {colorHexMap[color] && (
                          <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: colorHexMap[color] }} />
                        )}
                        {color}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {allSizesForColor.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => enabledSizesForColor.has(size) && setSelectedSize(size)}
                    disabled={!enabledSizesForColor.has(size)}
                    className={[
                      'p-3 border rounded-lg text-center transition-all',
                      selectedSize === size ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground',
                      !enabledSizesForColor.has(size) ? 'opacity-50 cursor-not-allowed' : ''
                    ].filter(Boolean).join(' ')}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !selectedVariant || !selectedVariant.is_enabled}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm">Premium Quality</span>
              </div>
            </div>
            {/* Show a message if no enabled variants are available for the selected color/size */}
            {!selectedVariant && (
              <div className="text-sm text-red-500 mt-2">This combination is out of stock.</div>
            )}
          </div>
        </div>
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      This premium product is designed with attention to detail and quality craftsmanship. 
                      Made from high-quality materials that ensure durability and long-lasting performance. 
                      Perfect for daily use or special occasions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Product Details</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="capitalize">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stock Status:</span>
                          <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SKU:</span>
                          <span>THR-{product.id.padStart(4, '0')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Shipping & Returns</h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>Free shipping on orders over $50</p>
                        <p>30-day return policy</p>
                        <p>Ships within 1-2 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Customer Reviews</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">4.8 (124 reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Customer {index + 1}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">2 weeks ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Great quality product! Exactly as described and arrived quickly. 
                            Would definitely recommend to others.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Back to Shop */}
        <div className="flex justify-center pt-8">
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-6 text-center">Related Products</h3>
            <Carousel opts={{ align: 'start', slidesToScroll: 1, loop: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {relatedProducts.map((product: Product) => (
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
        )}
      </motion.div>
    </div>
  );
} 