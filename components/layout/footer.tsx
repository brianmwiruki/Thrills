import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { getProducts } from '@/lib/printify';

const FALLBACK_CATEGORIES = [
  'jewelry',
  'eyewear',
  'accessories',
  'tech',
];

export async function Footer() {
  let categories: string[] = [];
  try {
    // Printify API limit is 50 per request
    const printifyProducts = await getProducts(1, 50);
    const allTags = Array.from(new Set(printifyProducts.flatMap(p => p.tags)));
    categories = allTags.sort().slice(0, 6);
  } catch (e) {
    console.error('Failed to fetch categories for footer:', e);
    categories = FALLBACK_CATEGORIES;
  }

  return (
    <footer className="bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Thrills</h3>
            <p className="text-muted-foreground">
              Discover trendy fashion accessories and lifestyle items that express your unique style.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${encodeURIComponent(cat)}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {cat.replace(/-/g, ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1"
              />
              <Button size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4 md:col-span-4">
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm text-muted-foreground">
              HONSON VENTURES LIMITED<br />
              gpsr@honsonventures.com<br />
              3, Gnaftis House flat 102, Mesa Geitonia, 4003, Limassol, CY
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2025 Thrills. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}