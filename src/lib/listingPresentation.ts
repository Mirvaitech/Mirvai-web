export interface UsdRate {
  ngnPerUsd: number;
  updatedAt: number;
  nextUpdateAt: number;
}

export interface UsdRateState {
  rate: UsdRate | null;
  loading: boolean;
}

export const MAX_RATE_AGE_MS = 48 * 60 * 60 * 1000;

// Exchange Rate API's published USD/NGN rate on 27 November 2026.
// Used only while recent, and replaced automatically by the daily feed.
export const REFERENCE_USD_RATE: UsdRate = {
  ngnPerUsd: 1365.956597,
  updatedAt: 1795737751000,
  nextUpdateAt: 1795825901000,
};

export function isUsableUsdRate(value: unknown, now = Date.now()): value is UsdRate {
  if (!value || typeof value !== 'object') return false;
  const rate = value as Partial<UsdRate>;
  return (
    typeof rate.ngnPerUsd === 'number' && Number.isFinite(rate.ngnPerUsd) && rate.ngnPerUsd > 0 &&
    typeof rate.updatedAt === 'number' && Number.isFinite(rate.updatedAt) && rate.updatedAt > 0 &&
    rate.updatedAt <= now + 5 * 60 * 1000 && now - rate.updatedAt <= MAX_RATE_AGE_MS &&
    typeof rate.nextUpdateAt === 'number' && Number.isFinite(rate.nextUpdateAt) &&
    rate.nextUpdateAt > rate.updatedAt
  );
}

export function parseUsdRateResponse(value: unknown, now = Date.now()): UsdRate | null {
  if (!value || typeof value !== 'object') return null;
  const response = value as {
    result?: unknown;
    base_code?: unknown;
    rates?: { NGN?: unknown };
    time_last_update_unix?: unknown;
    time_next_update_unix?: unknown;
  };
  if (response.result !== 'success' || response.base_code !== 'USD') return null;
  const rate = {
    ngnPerUsd: Number(response.rates?.NGN),
    updatedAt: Number(response.time_last_update_unix) * 1000,
    nextUpdateAt: Number(response.time_next_update_unix) * 1000,
  };
  return isUsableUsdRate(rate, now) ? rate : null;
}

const wordsToBeds: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

export function shortPropertyTitle(item: { name: string; type: string; beds?: number }): string {
  const match = item.name.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*[-‑]?\s*bed(?:room)?s?\b/i);
  const fromName = match ? (wordsToBeds[match[1].toLowerCase()] || Number(match[1])) : 0;
  const beds = Number.isInteger(item.beds) && (item.beds ?? 0) > 0 ? item.beds : fromName;
  if (!beds) return item.name;

  const text = `${item.type} ${item.name}`.toLowerCase().replace(/_/g, ' ');
  let type = '';
  if (/\bsemi(?:[\s-]*detached)?\b/.test(text)) type = 'Semi-detached';
  else if (/\bdetached\b/.test(text)) type = 'Detached';
  else if (/\bterrace(?:d)?\b/.test(text)) type = 'Terrace';
  else if (/\b(?:apartment|flat)\b/.test(text)) type = 'Apartment';
  else if (/\boff[\s-]*plan\b/.test(text)) type = 'Off-plan property';
  if (!type) return item.name;

  const duplex = /\bduplex\b/.test(text) && /^(Semi-detached|Detached|Terrace)$/.test(type);
  return `${beds}-Bedroom ${type}${duplex ? ' Duplex' : ''}`;
}

export function listingPricePair(
  amount: number,
  currency: 'NGN' | 'USD' | undefined,
  state: UsdRateState
): { naira: string; dollars: string } {
  if (!Number.isFinite(amount) || amount < 0) {
    return { naira: 'Price on request', dollars: '' };
  }
  const ngn = (n: number) => '₦' + new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(n);
  const usd = (n: number) => '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
  const rate = state.rate?.ngnPerUsd;
  const validRate = typeof rate === 'number' && Number.isFinite(rate) && rate > 0;

  if (currency === 'USD') {
    return {
      naira: validRate ? `Approx. ${ngn(amount * rate)}` : state.loading ? 'Naira estimate loading…' : 'Naira estimate unavailable',
      dollars: usd(amount),
    };
  }
  return {
    naira: ngn(amount),
    dollars: validRate ? `Approx. ${usd(amount / rate)}` : state.loading ? 'USD estimate loading…' : 'USD estimate unavailable',
  };
}
