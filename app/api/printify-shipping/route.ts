import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/printify';

export async function POST(req: NextRequest) {
  try {
    const { lineItems, address } = await req.json();
    if (!lineItems || !address) {
      return NextResponse.json({ error: 'Missing lineItems or address' }, { status: 400 });
    }
    const result = await calculateShipping(lineItems, address);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Shipping calculation failed' }, { status: 500 });
  }
} 