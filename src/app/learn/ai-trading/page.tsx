import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "معامله‌گری با هوش مصنوعی | آموزش AI Trading",
  description: "آموزش استفاده از هوش مصنوعی در معامله‌گری. سیگنال‌یابی، تحلیل خودکار، ربات‌های معاملاتی و مدیریت ریسک با AI.",
  keywords: ["معامله‌گری هوش مصنوعی", "AI Trading", "ربات معاملاتی", "سیگنال خودکار"],
  path: "/learn/ai-trading",
});

const sections = [
  {
    title: "هوش مصنوعی در معامله‌گری",
    content:
      "هوش مصنوعی در بازارهای مالی برای تحلیل حجم عظیمی از داده‌ها، شناسایی الگوها و تصمیم‌گیری سریع استفاده می‌شود. از یادگیری ماشین تا پردازش زبان طبیعی، تکنولوژی‌های مختلف AI کاربردهای متنوعی در معامله‌گری دارند.",
  },
  {
    title: "سیگنال‌یابی با AI",
    content:
      "سیستم‌های هوش مصنوعی می‌توانند با تحلیل هم‌زمان ده‌ها اندیکاتور تکنیکال، داده‌های فاندامنتال و حتی اخبار و شبکه‌های اجتماعی، سیگنال‌های خرید و فروش تولید کنند. این سیگنال‌ها معمولاً دقت بالاتری نسبت به تحلیل دستی دارند.",
  },
  {
    title: "ربات‌های معاملاتی",
    content:
      "ربات‌های معاملاتی برنامه‌هایی هستند که بر اساس الگوریتم‌های از پیش تعیین‌شده، معاملات را به صورت خودکار انجام می‌دهند. مزیت اصلی آن‌ها حذف احساسات از معامله‌گری و اجرای سریع استراتژی‌هاست.",
  },
  {
    title: "تحلیل احساسات بازار",
    content:
      "هوش مصنوعی می‌تواند با تحلیل اخبار، توییت‌ها و نظرات کاربران، احساسات غالب بازار (صعودی یا نزولی) را شناسایی کند. این تحلیل به معامله‌گران کمک می‌کند تا روند احتمالی بازار را بهتر درک کنند.",
  },
  {
    title: "مدیریت ریسک هوشمند",
    content:
      "سیستم‌های AI می‌توانند با تحلیل نوسانات تاریخی و شرایط فعلی بازار، حد ضرر و حد سود بهینه را محاسبه کنند. همچنین می‌توانند حجم مناسب هر معامله را بر اساس میزان ریسک‌پذیری تعیین کنند.",
  },
  {
    title: "محدودیت‌ها و هشدارها",
    content:
      "هوش مصنوعی جادو نیست. هیچ سیستمی ۱۰۰٪ دقیق نیست. بازارهای مالی تحت تأثیر عوامل غیرقابل پیش‌بینی قرار دارند. همیشه از مدیریت سرمایه استفاده کنید و هرگز بیش از توان مالی خود ریسک نکنید.",
  },
];

export default function LearnAiTradingPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/learn" },
          { label: "معامله‌گری با هوش مصنوعی" },
        ]}
      />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">معامله‌گری با هوش مصنوعی</h1>
      <p className="mb-8 text-muted-foreground">
        آموزش استفاده از هوش مصنوعی برای تحلیل بازار و معامله‌گری هوشمند
      </p>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="p-4 sm:p-6">
              <h2 className="mb-3 text-lg font-bold">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
