import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { AdSlot } from "@/components/ads/AdSlot";
import { getArticlesByCategory } from "@/lib/db/articles";
import { toJalali } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";
import { generatePageMetadata } from "@/lib/utils/seo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "اخبار هوش مصنوعی بازار",
  description: "خلاصه مهم‌ترین اخبار اقتصادی و مالی روز توسط هوش مصنوعی. خبرهای تأثیرگذار بر بازار ارز، طلا و ارز دیجیتال.",
  keywords: ["اخبار اقتصادی", "اخبار بازار", "هوش مصنوعی", "خلاصه اخبار"],
  path: "/ai/news",
});

export default async function AiNewsPage() {
  const articles = await getArticlesByCategory("news", 20);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">اخبار هوش مصنوعی</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        خلاصه مهم‌ترین اخبار اقتصادی و مالی روز توسط هوش مصنوعی
      </p>

      <AdSlot position="above_fold" page="ai-news" className="mb-6" />

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
        <p className="py-12 text-center text-muted-foreground">هنوز خبری منتشر نشده است.</p>
      )}
    </>
  );
}
