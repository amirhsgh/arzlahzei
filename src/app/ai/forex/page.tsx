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
  title: "تحلیل فارکس با هوش مصنوعی",
  description: "تحلیل جفت ارزهای فارکس و تأثیر آن بر بازار ارز داخلی. بررسی DXY و جفت ارزهای اصلی با هوش مصنوعی.",
  keywords: ["تحلیل فارکس", "جفت ارز", "DXY", "هوش مصنوعی"],
  path: "/ai/forex",
});

export default async function AiForexPage() {
  const articles = await getArticlesByCategory("forex", 20);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">تحلیل فارکس</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        تحلیل جفت ارزهای فارکس و تأثیر آن بر بازار ارز داخلی
      </p>

      <PromoSlot position="above_fold" page="ai-forex" className="mb-6" />

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
        <p className="py-12 text-center text-muted-foreground">هنوز تحلیلی منتشر نشده است.</p>
      )}
    </>
  );
}
