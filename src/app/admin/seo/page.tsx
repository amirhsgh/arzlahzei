"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Save, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SeoPage {
  id?: string;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  ogImage: string | null;
  schema: unknown;
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: SeoPage[]) => {
        // If no SEO pages exist, seed with default ones
        if (data.length === 0) {
          setPages([
            { page: "/", title: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال", description: "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
            { page: "/dollar", title: "قیمت دلار امروز", description: "قیمت لحظه‌ای دلار آمریکا.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
            { page: "/gold", title: "قیمت طلا امروز", description: "قیمت لحظه‌ای طلای ۱۸ عیار.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
            { page: "/coin", title: "قیمت سکه امروز", description: "قیمت لحظه‌ای سکه.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
            { page: "/crypto", title: "ارزهای دیجیتال", description: "قیمت لحظه‌ای ارزهای دیجیتال.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
            { page: "/blog", title: "بلاگ", description: "مقالات و تحلیل بازار.", keywords: [], canonicalUrl: null, ogImage: null, schema: null },
          ]);
        } else {
          setPages(data);
        }
      })
      .catch(() => toast.error("خطا در دریافت تنظیمات سئو"))
      .finally(() => setLoading(false));
  }, []);

  const updatePage = (index: number, field: keyof SeoPage, value: string) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (index: number) => {
    setSaving(true);
    const pg = pages[index];
    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pg.page,
          title: pg.title,
          description: pg.description,
          keywords: pg.keywords,
          canonicalUrl: pg.canonicalUrl,
          ogImage: pg.ogImage,
          schema: pg.schema,
        }),
      });
      if (!r.ok) throw new Error();
      toast.success("تنظیمات سئو ذخیره شد");
      setEditIndex(null);
    } catch {
      toast.error("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-2xl font-bold">تنظیمات سئو</h1>

      <Card>
        <CardHeader><CardTitle>متا تگ‌های صفحات</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pages.map((page, i) => (
            <div key={page.page} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium" dir="ltr">{page.page}</p>
                <Button variant="ghost" size="sm" onClick={() => setEditIndex(editIndex === i ? null : i)}>
                  {editIndex === i ? "بستن" : "ویرایش"}
                </Button>
              </div>

              {editIndex === i ? (
                <div className="space-y-3">
                  <Input label="عنوان (Meta Title)" value={page.title || ""} onChange={(e) => updatePage(i, "title", e.target.value)} />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">توضیحات (Meta Description)</label>
                    <textarea value={page.description || ""} onChange={(e) => updatePage(i, "description", e.target.value)} rows={2}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <Input label="Canonical URL" value={page.canonicalUrl || ""} onChange={(e) => updatePage(i, "canonicalUrl", e.target.value)} dir="ltr" />
                  <Input label="OG Image URL" value={page.ogImage || ""} onChange={(e) => updatePage(i, "ogImage", e.target.value)} dir="ltr" />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => handleSave(i)} disabled={saving}>
                      <Save className="ml-1 h-4 w-4" />
                      {saving ? "ذخیره..." : "ذخیره"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{page.title || "—"}</p>
                  <p className="mt-1">{page.description || "—"}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sitemap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>نقشه سایت (Sitemap)</CardTitle>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="ml-1 h-4 w-4" />
                مشاهده
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            نقشه سایت به صورت خودکار از صفحات قیمت، مقالات و ابزارها تولید می‌شود.
          </p>
          <p className="mt-2 text-xs text-muted-foreground" dir="ltr">https://arzlahzei.ir/sitemap.xml</p>
        </CardContent>
      </Card>
    </div>
  );
}
