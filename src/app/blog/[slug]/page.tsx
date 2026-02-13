import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { toJalali } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";
import { getArticleBySlug, getLatestArticles } from "@/lib/db/articles";

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return generatePageMetadata({
    title: article.seoTitle || article.title,
    description: article.excerpt || article.title,
    keywords: article.tags,
    path: `/blog/${slug}`,
    ogImage: article.coverImage || undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [article, latestArticles] = await Promise.all([
    getArticleBySlug(slug),
    getLatestArticles(4),
  ]);

  if (!article) notFound();

  const relatedArticles = latestArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "بلاگ", href: "/blog" },
          { label: article.title },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || article.title}
        url={`https://arzlahzei.ir/blog/${slug}`}
        datePublished={article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date(article.createdAt).toISOString()}
        image={article.coverImage || undefined}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="mb-3 text-2xl font-bold leading-relaxed sm:text-3xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {article.publishedAt && (
              <time dateTime={new Date(article.publishedAt).toISOString()}>{toJalali(new Date(article.publishedAt))}</time>
            )}
            {article.category && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {article.category}
              </span>
            )}
            <span>{toPersianDigits(article.viewCount.toLocaleString())} بازدید</span>
            {article.isAiGenerated && (
              <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                تحلیل هوش مصنوعی
              </span>
            )}
          </div>
        </header>

        <AdSlot position="above_fold" page={`blog-${slug}`} className="mb-6" />

        <div
          className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:leading-relaxed prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <AdSlot position="in_content" page={`blog-${slug}`} className="mt-8" />
      </article>

      {relatedArticles.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-lg font-bold">مطالب مرتبط</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          بازگشت به لیست مقالات
        </Link>
      </div>
    </div>
  );
}
