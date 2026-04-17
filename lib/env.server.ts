type RequiredEnvKey =
  | "DATABASE_URL"
  | "ADMIN_BASIC_USER"
  | "ADMIN_BASIC_PASS";

type OptionalEnvKey =
  | "SITE_URL"
  | "SMTP_HOST"
  | "SMTP_PORT"
  | "SMTP_USER"
  | "SMTP_PASS"
  | "RFQ_TO_EMAIL"
  | "RFQ_FROM_EMAIL"
  | "NEXT_PUBLIC_GA4_ID";

const REQUIRED_KEYS: RequiredEnvKey[] = [
  "DATABASE_URL",
  "ADMIN_BASIC_USER",
  "ADMIN_BASIC_PASS",
];

const OPTIONAL_KEYS: OptionalEnvKey[] = [
  "SITE_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "RFQ_TO_EMAIL",
  "RFQ_FROM_EMAIL",
  "NEXT_PUBLIC_GA4_ID",
];

export function getRequiredEnv() {
  const missing: string[] = [];

  const env = REQUIRED_KEYS.reduce<Record<string, string>>((acc, key) => {
    const value = process.env[key]?.trim();

    if (!value) {
      missing.push(key);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return env as Record<RequiredEnvKey, string>;
}

export function getOptionalEnv() {
  return OPTIONAL_KEYS.reduce<Record<string, string | undefined>>((acc, key) => {
    const value = process.env[key]?.trim();
    acc[key] = value || undefined;
    return acc;
  }, {}) as Record<OptionalEnvKey, string | undefined>;
}

export function getEnvSummary() {
  const required = REQUIRED_KEYS.map((key) => ({
    key,
    present: Boolean(process.env[key]?.trim()),
  }));

  const optional = OPTIONAL_KEYS.map((key) => ({
    key,
    present: Boolean(process.env[key]?.trim()),
  }));

  return {
    required,
    optional,
  };
}