import crypto from "crypto";

export type VigilTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
export type VigilBillingCycle = "MONTHLY" | "ANNUAL" | "LIFETIME";
export type VigilSubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "LIFETIME"
  | "PAST_DUE"
  | "EXPIRED"
  | "CANCELLED"
  | "REVOKED";
export type VigilLicenseSource = "DODO_PAYMENTS" | "MANUAL_ADMIN";

export interface VigilSyncPayload {
  deliveryId: string;
  eventType: string;
  email: string;
  companyName: string;
  tier: VigilTier;
  billingCycle: VigilBillingCycle;
  status: VigilSubscriptionStatus;
  source: VigilLicenseSource;
  isLifetime: boolean;
  licenseKey: string;
  bitgardSubscriptionId: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  note?: string | null;
  initialAdminPassword?: string;
}

export interface VigilSyncResult {
  synced: boolean;
  status: "SYNCED" | "FAILED" | "PENDING";
  deliveryId: string;
  error?: string;
}

const STANDARD_WEBHOOK_TOLERANCE_SECONDS = 300; // 5 minutes

export function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies a Standard Webhooks (Dodo Payments) request signature:
 * signed content `${webhookId}.${webhookTimestamp}.${rawBody}` with Base64-decoded `whsec_` key.
 */
export function verifyDodoWebhookSignature(
  rawBody: string,
  headers: {
    webhookId: string | null;
    webhookTimestamp: string | null;
    webhookSignature: string | null;
  },
  webhookSecret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): { valid: true } | { valid: false; reason: string } {
  const { webhookId, webhookTimestamp, webhookSignature } = headers;

  if (!webhookSecret) {
    return { valid: false, reason: "Webhook secret is not configured" };
  }

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return { valid: false, reason: "Missing required Standard Webhooks headers" };
  }

  const timestampNum = Number(webhookTimestamp);
  if (
    !Number.isInteger(timestampNum) ||
    Math.abs(nowSeconds - timestampNum) > STANDARD_WEBHOOK_TOLERANCE_SECONDS
  ) {
    return { valid: false, reason: "Webhook timestamp outside tolerance window" };
  }

  const cleanSecret = webhookSecret.startsWith("whsec_")
    ? webhookSecret.slice("whsec_".length)
    : webhookSecret;

  const keyBytes = Buffer.from(cleanSecret, "base64");
  if (keyBytes.length === 0) {
    return { valid: false, reason: "Invalid webhook secret format" };
  }

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expectedSig = crypto
    .createHmac("sha256", keyBytes)
    .update(signedContent, "utf8")
    .digest("base64");

  const candidates = webhookSignature.trim().split(/\s+/).filter(Boolean);
  for (const entry of candidates) {
    const commaIdx = entry.indexOf(",");
    if (commaIdx <= 0) continue;
    const version = entry.slice(0, commaIdx);
    const sig = entry.slice(commaIdx + 1);
    if (version === "v1" && timingSafeEqualStrings(expectedSig, sig)) {
      return { valid: true };
    }
  }

  return { valid: false, reason: "Invalid webhook signature" };
}

/**
 * Signs an outbound BitgardWeb -> Vigil sync request using HMAC-SHA256.
 */
export function signBitgardSyncPayload(
  rawBody: string,
  secret: string,
  deliveryId: string,
  timestampSeconds: number = Math.floor(Date.now() / 1000)
): {
  "x-bitgard-delivery-id": string;
  "x-bitgard-timestamp": string;
  "x-bitgard-signature": string;
} {
  const signedContent = `${timestampSeconds}.${deliveryId}.${rawBody}`;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(signedContent, "utf8")
    .digest("base64");

  return {
    "x-bitgard-delivery-id": deliveryId,
    "x-bitgard-timestamp": String(timestampSeconds),
    "x-bitgard-signature": `v1,${digest}`,
  };
}

export function generateVigilLicenseKey(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(16);
  const chars: string[] = [];
  for (let i = 0; i < 16; i += 1) {
    chars.push(alphabet[bytes[i] % alphabet.length]);
  }
  return `VGL-${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars
    .slice(8, 12)
    .join("")}-${chars.slice(12, 16).join("")}`;
}

