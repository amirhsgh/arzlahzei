"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatPriceWithUnit, toPersianDigits } from "@/lib/utils/format";

export function ProfitCalculatorClient() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [amount, setAmount] = useState("1");

  const result = useMemo(() => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseFloat(amount) || 0;
    if (buy === 0) return null;

    const totalBuy = buy * qty;
    const totalSell = sell * qty;
    const profit = totalSell - totalBuy;
    const profitPercent = ((sell - buy) / buy) * 100;

    return { totalBuy, totalSell, profit, profitPercent };
  }, [buyPrice, sellPrice, amount]);

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>محاسبه سود سرمایه‌گذاری</CardTitle>
        <p className="text-sm text-muted-foreground">
          سود یا زیان خرید و فروش ارز، طلا یا ارز دیجیتال را محاسبه کنید
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="قیمت خرید (تومان)"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="مثلاً ۸۵۰۰۰"
          min="0"
        />

        <Input
          label="قیمت فروش (تومان)"
          type="number"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          placeholder="مثلاً ۹۰۰۰۰"
          min="0"
        />

        <Input
          label="تعداد / مقدار"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />

        {result && (
          <div className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">مبلغ خرید</span>
              <span className="font-medium">{formatPriceWithUnit(result.totalBuy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">مبلغ فروش</span>
              <span className="font-medium">{formatPriceWithUnit(result.totalSell)}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="text-sm font-medium">{result.profit >= 0 ? "سود" : "زیان"}</span>
              <span className={`text-lg font-bold ${result.profit >= 0 ? "text-positive" : "text-negative"}`}>
                {formatPriceWithUnit(Math.abs(result.profit))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">درصد</span>
              <span className={`font-bold ${result.profitPercent >= 0 ? "text-positive" : "text-negative"}`}>
                {result.profitPercent >= 0 ? "+" : ""}{toPersianDigits(result.profitPercent.toFixed(2))}٪
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
