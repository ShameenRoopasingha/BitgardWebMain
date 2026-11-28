export const CMS_SESSION_COOKIE = "bitgard_cms_session";
export const CMS_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export type CmsAdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface CmsSessionPayload {
  id: string;
  email: string;
  name: string;
  role: CmsAdminRole;
  tokenVersion?: number;
  exp: number;
}

const PLACEHOLDER_SECRET = "generate-a-secure-secret-here";

export function getCmsAuthSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret === PLACEHOLDER_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SECURITY ERROR: AUTH_SECRET must be set to a strong non-placeholder value in production."
      );
    }
    return "dev-only-bitgard-cms-session-secret-change-me";
  }
  return secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

export async function signCmsSessionToken(
  user: Omit<CmsSessionPayload, "exp">,
  ttlSeconds: number = CMS_SESSION_TTL_SECONDS
): Promise<string> {
  const payload: CmsSessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encodedPayload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importHmacKey(getCmsAuthSecret(), "sign");
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload)
  );
  return `${encodedPayload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifyCmsSessionToken(
  token?: string | null
): Promise<CmsSessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, encodedSig] = parts;
  if (!encodedPayload || !encodedSig) return null;

  try {
    const key = await importHmacKey(getCmsAuthSecret(), "verify");
    const sigBytes = base64UrlToBytes(encodedSig);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(encodedPayload)
    );
    if (!valid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToBytes(encodedPayload));
    const parsed = JSON.parse(payloadJson) as CmsSessionPayload;
    if (
      !parsed?.id ||
      !parsed?.email ||
      !parsed?.role ||
      !Number.isFinite(parsed.exp) ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
