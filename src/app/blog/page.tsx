import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { CollectionPageJsonLd } from "@/components/seo/JsonLd";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getAllPublishedArticles } from "@/lib/db/articles";

export const revalidate = 60;

export const metadata: Metadata = generatePageMetadata({
  title: "بلاگ | مقالات و تحلیل بازار ارز، طلا و ارز دیجیتال",
  description: "آخرین مقالات، تحلیل‌های روزانه بازار ارز و طلا، راهنمای سرمایه‌گذاری و اخبار ارزهای دیجیتال.",
  keywords: ["تحلیل بازار ارز", "اخبار طلا", "تحلیل ارز دیجیتال", "مقالات اقتصادی", "بلاگ ارزلحظه‌ای"],
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await getAllPublishedArticles();

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "بلاگ" }]} />
      <CollectionPageJsonLd
        name="بلاگ ارزلحظه‌ای"
        description="مقالات و تحلیل‌های بازار ارز، طلا و ارز دیجیتال"
        url="https://arzlahzei.ir/blog"
        items={articles.map((a) => ({ name: a.title, url: `https://arzlahzei.ir/blog/${a.slug}` }))}
      />

      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">مقالات و تحلیل بازار</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        آخرین تحلیل‌ها، اخبار و مقالات آموزشی درباره بازار ارز، طلا و ارزهای دیجیتال
      </p>

      <AdSlot position="above_fold" page="blog" className="mb-6" />

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">هنوز مقاله‌ای منتشر نشده است.</p>
      )}

      <AdSlot position="below_fold" page="blog" className="mt-6" />
    </div>
  );
}
