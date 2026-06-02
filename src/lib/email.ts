import type { Lead } from "./types";
import { SITE } from "./site";
import { escapeHtml } from "./sanitize";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getLeadNotifyEmail(): string {
  return process.env.LEADS_NOTIFY_EMAIL || SITE.email;
}

export function getResendFrom(): string {
  return process.env.RESEND_FROM || "Triumph Global <onboarding@resend.dev>";
}

// Sends a lead notification email via Resend (https://resend.com) when
// RESEND_API_KEY is configured. Fails silently (never throws) so a missing or
// failing email provider can never break a form submission.
export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = getLeadNotifyEmail();
  const from = getResendFrom();

  if (!apiKey || !to) {
    console.info(
      `[lead] ${lead.source} from ${lead.name} (${lead.phone}) — email not sent (RESEND_API_KEY unset)`
    );
    return false;
  }

  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Location", lead.location],
    ["Service", lead.service],
    ["Budget", lead.budget],
    ["Source", lead.source],
  ];

  const html = `
    <h2>New ${escapeHtml(lead.source)} request</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="color:#64748b"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v!)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="margin-top:12px"><strong>Message</strong><br/>${escapeHtml(lead.message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email || undefined,
        subject: `New ${lead.source} request from ${lead.name}`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Sends a test email to verify Resend is configured correctly. */
export async function sendTestEmail(): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = getLeadNotifyEmail();
  const from = getResendFrom();

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set in .env.local" };
  }
  if (!to) {
    return { ok: false, error: "LEADS_NOTIFY_EMAIL is not set." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Triumph Global — test lead notification",
        html: `
          <p>This is a <strong>test email</strong> from the Triumph Global Engineering admin dashboard.</p>
          <p>If you received this, Resend is configured correctly and new quote/contact submissions will be emailed to <strong>${to}</strong>.</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: body || `Resend returned ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Send failed." };
  }
}
