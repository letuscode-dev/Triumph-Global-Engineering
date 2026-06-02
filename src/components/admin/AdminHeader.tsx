import { Info } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AdminHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-1 text-slate-500">{description}</p>
      {!isSupabaseConfigured && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800">
          <Info className="h-4.5 w-4.5 mt-0.5 shrink-0" />
          <span>
            <strong>Demo mode:</strong> changes are saved in memory and reset when the
            server restarts. Connect Supabase (see{" "}
            <code className="font-mono">supabase/schema.sql</code>) to persist content
            permanently.
          </span>
        </div>
      )}
    </div>
  );
}
