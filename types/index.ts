export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  images: string[];
  tags: string[];
  category: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
}

// New types for Printify API
export interface PrintifyImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
  is_selected_for_publishing: boolean;
}

export interface PrintifyVariant {
  id: number;
  price: number;
  is_enabled: boolean;
  title: string;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  created_at: string;
  updated_at: string;
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