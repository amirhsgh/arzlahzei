import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const AI_TABS = [
  { label: "تحلیل روزانه", href: "/ai/daily-analysis" },
  { label: "سیگنال معاملاتی", href: "/ai/trading" },
  { label: "تحلیل فارکس", href: "/ai/forex" },
  { label: "اخبار", href: "/ai/news" },
];

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "هوش مصنوعی" }]} />
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {AI_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
