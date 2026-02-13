const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(num: string | number): string {
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(Math.round(price));
  return formatted;
}

export function formatPriceWithUnit(price: number, unit = "تومان"): string {
  return `${formatPrice(price)} ${unit}`;
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${toPersianDigits(percent.toFixed(2))}٪`;
}

export function formatCompactPrice(price: number): string {
  if (price >= 1_000_000_000) {
    return `${toPersianDigits((price / 1_000_000_000).toFixed(1))} میلیارد`;
  }
  if (price >= 1_000_000) {
    return `${toPersianDigits((price / 1_000_000).toFixed(1))} میلیون`;
  }
  if (price >= 1_000) {
    return `${toPersianDigits((price / 1_000).toFixed(1))} هزار`;
  }
  return toPersianDigits(price.toString());
}
