"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PriceChange } from "./PriceChange";
import { formatPriceWithUnit } from "@/lib/utils/format";
import { timeAgo } from "@/lib/utils/date";
import type { PriceItem } from "@/types";
import { cn } from "@/lib/utils/cn";

interface PriceCardProps {
  price: PriceItem;
  featured?: boolean;
}

export function PriceCard({ price, featured = false }: PriceCardProps) {
  const href =
    price.category === "crypto"
      ? `/crypto/${price.slug}`
      : price.category === "currency"
        ? `/currency/${price.slug}`
        : price.category === "gold"
          ? "/gold"
          : price.category === "coin"
            ? "/coin"
            : `/${price.slug}`;

  return (
    <Link href={href}>
      <Card
        className={cn(
          "transition-all hover:shadow-md hover:border-primary/30",
          featured && "border-primary/20"
        )}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={cn("font-semibold", featured ? "text-lg" : "text-base")}>
                {price.name}
              </h3>
              <p className="text-xs text-muted-foreground">{price.nameEn}</p>
            </div>
            <div className="text-left">
              <p className={cn("font-bold", featured ? "text-xl" : "text-lg")}>
                {formatPriceWithUnit(price.currentPrice)}
              </p>
              <PriceChange
                changePercent={price.changePercent}
                changeAmount={price.changeAmount}
                size="sm"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {timeAgo(price.updatedAt)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
