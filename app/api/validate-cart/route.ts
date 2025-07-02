import { NextRequest, NextResponse } from 'next/server';
import { validateCartItems } from '@/lib/printify';

export async function POST(req: NextRequest) {
  const { items } = await req.json();
  const result = await validateCartItems(items);
  return NextResponse.json(result);
} 