import {
  CheckCircle2,
  Shield,
  XCircle,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isUploadConfigured } from "@/lib/upload";
import { hasCustomAdminPassword } from "@/lib/admin-credentials";
import { getLeadNotifyEmail, getResendFrom, isResendConfigured } from "@/lib/email";
import { getSiteSettings, isUpstashConfigured } from "@/lib/site-settings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { EmailSettingsPanel } from "@/components/admin/EmailSettingsPanel";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

function StatusRow({ label, ok, hint }: { label: string; ok: boolean; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">{hint}</div>
      </div>
      {ok ? (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-leaf-600">
          <CheckCircle2 className="h-4.5 w-4.5" /> Connected
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
          <XCircle className="h-4.5 w-4.5" /> Not set
        </span>
      )}
    </div>
  );
}

export default async function SettingsPage() {
  const gaSet = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const resendSet = isResendConfigured();
  const customPassword = await hasCustomAdminPassword();
  const site = await getSiteSettings();
  const sessionTokenSet = Boolean(process.env.ADMIN_SESSION_TOKEN?.trim());
  const upstashSet = isUpstashConfigured();

  return (
    <div>
      <AdminHeader
        title="Settings"
        description="Security, company information, notifications, and integrations."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Admin password</h2>
          <p className="mt-1 text-xs text-slate-500">
            Password precedence: (1) hash saved in Supabase Storage, (2){" "}
            <code className="font-mono">ADMIN_PASSWORD</code> env var, (3) dev default only in
            local mode.
          </p>
          <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Shield className="mb-1 inline h-4 w-4 text-brand-600" />{" "}
            {customPassword
              ? "Custom password is active (stored in Supabase)."
              : isSupabaseConfigured
                ? "Using env password — set a new one below to store it in Supabase."
                : "Connect Supabase to change the password from this dashboard."}
          </div>
          {isSupabaseConfigured ? (
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Add Supabase keys to <code className="font-mono">.env.local</code>, restart the
              server, then return here to change your password.
            </p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Session security</h2>
          <p className="mt-1 text-xs text-slate-500">
            Production requires a random <code className="font-mono">ADMIN_SESSION_TOKEN</code> to
            sign admin cookies (12-hour sessions).
          </p>
          <StatusRow
            label="ADMIN_SESSION_TOKEN"
            ok={sessionTokenSet}
            hint={
              sessionTokenSet
                ? "Session signing secret is configured"
                : "Required in production — generate with crypto.randomBytes(48)"
            }
          />
          <StatusRow
            label="Rate limiting (Upstash)"
            ok={upstashSet}
            hint={
              upstashSet
                ? "Distributed rate limits for leads and login"
                : "Recommended on Vercel — see PRODUCTION.md §7"
            }
          />
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-slate-900">Company information</h2>
          <p className="mt-1 text-xs text-slate-500">
            Shown in the header, footer, contact page, and JSON-LD. No redeploy required.
          </p>
          <SiteSettingsForm initial={site} />
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Lead email alerts</h2>
          <p className="mt-1 text-xs text-slate-500">
            Get an email when someone submits a quote or contact form (via Resend).
          </p>
          <div className="mt-5">
            <EmailSettingsPanel
              configured={resendSet}
              notifyEmail={getLeadNotifyEmail()}
              fromAddress={getResendFrom()}
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Integrations</h2>
          <p className="mt-1 text-xs text-slate-500">
            Add the relevant keys to your environment to enable each integration.
          </p>
          <div className="mt-5 space-y-3">
            <StatusRow
              label="Supabase"
              ok={isSupabaseConfigured}
              hint="Database, CMS content, leads, and storage"
            />
            <StatusRow
              label="Media Uploads"
              ok={isUploadConfigured}
              hint={
                isCloudinaryConfigured
                  ? "Image & video uploads (Cloudinary)"
                  : "Image & video uploads (Supabase Storage)"
              }
            />
            <StatusRow
              label="Lead email (Resend)"
              ok={resendSet}
              hint="Email alerts for new quote & contact submissions"
            />
            <StatusRow
              label="Google Analytics"
              ok={gaSet}
              hint="Website traffic tracking (consent-gated)"
            />
            <StatusRow
              label="WhatsApp Business"
              ok={Boolean(site.whatsapp)}
              hint="Floating chat & quick contact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
