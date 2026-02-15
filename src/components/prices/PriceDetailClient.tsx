"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { PriceChange } from "./PriceChange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const PriceChart = dynamic(
  () => import("@/components/prices/PriceChart").then((mod) => ({ default: mod.PriceChart })),
  {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-muted" />,
  }
);
import { CommentSection } from "./CommentSection";
import { PromoSlot } from "@/components/sponsor/PromoSlot";
import { formatPriceWithUnit, toPersianDigits } from "@/lib/utils/format";
import { toJalali, toJalaliWithTime } from "@/lib/utils/date";
import type { PriceItem, PriceHistoryItem } from "@/types";

interface PriceDetailClientProps {
  price: PriceItem;
  history: PriceHistoryItem[];
  relatedPrices: PriceItem[];
  faqItems: { question: string; answer: string }[];
  pageName: string;
}

export function PriceDetailClient({
  price,
  history,
  relatedPrices,
  faqItems,
  pageName,
}: PriceDetailClientProps) {
  const chartData = history.map((h) => ({
    date: toJalali(h.date).split(" ").slice(0, 2).join(" "),
    price: h.close || h.price,
  }));

  return (
    <div className="space-y-6">
      {/* Current Price Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{price.name}</h1>
                <p className="text-sm text-muted-foreground">{price.nameEn}</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {formatPriceWithUnit(price.currentPrice)}
                </p>
                <PriceChange
                  changePercent={price.changePercent}
                  changeAmount={price.changeAmount}
                  showAmount
                  size="lg"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">بیشترین ۲۴ ساعت</p>
                <p className="font-semibold">{formatPriceWithUnit(price.high24h)}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">کمترین ۲۴ ساعت</p>
                <p className="font-semibold">{formatPriceWithUnit(price.low24h)}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">قیمت قبلی</p>
                <p className="font-semibold">{formatPriceWithUnit(price.previousPrice)}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">آخرین بروزرسانی</p>
                <p className="text-sm font-semibold">{toJalaliWithTime(price.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ad Slot */}
      <PromoSlot position="between_prices" page={pageName} />

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PriceChart
          data={chartData}
          title={`نمودار قیمت ${price.name}`}
        />
      </motion.div>

      {/* Price History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>تاریخچه قیمت {price.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-right font-medium text-muted-foreground">تاریخ</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">باز شدن</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">بیشترین</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">کمترین</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">بسته شدن</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(-10).reverse().map((h) => (
                    <tr key={h.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-right">{toJalali(h.date)}</td>
                      <td className="p-3 text-left">{toPersianDigits(h.open.toLocaleString())}</td>
                      <td className="p-3 text-left text-positive">{toPersianDigits(h.high.toLocaleString())}</td>
                      <td className="p-3 text-left text-negative">{toPersianDigits(h.low.toLocaleString())}</td>
                      <td className="p-3 text-left font-medium">{toPersianDigits(h.close.toLocaleString())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Related Prices */}
      {relatedPrices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>قیمت‌های مرتبط</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPrices.map((rp) => {
                const href =
                  rp.category === "crypto"
                    ? `/crypto/${rp.slug}`
                    : rp.category === "currency"
                      ? `/currency/${rp.slug}`
                      : `/${rp.slug}`;
                return (
                  <a
                    key={rp.id}
                    href={href}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">{rp.name}</p>
                      <p className="text-xs text-muted-foreground">{rp.nameEn}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{formatPriceWithUnit(rp.currentPrice)}</p>
                      <PriceChange changePercent={rp.changePercent} size="sm" />
                    </div>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      {faqItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سوالات متداول</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CommentSection slug={price.slug} />
      </motion.div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border pb-3 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-right font-medium"
      >
        <span>{question}</span>
        <span className="mr-2 text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  );
}
