"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Save, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminArticleEditorPage({
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
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/articles/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((article) => {
        setTitle(article.title || "");
        setSlug(article.slug || "");
        setExcerpt(article.excerpt || "");
        setContent(article.content || "");
        setCategory(article.category || "");
        setTags((article.tags || []).join(", "));
        setStatus(article.status || "draft");
        setCoverImage(article.coverImage || "");
        setSeoTitle(article.seoTitle || "");
        setSeoDescription(article.seoDescription || "");
        setSeoKeywords((article.seoKeywords || []).join(", "));
      })
      .catch(() => toast.error("خطا در دریافت مقاله"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title || !slug || !content) {
      toast.error("عنوان، اسلاگ و محتوا الزامی هستند");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category: category || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        status,
        coverImage: coverImage || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords ? seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
        publishedAt: status === "published" ? new Date().toISOString() : null,
      };

      const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${id}`;
      const method = isNew ? "POST" : "PUT";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(data?.error || "خطا");
      }

      toast.success(isNew ? "مقاله ایجاد شد" : "مقاله ذخیره شد");

      if (isNew) {
        if (data?.id) router.push(`/admin/articles/${data.id}`);
        else router.push("/admin/articles");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در ذخیره مقاله");
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const r = await fetch("/api/admin/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      if (data.title) setTitle(data.title);
      if (data.content) setContent(data.content);
      if (data.seoTitle) setSeoTitle(data.seoTitle);
      if (data.seoDescription) setSeoDescription(data.seoDescription);
      if (data.keywords) setSeoKeywords(data.keywords.join(", "));
      if (data.excerpt) setExcerpt(data.excerpt);
      toast.success("مقاله با هوش مصنوعی تولید شد");
    } catch {
      toast.error("خطا در تولید مقاله با AI");
    } finally {
      setAiLoading(false);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/articles")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "مقاله جدید" : "ویرایش مقاله"}</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="ml-1 h-4 w-4" />
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Generate */}
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <p className="text-sm font-medium">تولید مقاله با هوش مصنوعی</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="موضوع مقاله را وارد کنید..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button variant="gold" onClick={handleAiGenerate} disabled={aiLoading || !aiPrompt} className="shrink-0">
                  {aiLoading ? "در حال تولید..." : "تولید"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Input label="عنوان مقاله" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان مقاله" />
          <Input label="اسلاگ (URL)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-slug" dir="ltr" />

          <div>
            <label className="mb-1.5 block text-sm font-medium">خلاصه</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="خلاصه‌ای از مقاله..."
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">محتوا</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder="محتوای مقاله را بنویسید... (HTML پشتیبانی می‌شود)"
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">تنظیمات انتشار</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">وضعیت</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="">انتخاب کنید</option>
                  <option value="تحلیل بازار">تحلیل بازار</option>
                  <option value="آموزش">آموزش</option>
                  <option value="ارز دیجیتال">ارز دیجیتال</option>
                  <option value="اخبار">اخبار</option>
                </select>
              </div>
              <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="دلار, طلا, تحلیل" />
              <Input label="تصویر کاور (URL)" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." dir="ltr" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">تنظیمات سئو</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input label="عنوان سئو" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="عنوان سئو" />
              <div>
                <label className="mb-1.5 block text-sm font-medium">توضیحات سئو</label>
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} placeholder="توضیحات سئو" className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <Input label="کلمات کلیدی" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="کلمه1, کلمه2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
