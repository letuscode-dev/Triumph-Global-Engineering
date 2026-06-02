/**
 * Apply Supabase SQL migrations using a direct Postgres connection.
 *
 * Requires SUPABASE_DB_URL in .env.local (Supabase → Project Settings → Database
 * → Connection string → URI, Session pooler or Direct).
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/run-migration.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");
const PATCHES_DIR = join(process.cwd(), "supabase", "patches");

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error(
    "Missing SUPABASE_DB_URL (or DATABASE_URL).\n\n" +
      "Add your Postgres connection string to .env.local:\n" +
      "  Supabase Dashboard → Project Settings → Database → Connection string → URI\n\n" +
      "Then run:\n" +
      "  npx tsx --env-file=.env.local scripts/run-migration.ts"
  );
  process.exit(1);
}

function sqlFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort()
      .map((f) => join(dir, f));
  } catch {
    return [];
  }
}

async function verify(client: pg.Client) {
  const checks: { label: string; ok: boolean; detail: string }[] = [];

  const { rows: policyRows } = await client.query<{ exists: boolean }>(
    `select exists (
       select 1 from pg_policies
       where schemaname = 'public' and tablename = 'leads'
         and policyname = 'Public can insert leads'
     ) as exists`
  );
  checks.push({
    label: "Leads public INSERT removed",
    ok: !policyRows[0]?.exists,
    detail: policyRows[0]?.exists ? "Policy still present" : "OK",
  });

  const { rows: tableRows } = await client.query<{ exists: boolean }>(
    `select exists (
       select 1 from information_schema.tables
       where table_schema = 'public' and table_name = 'site_settings'
     ) as exists`
  );
  checks.push({
    label: "site_settings table",
    ok: Boolean(tableRows[0]?.exists),
    detail: tableRows[0]?.exists ? "OK" : "Missing",
  });

  const { rows: colRows } = await client.query<{ exists: boolean }>(
    `select exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'services'
         and column_name = 'updated_at'
     ) as exists`
  );
  checks.push({
    label: "updated_at on content tables",
    ok: Boolean(colRows[0]?.exists),
    detail: colRows[0]?.exists ? "OK" : "Missing",
  });

  return checks;
}

async function main() {
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase Postgres.\n");

  const before = await verify(client);
  if (before.every((c) => c.ok)) {
    console.log("Migration already applied — nothing to do.\n");
    for (const c of before) console.log(`  ✓ ${c.label}`);
    await client.end();
    return;
  }

  const files = [...sqlFiles(MIGRATIONS_DIR), ...sqlFiles(PATCHES_DIR)];
  if (files.length === 0) {
    console.error("No migration SQL files found.");
    process.exit(1);
  }

  for (const file of files) {
    const sql = readFileSync(file, "utf8");
    console.log(`Running ${file.replace(process.cwd(), ".")} ...`);
    await client.query(sql);
    console.log("  Done.\n");
  }

  const after = await verify(client);
  console.log("Verification:");
  let failed = false;
  for (const c of after) {
    console.log(`  ${c.ok ? "✓" : "✗"} ${c.label} — ${c.detail}`);
    if (!c.ok) failed = true;
  }

  await client.end();
  if (failed) {
    console.error("\nSome checks failed. Review the SQL output in Supabase logs.");
    process.exit(1);
  }
  console.log("\nMigration completed successfully.");
}

main().catch((err) => {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
