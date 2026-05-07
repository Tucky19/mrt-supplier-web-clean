const PLACEHOLDER_IMAGE_URL = "/images/placeholder.jpg";

const PRODUCT_IMAGE_FILES = {
  donaldson: [
    "ntn-6205zz.jpg",
    "p550008.jpg",
    "p550012.jpg",
    "p550020.jpg",
    "p550057.jpg",
    "p550065.jpg",
    "p550084.jpg",
    "p550086.jpg",
    "p550105.jpg",
    "p550132.jpg",
    "p550148.jpg",
    "p550162.jpg",
    "p550222.jpg",
    "p550223.jpg",
    "p550335.jpg",
    "p550425.jpg",
    "p550440.jpg",
    "p550576.jpg",
    "p550596.jpg",
    "p550639.jpg",
    "p550708.jpg",
    "p550719.jpg",
    "p550762.jpg",
    "p550769.jpg",
    "p550777.jpg",
    "p550779.jpg",
    "p550820.jpg",
    "p550848.jpg",
    "p550861.jpg",
    "p550881.jpg",
    "p550903.jpg",
    "p550904.jpg",
    "p550920.jpg",
    "p550928.jpg",
    "p551102.jpg",
    "p551315.jpg",
    "P553004.jpg",
    "p553191.jpg",
    "p554620.jpg",
    "p554685.jpg",
    "p555461.jpg",
    "P558615.jpg",
    "p559000.jpg",
    "P777868.jpg",
    "p777869.jpg",
    "p164166.jpg",
    "p500202.jpg",
    "p550226.jpg",
    "p550227.jpg",
    "p550268.jpg",
    "p550318.jpg",
    "p550365.jpg",
    "p550367.jpg",
    "p550372.jpg",
    "p550382.jpg",
    "p550408.jpg",
    "p550428.jpg",
    "p550445.jpg",
    "p550467.jpg",
    "p550478.jpg",
    "p550519.jpg",
    "p550595.jpg",
    "p550335.jpg",
    "p550035.jpg",
    "c1633-1.jpg",
    "p500194.jpg",
    "p500195.jpg",
    "p500196.jpg",
    "p823295.jpg",
    "p181049.jpg",
    "p182049.jpg",
    "p116446.jpg",
    "p181042.jpg",
    "p128408.jpg",
    "p532503.jpg",
    "p532504.jpg",
    "p550880.jpg",
    "p559740.jpg",
    "p550035.jpg",
    "p550057.jpg",
    "p550065.jpg",
    "p550105.jpg",
    "p550132.jpg",
    "p550148.jpg",  
    "p128408.jpg",
    "p551670.jpg",
    "p782105.jpg",
    "p782108.jpg",
    "p557440.jpg",
    "p551425.jpg",
    "p553000.jpg"
  ],




} as const;

function normalizeKey(value?: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "");
}

function getKnownImagePath(brand?: string, partNo?: string) {
  const brandKey = String(brand ?? "").trim().toLowerCase();
  const files =
    PRODUCT_IMAGE_FILES[brandKey as keyof typeof PRODUCT_IMAGE_FILES] ?? [];

  if (!files.length || !partNo) return null;

  const target = normalizeKey(partNo);
  const matchedFile = files.find((file) => normalizeKey(file) === target);

  if (!matchedFile) return null;

  return `/images/products/${brandKey}/${matchedFile}`;
}

function normalizePreferredProductImagePath(path: string) {
  const match = path.match(/^\/images\/products\/([^/]+)\/([^/]+)$/i);
  if (!match) return null;

  const [, brand, fileName] = match;
  return getKnownImagePath(brand, fileName);
}

export function getProductImageUrl(
  brand?: string,
  partNo?: string,
  preferredUrl?: string
) {
  if (preferredUrl) {
    if (
      preferredUrl.startsWith("http://") ||
      preferredUrl.startsWith("https://")
    ) {
      return preferredUrl;
    }

    const normalizedPreferred = normalizePreferredProductImagePath(preferredUrl);
    if (normalizedPreferred) {
      return normalizedPreferred;
    }

    if (preferredUrl.startsWith("/")) {
      return preferredUrl;
    }
  }

  const knownImagePath = getKnownImagePath(brand, partNo);
  if (knownImagePath) {
    return knownImagePath;
  }

  return PLACEHOLDER_IMAGE_URL;
}

export function getOfficialImageUrl(partNo: string) {
  return `https://cdn.donaldson.com/images/${partNo}.jpg`;
}
