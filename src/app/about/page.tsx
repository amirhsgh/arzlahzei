import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { AboutPageJsonLd } from "@/components/seo/JsonLd";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "درباره ما | ارزلحظه‌ای",
  description: "درباره پلتفرم ارزلحظه‌ای. ارائه‌دهنده قیمت لحظه‌ای ارز، طلا، سکه و ارزهای دیجیتال.",
  keywords: ["درباره ارزلحظه‌ای", "arzlahzei"],
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
      <AboutPageJsonLd />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">درباره ارزلحظه‌ای</h1>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            <strong className="text-foreground">ارزلحظه‌ای</strong> یک پلتفرم حرفه‌ای نمایش قیمت لحظه‌ای ارز، طلا، سکه و ارزهای دیجیتال است. هدف ما ارائه اطلاعات دقیق، به‌روز و قابل اعتماد برای کاربران ایرانی است.
          </p>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-bold text-foreground">ویژگی‌های ما</h2>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>بروزرسانی قیمت‌ها هر ۵ دقیقه</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>نمودارهای تعاملی و تاریخچه قیمت</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>تحلیل روزانه بازار با هوش مصنوعی</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>ابزارهای محاسباتی (تبدیل ارز، محاسبه‌گر طلا، حباب سکه)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>پوشش کامل ارزها، طلا، سکه و رمزارزها</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#10003;</span>
                <span>طراحی واکنش‌گرا و سازگار با موبایل</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-foreground">منابع قیمت</h2>
            <p>
              قیمت‌های نمایش داده شده در ارزلحظه‌ای از منابع معتبر بازار آزاد و صرافی‌های آنلاین جمع‌آوری می‌شوند. قیمت ارزهای دیجیتال از بازارهای بین‌المللی دریافت شده و به نرخ روز تومان تبدیل می‌شود.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-foreground">سلب مسئولیت</h2>
            <p>
              اطلاعات ارائه شده در این سایت صرفاً جنبه اطلاع‌رسانی دارد و نباید به عنوان توصیه سرمایه‌گذاری تلقی شود. ارزلحظه‌ای مسئولیتی در قبال تصمیمات سرمایه‌گذاری کاربران ندارد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
