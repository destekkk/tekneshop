export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://tekneshop.vercel.app";
}

export function getEmailFrom() {
  return process.env.EMAIL_FROM || "TekneShop <onboarding@resend.dev>";
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
