import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const out = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    out[key] = val;
  }
  return out;
}

function isPlaceholder(val) {
  if (!val) return true;
  return /^(your-|replace-with|generate-a-secure|test_your_|whsec_your|pdt_vigil_|re_123|gsk_\.\.\.)/i.test(val) ||
    /(placeholder|example|TODO|_here$|-here$|sandbox)/i.test(val);
}

const targets = [
  {
    label: "@bitgard/cms",
    file: path.join(ROOT, "apps/cms/.env"),
    required: ["DATABASE_URL", "AUTH_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "VIGIL_SYNC_URL", "BITGARD_SYNC_SECRET"],
    optional: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  },
  {
    label: "@bitgard/web",
    file: path.join(ROOT, "apps/web/.env"),
    required: [
      "DATABASE_URL",
      "DODO_PAYMENTS_API_KEY",
      "DODO_PAYMENTS_WEBHOOK_KEY",
      "DODO_PRODUCT_ID_STARTER",
      "DODO_PRODUCT_ID_PROFESSIONAL",
      "DODO_PRODUCT_ID_ENTERPRISE",
      "CRON_SECRET",
      "REVALIDATION_SECRET",
      "VIGIL_SYNC_URL",
      "BITGARD_SYNC_SECRET",
    ],
    optional: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  },
  {
    label: "Vigil Tour Management Platform",
    file: path.resolve(ROOT, "../vigil/Vigil Tour Management Platform/.env"),
    required: ["DATABASE_URL", "NEXTAUTH_SECRET", "BITGARD_SYNC_SECRET", "DIAGNOSTIC_SECRET", "SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN"],
    optional: ["RESEND_API_KEY", "SMTP_HOST", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "BITGARD_SYNC_ALLOWED_IPS", "DIAGNOSTIC_ALLOWED_IPS"],
  },
];

let missingRequired = 0;

for (const target of targets) {
  const env = parseEnv(target.file);
  console.log(`\n[${target.label}] ${env ? target.file : "MISSING FILE"}`);
  if (!env) {
    missingRequired += target.required.length;
    continue;
  }

  for (const key of target.required) {
    const val = env[key];
    if (!val || isPlaceholder(val)) {
      missingRequired += 1;
      console.log(`  MISSING / PLACEHOLDER: ${key}`);
    } else {
      console.log(`  READY: ${key}`);
    }
  }

  for (const key of target.optional) {
    const val = env[key];
    const status = !val || isPlaceholder(val) ? "UNSET / PLACEHOLDER (optional)" : "READY";
    console.log(`  ${status}: ${key}`);
  }

  if (target.label === "Vigil Tour Management Platform") {
    const flag = env.ENABLE_SUBSCRIPTION_ENFORCEMENT ?? "unset";
    console.log(`  CUTOVER FLAG: ENABLE_SUBSCRIPTION_ENFORCEMENT=${flag}`);
  }
}

if (missingRequired > 0) {
  console.log(`\nCutover check incomplete: ${missingRequired} required key(s) still placeholder or missing.`);
  process.exit(1);
}

console.log("\nAll required production environment keys are populated.");
