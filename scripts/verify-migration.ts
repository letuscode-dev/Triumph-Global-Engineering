/**
 * Verify migration state via Supabase REST (no DB password required).
 * Run: npx tsx --env-file=.env.local scripts/verify-migration.ts
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key || !anon) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });
const publicClient = createClient(url, anon, { auth: { persistSession: false } });

async function main() {
  console.log("Checking Supabase migration state...\n");

  const { error: settingsError } = await admin.from("site_settings").select("id").limit(1);
  const siteSettingsOk = !settingsError;
  console.log(
    `${siteSettingsOk ? "✓" : "✗"} site_settings table — ${
      settingsError ? settingsError.message : "accessible"
    }`
  );

  const { error: updatedAtError } = await admin.from("services").select("updated_at").limit(1);
  const updatedAtOk = !updatedAtError;
  console.log(
    `${updatedAtOk ? "✓" : "✗"} services.updated_at — ${
      updatedAtError ? updatedAtError.message : "column exists"
    }`
  );

  const { error: anonInsertError } = await publicClient.from("leads").insert({
    name: "Migration test",
    phone: "0000000000",
    message: "Should fail if RLS is tightened",
    source: "quote",
  });
  const anonInsertBlocked = Boolean(anonInsertError);
  console.log(
    `${anonInsertBlocked ? "✓" : "✗"} Anon lead INSERT blocked — ${
      anonInsertError ? anonInsertError.message : "WARNING: anon can still insert leads!"
    }`
  );

  const allOk = siteSettingsOk && updatedAtOk && anonInsertBlocked;
  console.log(allOk ? "\nMigration looks applied." : "\nMigration NOT fully applied yet.");
  process.exit(allOk ? 0 : 1);
}

main();
