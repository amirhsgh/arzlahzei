import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { toJalali } from "@/lib/utils/date";
import type { ArticleItem } from "@/types";

interface ArticleCardProps {
  article: ArticleItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        {article.coverImage && (
          <div className="relative aspect-video">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold leading-relaxed hover:text-primary">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {article.publishedAt && <span>{toJalali(article.publishedAt)}</span>}
            {article.category && (
              <span className="rounded-full bg-muted px-2 py-0.5">
                {article.category}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
