import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext();

const FALLBACK_RATE = 170; // ETB per 1 USD
const CACHE_KEY = 'anditours_etb_rate';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

function getCachedRate() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rate, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return rate;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function setCachedRate(rate) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [etbRate, setEtbRate] = useState(getCachedRate() || FALLBACK_RATE);

  useEffect(() => {
    // Try to fetch live rate from a free API
    const fetchRate = async () => {
      try {
        const res = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        if (!res.ok) throw new Error('Rate API error');
        const data = await res.json();
        const rate = data.rates?.ETB;
        if (rate && typeof rate === 'number') {
          setEtbRate(rate);
          setCachedRate(rate);
        }
      } catch {
        // Use cached or fallback
        const cached = getCachedRate();
        setEtbRate(cached || FALLBACK_RATE);
      }
    };

    fetchRate();
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === 'USD' ? 'ETB' : 'USD'));
  }, []);

  const formatPrice = useCallback(
    (priceUSD) => {
      const num = Number(priceUSD);
      if (isNaN(num)) return priceUSD;

      if (currency === 'USD') {
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }
      const etb = Math.round(num * etbRate);
      return `Br ${etb.toLocaleString('en-US')}`;
    },
    [currency, etbRate]
  );

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, etbRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export default CurrencyContext;
