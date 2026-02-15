import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { Card, CardContent } from "@/components/ui/Card";
import { getArticlesByCategory } from "@/lib/db/articles";
import { toJalali } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "تحلیل روزانه بازار | ارزلحظه‌ای",
  description:
    "تحلیل روزانه بازار ارز، طلا، سکه و ارز دیجیتال با هوش مصنوعی. آخرین تغییرات و پیش‌بینی روند بازار.",
  keywords: [
    "تحلیل روزانه بازار",
    "تحلیل ارز",
    "تحلیل طلا",
    "پیش‌بینی بازار",
  ],
  openGraph: {
    title: "تحلیل روزانه بازار | ارزلحظه‌ای",
    description:
      "تحلیل روزانه بازار ارز، طلا، سکه و ارز دیجیتال با هوش مصنوعی",
    type: "website",
  },
};

export default async function DailyAnalysisPage() {
  const articles = await getArticlesByCategory("analysis", 20);

  const latestArticle = articles[0];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "بلاگ", href: "/blog" },
          { label: "تحلیل روزانه بازار" },
        ]}
      />

      {latestArticle && (
        <ArticleJsonLd
          title={latestArticle.title}
          description={latestArticle.excerpt || ""}
          url={`https://nerkhe.ir/blog/${latestArticle.slug}`}
          datePublished={latestArticle.publishedAt?.toISOString() || latestArticle.createdAt.toISOString()}
          dateModified={latestArticle.publishedAt?.toISOString() || latestArticle.createdAt.toISOString()}
          image={latestArticle.coverImage || undefined}
        />
      )}

      <AdSlot position="above_fold" page="blog" className="mb-6" />

      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        تحلیل روزانه بازار
      </h1>

      <p className="mb-8 text-muted-foreground">
        تحلیل‌های روزانه بازار ارز، طلا، سکه و ارز دیجیتال توسط هوش مصنوعی
        تولید و هر روز صبح منتشر می‌شوند.
      </p>

      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <Card className="transition-colors hover:border-primary/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="mb-2 text-lg font-bold">{article.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{toJalali(article.publishedAt || article.createdAt)}</span>
                        <span>
                          {toPersianDigits(article.viewCount.toLocaleString())}{" "}
                          بازدید
                        </span>
                        {article.isAiGenerated && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">هنوز تحلیلی منتشر نشده است.</p>
      )}

      <AdSlot position="below_fold" page="blog" className="mt-8" />
    </div>
  );
}
