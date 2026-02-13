import Link from "next/link";

interface RelatedLink {
  label: string;
  href: string;
}

export function RelatedLinks({ links, title = "لینک‌های مرتبط" }: { links: RelatedLink[]; title?: string }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
