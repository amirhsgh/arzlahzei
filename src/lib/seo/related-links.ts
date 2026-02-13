interface RelatedLink {
  label: string;
  href: string;
}

const RELATED_LINKS_MAP: Record<string, RelatedLink[]> = {
  // Currency
  dollar: [
    { label: "قیمت یورو", href: "/currency/euro" },
    { label: "قیمت پوند", href: "/currency/gbp" },
    { label: "قیمت طلا", href: "/gold" },
    { label: "تبدیل ارز", href: "/tools/currency-converter" },
    { label: "تحلیل فارکس", href: "/ai/forex" },
  ],
  euro: [
    { label: "قیمت دلار", href: "/dollar" },
    { label: "قیمت پوند", href: "/currency/gbp" },
    { label: "تبدیل ارز", href: "/tools/currency-converter" },
  ],
  // Gold
  gold: [
    { label: "قیمت سکه", href: "/coin" },
    { label: "قیمت دلار", href: "/dollar" },
    { label: "محاسبه‌گر طلا", href: "/tools/gold-calculator" },
    { label: "سرمایه‌گذاری طلا", href: "/learn/gold-investment" },
  ],
  // Coin
  coin: [
    { label: "قیمت طلا", href: "/gold" },
    { label: "حباب سکه", href: "/tools/coin-bubble" },
    { label: "قیمت دلار", href: "/dollar" },
  ],
  // Crypto
  bitcoin: [
    { label: "قیمت اتریوم", href: "/crypto/ethereum" },
    { label: "قیمت تتر", href: "/crypto/tether" },
    { label: "ارزهای دیجیتال", href: "/crypto" },
    { label: "آموزش کریپتو", href: "/learn/crypto" },
  ],
  ethereum: [
    { label: "قیمت بیت‌کوین", href: "/crypto/bitcoin" },
    { label: "قیمت سولانا", href: "/crypto/solana" },
    { label: "ارزهای دیجیتال", href: "/crypto" },
  ],
};

// Default links by category
const DEFAULT_LINKS: Record<string, RelatedLink[]> = {
  currency: [
    { label: "قیمت دلار", href: "/dollar" },
    { label: "قیمت یورو", href: "/currency/euro" },
    { label: "همه ارزها", href: "/currency" },
    { label: "تبدیل ارز", href: "/tools/currency-converter" },
  ],
  gold: [
    { label: "قیمت طلا", href: "/gold" },
    { label: "قیمت سکه", href: "/coin" },
    { label: "محاسبه‌گر طلا", href: "/tools/gold-calculator" },
  ],
  coin: [
    { label: "قیمت سکه", href: "/coin" },
    { label: "قیمت طلا", href: "/gold" },
    { label: "حباب سکه", href: "/tools/coin-bubble" },
  ],
  crypto: [
    { label: "قیمت بیت‌کوین", href: "/crypto/bitcoin" },
    { label: "قیمت اتریوم", href: "/crypto/ethereum" },
    { label: "همه ارزها", href: "/crypto" },
    { label: "آموزش کریپتو", href: "/learn/crypto" },
  ],
};

export function getRelatedLinks(slug: string, category: string): RelatedLink[] {
  return RELATED_LINKS_MAP[slug] || DEFAULT_LINKS[category] || [];
}
