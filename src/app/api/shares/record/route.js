import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShareApprovalSMS } from '../../../../lib/sms';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { member_name, phone_number, role, shares_count, payment_channel, payment_status } = body;

    if (!supabase) {
      return NextResponse.json({ error: 'Database uninitialized' }, { status: 500 });
    }

    // Insert new share deposit record into Supabase
    const { data, error } = await supabase
      .from('member_shares')
      .insert([
        {
          member_name,
          phone_number,
          role,
          shares_count: parseInt(shares_count, 10),
          payment_channel,
          payment_status,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Trigger SMS if deposit status is set to Approved
    if (payment_status === 'Approved') {
      await sendShareApprovalSMS({
        phoneNumber: phone_number,
        name: member_name,
        sharesCount: shares_count,
        totalPaidUGX: data.total_paid_ugx || (shares_count * 100000)
      });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
