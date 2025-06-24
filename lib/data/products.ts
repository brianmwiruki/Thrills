import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Urban Chain Necklace',
    price: 89,
    originalPrice: 129,
    description: 'Premium stainless steel chain necklace with modern urban design. Perfect for everyday wear or special occasions.',
    category: 'jewelry',
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: true,
    tags: ['chain', 'necklace', 'urban', 'stainless-steel']
  },
  {
    id: '2',
    name: 'Minimalist Ring Set',
    price: 45,
    description: 'Set of 3 minimalist rings in different finishes. Made from high-quality materials for long-lasting wear.',
    category: 'jewelry',
    images: [
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1191532/pexels-photo-1191532.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: true,
    tags: ['rings', 'minimalist', 'set']
  },
  {
    id: '3',
    name: 'Tech Sunglasses',
    price: 129,
    originalPrice: 179,
    description: 'Cutting-edge sunglasses with UV protection and modern frame design. Perfect for the tech-savvy individual.',
    category: 'eyewear',
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/701878/pexels-photo-701878.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: false,
    tags: ['sunglasses', 'tech', 'uv-protection']
  },
  {
    id: '4',
    name: 'Leather Wallet Pro',
    price: 79,
    description: 'Premium leather wallet with RFID protection and sleek design. Multiple card slots and bill compartments.',
    category: 'accessories',
    images: [
      'https://images.pexels.com/photos/2079228/pexels-photo-2079228.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2079229/pexels-photo-2079229.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: true,
    tags: ['wallet', 'leather', 'rfid', 'premium']
  },
  {
    id: '5',
    name: 'Wireless Earphones Elite',
    price: 199,
    originalPrice: 249,
    description: 'High-quality wireless earphones with noise cancellation and premium sound quality. 24-hour battery life.',
    category: 'tech',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: true,
    tags: ['earphones', 'wireless', 'noise-cancellation']
  },
  {
    id: '6',
    name: 'Designer Watch Band',
    price: 35,
    description: 'Stylish watch band compatible with most smartwatches. Premium materials and comfortable fit.',
    category: 'accessories',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: false,
    tags: ['watch-band', 'smartwatch', 'designer']
  },
  {
    id: '7',
    name: 'Statement Earrings',
    price: 65,
    description: 'Bold statement earrings that add personality to any outfit. Hypoallergenic materials.',
    category: 'jewelry',
    images: [
      'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1721944/pexels-photo-1721944.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: false,
    tags: ['earrings', 'statement', 'hypoallergenic']
  },
  {
    id: '8',
    name: 'Smart Keychain',
    price: 29,
    description: 'Innovative keychain with Bluetooth tracking and LED light. Never lose your keys again.',
    category: 'tech',
    images: [
      'https://images.pexels.com/photos/2977304/pexels-photo-2977304.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2977305/pexels-photo-2977305.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    featured: false,
    tags: ['keychain', 'bluetooth', 'tracking', 'smart']
  }
];

export const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'jewelry', name: 'Jewelry', icon: '💎' },
  { id: 'eyewear', name: 'Eyewear', icon: '🕶️' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
  { id: 'tech', name: 'Tech', icon: '📱' }
];

export const featuredProducts = products.filter(product => product.featured);