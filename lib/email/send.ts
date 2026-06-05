import { Resend } from "resend";
import { getEmailFrom, getSiteUrl, isEmailConfigured } from "@/lib/email/config";
import { buildUnsubscribeUrl, htmlToPlainText, wrapEmailHtml } from "@/lib/email/template";

export type SendEmailOpts = {
  to: string;
  subject: string;
  body: string;
  siteName: string;
  supportEmail: string;
  unsubscribeToken?: string;
  replyTo?: string;
};

function getResend() {
  if (!isEmailConfigured()) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendTransactionalEmail(opts: SendEmailOpts) {
  const resend = getResend();
  if (!resend) {
    return { ok: false as const, error: "RESEND_API_KEY tanımlı değil" };
  }

  const unsubscribeUrl = opts.unsubscribeToken
    ? buildUnsubscribeUrl(opts.unsubscribeToken)
    : `${getSiteUrl()}/eposta-iptal`;

  const html = wrapEmailHtml({
    siteName: opts.siteName,
    body: opts.body,
    unsubscribeUrl,
    supportEmail: opts.supportEmail,
  });

  const text = htmlToPlainText(opts.body);

  const headers: Record<string, string> = {};
  if (opts.unsubscribeToken) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: opts.to,
      subject: opts.subject,
      html,
      text,
      replyTo: opts.replyTo || opts.supportEmail,
      headers,
    });

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Gönderim hatası" };
  }
}

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function sendBulkEmails(
  recipients: { email: string; unsubscribeToken: string }[],
  opts: Omit<SendEmailOpts, "to" | "unsubscribeToken">,
  onProgress?: (sent: number, failed: number) => void,
) {
  const resend = getResend();
  if (!resend) {
    return { sent: 0, failed: recipients.length, errors: ["RESEND_API_KEY tanımlı değil"] };
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const payloads = batch.map((r) => {
      const unsubscribeUrl = buildUnsubscribeUrl(r.unsubscribeToken);
      const html = wrapEmailHtml({
        siteName: opts.siteName,
        body: opts.body,
        unsubscribeUrl,
        supportEmail: opts.supportEmail,
      });
      return {
        from: getEmailFrom(),
        to: r.email,
        subject: opts.subject,
        html,
        text: htmlToPlainText(opts.body),
        replyTo: opts.replyTo || opts.supportEmail,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    try {
      const { data, error } = await resend.batch.send(payloads);
      if (error) {
        failed += batch.length;
        errors.push(error.message);
      } else {
        sent += data?.length ?? batch.length;
      }
    } catch (e) {
      failed += batch.length;
      errors.push(e instanceof Error ? e.message : "Toplu gönderim hatası");
    }

    onProgress?.(sent, failed);
    if (i + BATCH_SIZE < recipients.length) await sleep(BATCH_DELAY_MS);
  }

  return { sent, failed, errors };
}
