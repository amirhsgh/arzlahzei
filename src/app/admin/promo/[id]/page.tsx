"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Save, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AD_TYPES = [
  { value: "banner", label: "بنر تصویری" },
  { value: "sidebar", label: "سایدبار" },
  { value: "inline", label: "درون‌خطی" },
  { value: "popup", label: "پاپ‌آپ" },
  { value: "native", label: "native" },
  { value: "video", label: "ویدیو" },
  { value: "sticky_footer", label: "چسبان فوتر" },
  { value: "sticky_header", label: "چسبان هدر" },
  { value: "between_content", label: "بین محتوا" },
  { value: "fullscreen_interstitial", label: "تمام‌صفحه" },
];

const AD_POSITIONS = [
  { value: "above_fold", label: "بالای صفحه — زیر عنوان، همه صفحات" },
  { value: "between_prices", label: "بین قیمت‌ها — فقط صفحه اصلی" },
  { value: "between_articles", label: "بین مقالات — فقط صفحه اصلی" },
  { value: "between_content", label: "بین محتوا — طلا، سکه، ابزارها" },
  { value: "in_content", label: "درون محتوا — صفحات جزئیات و بلاگ" },
  { value: "below_fold", label: "زیر صفحه — دلار، ارزها، کریپتو، بلاگ" },
  { value: "header", label: "هدر (استفاده نمیشود)" },
  { value: "footer", label: "فوتر (استفاده نمیشود)" },
  { value: "sidebar", label: "سایدبار (استفاده نمیشود)" },
];

const PAGE_TARGETS = [
  { value: "home", label: "صفحه اصلی" },
  { value: "dollar", label: "دلار" },
  { value: "gold", label: "طلا" },
  { value: "coin", label: "سکه" },
  { value: "crypto", label: "ارز دیجیتال" },
  { value: "currency", label: "ارزها" },
  { value: "blog", label: "بلاگ" },
  { value: "tools", label: "ابزارها" },
];

export default function AdminAdEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("banner");
  const [position, setPosition] = useState("header");
  const [device, setDevice] = useState("all");
  const [pages, setPages] = useState<string[]>(["home"]);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [priority, setPriority] = useState("5");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/promo/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((ad) => {
        setTitle(ad.title || "");
        setType(ad.type || "banner");
        setPosition(ad.position || "header");
        setDevice(ad.deviceTarget || "all");
        setPages(ad.pageTarget || []);
        setImageUrl(ad.imageUrl || "");
        setLinkUrl(ad.linkUrl || "");
        setHtmlCode(ad.htmlCode || "");
        setPriority(String(ad.priority || 5));
        setIsActive(ad.isActive ?? true);
      })
      .catch(() => toast.error("خطا در دریافت تبلیغ"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title) { toast.error("عنوان تبلیغ الزامی است"); return; }
    setSaving(true);
    try {
      const body = {
        title, type, position,
        deviceTarget: device,
        pageTarget: pages,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        htmlCode: htmlCode || null,
        priority: Number(priority) || 5,
        isActive,
      };

      const url = isNew ? "/api/admin/promo" : `/api/admin/promo/${id}`;
      const method = isNew ? "POST" : "PUT";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.error || "خطا");
      }

      toast.success(isNew ? "تبلیغ ایجاد شد" : "تبلیغ ذخیره شد");
      if (isNew) router.push("/admin/promo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در ذخیره تبلیغ");
    } finally {
      setSaving(false);
    }
  };

  const togglePage = (val: string) => {
    setPages((prev) => prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/promo")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "تبلیغ جدید" : "ویرایش تبلیغ"}</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="ml-1 h-4 w-4" />
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">اطلاعات تبلیغ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="عنوان تبلیغ" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="بنر صرافی آنلاین" />
            <div>
              <label className="mb-1.5 block text-sm font-medium">نوع تبلیغ</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {AD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">موقعیت</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {AD_POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <Input label="اولویت" type="number" value={priority} onChange={(e) => setPriority(e.target.value)} min="1" max="100" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded" />
              فعال
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">هدف‌گیری</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">دستگاه</label>
              <select value={device} onChange={(e) => setDevice(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="all">همه دستگاه‌ها</option>
                <option value="mobile">فقط موبایل</option>
                <option value="desktop">فقط دسکتاپ</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">صفحات هدف</label>
              <div className="flex flex-wrap gap-2">
                {PAGE_TARGETS.map((p) => (
                  <button key={p.value} type="button" onClick={() => togglePage(p.value)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      pages.includes(p.value) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">محتوای تبلیغ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="آدرس تصویر" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/banner.jpg" dir="ltr" />
            <Input label="لینک مقصد" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" dir="ltr" />
            <div>
              <label className="mb-1.5 block text-sm font-medium">کد HTML (اختیاری)</label>
              <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} rows={6} placeholder="کد HTML تبلیغ..." dir="ltr"
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
