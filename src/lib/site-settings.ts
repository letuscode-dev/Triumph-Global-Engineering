import { cache } from "react";
import { createAdminClient } from "./supabase/server";
import { DEFAULT_SITE, type SiteConfig } from "./site";
import type { SiteSettingsInput } from "./validation";

const g = globalThis as unknown as { __tgeSiteSettings?: SiteConfig };

function mergeSettings(partial: Record<string, unknown>): SiteConfig {
  const base = g.__tgeSiteSettings ?? DEFAULT_SITE;
  return {
    name: String(partial.name ?? base.name),
    shortName: String(partial.shortName ?? base.shortName),
    slogan: String(partial.slogan ?? base.slogan),
    description: String(partial.description ?? base.description),
    url: DEFAULT_SITE.url,
    email: String(partial.email ?? base.email),
    phones: Array.isArray(partial.phones) ? (partial.phones as string[]) : [...base.phones],
    phoneIntl: Array.isArray(partial.phoneIntl)
      ? (partial.phoneIntl as string[])
      : [...base.phoneIntl],
    whatsapp: String(partial.whatsapp ?? base.whatsapp),
    address: String(partial.address ?? base.address),
    hours: Array.isArray(partial.hours)
      ? (partial.hours as SiteConfig["hours"])
      : [...base.hours],
    socials: {
      facebook: String(
        (partial.socials as SiteConfig["socials"] | undefined)?.facebook ?? base.socials.facebook
      ),
      linkedin: String(
        (partial.socials as SiteConfig["socials"] | undefined)?.linkedin ?? base.socials.linkedin
      ),
      youtube: String(
        (partial.socials as SiteConfig["socials"] | undefined)?.youtube ?? base.socials.youtube
      ),
    },
  };
}

export const getSiteSettings = cache(async (): Promise<SiteConfig> => {
  const supabase = createAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    if (data?.data && typeof data.data === "object") {
      return mergeSettings(data.data as Record<string, unknown>);
    }
  }
  return g.__tgeSiteSettings ?? DEFAULT_SITE;
});

export async function saveSiteSettings(
  input: SiteSettingsInput
): Promise<{ ok: boolean; error?: string }> {
  const payload = {
    name: input.name,
    shortName: input.shortName,
    slogan: input.slogan,
    description: input.description,
    email: input.email,
    phones: input.phones,
    phoneIntl: input.phoneIntl,
    whatsapp: input.whatsapp,
    address: input.address,
    hours: input.hours,
    socials: input.socials,
  };

  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from("site_settings").upsert(
      {
        id: 1,
        data: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  g.__tgeSiteSettings = mergeSettings(payload);
  return { ok: true };
}

export function isUpstashConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
