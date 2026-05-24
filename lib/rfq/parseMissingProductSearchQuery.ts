type DimensionPrefill = {
  outerDiameter: string;
  innerDiameter: string;
  lengthHeight: string;
  threadSize: string;
};

const EMPTY_PREFILL: DimensionPrefill = {
  outerDiameter: "",
  innerDiameter: "",
  lengthHeight: "",
  threadSize: "",
};

function cleanCapturedValue(value: string) {
  return value.replace(/\s+/g, " ").trim().replace(/[.,;:]+$/, "");
}

function extractDimension(
  query: string,
  patterns: RegExp[],
) {
  for (const pattern of patterns) {
    const match = query.match(pattern);
    const value = match?.[1]?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

function extractThreadSize(query: string) {
  const keywordMatch = query.match(
    /\b(?:thread|thd|thread size|threadsize|เกลียว)\b/i,
  );

  if (!keywordMatch || keywordMatch.index === undefined) {
    return "";
  }

  const tail = query.slice(keywordMatch.index + keywordMatch[0].length);
  const boundaryMatch = tail.match(
    /(?=,|;|\||\b(?:od|o\/d|outer(?:\s+diameter|\s+dia)?|id|i\/d|inner(?:\s+diameter|\s+dia)?|length|len|height|h)\b)/i,
  );
  const candidate = cleanCapturedValue(
    boundaryMatch ? tail.slice(0, boundaryMatch.index) : tail,
  ).replace(/^[-:=\s]+/, "");

  if (!candidate) {
    return "";
  }

  if (!/\d/.test(candidate)) {
    return "";
  }

  if (!/[/-]/.test(candidate) && !/\b(?:m\d|npt|bsp|unf|unc|g)\b/i.test(candidate)) {
    return "";
  }

  return candidate;
}

export function parseMissingProductSearchQuery(query: string): DimensionPrefill {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return EMPTY_PREFILL;
  }

  return {
    outerDiameter: extractDimension(normalizedQuery, [
      /\b(?:od|o\/d|outer(?:\s+diameter|\s+dia)?)\b\s*[:=]?\s*(\d+(?:\.\d+)?)\b/i,
    ]),
    innerDiameter: extractDimension(normalizedQuery, [
      /\b(?:id|i\/d|inner(?:\s+diameter|\s+dia)?)\b\s*[:=]?\s*(\d+(?:\.\d+)?)\b/i,
    ]),
    lengthHeight: extractDimension(normalizedQuery, [
      /\b(?:length|len|l|height|h)\b\s*[:=]?\s*(\d+(?:\.\d+)?)\b/i,
    ]),
    threadSize: extractThreadSize(normalizedQuery),
  };
}

