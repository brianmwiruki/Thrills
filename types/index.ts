export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
}