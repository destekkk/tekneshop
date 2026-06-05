import { getSiteUrl } from "@/lib/email/config";

export function htmlToPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export function wrapEmailHtml(opts: {
  siteName: string;
  body: string;
  unsubscribeUrl: string;
  supportEmail: string;
}) {
  const bodyHtml = opts.body.includes("<")
    ? opts.body
    : opts.body
        .split("\n")
        .map((line) => (line.trim() ? `<p style="margin:0 0 12px">${line}</p>` : "<br/>"))
        .join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1a2b4a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a2b4a;padding:20px 24px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${opts.siteName}</p>
        </td></tr>
        <tr><td style="padding:24px;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 24px 24px;border-top:1px solid #e8ecf0;font-size:12px;color:#6b7c93;line-height:1.5;">
          <p style="margin:0 0 8px;">Bu e-posta ${opts.siteName} üzerinden kayıtlı adresinize gönderilmiştir.</p>
          <p style="margin:0 0 8px;">
            <a href="${opts.unsubscribeUrl}" style="color:#1a2b4a;">Abonelikten çık</a>
            · <a href="${getSiteUrl()}" style="color:#1a2b4a;">Siteye git</a>
          </p>
          <p style="margin:0;">Sorularınız için: <a href="mailto:${opts.supportEmail}" style="color:#1a2b4a;">${opts.supportEmail}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildUnsubscribeUrl(token: string) {
  return `${getSiteUrl()}/eposta-iptal?token=${encodeURIComponent(token)}`;
}
