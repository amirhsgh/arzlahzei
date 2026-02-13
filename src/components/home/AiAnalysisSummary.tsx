import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

interface AiArticle {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string | Date;
}

interface AiAnalysisSummaryProps {
  article?: AiArticle | null;
}

export function AiAnalysisSummary({ article }: AiAnalysisSummaryProps) {
  if (!article) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <h3 className="text-lg font-semibold text-foreground">
            تحلیل هوش مصنوعی
          </h3>
        </div>
        <h4 className="font-medium text-foreground mb-2 leading-relaxed">
          {article.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <Link
          href={`/ai/daily-analysis/${article.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          مشاهده تحلیل
          <svg
            className="w-4 h-4 mr-1 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </CardContent>
    </Card>
  );
}
