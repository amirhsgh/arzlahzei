import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { PromoSlot } from "@/components/sponsor/PromoSlot";
import { getArticlesByCategory } from "@/lib/db/articles";
import { toJalali } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";
import { generatePageMetadata } from "@/lib/utils/seo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "سیگنال معاملاتی با هوش مصنوعی",
  description: "سیگنال‌های خرید و فروش ارز دیجیتال با تحلیل هوش مصنوعی. تحلیل تکنیکال و فاندامنتال خودکار.",
  keywords: ["سیگنال معاملاتی", "تحلیل تکنیکال", "هوش مصنوعی", "ارز دیجیتال"],
  path: "/ai/trading",
});

export default async function AiTradingPage() {
  const articles = await getArticlesByCategory("trading", 20);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">سیگنال‌های معاملاتی</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        سیگنال‌های خرید و فروش بر اساس تحلیل هوش مصنوعی
      </p>

      <PromoSlot position="above_fold" page="ai-trading" className="mb-6" />

      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <Card className="transition-colors hover:border-primary/50">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="mb-2 text-lg font-bold">{article.title}</h2>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{toJalali(article.publishedAt || article.createdAt)}</span>
                    <span>{toPersianDigits(article.viewCount.toLocaleString())} بازدید</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">هنوز سیگنالی منتشر نشده است.</p>
      )}
    </>
  );
}
