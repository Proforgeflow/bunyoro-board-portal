import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Health Check Endpoint (GET)
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Stanbic Bank Webhook Listener',
    supported_methods: ['POST']
  }, { status: 200 });
}

// Transaction Webhook Endpoint (POST)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('x-stanbic-signature') || request.headers.get('authorization');
    const expectedSecret = process.env.STANBIC_WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized signature' }, { status: 401 });
    }

    const payload = await request.json();
    const { reference, phone_number, status } = payload;

    if (!supabase) {
      return NextResponse.json({ error: 'Database client uninitialized' }, { status: 500 });
    }

    if (status === 'SUCCESS' || status === 'COMPLETED') {
      const { error } = await supabase
        .from('member_shares')
        .update({ 
          payment_status: 'Approved',
          payment_channel: 'Stanbic Bank',
          transaction_ref: reference || 'STB-AUTO-VERIFIED'
        })
        .or(`id.eq.${reference},phone_number.eq.${phone_number}`)
        .eq('payment_status', 'Pending');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        status: 'success', 
        message: 'Share deposit auto-approved successfully',
        reference 
      }, { status: 200 });
    }

    return NextResponse.json({ status: 'ignored', message: 'Transaction status not completed' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Malformed webhook request', details: err.message }, { status: 400 });
  }
}
