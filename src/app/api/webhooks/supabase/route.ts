import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received Supabase Webhook Payload:', body);

    return NextResponse.json(
      { message: 'Webhook received successfully', received: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process webhook body' },
      { status: 400 }
    );
  }
}
