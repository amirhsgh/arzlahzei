"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Eye,
  Users,
  Megaphone,
  MousePointerClick,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils/format";
import { toJalali, toJalaliWithTime } from "@/lib/utils/date";

interface DashboardData {
  stats: {
    todayViews: number;
    yesterdayViews: number;
    changePercent: number;
    todayUnique: number;
    todayImpressions: number;
    todayClicks: number;
    publishedArticles: number;
    totalArticles: number;
    activeAds: number;
    totalAds: number;
    lastPriceUpdate: string | null;
  };
  chart: { date: string; views: number; unique: number }[];
  topPages: { page: string; views: number }[];
  recentViews: { ip: string; page: string; timestamp: string; device: string | null; browser: string | null }[];
}

function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  subValue,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color?: string;
  subValue?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">
              {typeof value === "number" ? toPersianDigits(value.toLocaleString()) : value}
            </p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
          <Icon className={`h-8 w-8 ${color} opacity-60`} />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="mr-3 text-muted-foreground">در حال بارگذاری...</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("خطا در دریافت اطلاعات");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="py-20 text-center text-negative">{error}</div>;
  if (!data) return null;

  const { stats, chart, topPages, recentViews } = data;

  const chartFormatted = chart.map((d) => ({
    ...d,
    date: toJalali(d.date),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="بازدید امروز"
          value={stats.todayViews}
          icon={Eye}
          subValue={`${stats.changePercent >= 0 ? "+" : ""}${toPersianDigits(stats.changePercent.toString())}٪ نسبت به دیروز`}
        />
        <StatCard
          title="بازدیدکنندگان یونیک"
          value={stats.todayUnique}
          icon={Users}
          color="text-gold"
        />
        <StatCard
          title="نمایش تبلیغات"
          value={stats.todayImpressions}
          icon={Megaphone}
          color="text-positive"
        />
        <StatCard
          title="کلیک تبلیغات"
          value={stats.todayClicks}
          icon={MousePointerClick}
          color="text-primary"
        />
      </div>

      {/* System status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            {stats.lastPriceUpdate ? (
              <CheckCircle className="h-5 w-5 text-positive" />
            ) : (
              <AlertCircle className="h-5 w-5 text-negative" />
            )}
            <div>
              <p className="text-sm font-medium">آپدیت قیمت‌ها</p>
              <p className="text-xs text-muted-foreground">
                {stats.lastPriceUpdate ? toJalaliWithTime(stats.lastPriceUpdate) : "هنوز آپدیت نشده"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">مقالات</p>
              <p className="text-xs text-muted-foreground">
                {toPersianDigits(stats.publishedArticles)} منتشر شده / {toPersianDigits(stats.totalArticles)} کل
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Megaphone className="h-5 w-5 text-gold" />
            <div>
              <p className="text-sm font-medium">تبلیغات</p>
              <p className="text-xs text-muted-foreground">
                {toPersianDigits(stats.activeAds)} فعال / {toPersianDigits(stats.totalAds)} کل
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 30 day views chart */}
        <Card>
          <CardHeader>
            <CardTitle>نمودار بازدید ۳۰ روزه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {chartFormatted.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartFormatted}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", direction: "rtl" }}
                      formatter={(value, name) => [toPersianDigits(Number(value).toLocaleString()), name === "views" ? "بازدید" : "یونیک"]}
                    />
                    <Legend formatter={(value) => (value === "views" ? "بازدید" : "یونیک")} />
                    <Line type="monotone" dataKey="views" stroke="#0D9488" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="unique" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  داده‌ای برای نمایش وجود ندارد
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle>پربازدیدترین صفحات امروز</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((p, i) => (
                  <div key={p.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {toPersianDigits(i + 1)}
                      </span>
                      <p className="text-sm" dir="ltr">{p.page}</p>
                    </div>
                    <span className="text-sm font-medium">{toPersianDigits(p.views.toLocaleString())}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">هنوز بازدیدی ثبت نشده</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent views */}
      <Card>
        <CardHeader>
          <CardTitle>آخرین بازدیدها</CardTitle>
        </CardHeader>
        <CardContent>
          {recentViews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-right font-medium text-muted-foreground">IP</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">صفحه</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">دستگاه</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">زمان</th>
                  </tr>
                </thead>
                <tbody>
                  {recentViews.map((v, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-3 font-mono text-xs" dir="ltr">{v.ip}</td>
                      <td className="p-3 text-xs" dir="ltr">{v.page}</td>
                      <td className="p-3 text-xs">{v.device || "—"}</td>
                      <td className="p-3 text-left text-xs text-muted-foreground">
                        {toJalaliWithTime(v.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">هنوز بازدیدی ثبت نشده</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
