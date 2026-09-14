import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShareApprovalSMS } from '../../../../lib/sms';
import { logAuditEvent } from '../../../../lib/audit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { member_name, phone_number, role, shares_count, payment_channel, payment_status } = body;

    if (!member_name || !phone_number || !shares_count) {
      return NextResponse.json({ error: 'Missing mandatory fields: member_name, phone_number, or shares_count' }, { status: 400 });
    }

    const sharesInt = parseInt(shares_count, 10);
    if (isNaN(sharesInt) || sharesInt <= 0) {
      return NextResponse.json({ error: 'Invalid share quantity allotment' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database service uninitialized' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('member_shares')
      .insert([
        {
          member_name: member_name.trim(),
          phone_number: phone_number.trim(),
          role: role || 'Shareholder',
          shares_count: sharesInt,
          payment_channel: payment_channel || 'Stanbic Bank',
          payment_status: payment_status || 'Pending',
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await logAuditEvent({
      actor: 'Admin Secretariat',
      action: 'RECORD_SHARE_DEPOSIT',
      entityType: 'member_shares',
      entityId: data.id,
      payload: { member_name, shares_count: sharesInt, payment_status, total_paid_ugx: data.total_paid_ugx },
      req: request,
    });

    if (payment_status === 'Approved') {
      await sendShareApprovalSMS({
        phoneNumber: data.phone_number,
        name: data.member_name,
        sharesCount: data.shares_count,
        totalPaidUGX: data.total_paid_ugx,
      });

      await logAuditEvent({
        actor: 'SMS Gateway',
        action: 'DISPATCH_APPROVAL_SMS',
        entityType: 'member_shares',
        entityId: data.id,
        payload: { recipient: data.phone_number },
        req: request,
      });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server fault', details: err.message }, { status: 500 });
  }
}
