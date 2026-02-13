import { toPersianDigits, formatPriceWithUnit, formatPercent } from "@/lib/utils/format";
import { toJalali } from "@/lib/utils/date";

interface PriceData {
  name: string;
  nameEn: string;
  slug: string;
  currentPrice: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  category: string;
}

interface HistoryPoint {
  date: Date | string;
  price: number;
}

/**
 * Generate a 2-3 paragraph SEO text about the price, using template-based Persian text.
 */
export function generatePriceSeoText(price: PriceData, history: HistoryPoint[]): string {
  const today = toJalali(new Date());
  const currentFormatted = formatPriceWithUnit(price.currentPrice);
  const highFormatted = formatPriceWithUnit(price.high24h);
  const lowFormatted = formatPriceWithUnit(price.low24h);
  const changeFormatted = formatPercent(price.changePercent);

  const trendDirection = getTrendDirection(history);
  const categoryLabel = getCategoryLabel(price.category);

  const paragraph1 = `قیمت ${price.name} (${price.nameEn}) امروز ${toPersianDigits(today)} برابر با ${currentFormatted} است. بالاترین قیمت ${price.name} در ۲۴ ساعت گذشته ${highFormatted} و پایین‌ترین آن ${lowFormatted} بوده است. تغییرات قیمت نسبت به روز گذشته ${changeFormatted} می‌باشد.`;

  const paragraph2 = generateTrendParagraph(price, trendDirection, history);

  const paragraph3 = `ارزلحظه‌ای قیمت لحظه‌ای ${categoryLabel} از جمله ${price.name} را هر ۵ دقیقه بروزرسانی می‌کند. شما می‌توانید با مراجعه به نمودار بالا، روند تغییرات قیمت ${price.name} را در بازه‌های زمانی مختلف مشاهده و تحلیل کنید.`;

  return `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;
}

function getTrendDirection(history: HistoryPoint[]): "up" | "down" | "stable" {
  if (history.length < 2) return "stable";
  const recent = history.slice(-7);
  const first = recent[0].price;
  const last = recent[recent.length - 1].price;
  const changePercent = ((last - first) / first) * 100;
  if (changePercent > 1) return "up";
  if (changePercent < -1) return "down";
  return "stable";
}

function generateTrendParagraph(price: PriceData, trend: "up" | "down" | "stable", history: HistoryPoint[]): string {
  const weekCount = Math.min(history.length, 7);
  const weekLabel = toPersianDigits(weekCount.toString());

  if (trend === "up") {
    return `بررسی نمودار ${weekLabel} روز اخیر نشان می‌دهد که قیمت ${price.name} روند صعودی داشته است. این افزایش قیمت می‌تواند ناشی از عوامل مختلفی از جمله افزایش تقاضا، تغییرات بازارهای جهانی و شرایط اقتصادی باشد. توصیه می‌شود قبل از هرگونه تصمیم‌گیری، تحلیل دقیق‌تری انجام دهید.`;
  }
  if (trend === "down") {
    return `بررسی نمودار ${weekLabel} روز اخیر نشان می‌دهد که قیمت ${price.name} روند نزولی داشته است. این کاهش قیمت می‌تواند ناشی از عوامل مختلفی از جمله کاهش تقاضا، تغییرات بازارهای جهانی و شرایط اقتصادی باشد. توصیه می‌شود قبل از هرگونه تصمیم‌گیری، تحلیل دقیق‌تری انجام دهید.`;
  }
  return `بررسی نمودار ${weekLabel} روز اخیر نشان می‌دهد که قیمت ${price.name} نسبتاً ثابت بوده و نوسانات شدیدی نداشته است. ثبات نسبی قیمت می‌تواند نشانه تعادل عرضه و تقاضا در بازار باشد.`;
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "currency": return "ارزهای خارجی";
    case "gold": return "طلا و فلزات گرانبها";
    case "coin": return "سکه";
    case "crypto": return "ارزهای دیجیتال";
    default: return "دارایی‌ها";
  }
}

/**
 * Generate FAQ items for a price page.
 * Returns different questions based on the category.
 */
export function generateDynamicFaq(price: PriceData, category: string): { question: string; answer: string }[] {
  const currentFormatted = formatPriceWithUnit(price.currentPrice);

  const commonFaq = [
    {
      question: `قیمت ${price.name} امروز چقدر است؟`,
      answer: `قیمت لحظه‌ای ${price.name} (${price.nameEn}) در حال حاضر ${currentFormatted} است. این قیمت هر ۵ دقیقه در سایت ارزلحظه‌ای بروزرسانی می‌شود.`,
    },
    {
      question: `روند قیمت ${price.name} در هفته اخیر چگونه بوده؟`,
      answer: `شما می‌توانید با مشاهده نمودار قیمت ${price.name} در بالای همین صفحه، روند تغییرات هفتگی و ماهانه را بررسی کنید. تغییرات ۲۴ ساعت گذشته ${formatPercent(price.changePercent)} بوده است.`,
    },
  ];

  if (category === "currency") {
    return [
      ...commonFaq,
      {
        question: `عوامل موثر بر قیمت ${price.name} چیست؟`,
        answer: `قیمت ${price.name} تحت تأثیر عوامل مختلفی مانند سیاست‌های پولی بانک مرکزی، عرضه و تقاضا در بازار آزاد، تحولات سیاسی و اقتصادی بین‌المللی و نرخ تورم قرار دارد.`,
      },
      {
        question: `تفاوت نرخ آزاد و رسمی ${price.name} چیست؟`,
        answer: `نرخ آزاد ${price.name} قیمتی است که در بازار آزاد (صرافی‌ها) معامله می‌شود، در حالی که نرخ رسمی توسط بانک مرکزی تعیین می‌گردد. معمولاً نرخ آزاد بالاتر از نرخ رسمی است.`,
      },
      {
        question: `بهترین زمان برای خرید ${price.name} چه وقتی است؟`,
        answer: `پیش‌بینی دقیق بهترین زمان خرید ارز ممکن نیست. توصیه می‌شود با بررسی روند بازار و مشورت با کارشناسان مالی، تصمیم‌گیری کنید.`,
      },
    ];
  }

  if (category === "gold") {
    return [
      ...commonFaq,
      {
        question: `قیمت ${price.name} چگونه تعیین می‌شود؟`,
        answer: `قیمت ${price.name} بر اساس قیمت اونس جهانی طلا، نرخ دلار در بازار آزاد و عرضه و تقاضای داخلی تعیین می‌شود.`,
      },
      {
        question: `آیا خرید ${price.name} سرمایه‌گذاری خوبی است؟`,
        answer: `طلا به‌طور سنتی یکی از امن‌ترین دارایی‌ها برای حفظ ارزش سرمایه محسوب می‌شود. با این حال، هر سرمایه‌گذاری دارای ریسک است و توصیه می‌شود با مشاوره کارشناسان اقدام کنید.`,
      },
      {
        question: `رابطه قیمت طلا و دلار چیست؟`,
        answer: `قیمت طلا در ایران رابطه مستقیمی با قیمت دلار دارد. افزایش قیمت دلار معمولاً باعث افزایش قیمت طلا در بازار داخلی می‌شود.`,
      },
    ];
  }

  if (category === "coin") {
    return [
      ...commonFaq,
      {
        question: `قیمت ${price.name} چگونه محاسبه می‌شود؟`,
        answer: `قیمت ${price.name} بر اساس قیمت اونس جهانی طلا، نرخ دلار و میزان عرضه و تقاضا در بازار داخلی تعیین می‌شود. همچنین حباب سکه نیز بر قیمت تأثیرگذار است.`,
      },
      {
        question: `حباب ${price.name} چقدر است؟`,
        answer: `حباب سکه تفاوت بین قیمت بازاری و ارزش ذاتی آن (بر اساس وزن طلا) است. برای مشاهده حباب فعلی به بخش جزئیات قیمت مراجعه کنید.`,
      },
      {
        question: `تفاوت انواع سکه‌ها چیست؟`,
        answer: `سکه تمام بهار آزادی (امامی و طرح قدیم) وزن ۸.۱۳۳ گرم، نیم سکه ۴.۰۶ گرم و ربع سکه ۲.۰۳ گرم دارد. همه از طلای ۲۲ عیار ساخته شده‌اند.`,
      },
    ];
  }

  if (category === "crypto") {
    return [
      ...commonFaq,
      {
        question: `قیمت ${price.name} به تومان چگونه محاسبه می‌شود؟`,
        answer: `قیمت تومانی ${price.name} از ضرب قیمت دلاری آن در نرخ دلار بازار آزاد محاسبه می‌شود. این قیمت هر ۵ دقیقه بروزرسانی می‌گردد.`,
      },
      {
        question: `آیا سرمایه‌گذاری در ${price.name} مناسب است؟`,
        answer: `بازار ارزهای دیجیتال دارای نوسانات بسیار بالایی است. قبل از سرمایه‌گذاری، تحقیقات کامل انجام دهید و فقط مبلغی را وارد بازار کنید که توانایی از دست دادن آن را دارید.`,
      },
      {
        question: `${price.name} را از کجا بخرم؟`,
        answer: `${price.name} را می‌توانید از صرافی‌های ارز دیجیتال داخلی مانند نوبیتکس و والکس یا صرافی‌های بین‌المللی خریداری کنید. حتماً از صرافی‌های معتبر استفاده کنید.`,
      },
    ];
  }

  // Default fallback
  return [
    ...commonFaq,
    {
      question: `پیش‌بینی قیمت ${price.name} چگونه است؟`,
      answer: `پیش‌بینی دقیق قیمت هیچ دارایی ممکن نیست. توصیه می‌شود با بررسی نمودارها و تحلیل‌های کارشناسی تصمیم‌گیری کنید.`,
    },
  ];
}

/**
 * Generate comparison text for related prices.
 */
export function generateMarketComparison(price: PriceData, related: PriceData[]): string {
  if (related.length === 0) return "";

  const comparisons = related.slice(0, 3).map((r) => {
    const changeLabel = r.changePercent > 0 ? "افزایش" : r.changePercent < 0 ? "کاهش" : "بدون تغییر";
    return `${r.name} با قیمت ${formatPriceWithUnit(r.currentPrice)} و ${changeLabel} ${formatPercent(Math.abs(r.changePercent))}`;
  });

  const categoryLabel = getCategoryLabel(price.category);
  return `در مقایسه با سایر ${categoryLabel}، ${price.name} با قیمت ${formatPriceWithUnit(price.currentPrice)} معامله می‌شود. ${comparisons.join("، ")} از جمله موارد قابل مقایسه هستند.`;
}
