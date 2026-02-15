import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { getArticlesByCategory } from "@/lib/db/articles";
import { toJalali } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";
import { generatePageMetadata } from "@/lib/utils/seo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "تحلیل روزانه بازار با هوش مصنوعی",
  description: "تحلیل روزانه بازار ارز، طلا، سکه و ارز دیجیتال توسط هوش مصنوعی. پیش‌بینی روند و بررسی تغییرات.",
  keywords: ["تحلیل روزانه", "تحلیل بازار", "هوش مصنوعی", "پیش‌بینی بازار"],
  path: "/ai/daily-analysis",
});

export default async function AiDailyAnalysisPage() {
  const articles = await getArticlesByCategory("analysis", 20);
  const latest = articles[0];

  return (
    <>
      {latest && (
        <ArticleJsonLd
          title={latest.title}
          description={latest.excerpt || ""}
          url={`https://nerkhe.ir/blog/${latest.slug}`}
          datePublished={latest.publishedAt?.toISOString() || latest.createdAt.toISOString()}
        />
      )}

      <h1 className="mb-2 text-2xl font-bold">تحلیل روزانه بازار</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        تحلیل‌های روزانه بازار ارز، طلا و سکه توسط هوش مصنوعی
      </p>

      <AdSlot position="above_fold" page="ai-analysis" className="mb-6" />

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
                    {article.isAiGenerated && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">AI</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">هنوز تحلیلی منتشر نشده است.</p>
      )}
    </>
  );
}
