export async function sendWhatsAppMessage(
  phone: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  // Future: plug in Twilio or WhatsApp Cloud API here
  console.log(`[WhatsApp] To: +91${phone} | Message: ${message}`);
  return { success: true };
}

export function getWelcomeMessage(memberName: string): string {
  return `Hello ${memberName}! 👋 Welcome to FitLife Studio, Panambad. Your fitness journey starts today! 💪 — Trainer Akshay`;
}

export function getFeeReminderMessage(
  memberName: string,
  expiryDate: string,
): string {
  return `Hello ${memberName}! Your FitLife Studio membership expires on ${expiryDate}. Please renew to continue. Contact Trainer Akshay. 🏋️`;
}
