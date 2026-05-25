const COMMON_THREAD_SIZE_OPTIONS = [
  "M14 x 1.5",
  "M16 x 1.5",
  "M18 x 1.5",
  "M20 x 1.5",
  "M22 x 1.5",
  "M24 x 1.5",
  "3/4-16 UN",
  "7/8-14 UN",
  "1-12 UN",
  "1-14 UN",
  "13/16-16 UN",
] as const;

const FUEL_THREAD_SIZE_OPTIONS = [
  "M14 x 1.5",
  "M16 x 1.5",
  "M18 x 1.5",
  "M20 x 1.5",
  "M22 x 1.5",
  "M22 x 1.5 6H",
  "M24 x 1.5",
  "3/4-16 UN",
  "3/4-20 UN",
  "7/8-14 UN",
  "7/8-16 UN",
  "1-12 UN",
  "1-14 UN",
  "1 1/8-12 UN",
  "1 1/8-16 UN",
  "1 1/4-12 UN",
  "1 3/8-16 UN",
  "13/16-12 UN",
  "13/16-16 UN",
  "13/16-18 UN",
  "15/16-16 UN",
  "5/8-11 UN",
  "3/8-24 UN",
] as const;

const HYDRAULIC_THREAD_SIZE_OPTIONS = [
  ".97-20",
  "3/4-16 UN",
  "7/8-14 UN",
  "1-12 UN",
  "1-14 UN",
  "1-16 UN",
  "1 1/8-16 UN",
  "1 1/4-11 UN",
  "1 1/4-12 UN",
  "1 3/8-12 UN",
  "1 1/2-16 UN",
  "1 5/16-12 UN",
  "1 7/8-12 UN",
  "1 7/8-16 UN",
  "2-12 UN",
  "2-16 UN",
  "3-8 UN",
  "13/16-16 UN",
  "M42 x 2-6H",
  "1 1/2 BSP",
  "1 NPT",
  "1/2 NPT",
  "3/4 NPT",
  "1 1/4 NPT",
  "1 1/2 NPT",
  "2 NPT",
  "3 NPT",
  ".71-18",
] as const;

const LUBE_OIL_THREAD_SIZE_OPTIONS = [
  "3/4-16 UN",
  "3/4-20 UN",
  "5/8-18 UN",
  "7/8-14 UN",
  "7/8-16 UN",
  "1-12 UN",
  "1-16 UN",
  "1 1/8-15 UN",
  "1 1/8-16 UN",
  "1 1/2-12 UN",
  "1 1/2-15 UN",
  "1 1/2-16 UN",
  "1 5/8-12 UN",
  "1 3/8-16 UN",
  "13/16-16 UN",
  "13/16-18 UN",
  "2 1/4-12 UN",
  "2 1/4-16 UN",
  "M18 x 1.5",
  "M20 x 1.5",
  "M20 x 1.5-6H",
  "M22 x 1.5",
  "M24 x 1.5",
  "M25 x 1.5",
  "M26 x 1.5",
  "M30 x 1.5-6H",
  "M30 x 2",
  "M32 x 1.5",
  "M36 x 1.5",
  "M60 x 3",
  "M95 x 2.5",
  "M95 x 2.5-6H",
  "2.75 x 5.5",
  "0.59",
  "1.44",
] as const;

const SEPARATOR_THREAD_SIZE_OPTIONS = [
  "M16 x 1.5",
  "M18 x 1.5",
  "M20 x 1.5",
  "M22 x 1.5",
  "M24 x 1.5",
  "M30 x 1.5",
  "M30 x 2",
  "M33 x 2",
  "M36 x 1.5",
  "M36 x 2",
  "3/4-16 UN",
  "7/8-14 UN",
  "1-12 UN",
  "1-14 UN",
  "1 1/8-16 UN",
  "1 1/4-12 UN",
  "1 3/8-16 UN",
  "13/16-16 UN",
  "13/16-18 UN",
  "1 NPT",
  "3/4 NPT",
] as const;

function dedupeOptions(options: readonly string[]) {
  return [...new Set(options.map((option) => option.trim()).filter(Boolean))];
}

export function getThreadSizeOptions(filterType: string) {
  const normalizedFilterType = filterType.trim().toLowerCase();
  const commonOptions = dedupeOptions(COMMON_THREAD_SIZE_OPTIONS);
  const recommendedOptions = getRecommendedThreadSizeOptions(filterType);

  if (recommendedOptions.length > 0) {
    return recommendedOptions;
  }

  if (
    !normalizedFilterType ||
    normalizedFilterType === "not_sure" ||
    normalizedFilterType === "other"
  ) {
    return commonOptions;
  }

  return commonOptions;
}

export function getFuelThreadSizeOptions() {
  return dedupeOptions(FUEL_THREAD_SIZE_OPTIONS);
}

export function getHydraulicThreadSizeOptions() {
  return dedupeOptions(HYDRAULIC_THREAD_SIZE_OPTIONS);
}

export function getLubeOilThreadSizeOptions() {
  return dedupeOptions(LUBE_OIL_THREAD_SIZE_OPTIONS);
}

export function getSeparatorThreadSizeOptions() {
  return dedupeOptions(SEPARATOR_THREAD_SIZE_OPTIONS);
}

export function getRecommendedThreadSizeOptions(filterType: string) {
  const normalizedFilterType = filterType.trim().toLowerCase();

  if (
    normalizedFilterType === "fuel_filter" ||
    normalizedFilterType === "fuel_water_separator"
  ) {
    return getFuelThreadSizeOptions();
  }

  if (normalizedFilterType === "hydraulic_filter") {
    return getHydraulicThreadSizeOptions();
  }

  if (
    normalizedFilterType === "lube_filter" ||
    normalizedFilterType === "oil_filter"
  ) {
    return getLubeOilThreadSizeOptions();
  }

  if (
    normalizedFilterType === "separator" ||
    normalizedFilterType === "oil_separator" ||
    normalizedFilterType === "air_oil_separator"
  ) {
    return getSeparatorThreadSizeOptions();
  }

  return [];
}
