const REQUIRED = [
  "DATABASE_URL",
  "ADMIN_BASIC_USER",
  "ADMIN_BASIC_PASS",
];

const OPTIONAL = [
  "DIRECT_URL",
  "SITE_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "RFQ_TO_EMAIL",
  "RFQ_CC_EMAIL",
  "RFQ_FROM_EMAIL",
  "LINE_CHANNEL_ACCESS_TOKEN",
  "LINE_TARGET_USER_ID",
  "RFQ_DEV_MOCK_BYPASS",
  "NEXT_PUBLIC_GA4_ID",
];

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function checkKey(key) {
  return Boolean(process.env[key] && String(process.env[key]).trim());
}

let hasError = false;

printSection("Required Environment Variables");
for (const key of REQUIRED) {
  const ok = checkKey(key);
  console.log(`${ok ? "✅" : "❌"} ${key}`);
  if (!ok) hasError = true;
}

printSection("Optional Environment Variables");
for (const key of OPTIONAL) {
  const ok = checkKey(key);
  console.log(`${ok ? "✅" : "⚪"} ${key}`);
}

if (hasError) {
  console.error("\nEnvironment check failed.");
  process.exit(1);
}

console.log("\nEnvironment check passed.");
