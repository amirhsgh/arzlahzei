import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { ContactPageJsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { generatePageMetadata } from "@/lib/utils/seo";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "تماس با ما | ارزلحظه‌ای",
  description: "تماس با تیم ارزلحظه‌ای. ارسال پیام، پیشنهاد، انتقاد یا درخواست تبلیغات.",
  keywords: ["تماس با ارزلحظه‌ای", "ارتباط با ما"],
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]} />
      <ContactPageJsonLd />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">تماس با ما</h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          برای ارسال پیام، پیشنهاد، انتقاد یا درخواست تبلیغات با ما در ارتباط باشید.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">ایمیل</p>
                <p className="text-sm text-muted-foreground">info@nerkhe.ir</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MessageSquare className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">تلگرام</p>
                <p className="text-sm text-muted-foreground">@nerkhe</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">تبلیغات</p>
                <p className="text-sm text-muted-foreground">ads@nerkhe.ir</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ارسال پیام</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="نام" placeholder="نام شما" />
                  <Input label="ایمیل" type="email" placeholder="email@example.com" />
                </div>
                <Input label="موضوع" placeholder="موضوع پیام" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium">متن پیام</label>
                  <textarea
                    rows={5}
                    placeholder="پیام خود را بنویسید..."
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  ارسال پیام
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
