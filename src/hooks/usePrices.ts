"use client";

import { useState, useEffect, useCallback } from "react";
import type { PriceItem } from "@/types";
import { PRICE_UPDATE_INTERVAL } from "@/lib/constants";

export function usePrices(category?: string) {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const url = category
        ? `/api/prices?category=${category}`
        : "/api/prices";
      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت قیمت‌ها");
      const data = await res.json();
      setPrices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, PRICE_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}

export function usePrice(slug: string) {
  const [price, setPrice] = useState<PriceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(`/api/prices/${slug}`);
      if (!res.ok) throw new Error("خطا در دریافت قیمت");
      const data = await res.json();
      setPrice(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, PRICE_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return { price, loading, error, refetch: fetchPrice };
}
