// External price API integration — Navasan
// Single API call fetches ALL prices (currency, gold, coin, crypto)

const NAVASAN_BASE = "http://api.navasan.tech/latest/";
const NAVASAN_KEY = process.env.NAVASAN_API_KEY || "";

interface NavasanRate {
  value: string;
  change: number | string;
  timestamp: number;
  date: string;
}

export interface PriceUpdate {
  slug: string;
  name: string;
  nameEn: string;
  category: "currency" | "gold" | "coin" | "crypto";
  currentPrice: number;
  changeAmount: number;
  changePercent: number;
  high24h: number;
  low24h: number;
}

// ── Key mappings: Navasan API key → our slug/name ──

const CURRENCY_MAP: Record<string, { slug: string; name: string; nameEn: string }> = {
  usd:  { slug: "usd", name: "دلار آمریکا", nameEn: "US Dollar" },
  eur:  { slug: "eur", name: "یورو", nameEn: "Euro" },
  gbp:  { slug: "gbp", name: "پوند انگلیس", nameEn: "British Pound" },
  aed:  { slug: "aed", name: "درهم امارات", nameEn: "UAE Dirham" },
  try:  { slug: "try", name: "لیر ترکیه", nameEn: "Turkish Lira" },
  cny:  { slug: "cny", name: "یوان چین", nameEn: "Chinese Yuan" },
  jpy:  { slug: "jpy", name: "ین ژاپن", nameEn: "Japanese Yen" },
  cad:  { slug: "cad", name: "دلار کانادا", nameEn: "Canadian Dollar" },
  aud:  { slug: "aud", name: "دلار استرالیا", nameEn: "Australian Dollar" },
  chf:  { slug: "chf", name: "فرانک سوئیس", nameEn: "Swiss Franc" },
  sar:  { slug: "sar", name: "ریال عربستان", nameEn: "Saudi Riyal" },
  inr:  { slug: "inr", name: "روپیه هند", nameEn: "Indian Rupee" },
  iqd:  { slug: "iqd", name: "دینار عراق", nameEn: "Iraqi Dinar" },
  afn:  { slug: "afn", name: "افغانی", nameEn: "Afghan Afghani" },
};

const GOLD_MAP: Record<string, { slug: string; name: string; nameEn: string }> = {
  "18ayar": { slug: "gold-18k", name: "طلای ۱۸ عیار", nameEn: "18K Gold" },
  xau:     { slug: "ounce", name: "اونس جهانی طلا", nameEn: "Gold Ounce" },
};

const COIN_MAP: Record<string, { slug: string; name: string; nameEn: string }> = {
  sekkeh:  { slug: "emami", name: "سکه امامی", nameEn: "Emami Coin" },
  bahar:   { slug: "bahar", name: "سکه بهار آزادی", nameEn: "Bahar Azadi Coin" },
  nim:     { slug: "nim", name: "نیم سکه", nameEn: "Half Coin" },
  rob:     { slug: "rob", name: "ربع سکه", nameEn: "Quarter Coin" },
  gerami:  { slug: "gerami", name: "سکه گرمی", nameEn: "Gram Coin" },
};

