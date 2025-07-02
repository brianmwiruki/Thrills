import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    // Here you would integrate with a payment processor (Stripe, PayPal, etc.)
    // For now, just log the donation
    console.log('Received green donation:', amount);
    // Optionally, store in a database or send a notification
    return NextResponse.json({ success: true, message: 'Thank you for your donation!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Donation failed' }, { status: 500 });
  }
} 