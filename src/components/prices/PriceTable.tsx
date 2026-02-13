"use client";

import Link from "next/link";
import { PriceChange } from "./PriceChange";
import { formatPriceWithUnit } from "@/lib/utils/format";
import type { PriceItem } from "@/types";

interface PriceTableProps {
  prices: PriceItem[];
  title?: string;
}

export function PriceTable({ prices, title }: PriceTableProps) {
  return (
    <div>
      {title && (
        <h2 className="mb-4 text-lg font-bold">{title}</h2>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-right font-medium text-muted-foreground">نام</th>
              <th className="p-3 text-left font-medium text-muted-foreground">قیمت</th>
              <th className="p-3 text-left font-medium text-muted-foreground">تغییر</th>
              <th className="hidden p-3 text-left font-medium text-muted-foreground sm:table-cell">بیشترین</th>
              <th className="hidden p-3 text-left font-medium text-muted-foreground sm:table-cell">کمترین</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => {
              const href =
                price.category === "crypto"
                  ? `/crypto/${price.slug}`
                  : price.category === "currency"
                    ? `/currency/${price.slug}`
                    : `/${price.slug}`;

              return (
                <tr
                  key={price.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="p-3">
                    <Link href={href} className="font-medium hover:text-primary">
                      {price.name}
                      <span className="mr-2 text-xs text-muted-foreground">
                        {price.nameEn}
                      </span>
                    </Link>
                  </td>
                  <td className="p-3 text-left font-medium">
                    {formatPriceWithUnit(price.currentPrice)}
                  </td>
                  <td className="p-3 text-left">
                    <PriceChange changePercent={price.changePercent} size="sm" />
                  </td>
                  <td className="hidden p-3 text-left text-muted-foreground sm:table-cell">
                    {formatPriceWithUnit(price.high24h)}
                  </td>
                  <td className="hidden p-3 text-left text-muted-foreground sm:table-cell">
                    {formatPriceWithUnit(price.low24h)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
