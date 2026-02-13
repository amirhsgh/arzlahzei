import Link from "next/link";

const footerLinks = {
  prices: {
    title: "قیمت‌ها",
    links: [
      { label: "قیمت دلار", href: "/dollar" },
      { label: "قیمت طلا", href: "/gold" },
      { label: "قیمت سکه", href: "/coin" },
      { label: "ارزهای دیجیتال", href: "/crypto" },
      { label: "همه ارزها", href: "/currency" },
    ],
  },
  tools: {
    title: "ابزارها",
    links: [
      { label: "تبدیل ارز", href: "/tools/currency-converter" },
      { label: "محاسبه‌گر طلا", href: "/tools/gold-calculator" },
      { label: "حباب سکه", href: "/tools/coin-bubble" },
      { label: "محاسبه سود", href: "/tools/profit-calculator" },
    ],
  },
  site: {
    title: "سایت",
    links: [
      { label: "بلاگ", href: "/blog" },
      { label: "درباره ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ارز</span>
              <span className="text-xl font-bold text-gold">لحظه‌ای</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              پلتفرم نمایش قیمت لحظه‌ای ارز، طلا، سکه و ارزهای دیجیتال با
              نمودار تعاملی و تحلیل بازار.
            </p>
          </div>

          {/* Link Sections */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            تمامی حقوق برای ارزلحظه‌ای محفوظ است. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
