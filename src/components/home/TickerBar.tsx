"use client";

import { formatPriceWithUnit, toPersianDigits } from "@/lib/utils/format";

interface TickerPrice {
  name: string;
  currentPrice: number;
  changePercent: number;
}

interface TickerBarProps {
  prices: TickerPrice[];
}

export function TickerBar({ prices }: TickerBarProps) {
  if (!prices || prices.length === 0) return null;

  const renderItem = (item: TickerPrice, index: number) => {
    const isPositive = item.changePercent > 0;
    const isNegative = item.changePercent < 0;
    const changeColor = isPositive
      ? "text-positive"
      : isNegative
        ? "text-negative"
        : "text-muted-foreground";
    const sign = isPositive ? "+" : "";

    return (
      <span
        key={index}
        className="inline-flex items-center gap-2 px-4 whitespace-nowrap text-sm"
      >
        <span className="font-medium text-foreground">{item.name}</span>
        <span className="text-muted-foreground">
          {formatPriceWithUnit(item.currentPrice)}
        </span>
        <span className={changeColor}>
          ({toPersianDigits(`${sign}${item.changePercent.toFixed(2)}`)}٪)
        </span>
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden border-b border-border bg-card py-2">
      <div className="animate-ticker flex w-max">
        {/* Original content */}
        {prices.map((item, i) => renderItem(item, i))}
        {/* Duplicate for seamless loop */}
        {prices.map((item, i) => renderItem(item, i + prices.length))}
      </div>
    </div>
  );
}
