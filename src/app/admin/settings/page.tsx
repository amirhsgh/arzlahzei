"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Settings are stored as SeoMeta rows with special page keys
const SETTINGS_KEY = "__site_settings__";

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  telegram: string;
  instagram: string;
  twitter: string;
  gaId: string;
  gscVerification: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  openaiKey: string;
  navasanKey: string;
}

const defaultSettings: SiteSettings = {
  siteName: "ارزلحظه‌ای",
  siteUrl: "https://nerkhe.ir",
  logo: "",
  favicon: "",
  telegram: "@nerkhe",
  instagram: "",
  twitter: "",
  gaId: "",
  gscVerification: "",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  smtpFrom: "info@nerkhe.ir",
  openaiKey: "",
  navasanKey: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : [])
      .then((data: { page: string; schema: unknown }[]) => {
        const found = data.find((d) => d.page === SETTINGS_KEY);
        if (found?.schema && typeof found.schema === "object") {
          setSettings({ ...defaultSettings, ...(found.schema as Record<string, string>) });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: SETTINGS_KEY,
          title: "Site Settings",
          schema: settings,
        }),
      });
      if (!r.ok) throw new Error();
      toast.success("تنظیمات ذخیره شد");
    } catch {
      toast.error("خطا در ذخیره تنظیمات");
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">تنظیمات عمومی</h1>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="ml-1 h-4 w-4" />
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">اطلاعات سایت</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="نام سایت" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} />
            <Input label="آدرس سایت" value={settings.siteUrl} onChange={(e) => update("siteUrl", e.target.value)} dir="ltr" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="لوگو (URL)" value={settings.logo} onChange={(e) => update("logo", e.target.value)} placeholder="https://..." dir="ltr" />
            <Input label="فاوآیکون (URL)" value={settings.favicon} onChange={(e) => update("favicon", e.target.value)} placeholder="https://..." dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">شبکه‌های اجتماعی</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="تلگرام" value={settings.telegram} onChange={(e) => update("telegram", e.target.value)} placeholder="@username" dir="ltr" />
            <Input label="اینستاگرام" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@username" dir="ltr" />
            <Input label="توییتر" value={settings.twitter} onChange={(e) => update("twitter", e.target.value)} placeholder="@username" dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">آنالیتیکس</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="کد Google Analytics" value={settings.gaId} onChange={(e) => update("gaId", e.target.value)} placeholder="G-XXXXXXXXX" dir="ltr" />
            <Input label="کد تایید GSC" value={settings.gscVerification} onChange={(e) => update("gscVerification", e.target.value)} placeholder="verification-code" dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">تنظیمات SMTP</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="سرور SMTP" value={settings.smtpHost} onChange={(e) => update("smtpHost", e.target.value)} placeholder="smtp.example.com" dir="ltr" />
            <Input label="پورت" value={settings.smtpPort} onChange={(e) => update("smtpPort", e.target.value)} dir="ltr" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="نام کاربری" value={settings.smtpUser} onChange={(e) => update("smtpUser", e.target.value)} dir="ltr" />
            <Input label="رمز عبور" type="password" value={settings.smtpPass} onChange={(e) => update("smtpPass", e.target.value)} dir="ltr" />
          </div>
          <Input label="ایمیل فرستنده" value={settings.smtpFrom} onChange={(e) => update("smtpFrom", e.target.value)} dir="ltr" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">کلیدهای API</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="کلید OpenAI" type="password" value={settings.openaiKey} onChange={(e) => update("openaiKey", e.target.value)} placeholder="sk-..." dir="ltr" />
          <Input label="کلید Navasan API" type="password" value={settings.navasanKey} onChange={(e) => update("navasanKey", e.target.value)} placeholder="API key" dir="ltr" />
          <p className="text-xs text-muted-foreground">
            کلیدهای API در دیتابیس ذخیره می‌شوند و فقط ادمین‌ها دسترسی دارند.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
