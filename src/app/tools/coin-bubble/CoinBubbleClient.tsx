"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatPriceWithUnit, toPersianDigits } from "@/lib/utils/format";

const COIN_GOLD_WEIGHT = 7.32; // grams of pure gold in emami coin
const OUNCE_TO_GRAM = 31.1035;

interface CoinBubbleClientProps {
  coinPrice: number;
  ouncePrice: number;
  dollarPrice: number;
  coinTypes: { name: string; weight: number; price: number }[];
}

export function CoinBubbleClient({ coinPrice, ouncePrice, dollarPrice, coinTypes }: CoinBubbleClientProps) {
  const calculation = useMemo(() => {
    const goldPricePerGram = (ouncePrice * dollarPrice) / OUNCE_TO_GRAM;
    const intrinsicValue = goldPricePerGram * COIN_GOLD_WEIGHT;
    const bubble = coinPrice - intrinsicValue;
    const bubblePercent = (bubble / intrinsicValue) * 100;
    return { intrinsicValue, bubble, bubblePercent, goldPricePerGram };
  }, [coinPrice, ouncePrice, dollarPrice]);

  const isPositiveBubble = calculation.bubble > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>محاسبه حباب سکه</CardTitle>
          <p className="text-sm text-muted-foreground">
            مقایسه قیمت بازاری سکه با ارزش ذاتی آن
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`rounded-xl p-6 text-center ${isPositiveBubble ? "bg-negative/10" : "bg-positive/10"}`}>
            <p className="text-sm text-muted-foreground">حباب سکه امامی</p>
            <p className={`mt-1 text-3xl font-bold ${isPositiveBubble ? "text-negative" : "text-positive"}`}>
              {toPersianDigits(calculation.bubblePercent.toFixed(1))}%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatPriceWithUnit(Math.abs(calculation.bubble))}
              {isPositiveBubble ? " بالاتر از ارزش ذاتی" : " پایین‌تر از ارزش ذاتی"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">قیمت بازاری سکه</p>
              <p className="font-semibold">{formatPriceWithUnit(coinPrice)}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">ارزش ذاتی سکه</p>
              <p className="font-semibold">{formatPriceWithUnit(calculation.intrinsicValue)}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">اونس جهانی طلا</p>
              <p className="font-semibold">{toPersianDigits(ouncePrice.toLocaleString())} دلار</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">قیمت دلار</p>
              <p className="font-semibold">{formatPriceWithUnit(dollarPrice)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حباب انواع سکه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coinTypes.map((coin) => {
              const intrinsic = calculation.goldPricePerGram * coin.weight;
              const bubble = coin.price - intrinsic;
              const pct = (bubble / intrinsic) * 100;
              return (
                <div key={coin.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-xs text-muted-foreground">قیمت: {formatPriceWithUnit(coin.price)}</p>
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${bubble > 0 ? "text-negative" : "text-positive"}`}>
                      {toPersianDigits(pct.toFixed(1))}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPriceWithUnit(Math.abs(bubble))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
