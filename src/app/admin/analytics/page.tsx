"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toPersianDigits } from "@/lib/utils/format";
import { toJalali } from "@/lib/utils/date";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#0D9488", "#F59E0B", "#6366F1", "#EF4444", "#8B5CF6"];

interface OverviewData {
  todayViews: number;
  todayUnique: number;
  weekViews: number;
  weekUnique: number;
  monthViews: number;
  monthUnique: number;
  todayImpressions: number;
  todayClicks: number;
}

interface ChartItem { date: string; views: number; unique: number }
interface AdReport { id: string; title: string; impressions: number; clicks: number; ctr: number }

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<"views" | "ads">("views");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [chart, setChart] = useState<ChartItem[]>([]);
  const [adReport, setAdReport] = useState<AdReport[]>([]);
  const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/analytics/overview").then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/analytics/pageviews?range=30d").then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/analytics/ads-report?range=30d").then((r) => r.ok ? r.json() : null),
    ])
      .then(([ov, pv, ar]) => {
        if (ov) setOverview({
          todayViews: ov.todayViews ?? 0,
          todayUnique: ov.todayUnique ?? 0,
          weekViews: ov.weekViews ?? 0,
          weekUnique: ov.weekUnique ?? 0,
          monthViews: ov.monthViews ?? 0,
          monthUnique: ov.monthUnique ?? 0,
          todayImpressions: ov.todayImpressions ?? 0,
          todayClicks: ov.todayClicks ?? 0,
        });
        if (pv?.data) {
          setChart(pv.data.map((d: { date: string; views: number; unique: number }) => ({
            ...d,
            date: toJalali(d.date),
          })));
        }
        if (ar?.report) setAdReport(ar.report);

        // Compute device stats from overview if available
        if (pv?.devices) {
          setDeviceData(pv.devices);
        }
      })
      .catch(() => toast.error("خطا در دریافت آمار"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="mr-3 text-muted-foreground">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">آمار و گزارشات</h1>
        <div className="flex gap-1">
          <Button variant={tab === "views" ? "default" : "outline"} size="sm" onClick={() => setTab("views")}>بازدید</Button>
          <Button variant={tab === "ads" ? "default" : "outline"} size="sm" onClick={() => setTab("ads")}>تبلیغات</Button>
        </div>
      </div>

      {/* Overview stats */}
      {overview && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">بازدید امروز</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(overview.todayViews.toLocaleString())}</p><p className="text-xs text-muted-foreground">{toPersianDigits(overview.todayUnique.toLocaleString())} یونیک</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">بازدید هفته</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(overview.weekViews.toLocaleString())}</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">بازدید ماه</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(overview.monthViews.toLocaleString())}</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">نمایش/کلیک تبلیغات امروز</p><p className="mt-1 text-2xl font-bold">{toPersianDigits(overview.todayImpressions.toLocaleString())} / {toPersianDigits(overview.todayClicks.toLocaleString())}</p></CardContent></Card>
        </div>
      )}

      {tab === "views" && (
        <>
          {/* Views chart */}
          <Card>
            <CardHeader><CardTitle>نمودار بازدید ۳۰ روزه</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                {chart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", direction: "rtl" }}
                        formatter={(value) => [toPersianDigits(Number(value).toLocaleString()), "بازدید"]} />
                      <Line type="monotone" dataKey="views" stroke="#0D9488" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="unique" stroke="#F59E0B" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">داده‌ای موجود نیست</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device pie chart */}
          {deviceData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>دستگاه‌ها</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                          {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {deviceData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-sm">{d.name}</span>
                        <span className="text-sm font-bold">{toPersianDigits(d.value)}٪</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === "ads" && (
        <Card>
          <CardHeader><CardTitle>گزارش تبلیغات</CardTitle></CardHeader>
          <CardContent>
            {adReport.length > 0 ? (
              <>
                <div className="mb-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adReport}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="title" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", direction: "rtl" }} />
                      <Bar dataKey="impressions" fill="#0D9488" name="نمایش" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" fill="#F59E0B" name="کلیک" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-3 text-right font-medium text-muted-foreground">عنوان</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">نمایش</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">کلیک</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adReport.map((ad) => (
                        <tr key={ad.id} className="border-b border-border last:border-0">
                          <td className="p-3 font-medium">{ad.title}</td>
                          <td className="p-3 text-left">{toPersianDigits(ad.impressions.toLocaleString())}</td>
                          <td className="p-3 text-left">{toPersianDigits(ad.clicks.toLocaleString())}</td>
                          <td className="p-3 text-left text-primary">{toPersianDigits(ad.ctr.toFixed(2))}٪</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">داده‌ای موجود نیست</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
