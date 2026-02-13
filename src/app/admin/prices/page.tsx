"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PriceChange } from "@/components/prices/PriceChange";
import { formatPriceWithUnit, toPersianDigits } from "@/lib/utils/format";
import { toJalaliWithTime } from "@/lib/utils/date";
import { Plus, Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Category = "currency" | "gold" | "coin" | "crypto";

interface PriceItem {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: Category;
  currentPrice: number;
  changePercent: number;
  updatedAt: string;
}

const categoryLabels: Record<Category, string> = {
  currency: "ارز",
  gold: "طلا",
  coin: "سکه",
  crypto: "ارز دیجیتال",
};

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState<PriceItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", nameEn: "", slug: "", category: "currency" as Category, currentPrice: "" });

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("category", filter);
      if (search) params.set("search", search);
      const r = await fetch(`/api/admin/prices?${params}`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setPrices(data.prices);
      setTotal(data.total);
    } catch {
      toast.error("خطا در دریافت قیمت‌ها");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const handleUpdateAll = async () => {
    setUpdating(true);
    try {
      const r = await fetch("/api/admin/prices/update-all", { method: "POST" });
      if (!r.ok) throw new Error();
      toast.success("قیمت‌ها با موفقیت بروزرسانی شدند");
      fetchPrices();
    } catch {
      toast.error("خطا در بروزرسانی قیمت‌ها");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.nameEn || !form.slug) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, currentPrice: Number(form.currentPrice) || 0 }),
      });
      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.error);
      }
      toast.success("قیمت جدید اضافه شد");
      setAddModal(false);
      setForm({ name: "", nameEn: "", slug: "", category: "currency", currentPrice: "" });
      fetchPrices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در افزودن قیمت");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/prices/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      toast.success("قیمت ویرایش شد");
      setEditModal(false);
      fetchPrices();
    } catch {
      toast.error("خطا در ویرایش قیمت");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const r = await fetch(`/api/admin/prices/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast.success("قیمت حذف شد");
      setDeleteConfirm(null);
      fetchPrices();
    } catch {
      toast.error("خطا در حذف قیمت");
    }
  };

  const openEdit = (price: PriceItem) => {
    setSelected(price);
    setForm({ name: price.name, nameEn: price.nameEn, slug: price.slug, category: price.category, currentPrice: price.currentPrice.toString() });
    setEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت قیمت‌ها</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUpdateAll} disabled={updating}>
            <RefreshCw className={`ml-1 h-4 w-4 ${updating ? "animate-spin" : ""}`} />
            {updating ? "در حال بروزرسانی..." : "بروزرسانی همه"}
          </Button>
          <Button size="sm" onClick={() => { setForm({ name: "", nameEn: "", slug: "", category: "currency", currentPrice: "" }); setAddModal(true); }}>
            <Plus className="ml-1 h-4 w-4" />
            افزودن قیمت
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        {(["all", "currency", "gold", "coin", "crypto"] as const).map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "همه" : categoryLabels[cat]}
          </Button>
        ))}
        <span className="text-xs text-muted-foreground">
          {toPersianDigits(total)} قیمت
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : prices.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">قیمتی یافت نشد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-right font-medium text-muted-foreground">نام</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">دسته</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">قیمت فعلی</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">تغییر</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">آخرین آپدیت</th>
                    <th className="p-3 text-center font-medium text-muted-foreground">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => (
                    <tr key={price.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{price.name}</p>
                        <p className="text-xs text-muted-foreground">{price.nameEn} | {price.slug}</p>
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{categoryLabels[price.category]}</span>
                      </td>
                      <td className="p-3 text-left font-medium">{formatPriceWithUnit(price.currentPrice)}</td>
                      <td className="p-3 text-left"><PriceChange changePercent={price.changePercent} size="sm" /></td>
                      <td className="p-3 text-left text-xs text-muted-foreground">{toJalaliWithTime(price.updatedAt)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(price)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-negative" onClick={() => setDeleteConfirm(price.id)}>
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

      {/* Edit Modal */}
      <Modal open={editModal} onOpenChange={setEditModal} title="ویرایش قیمت">
        <div className="space-y-4">
          <Input label="نام فارسی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="نام انگلیسی" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          <Input label="اسلاگ" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="قیمت فعلی" type="number" value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="currency">ارز</option>
              <option value="gold">طلا</option>
              <option value="coin">سکه</option>
              <option value="crypto">ارز دیجیتال</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModal(false)}>انصراف</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal open={addModal} onOpenChange={setAddModal} title="افزودن قیمت جدید">
        <div className="space-y-4">
          <Input label="نام فارسی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلا: دلار کانادا" />
          <Input label="نام انگلیسی" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="مثلا: CAD" />
          <Input label="اسلاگ" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="مثلا: cad" />
          <div>
            <label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="currency">ارز</option>
              <option value="gold">طلا</option>
              <option value="coin">سکه</option>
              <option value="crypto">ارز دیجیتال</option>
            </select>
          </div>
          <Input label="قیمت اولیه" type="number" value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value })} placeholder="0" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModal(false)}>انصراف</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? "در حال افزودن..." : "افزودن"}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="تایید حذف">
        <div className="space-y-4">
          <p className="text-sm">آیا مطمئن هستید که می‌خواهید این قیمت را حذف کنید؟</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>انصراف</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>حذف</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
