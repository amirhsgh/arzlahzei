import { ArticleCard } from "./ArticleCard";
import type { ArticleItem } from "@/types";

interface ArticleListProps {
  articles: ArticleItem[];
  title?: string;
}

export function ArticleList({ articles, title }: ArticleListProps) {
  return (
    <section>
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
