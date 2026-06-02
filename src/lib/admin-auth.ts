// Admin session auth using an HMAC-signed, expiring cookie. Works in both the
// Edge runtime (middleware) and Node (route handlers) via Web Crypto.
//
// For production set a strong ADMIN_PASSWORD and a random ADMIN_SESSION_TOKEN.
// For a multi-user setup, switch to Supabase Auth + RLS.

const isProd = process.env.NODE_ENV === "production";

export const SESSION_COOKIE = "tge_admin";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || (isProd ? "" : "triumph-admin");

function secret(): string {
  if (process.env.ADMIN_SESSION_TOKEN) return process.env.ADMIN_SESSION_TOKEN;
  if (isProd) return "";
  return process.env.ADMIN_PASSWORD || "triumph-admin-dev-secret";
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64url(new Uint8Array(sig));
}

// Returns a signed token of the form "<expiry>.<signature>".
export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = await hmac(exp);
  return `${exp}.${sig}`;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = await hmac(exp);
  return timingSafeEqual(sig, expected);
}
