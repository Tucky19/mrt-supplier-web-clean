type CampaignField = 'campaign_source' | 'campaign_medium' | 'campaign_name' | 'campaign_content' | 'campaign_id';
type Campaign = Partial<Record<CampaignField, string>>;
type PageContext = { page_location: string; page_referrer: string; page_title: string };
type ContextRuntime = {
  campaign: Campaign;
  page: PageContext;
  update: (url: string, referrer: string) => PageContext;
};

declare global {
  interface Window { __mrtGAContext?: ContextRuntime }
}

// Self-contained functions also run in the pre-tag inline bootstrap below.
export function safeGooglePageUrl(value: string, origin: string): string {
  if (!value) return '';
  try {
    const url = new URL(value, origin);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
    if (url.origin !== origin) return url.origin;
    const segments = url.pathname.split('/').filter(Boolean);
    const locale = segments[0] === 'en' ? 'en' : 'th';
    const section = ['products', 'quote', 'cross-reference', 'applications', 'brands', 'search'].includes(segments[1] ?? '') ? segments[1] : '';
    return `${url.origin}/${locale}${section ? `/${section}` : ''}`;
  } catch { return ''; }
}

export function readLandingCampaign(value: string, origin: string): Campaign {
  const result: Campaign = {};
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin) return result;
    const mapping: Array<[string, CampaignField]> = [
      ['utm_source', 'campaign_source'], ['utm_medium', 'campaign_medium'],
      ['utm_campaign', 'campaign_name'], ['utm_content', 'campaign_content'], ['utm_id', 'campaign_id'],
    ];
    for (const [key, field] of mapping) {
      const values = url.searchParams.getAll(key);
      if (values.length !== 1 || /[\x00-\x1f\x7f]/.test(values[0])) continue;
      const text = values[0].trim();
      if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(text)) continue;
      if (/^[\d_-]{7,}$/.test(text) || /^(?:bearer|password|secret|token|credential|authorization)(?:_|-|$)/i.test(text)) continue;
      result[field] = text;
    }
  } catch { /* Invalid fields are omitted; never log raw/rejected values. */ }
  return result;
}

function initializeGoogleContext(
  sanitize: typeof safeGooglePageUrl,
  campaignFrom: typeof readLandingCampaign,
) {
  if (window.__mrtGAContext) return;
  window.dataLayer ??= [];
  window.gtag ??= function (...args: unknown[]) { window.dataLayer!.push(args); };
  const origin = window.location.origin;
  const runtime: ContextRuntime = {
    campaign: campaignFrom(window.location.href, origin),
    page: { page_location: '', page_referrer: '', page_title: '' },
    update(url, referrer) {
      const page_location = sanitize(url, origin);
      runtime.page = { page_location, page_referrer: sanitize(referrer, origin),
        page_title: page_location ? new URL(page_location).pathname : '' };
      window.gtag!('set', runtime.page);
      return runtime.page;
    },
  };
  window.__mrtGAContext = runtime;
  runtime.update(window.location.href, document.referrer);
  // Landing-only campaign configuration; internal URL changes cannot overwrite it.
  if (Object.keys(runtime.campaign).length) window.gtag('set', runtime.campaign);
}

export function updateGooglePageContext(url: string, referrer: string): PageContext {
  initializeGoogleContext(safeGooglePageUrl, readLandingCampaign);
  return window.__mrtGAContext!.update(url, referrer);
}

// Only static, self-contained function source is embedded. No URL/user value is interpolated.
export function googleContextBootstrapScript(): string {
  return `;(${initializeGoogleContext.toString()})(${safeGooglePageUrl.toString()},${readLandingCampaign.toString()});`;
}