const CRYPTO_MAP: Record<string, { slug: string; name: string; nameEn: string }> = {
  btc:   { slug: "bitcoin", name: "بیت‌کوین", nameEn: "Bitcoin" },
  eth:   { slug: "ethereum", name: "اتریوم", nameEn: "Ethereum" },
  usdt:  { slug: "tether", name: "تتر", nameEn: "Tether" },
  bnb:   { slug: "binancecoin", name: "بایننس کوین", nameEn: "BNB" },
  xrp:   { slug: "ripple", name: "ریپل", nameEn: "XRP" },
  sol:   { slug: "solana", name: "سولانا", nameEn: "Solana" },
  ada:   { slug: "cardano", name: "کاردانو", nameEn: "Cardano" },
  doge:  { slug: "dogecoin", name: "دوج‌کوین", nameEn: "Dogecoin" },
  dot:   { slug: "polkadot", name: "پولکادات", nameEn: "Polkadot" },
  link:  { slug: "chainlink", name: "چین‌لینک", nameEn: "Chainlink" },
  ltc:   { slug: "litecoin", name: "لایت‌کوین", nameEn: "Litecoin" },
  avax:  { slug: "avalanche-2", name: "آوالانچ", nameEn: "Avalanche" },
  atom:  { slug: "cosmos", name: "کازماس", nameEn: "Cosmos" },
  etc:   { slug: "ethereum-classic", name: "اتریوم کلاسیک", nameEn: "Ethereum Classic" },
  trx:   { slug: "tron", name: "ترون", nameEn: "TRON" },
  eos:   { slug: "eos", name: "ایاس", nameEn: "EOS" },
  algo:  { slug: "algorand", name: "آلگوراند", nameEn: "Algorand" },
  dash:  { slug: "dash", name: "دش", nameEn: "Dash" },
  aave:  { slug: "aave", name: "آوی", nameEn: "Aave" },
  egld:  { slug: "multiversx", name: "مالتی‌ورس ایکس", nameEn: "MultiversX" },
  axs:   { slug: "axie-infinity", name: "اکسی اینفینیتی", nameEn: "Axie Infinity" },
  bch:   { slug: "bitcoin-cash", name: "بیت‌کوین کش", nameEn: "Bitcoin Cash" },
};

function parseRate(
  data: Record<string, NavasanRate>,
  key: string,
  mapping: { slug: string; name: string; nameEn: string },
  category: PriceUpdate["category"]
): PriceUpdate | null {
  const rate = data[key];
  if (!rate || !rate.value || rate.value === "") return null;

  const currentPrice = parseFloat(rate.value) || 0;
  if (currentPrice === 0) return null;

  const change = typeof rate.change === "string" ? parseFloat(rate.change) || 0 : rate.change || 0;
  const previousPrice = currentPrice - change;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

  return {
    ...mapping,
    category,
    currentPrice,
    changeAmount: change,
    changePercent: parseFloat(changePercent.toFixed(2)),
    high24h: currentPrice + Math.abs(change),
    low24h: currentPrice - Math.abs(change),
  };
}

/**
 * Fetch ALL prices from Navasan in a SINGLE API call.
 * Returns currencies, gold, coins, and crypto combined.
 */
export async function fetchAllNavasanPrices(): Promise<PriceUpdate[]> {
  if (!NAVASAN_KEY) {
    console.error("NAVASAN_API_KEY is not set");
    return [];
  }

  try {
    const res = await fetch(`${NAVASAN_BASE}?api_key=${NAVASAN_KEY}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Navasan API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: Record<string, NavasanRate> = await res.json();
    const prices: PriceUpdate[] = [];

    // Currencies
    for (const [key, mapping] of Object.entries(CURRENCY_MAP)) {
      const p = parseRate(data, key, mapping, "currency");
      if (p) prices.push(p);
    }

    // Gold
    for (const [key, mapping] of Object.entries(GOLD_MAP)) {
      const p = parseRate(data, key, mapping, "gold");
      if (p) prices.push(p);
    }

    // Coins
    for (const [key, mapping] of Object.entries(COIN_MAP)) {
      const p = parseRate(data, key, mapping, "coin");
      if (p) prices.push(p);
    }

    // Crypto
    for (const [key, mapping] of Object.entries(CRYPTO_MAP)) {
      const p = parseRate(data, key, mapping, "crypto");
      if (p) prices.push(p);
    }

    console.log(`Navasan: fetched ${prices.length} prices in 1 API call`);
    return prices;
  } catch (error) {
    console.error("Navasan fetch error:", error);
    return [];
  }
}

// ── Legacy exports for backward compatibility ──

export async function fetchCurrencyPrices(): Promise<PriceUpdate[]> {
  const all = await fetchAllNavasanPrices();
  return all.filter((p) => p.category === "currency");
}

export async function fetchGoldPrices(): Promise<PriceUpdate[]> {
  const all = await fetchAllNavasanPrices();
  return all.filter((p) => p.category === "gold");
}

export async function fetchCoinPrices(): Promise<PriceUpdate[]> {
  const all = await fetchAllNavasanPrices();
  return all.filter((p) => p.category === "coin");
}
