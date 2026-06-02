import { createAdminClient } from "./supabase/server";
import { ADMIN_PASSWORD } from "./admin-auth";

const BUCKET = "admin-secrets";
const CREDENTIALS_PATH = "credentials.json";

// PBKDF2 password hashing (Web Crypto — works in Node and Edge).
const ITERATIONS = 120_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

export type StoredCredentials = {
  passwordHash: string;
  updatedAt: string;
};

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const saltBytes = Uint8Array.from(salt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_BYTES * 8
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = new Uint8Array(await deriveKey(password, salt));
  return `pbkdf2-sha256:${ITERATIONS}:${base64url(salt)}:${base64url(derived)}`;
}

export async function verifyPasswordHash(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  const salt = fromBase64url(parts[2]);
  const expected = fromBase64url(parts[3]);
  const saltBytes = Uint8Array.from(salt);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
      keyMaterial,
      expected.length * 8
    )
  );

  if (derived.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < derived.length; i++) diff |= derived[i] ^ expected[i];
  return diff === 0;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function ensureSecretsBucket() {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return true;

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 4096,
  });
  return !error;
}

export async function readStoredCredentials(): Promise<StoredCredentials | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage.from(BUCKET).download(CREDENTIALS_PATH);
  if (error || !data) return null;

  try {
    const parsed = JSON.parse(await data.text()) as StoredCredentials;
    return parsed?.passwordHash ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeStoredCredentials(passwordHash: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const ok = await ensureSecretsBucket();
  if (!ok) return false;

  const body = JSON.stringify({
    passwordHash,
    updatedAt: new Date().toISOString(),
  } satisfies StoredCredentials);

  const { error } = await supabase.storage.from(BUCKET).upload(CREDENTIALS_PATH, body, {
    contentType: "application/json",
    upsert: true,
  });
  return !error;
}

/** True when a custom password is stored in Supabase (not env-only). */
export async function hasCustomAdminPassword(): Promise<boolean> {
  const stored = await readStoredCredentials();
  return Boolean(stored?.passwordHash);
}

/** Validates the admin password (stored hash first, then ADMIN_PASSWORD env). */
export async function validateAdminPassword(password: string): Promise<boolean> {
  const stored = await readStoredCredentials();
  if (stored?.passwordHash) {
    return verifyPasswordHash(password, stored.passwordHash);
  }
  return timingSafeEqual(password, ADMIN_PASSWORD);
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!createAdminClient()) {
    return {
      ok: false,
      error: "Supabase is required to change the password from the dashboard. Connect Supabase first.",
    };
  }

  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const valid = await validateAdminPassword(currentPassword);
  if (!valid) {
    return { ok: false, error: "Current password is incorrect." };
  }

  if (await validateAdminPassword(newPassword)) {
    return { ok: false, error: "New password must be different from the current password." };
  }

  const hash = await hashPassword(newPassword);
  const saved = await writeStoredCredentials(hash);
  if (!saved) {
    return {
      ok: false,
      error: "Could not save the new password. Check Supabase Storage permissions.",
    };
  }

  return { ok: true };
}
