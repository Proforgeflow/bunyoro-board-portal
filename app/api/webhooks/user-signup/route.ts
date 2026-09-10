import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    // Verify webhook secret header for security
    const webhookSecret = req.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 })
    }

    const payload = await req.json()
    const record = payload.record // Contains newly inserted profile row

    if (!record || !record.email) {
      return NextResponse.json({ message: 'No valid member email found' }, { status: 200 })
    }

    const memberName = record.full_name || 'Valued Shareholder'
    const memberEmail = record.email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@bunyororealestates.com'

    // 1. Send Welcome Email to New Shareholder
    await resend.emails.send({
      from: 'Bunyoro Real Estate <onboarding@resend.dev>',
      to: [memberEmail],
      subject: 'Welcome to Bunyoro Omuhama Real Estates LTD',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; padding: 20px;">
          <h2 style="color: #d97706;">Welcome to Bunyoro Omuhama Real Estates LTD</h2>
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>Thank you for creating your shareholder account. Your profile has been registered in our corporate database.</p>
          <p><strong>Current Status:</strong> <span style="background-color: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-weight: bold;">Pending KYC Verification</span></p>
          <p>Once board administration verifies your details, your full portal access and equity contribution record will be active.</p>
          <br/>
          <p>Best regards,<br/><strong>Executive Board Management</strong><br/>Bunyoro Omuhama Real Estates LTD</p>
        </div>
      `
    })

    // 2. Send Alert Email to Board Administrator
    await resend.emails.send({
      from: 'Command Studio Alerts <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `🚨 New Shareholder Signup: ${memberName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; padding: 20px;">
          <h3 style="color: #0f172a;">New Shareholder Registration Received</h3>
          <p>A new member has completed signup and requires KYC verification:</p>
          <ul>
            <li><strong>Name:</strong> ${memberName}</li>
            <li><strong>Email:</strong> ${memberEmail}</li>
            <li><strong>Default Status:</strong> Pending</li>
          </ul>
          <p>
            <a href="https://bunyoro-board-portal.vercel.app/admin" style="background-color: #d97706; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Open Admin Command Studio
            </a>
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true, message: 'Emails dispatched successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}