export function mapPlanToTier(input?: string | null): VigilTier {
  const raw = (input || "").trim();
  const enterpriseIds = [
    process.env.DODO_PRODUCT_ID_ENTERPRISE,
    process.env.DODO_PRODUCT_ID_ENTERPRISE_MONTHLY,
    process.env.DODO_PRODUCT_ID_ENTERPRISE_ANNUAL,
  ]
    .map((v) => v?.trim())
    .filter(Boolean);
  if (raw && enterpriseIds.includes(raw)) return "ENTERPRISE";

  const proIds = [
    process.env.DODO_PRODUCT_ID_PROFESSIONAL,
    process.env.DODO_PRODUCT_ID_PROFESSIONAL_MONTHLY,
    process.env.DODO_PRODUCT_ID_PROFESSIONAL_ANNUAL,
  ]
    .map((v) => v?.trim())
    .filter(Boolean);
  if (raw && proIds.includes(raw)) return "PROFESSIONAL";

  const starterIds = [
    process.env.DODO_PRODUCT_ID_STARTER,
    process.env.DODO_PRODUCT_ID_STARTER_MONTHLY,
    process.env.DODO_PRODUCT_ID_STARTER_ANNUAL,
  ]
    .map((v) => v?.trim())
    .filter(Boolean);
  if (raw && starterIds.includes(raw)) return "STARTER";

  const normalized = raw.toLowerCase();
  if (normalized.includes("ent")) return "ENTERPRISE";
  if (normalized.includes("pro")) return "PROFESSIONAL";
  return "STARTER";
}

export function mapBillingCycle(input?: string | null): VigilBillingCycle {
  const raw = (input || "").trim();
  const annualIds = [
    process.env.DODO_PRODUCT_ID_STARTER_ANNUAL,
    process.env.DODO_PRODUCT_ID_PROFESSIONAL_ANNUAL,
    process.env.DODO_PRODUCT_ID_ENTERPRISE_ANNUAL,
  ]
    .map((v) => v?.trim())
    .filter(Boolean);
  if (raw && annualIds.includes(raw)) return "ANNUAL";

  const normalized = raw.toLowerCase();
  if (normalized.includes("life")) return "LIFETIME";
  if (normalized.includes("ann") || normalized.includes("year")) return "ANNUAL";
  return "MONTHLY";
}

export function computePeriodEnd(
  billingCycle: VigilBillingCycle,
  startDate: Date = new Date()
): Date | null {
  if (billingCycle === "LIFETIME") {
    return null;
  }
  const end = new Date(startDate);
  if (billingCycle === "ANNUAL") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

/**
 * Pushes a signed subscription / lifetime license update from BitgardWeb to Vigil.
 * Keeps the two Supabase databases completely isolated across TB-8.
 */
export async function pushSubscriptionSyncToVigil(
  payload: VigilSyncPayload
): Promise<VigilSyncResult> {
  const rawSyncUrl = process.env.VIGIL_SYNC_URL?.trim();
  const syncSecret = process.env.BITGARD_SYNC_SECRET?.trim();

  if (!rawSyncUrl) {
    return {
      synced: false,
      status: "PENDING",
      deliveryId: payload.deliveryId,
      error: "VIGIL_SYNC_URL is not configured",
    };
  }

  if (!syncSecret) {
    return {
      synced: false,
      status: "FAILED",
      deliveryId: payload.deliveryId,
      error: "BITGARD_SYNC_SECRET is not configured",
    };
  }

  const endpoint = rawSyncUrl.endsWith("/api/bitgard/subscription-sync")
    ? rawSyncUrl
    : `${rawSyncUrl.replace(/\/+$/, "")}/api/bitgard/subscription-sync`;

  const rawBody = JSON.stringify(payload);
  const headers = signBitgardSyncPayload(rawBody, syncSecret, payload.deliveryId);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: rawBody,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      return {
        synced: false,
        status: "FAILED",
        deliveryId: payload.deliveryId,
        error: `Vigil sync returned HTTP ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    return {
      synced: true,
      status: "SYNCED",
      deliveryId: payload.deliveryId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error during Vigil sync";
    return {
      synced: false,
      status: "FAILED",
      deliveryId: payload.deliveryId,
      error: message,
    };
  }
}
