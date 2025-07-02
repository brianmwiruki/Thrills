import { PrintifyProduct } from "@/types";

const API_BASE = 'https://api.printify.com/v1';
const API_TOKEN = process.env.PRINTIFY_API_TOKEN;

if (!API_TOKEN) {
  throw new Error("Missing PRINTIFY_API_TOKEN in your .env.local file.");
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
  'User-Agent': 'Thrills-Store-App'
};

let shopId: string = '';

// Function to get the first shop ID
async function getShopId(): Promise<string> {
  if (shopId) return shopId;

  const response = await fetch(`${API_BASE}/shops.json`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch shops from Printify');
  }
  const shops = await response.json();
  if (!shops.length) {
    throw new Error('No shops found in your Printify account.');
  }
  shopId = shops[0].id as string;
  return shopId;
}

// Get all products from the first shop, with pagination and optional tag filter
export async function getProducts(page = 1, limit = 20, tag?: string): Promise<PrintifyProduct[]> {
  // Printify API does not allow limit > 50
  const safeLimit = Math.min(limit, 50);
  const currentShopId = await getShopId();
  if (!currentShopId) {
    throw new Error('No shop ID available for Printify API');
  }
  const url = `${API_BASE}/shops/${currentShopId}/products.json?page=${page}&limit=${safeLimit}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Printify products fetch failed:', response.status, errorText);
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  let products: PrintifyProduct[] = data.data;
  if (tag && tag !== 'all') {
    products = products.filter(product => product.tags.includes(tag));
  }
  return products;
}

// Get a single product by its ID
export async function getProduct(productId: string): Promise<PrintifyProduct | null> {
  const currentShopId = await getShopId();
  const response = await fetch(`${API_BASE}/shops/${currentShopId}/products/${productId}.json`, { headers });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch product ${productId}`);
  }
  return await response.json();
}

// Calculate shipping cost for given line items and address
export async function calculateShipping(lineItems: Array<{ product_id: string, variant_id: number, quantity: number }>, address: { first_name: string, last_name: string, email: string, phone: string, country: string, region?: string, city?: string, address1: string, zip: string }) {
  const currentShopId = await getShopId();
  const url = `${API_BASE}/shops/${currentShopId}/shipping.json`;
  const body = {
    line_items: lineItems,
    address_to: address,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Printify shipping error:', errorText);
    throw new Error('Failed to calculate shipping: ' + errorText);
  }
  return await response.json();
}

export async function validateCartItems(cartItems: Array<{ product: { id: string, selectedVariant?: { id: number } } }>) {
  for (const item of cartItems) {
    const product = await getProduct(item.product.id);
    if (!product) return { valid: false, message: `Product ${item.product.id} not found.` };
    const variant = product.variants.find((v: any) => v.id === item.product.selectedVariant?.id);
    if (!variant || !variant.is_enabled) {
      return { valid: false, message: `Selected variant is not available for ${product.title}.` };
    }
  }
  return { valid: true };
} 