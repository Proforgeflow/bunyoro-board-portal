import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShareApprovalSMS } from '../../../../lib/sms';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET() {
  return NextResponse.json({ status: 'online', service: 'Stanbic Webhook SMS Listener' }, { status: 200 });
}

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
      return NextResponse.json({ error: 'Database uninitialized' }, { status: 500 });
    }

    if (status === 'SUCCESS' || status === 'COMPLETED') {
      // 1. Update Supabase record
      const { data: updatedRows, error } = await supabase
        .from('member_shares')
        .update({ 
          payment_status: 'Approved',
          payment_channel: 'Stanbic Bank',
          transaction_ref: reference || 'STB-AUTO-VERIFIED'
        })
        .or(`id.eq.${reference},phone_number.eq.${phone_number}`)
        .select('*');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // 2. Dispatch SMS notification for approved members
      if (updatedRows && updatedRows.length > 0) {
        const member = updatedRows[0];
        await sendShareApprovalSMS({
          phoneNumber: member.phone_number,
          name: member.member_name,
          sharesCount: member.shares_count,
          totalPaidUGX: member.total_paid_ugx
        });
      }

      return NextResponse.json({ status: 'success', message: 'Deposit approved & SMS dispatched' }, { status: 200 });
    }

    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook processing error', details: err.message }, { status: 400 });
  }
}
