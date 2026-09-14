export async function sendShareApprovalSMS({ phoneNumber, name, sharesCount, totalPaidUGX }) {
  const apiKey = process.env.SMS_API_KEY;
  const username = process.env.SMS_USERNAME || 'sandbox'; // 'sandbox' for Africa's Talking test mode

  // Formatted SMS Message Content
  const message = `Bunyoro Board Portal: Dear ${name}, your deposit for ${sharesCount} shares (UGX ${Number(totalPaidUGX).toLocaleString()}) has been verified & approved. View your certificate at https://bunyoro-board-portal.vercel.app/admin`;

  // Fallback logging if API keys are not yet configured in Vercel
  if (!apiKey) {
    console.log(`[SMS SIMULATION] To ${phoneNumber}: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    // Standard Africa's Talking HTTP Gateway Request
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': apiKey
      },
      body: new URLSearchParams({
        username: username,
        to: phoneNumber,
        message: message
      })
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Failed to dispatch SMS notification:', error);
    return { success: false, error: error.message };
  }
}
