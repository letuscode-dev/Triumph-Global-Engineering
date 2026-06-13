/**
 * Reset the admin dashboard password stored in Supabase Storage.
 * Use when locked out of production (stored hash overrides ADMIN_PASSWORD env).
 *
 *   npx tsx --env-file=.env.local scripts/reset-admin-password.ts "YourNewPassword"
 */
import { createClient } from "@supabase/supabase-js";

const BUCKET = "admin-secrets";
const CREDENTIALS_PATH = "credentials.json";
const ITERATIONS = 120_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const newPassword = process.argv[2]?.trim();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!newPassword || newPassword.length < 8) {
  console.error("Usage: npx tsx --env-file=.env.local scripts/reset-admin-password.ts \"NewPassword8+\"");
  process.exit(1);
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_BYTES * 8
  );
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = new Uint8Array(await deriveKey(password, salt));
  return `pbkdf2-sha256:${ITERATIONS}:${base64url(salt)}:${base64url(derived)}`;
}

async function main() {
  const supabase = createClient(url!, key!);
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: 4096,
    });
    if (error) {
      console.error("Could not create admin-secrets bucket:", error.message);
      process.exit(1);
    }
  }

  const passwordHash = await hashPassword(newPassword!);
  const body = JSON.stringify({
    passwordHash,
    updatedAt: new Date().toISOString(),
  });

  const { error } = await supabase.storage.from(BUCKET).upload(CREDENTIALS_PATH, body, {
    contentType: "application/json",
    upsert: true,
  });

  if (error) {
    console.error("Reset failed:", error.message);
    process.exit(1);
  }

  console.log("Admin password reset in Supabase Storage.");
  console.log("Sign in at /admin with the password you just set.");
  console.log("Update Vercel ADMIN_PASSWORD to match, then change it in Admin → Settings.");
}

main();
