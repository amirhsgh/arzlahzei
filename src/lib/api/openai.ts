// OpenAI API integration for AI content generation

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE = "https://api.openai.com/v1";

interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  slug: string;
}

export async function generateArticle(
  prompt: string
): Promise<GeneratedArticle> {
  if (!OPENAI_API_KEY) {
    throw new Error("کلید API اوپن‌ای‌آی تنظیم نشده است");
  }

  const systemPrompt = `تو یک نویسنده حرفه‌ای مالی هستی که مقالات فارسی درباره بازار ارز، طلا، سکه و ارز دیجیتال می‌نویسی.
مقاله را به فرمت HTML بنویس.
خروجی را به صورت JSON با این ساختار برگردان:
{
  "title": "عنوان مقاله",
  "content": "<p>محتوای HTML مقاله</p>",
  "excerpt": "خلاصه ۲-۳ جمله‌ای",
  "seoTitle": "عنوان سئو (حداکثر ۶۰ کاراکتر)",
  "seoDescription": "توضیحات سئو (حداکثر ۱۶۰ کاراکتر)",
  "seoKeywords": ["کلمه کلیدی ۱", "کلمه کلیدی ۲"],
  "slug": "slug-in-english"
}`;

  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("پاسخ خالی از OpenAI");
  }

  return JSON.parse(content);
}

export async function generateDailyAnalysis(
  priceData: string
): Promise<GeneratedArticle> {
  const prompt = `بر اساس داده‌های زیر، یک تحلیل روزانه بازار ارز و طلا بنویس:

${priceData}

مقاله باید شامل:
- خلاصه وضعیت بازار
- تحلیل تغییرات مهم
- پیش‌بینی کوتاه‌مدت
- توصیه به خریداران و فروشندگان

باشد.`;

  return generateArticle(prompt);
}

export async function generateTradingSignal(
  priceData: string
): Promise<GeneratedArticle> {
  const prompt = `بر اساس داده‌های قیمتی ارزهای دیجیتال زیر، یک تحلیل سیگنال معاملاتی بنویس:

${priceData}

مقاله باید شامل:
- وضعیت کلی بازار کریپتو
- سیگنال‌های خرید و فروش (حداقل ۳ ارز)
- نقاط ورود و خروج پیشنهادی
- حد ضرر و حد سود
- هشدار ریسک

باشد. تأکید کن که این تحلیل صرفاً آموزشی است و توصیه سرمایه‌گذاری نیست.`;

  return generateArticle(prompt);
}

export async function generateForexAnalysis(
  priceData: string
): Promise<GeneratedArticle> {
  const prompt = `بر اساس داده‌های نرخ ارز زیر، یک تحلیل فارکس و تأثیر آن بر بازار داخلی بنویس:

${priceData}

مقاله باید شامل:
- وضعیت شاخص دلار (DXY)
- تحلیل جفت ارزهای اصلی (EUR/USD, GBP/USD)
- تأثیر بر نرخ دلار و ارز داخلی
- روند کوتاه‌مدت فارکس
- نکات مهم برای صرافی‌ها و معامله‌گران

باشد.`;

  return generateArticle(prompt);
}

export async function generateNewsDigest(
  priceData: string
): Promise<GeneratedArticle> {
  const prompt = `بر اساس وضعیت فعلی بازار با داده‌های زیر، یک خلاصه خبری از مهم‌ترین اخبار اقتصادی و مالی بنویس:

${priceData}

مقاله باید شامل:
- ۵ تا ۷ خبر مهم اقتصادی روز
- تأثیر هر خبر بر بازار
- تحلیل کوتاه هر خبر
- جمع‌بندی و پیش‌بینی تأثیر کلی بر بازار

باشد.`;

  return generateArticle(prompt);
}
