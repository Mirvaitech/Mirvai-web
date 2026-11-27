import { useEffect, useState } from 'react';
import {
  isUsableUsdRate,
  parseUsdRateResponse,
  REFERENCE_USD_RATE,
} from '../lib/listingPresentation';
import type { UsdRate, UsdRateState } from '../lib/listingPresentation';

const RATE_URL = 'https://open.er-api.com/v6/latest/USD';
const STORAGE_KEY = 'mirvai-usd-ngn-rate-v1';
const RETRY_MS = 60 * 60 * 1000;

function bestAvailableRate(): UsdRate | null {
  let cached: unknown = null;
  try {
    cached = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    // Storage may be unavailable in private browsing.
  }
  const rates = [cached, REFERENCE_USD_RATE].filter((rate): rate is UsdRate => isUsableUsdRate(rate));
  return rates.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
}

export function useUsdRate(enabled: boolean): UsdRateState {
  const [state, setState] = useState<UsdRateState>(() => {
    const rate = bestAvailableRate();
    return { rate, loading: !rate };
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let nextTimer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    const schedule = (delay: number) => {
      nextTimer = setTimeout(refresh, Math.max(60_000, Math.min(delay, 24 * RETRY_MS)));
    };

    const refresh = async () => {
      const available = bestAvailableRate();
      if (available && available.nextUpdateAt > Date.now()) {
        if (!cancelled) setState({ rate: available, loading: false });
        schedule(available.nextUpdateAt - Date.now() + 60_000);
        return;
      }

      if (!available && !cancelled) setState({ rate: null, loading: true });
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 8000);
      try {
        const response = await fetch(RATE_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Exchange rate unavailable');
        const rate = parseUsdRateResponse(await response.json());
        if (!rate) throw new Error('Invalid or outdated exchange rate');
        if (cancelled) return;
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rate));
        } catch {
          // The current session can still use the rate without storage.
        }
        setState({ rate, loading: false });
        schedule(Math.max(RETRY_MS, rate.nextUpdateAt - Date.now() + 60_000));
      } catch {
        if (cancelled) return;
        setState({ rate: bestAvailableRate(), loading: false });
        schedule(RETRY_MS);
      } finally {
        clearTimeout(timeout);
      }
    };

    void refresh();
    return () => {
      cancelled = true;
      if (nextTimer) clearTimeout(nextTimer);
      controller?.abort();
    };
  }, [enabled]);

  return state;
}
