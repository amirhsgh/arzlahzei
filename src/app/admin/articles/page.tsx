"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toPersianDigits } from "@/lib/utils/format";
import { toJalali } from "@/lib/utils/date";
import { Plus, Pencil, Trash2, Eye, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: "published" | "draft";
  isAiGenerated: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const limit = 20;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (filter !== "all") params.set("status", filter);
      const r = await fetch(`/api/admin/articles?${params}`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setArticles(data.articles);
      setTotal(data.total);
    } catch {
      toast.error("خطا در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleDelete = async (id: string) => {
    try {
      const r = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast.success("مقاله حذف شد");
      setDeleteConfirm(null);
      fetchArticles();
    } catch {
      toast.error("خطا در حذف مقاله");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت مقالات</h1>
        <div className="flex gap-2">
          <Link href="/admin/articles/new">
            <Button variant="outline" size="sm">
              <Sparkles className="ml-1 h-4 w-4 text-gold" />
              تولید با AI
            </Button>
          </Link>
          <Link href="/admin/articles/new">
            <Button size="sm">
              <Plus className="ml-1 h-4 w-4" />
              مقاله جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "published", "draft"] as const).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter(s); setPage(1); }}
          >
            {s === "all" ? "همه" : s === "published" ? "منتشر شده" : "پیش‌نویس"}
          </Button>
        ))}
        <span className="mr-2 text-xs text-muted-foreground">
          {toPersianDigits(total)} مقاله
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">مقاله‌ای یافت نشد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-right font-medium text-muted-foreground">عنوان</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">دسته</th>
                    <th className="p-3 text-center font-medium text-muted-foreground">وضعیت</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">بازدید</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">تاریخ</th>
                    <th className="p-3 text-center font-medium text-muted-foreground">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">/{article.slug}</p>
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{article.category || "بدون دسته"}</span>
                        {article.isAiGenerated && (
                          <span className="mr-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">AI</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          article.status === "published"
                            ? "bg-positive/10 text-positive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {article.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                        </span>
                      </td>
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          {toPersianDigits(article.viewCount.toLocaleString())}
                        </div>
                      </td>
                      <td className="p-3 text-left text-xs text-muted-foreground">
                        {article.publishedAt ? toJalali(article.publishedAt) : "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/admin/articles/${article.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="text-negative" onClick={() => setDeleteConfirm(article.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>قبلی</Button>
          <span className="text-sm text-muted-foreground">
            صفحه {toPersianDigits(page)} از {toPersianDigits(totalPages)}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>بعدی</Button>
        </div>
      )}

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="تایید حذف">
        <div className="space-y-4">
          <p className="text-sm">آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>انصراف</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>حذف</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
