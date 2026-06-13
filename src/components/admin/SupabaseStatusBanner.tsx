import { Info } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { probeSupabaseAdmin } from "@/lib/supabase/server";

export async function SupabaseStatusBanner() {
  if (!isSupabaseConfigured) return null;

  const probe = await probeSupabaseAdmin();
  if (probe.ok) return null;

  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
      <Info className="mt-0.5 h-4.5 w-4.5 shrink-0" />
      <span>
        <strong>Supabase connection error:</strong> {probe.error}. CMS edits will not save
        until <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> in your hosting
        env matches the <strong>Secret</strong> key from Supabase → Project Settings → API
        (same project as <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>). Then
        redeploy.
      </span>
    </div>
  );
}
