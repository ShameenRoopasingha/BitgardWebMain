import crypto from "crypto";
import { timingSafeEqualStrings } from "./vigil-sync";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const BACKUP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TOTP_STEP_SECONDS = 30;
const TOTP_DIGITS = 6;
const MFA_CHALLENGE_TTL_SECONDS = 5 * 60;

function getBitgardMfaSecretKey(): Buffer {
  const raw =
    process.env.MFA_ENCRYPTION_KEY?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.BITGARD_SYNC_SECRET?.trim();

  if (!raw || raw === "generate-a-secure-secret-here" || raw.includes("replace-with")) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SECURITY ERROR: MFA_ENCRYPTION_KEY or AUTH_SECRET must be set in production."
      );
    }
    return crypto
      .createHash("sha256")
      .update("dev-only-bitgard-cms-mfa-secret-change-me", "utf8")
      .digest();
  }

  return crypto.createHash("sha256").update(raw, "utf8").digest();
}

export function hashMfaOpaqueToken(raw: string): string {
  return crypto.createHash("sha256").update(raw.trim(), "utf8").digest("hex");
}

export function encodeBase32(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

export function decodeBase32(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[\s=-]+/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];

  for (const char of clean) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) {
      throw new Error("Invalid Base32 MFA secret");
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(out);
}

export function generateTotpSecret(byteLength = 20): string {
  return encodeBase32(crypto.randomBytes(byteLength));
}

export function generateTotpTokenForStep(secretBytes: Buffer, counter: number): string {
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  counterBuf.writeUInt32BE(counter >>> 0, 4);

  const hmac = crypto.createHmac("sha1", secretBytes).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const mod = 10 ** TOTP_DIGITS;
  return String(binary % mod).padStart(TOTP_DIGITS, "0");
}

export function verifyTotpCode(
  base32Secret: string,
  rawCode: string,
  nowMs: number = Date.now(),
  windowSteps = 1
): boolean {
  const cleanCode = rawCode.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  let secretBytes: Buffer;
  try {
    secretBytes = decodeBase32(base32Secret);
  } catch {
    return false;
  }

  const currentCounter = Math.floor(nowMs / 1000 / TOTP_STEP_SECONDS);
  let matched = false;

  for (let offset = -windowSteps; offset <= windowSteps; offset += 1) {
    const expected = generateTotpTokenForStep(secretBytes, currentCounter + offset);
    if (timingSafeEqualStrings(cleanCode, expected)) {
      matched = true;
    }
  }

  return matched;
}

export function buildOtpAuthUri(params: {
  issuer: string;
  accountEmail: string;
  secret: string;
}): string {
  const label = `${encodeURIComponent(params.issuer)}:${encodeURIComponent(params.accountEmail)}`;
  const qs = new URLSearchParams({
    secret: params.secret,
    issuer: params.issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${qs.toString()}`;
}

export function encryptMfaSecret(plainSecret: string): string {
  const key = getBitgardMfaSecretKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainSecret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptMfaSecret(storedValue: string): string {
  if (!storedValue.startsWith("v1:")) {
    throw new Error("Unsupported encrypted MFA secret format");
  }
  const parts = storedValue.split(":");
  if (parts.length !== 4) {
    throw new Error("Malformed encrypted MFA secret");
  }
  const [, ivHex, tagHex, cipherHex] = parts;
  const key = getBitgardMfaSecretKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherHex, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function generateBackupCodes(count = 8): {
  plainCodes: string[];
  hashedCodes: string[];
} {
  const plainCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < count; i += 1) {
    let raw = "";
    for (let j = 0; j < 8; j += 1) {
      raw += BACKUP_ALPHABET[crypto.randomInt(0, BACKUP_ALPHABET.length)];
    }
    plainCodes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`);
    hashedCodes.push(hashMfaOpaqueToken(raw));
  }

  return { plainCodes, hashedCodes };
}

export function verifyAndConsumeBackupCode(
  storedHashes: string[],
  rawCode: string
): { matched: boolean; remainingHashes: string[] } {
  const normalized = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized.length < 6) {
    return { matched: false, remainingHashes: storedHashes };
  }
  const candidateHash = hashMfaOpaqueToken(normalized);
  const idx = storedHashes.findIndex((h) => timingSafeEqualStrings(h, candidateHash));
  if (idx === -1) {
    return { matched: false, remainingHashes: storedHashes };
  }
  return {
    matched: true,
    remainingHashes: storedHashes.filter((_, i) => i !== idx),
  };
}

export function verifyMfaChallengeAgainstRecord(params: {
  encryptedSecret: string | null;
  backupHashes: string[];
  code: string;
}):
  | { valid: true; usedBackupCode: boolean; remainingHashes: string[] }
  | { valid: false; usedBackupCode: false; remainingHashes: string[] } {
  const clean = params.code.trim();
  if (!clean) {
    return { valid: false, usedBackupCode: false, remainingHashes: params.backupHashes };
  }

  if (params.encryptedSecret && /^\d{6}$/.test(clean.replace(/\s+/g, ""))) {
    try {
      const secret = decryptMfaSecret(params.encryptedSecret);
      if (verifyTotpCode(secret, clean)) {
        return { valid: true, usedBackupCode: false, remainingHashes: params.backupHashes };
      }
    } catch {
      // Fall through to backup code check
    }
  }

  const backupRes = verifyAndConsumeBackupCode(params.backupHashes, clean);
  if (backupRes.matched) {
    return {
      valid: true,
      usedBackupCode: true,
      remainingHashes: backupRes.remainingHashes,
    };
  }

  return { valid: false, usedBackupCode: false, remainingHashes: params.backupHashes };
}

export interface CmsMfaChallengePayload {
  id: string;
  email: string;
  purpose: "cms_mfa_challenge";
  nonce: string;
  exp: number;
}

export function signCmsMfaChallengeToken(params: {
  id: string;
  email: string;
  ttlSeconds?: number;
}): string {
  const key = getBitgardMfaSecretKey();
  const payload: CmsMfaChallengePayload = {
    id: params.id,
    email: params.email,
    purpose: "cms_mfa_challenge",
    nonce: crypto.randomBytes(12).toString("hex"),
    exp: Math.floor(Date.now() / 1000) + (params.ttlSeconds ?? MFA_CHALLENGE_TTL_SECONDS),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", key)
    .update(encodedPayload, "utf8")
    .digest("base64url");
  return `${encodedPayload}.${sig}`;
}

export function verifyCmsMfaChallengeToken(token: string): CmsMfaChallengePayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  try {
    const key = getBitgardMfaSecretKey();
    const expectedSig = crypto
      .createHmac("sha256", key)
      .update(encodedPayload, "utf8")
      .digest("base64url");

    if (!timingSafeEqualStrings(expectedSig, providedSig)) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as CmsMfaChallengePayload;

    if (
      !decoded?.id ||
      !decoded?.email ||
      decoded.purpose !== "cms_mfa_challenge" ||
      !decoded.nonce ||
      typeof decoded.exp !== "number" ||
      decoded.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
