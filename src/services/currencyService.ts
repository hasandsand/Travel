export interface LiveExchangeRates {
  base: string;
  sarToIdr: number;
  usdToIdr: number;
  tryToIdr: number;
  lastUpdatedUtc: string;
  lastUpdatedLocal: string;
  provider: string;
  isLive: boolean;
}

const STORAGE_KEY = 'umrah_live_exchange_rates';
const DEFAULT_SAR_IDR = 4300;

export async function fetchLiveExchangeRates(): Promise<LiveExchangeRates> {
  // Primary API: Open ExchangeRate API (Free, high uptime, CORS enabled)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/SAR', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    if (data && data.result === 'success' && data.rates && data.rates.IDR) {
      const sarToIdr = Number(data.rates.IDR);
      const usdRate = data.rates.USD || 0.266;
      const tryRate = data.rates.TRY || 9.5;
      
      const payload: LiveExchangeRates = {
        base: 'SAR',
        sarToIdr: Math.round(sarToIdr),
        usdToIdr: Math.round(sarToIdr / usdRate),
        tryToIdr: Math.round(sarToIdr / tryRate),
        lastUpdatedUtc: data.time_last_update_utc || new Date().toUTCString(),
        lastUpdatedLocal: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        provider: 'Open Exchange Rates Financial API',
        isLive: true
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage quota
      }

      return payload;
    }
  } catch (err) {
    console.warn('Primary exchange rate API failed, trying fallback...', err);
  }

  // Fallback API: ExchangeRate-API v4
  try {
    const fallbackRes = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      if (fbData && fbData.rates && fbData.rates.IDR) {
        const sarToIdr = Math.round(Number(fbData.rates.IDR));
        const payload: LiveExchangeRates = {
          base: 'SAR',
          sarToIdr,
          usdToIdr: Math.round(sarToIdr / (fbData.rates.USD || 0.266)),
          tryToIdr: Math.round(sarToIdr / (fbData.rates.TRY || 9.5)),
          lastUpdatedUtc: fbData.date || new Date().toISOString(),
          lastUpdatedLocal: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          provider: 'ExchangeRate-API v4',
          isLive: true
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // ignore
        }
        return payload;
      }
    }
  } catch (fallbackErr) {
    console.warn('Fallback currency API also failed', fallbackErr);
  }

  // Cached fallback
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isLive: false };
    }
  } catch {
    // ignore
  }

  // Hard fallback default
  return {
    base: 'SAR',
    sarToIdr: DEFAULT_SAR_IDR,
    usdToIdr: 16200,
    tryToIdr: 450,
    lastUpdatedUtc: new Date().toUTCString(),
    lastUpdatedLocal: 'Estimasi Pasar',
    provider: 'Bank Indonesia & SAMA Benchmark',
    isLive: false
  };
}
