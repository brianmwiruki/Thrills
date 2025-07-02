import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/printify';

export async function GET() {
  try {
    const products = await getProducts(1, 50);
    const result = products.map(p => ({
      id: p.id,
      title: p.title,
      variants: p.variants.map((v: any) => ({ id: v.id, title: v.title, is_enabled: v.is_enabled }))
    }));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 