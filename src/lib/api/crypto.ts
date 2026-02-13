// CoinGecko API integration for cryptocurrency prices

const COINGECKO_BASE =
  process.env.COINGECKO_API_URL || "https://api.coingecko.com/api/v3";

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CryptoPriceUpdate {
  slug: string;
  name: string;
  nameEn: string;
  category: "crypto";
  currentPrice: number;
  changeAmount: number;
  changePercent: number;
  high24h: number;
  low24h: number;
}

// Map CoinGecko IDs to Persian names
export const CRYPTO_NAMES: Record<string, string> = {
  bitcoin: "بیت‌کوین",
  ethereum: "اتریوم",
  tether: "تتر",
  binancecoin: "بایننس کوین",
  ripple: "ریپل",
  cardano: "کاردانو",
  solana: "سولانا",
  dogecoin: "دوج‌کوین",
  polkadot: "پولکادات",
  "avalanche-2": "آوالانچ",
  chainlink: "چین‌لینک",
  litecoin: "لایت‌کوین",
  "shiba-inu": "شیبا اینو",
  "matic-network": "پالیگان",
  tron: "ترون",
  uniswap: "یونی‌سواپ",
  stellar: "استلار",
  near: "نیر پروتکل",
  "the-sandbox": "سندباکس",
  aptos: "آپتوس",
  // Extended ~100 common coins
  "usd-coin": "یو‌اس‌دی کوین",
  "staked-ether": "اتر استیک شده",
  "wrapped-bitcoin": "بیت‌کوین رپد",
  "bitcoin-cash": "بیت‌کوین کش",
  "leo-token": "لئو توکن",
  dai: "دای",
  cosmos: "کازماس",
  "ethereum-classic": "اتریوم کلاسیک",
  monero: "مونرو",
  okb: "او‌کی‌بی",
  hedera: "هدرا",
  "internet-computer": "اینترنت کامپیوتر",
  filecoin: "فایل‌کوین",
  mantle: "منتل",
  "crypto-com-chain": "کرونوس",
  "lido-dao": "لیدو دائو",
  arbitrum: "آربیتروم",
  vechain: "وی‌چین",
  "true-usd": "ترو یو‌اس‌دی",
  maker: "میکر",
  optimism: "آپتیمیزم",
  "the-graph": "دی گراف",
  injective: "اینجکتیو",
  "theta-token": "تتا توکن",
  immutable: "ایمیوتبل",
  render: "رندر",
  algorand: "آلگوراند",
  fantom: "فانتوم",
  "bitcoin-cash-sv": "بیت‌کوین اس‌وی",
  "flow-token": "فلو",
  aave: "آوی",
  quant: "کوانت",
  "axie-infinity": "اکسی اینفینیتی",
  eos: "ایاس",
  multiversx: "مالتی‌ورس ایکس",
  decentraland: "دیسنترالند",
  "frax-share": "فرکس شر",
  tezos: "تزوس",
  iota: "آیوتا",
  "gala-2": "گالا",
  neo: "نئو",
  "thorchain": "تورچین",
  kucoin: "کوکوین",
  mina: "مینا پروتکل",
  "pax-gold": "پکس گلد",
  "curve-dao-token": "کرو دائو",
  "1inch": "وان‌اینچ",
  enjin: "انجین",
  zilliqa: "زیلیکا",
  "basic-attention-token": "بت توکن",
  chiliz: "چیلیز",
  "compound-governance-token": "کامپاند",
  "loopring": "لوپرینگ",
  "trust-wallet-token": "تراست ولت",
  "sushi": "سوشی",
  "yearn-finance": "یرن فایننس",
  "celo": "سلو",
  "harmony-one": "هارمونی",
  "ankr": "انکر",
  "pancakeswap-token": "پنکیک‌سواپ",
  "fetch-ai": "فچ ای‌آی",
  "ocean-protocol": "اوشن پروتکل",
  "mask-network": "مسک نتورک",
  "iotex": "آیوتکس",
  "skale": "اسکیل",
  "livepeer": "لایوپیر",
  "arweave": "آرویو",
  "flux": "فلاکس",
  "kava": "کاوا",
  "holo": "هولو",
  "nexo": "نکسو",
  "waves": "ویوز",
  "dash": "دش",
  "zcash": "زی‌کش",
  "ravencoin": "ریون‌کوین",
  "decred": "دیکرد",
  "ontology": "آنتولوژی",
  "icon-icx": "آیکون",
  "qtum": "کیوتم",
  "nervos-network": "نروس نتورک",
  "wax": "وکس",
  "syscoin": "سیس‌کوین",
  "oasis-network": "اوسیس نتورک",
  "siacoin": "سیاکوین",
  "stacks": "استکس",
  "sui": "سویی",
  "sei-network": "سی نتورک",
  "celestia": "سلستیا",
  "jupiter-exchange-solana": "ژوپیتر",
  "bonk": "بونک",
  "pepe": "پپه",
  "floki-inu": "فلوکی",
  "worldcoin-wld": "ورلدکوین",
  "blur-token": "بلور",
  "pyth-network": "پایث نتورک",
  "jito-governance-token": "جیتو",
  "wormhole": "ورم‌هول",
  "dymension": "دایمنشن",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapCoinToUpdate(coin: CoinGeckoMarket): CryptoPriceUpdate {
  return {
    slug: coin.id,
    name: CRYPTO_NAMES[coin.id] || coin.name,
    nameEn: coin.name,
    category: "crypto" as const,
    currentPrice: coin.current_price || 0,
    changeAmount: coin.price_change_24h || 0,
    changePercent: parseFloat(
      (coin.price_change_percentage_24h || 0).toFixed(2)
    ),
    high24h: coin.high_24h || 0,
    low24h: coin.low_24h || 0,
  };
}

/**
 * Fetch top 500 cryptos from CoinGecko using pagination.
 * 5 pages of 100, with 1.5 second delay between pages.
 * Includes sparkline_in_7d data.
 */
export async function fetchTop500Crypto(): Promise<CryptoPriceUpdate[]> {
  const allCoins: CryptoPriceUpdate[] = [];
  const totalPages = 5;
  const perPage = 100;

  for (let page = 1; page <= totalPages; page++) {
    try {
      const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline_in_7d=true`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.error(
          `CoinGecko page ${page} failed: ${res.status} ${res.statusText}`
        );
        // If rate limited, wait longer and retry once
        if (res.status === 429) {
          console.log(`Rate limited on page ${page}, waiting 10s and retrying...`);
          await delay(10000);
          const retryRes = await fetch(url, { cache: "no-store" });
          if (retryRes.ok) {
            const retryData: CoinGeckoMarket[] = await retryRes.json();
            allCoins.push(...retryData.map(mapCoinToUpdate));
          }
        }
        // Wait before next page regardless
        if (page < totalPages) await delay(1500);
        continue;
      }

      const data: CoinGeckoMarket[] = await res.json();
      allCoins.push(...data.map(mapCoinToUpdate));

      console.log(
        `Fetched page ${page}/${totalPages}: ${data.length} coins (total: ${allCoins.length})`
      );

      // Rate limit: wait 1.5 seconds between pages
      if (page < totalPages) {
        await delay(1500);
      }
    } catch (error) {
      console.error(`Error fetching crypto page ${page}:`, error);
      if (page < totalPages) await delay(1500);
    }
  }

  return allCoins;
}

/**
 * Fetch top 50 cryptos (single page, no sparkline).
 * Original function kept for backward compatibility.
 */
export async function fetchCryptoPrices(): Promise<CryptoPriceUpdate[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) return [];
    const data: CoinGeckoMarket[] = await res.json();

    return data.map(mapCoinToUpdate);
  } catch {
    return [];
  }
}

export async function fetchCryptoPrice(
  id: string
): Promise<CryptoPriceUpdate | null> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return {
      slug: data.id,
      name: CRYPTO_NAMES[data.id] || data.name,
      nameEn: data.name,
      category: "crypto",
      currentPrice: data.market_data?.current_price?.usd || 0,
      changeAmount: data.market_data?.price_change_24h || 0,
      changePercent: parseFloat(
        (data.market_data?.price_change_percentage_24h || 0).toFixed(2)
      ),
      high24h: data.market_data?.high_24h?.usd || 0,
      low24h: data.market_data?.low_24h?.usd || 0,
    };
  } catch {
    return null;
  }
}
