import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function logAuditEvent({ actor = 'System', action, entityType, entityId = null, payload = {}, req = null }) {
  if (!supabase) return;

  try {
    let ipAddress = 'Internal';
    if (req) {
      ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    }

    await supabase.from('audit_logs').insert([
      {
        actor_name: actor,
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        payload,
        ip_address: ipAddress,
      },
    ]);
  } catch (err) {
    console.error('[AUDIT_LOG_FAILURE]', err);
  }
}
