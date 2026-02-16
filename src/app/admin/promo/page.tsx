"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toPersianDigits } from "@/lib/utils/format";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: string;
  title: string;
  type: string;
  position: string;
  isActive: boolean;
  deviceTarget: string;
  pageTarget: string[];
  impressionCount: number;
  clickCount: number;
  priority: number;
}

const typeLabels: Record<string, string> = {
  banner: "بنر تصویری", native: "native", popup: "پاپ‌آپ", video: "ویدیو",
  sticky_footer: "چسبان فوتر", sticky_header: "چسبان هدر", sidebar: "سایدبار",
  inline: "درون‌خطی", between_content: "بین محتوا", fullscreen_interstitial: "تمام‌صفحه",
};

const positionLabels: Record<string, string> = {
  header: "هدر", footer: "فوتر", sidebar: "سایدبار", between_prices: "بین قیمت‌ها",
  between_articles: "بین مقالات", between_content: "بین محتوا", above_fold: "بالای صفحه",
  below_fold: "زیر صفحه", in_content: "درون محتوا",
};

const deviceLabels: Record<string, string> = { all: "همه", mobile: "موبایل", desktop: "دسکتاپ" };

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/promo");
      if (!r.ok) throw new Error();
      const data = await r.json();
      setAds(data.ads);
      setTotal(data.total);
    } catch {
      toast.error("خطا در دریافت تبلیغات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const toggleActive = async (ad: Ad) => {
    try {
      const r = await fetch(`/api/admin/promo/${ad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      if (!r.ok) throw new Error();
      toast.success(ad.isActive ? "تبلیغ غیرفعال شد" : "تبلیغ فعال شد");
      fetchAds();
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const r = await fetch(`/api/admin/promo/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast.success("تبلیغ حذف شد");
      setDeleteConfirm(null);
      fetchAds();
    } catch {
      toast.error("خطا در حذف تبلیغ");
    }
  };

  const totalImpressions = ads.reduce((s, a) => s + a.impressionCount, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clickCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت تبلیغات</h1>
        <Link href="/admin/promo/new">
          <Button size="sm">
            <Plus className="ml-1 h-4 w-4" />
            تبلیغ جدید
          </Button>
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">کل تبلیغات</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(total)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">فعال</p><p className="mt-1 text-2xl font-bold text-positive">{toPersianDigits(ads.filter((a) => a.isActive).length)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">کل نمایش</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(totalImpressions.toLocaleString())}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">کل کلیک</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(totalClicks.toLocaleString())}</p></CardContent></Card>
      </div>

      {/* Position Guide */}
      <Card>
        <CardContent className="p-4">
          <h2 className="mb-3 text-sm font-bold">راهنمای موقعیت تبلیغات در صفحات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-right font-medium text-muted-foreground">موقعیت</th>
                  <th className="p-2 text-right font-medium text-muted-foreground">توضیح</th>
                  <th className="p-2 text-right font-medium text-muted-foreground">صفحاتی که نشان داده میشود</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">بالای صفحه (above_fold)</td>
                  <td className="p-2">اولین تبلیغ بالای محتوا، زیر عنوان صفحه</td>
                  <td className="p-2">صفحه اصلی، دلار، طلا، سکه، ارزها، کریپتو، ابزارها، بلاگ</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">بین قیمت‌ها (between_prices)</td>
                  <td className="p-2">بین جدول ارزها و بخش طلا/سکه</td>
                  <td className="p-2">صفحه اصلی (home)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">بین مقالات (between_articles)</td>
                  <td className="p-2">بین بخش کریپتو و مقالات</td>
                  <td className="p-2">صفحه اصلی (home)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">بین محتوا (between_content)</td>
                  <td className="p-2">بین بخش‌های اصلی صفحه</td>
                  <td className="p-2">طلا (gold)، سکه (coin)، ابزارها (tools)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">درون محتوا (in_content)</td>
                  <td className="p-2">بین بخش‌های مختلف محتوای صفحه</td>
                  <td className="p-2">صفحات جزئیات قیمت، بلاگ</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium text-foreground">زیر صفحه (below_fold)</td>
                  <td className="p-2">پایین صفحه، بعد از محتوای اصلی</td>
                  <td className="p-2">دلار، ارزها، کریپتو</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-foreground">هدر / فوتر / سایدبار</td>
                  <td className="p-2 text-negative">در صفحات سایت استفاده نمیشود</td>
                  <td className="p-2 text-negative">هیچ‌کجا نمایش داده نمیشود</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            نکته: حتماً &quot;صفحات هدف&quot; تبلیغ را مطابق صفحه‌ای که میخواهید نمایش داده شود انتخاب کنید.
            مثلاً برای نمایش در صفحه اصلی، &quot;home&quot; را انتخاب کنید.
          </p>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : ads.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">تبلیغی یافت نشد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-right font-medium text-muted-foreground">عنوان</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">نوع</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">موقعیت</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">دستگاه</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">نمایش</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">کلیک</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">CTR</th>
                    <th className="p-3 text-center font-medium text-muted-foreground">وضعیت</th>
                    <th className="p-3 text-center font-medium text-muted-foreground">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => {
                    const ctr = ad.impressionCount > 0 ? ((ad.clickCount / ad.impressionCount) * 100).toFixed(2) : "0";
                    return (
                      <tr key={ad.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <p className="font-medium">{ad.title}</p>
                          <p className="text-xs text-muted-foreground">اولویت: {toPersianDigits(ad.priority)}</p>
                        </td>
                        <td className="p-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{typeLabels[ad.type] || ad.type}</span></td>
                        <td className="p-3 text-xs">{positionLabels[ad.position] || ad.position}</td>
                        <td className="p-3 text-xs">{deviceLabels[ad.deviceTarget] || ad.deviceTarget}</td>
                        <td className="p-3 text-left">{toPersianDigits(ad.impressionCount.toLocaleString())}</td>
                        <td className="p-3 text-left">{toPersianDigits(ad.clickCount.toLocaleString())}</td>
                        <td className="p-3 text-left text-primary">{toPersianDigits(ctr)}٪</td>
                        <td className="p-3 text-center">
                          <button onClick={() => toggleActive(ad)} className="text-muted-foreground hover:text-foreground">
                            {ad.isActive ? <ToggleRight className="h-6 w-6 text-positive" /> : <ToggleLeft className="h-6 w-6" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link href={`/admin/promo/${ad.id}`}>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="text-negative" onClick={() => setDeleteConfirm(ad.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="تایید حذف">
        <div className="space-y-4">
          <p className="text-sm">آیا مطمئن هستید که می‌خواهید این تبلیغ را حذف کنید؟</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>انصراف</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>حذف</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
