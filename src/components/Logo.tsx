import Link from "next/link";
import { Droplet } from "lucide-react";
import { SITE } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={SITE.name}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-leaf-600 text-white shadow-md transition-transform group-hover:scale-105">
        <Droplet className="h-5 w-5" fill="currentColor" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Triumph<span className="text-leaf-500">Global</span>
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
            light ? "text-brand-200" : "text-brand-600"
          }`}
        >
          Engineering
        </span>
      </span>
    </Link>
  );
}
