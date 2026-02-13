"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { toPersianDigits } from "@/lib/utils/format";

interface ChartDataPoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: ChartDataPoint[];
  title?: string;
  color?: string;
}

const timeRanges = [
  { label: "۱ روز", value: "1d" },
  { label: "۱ هفته", value: "1w" },
  { label: "۱ ماه", value: "1m" },
  { label: "۳ ماه", value: "3m" },
  { label: "۱ سال", value: "1y" },
] as const;

export function PriceChart({
  data,
  title = "نمودار قیمت",
  color = "#3B82F6",
}: PriceChartProps) {
  const [activeRange, setActiveRange] = useState("1m");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={activeRange === range.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveRange(range.value)}
                className={cn(
                  "text-xs",
                  activeRange === range.value && "bg-primary text-white"
                )}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => toPersianDigits(value.toLocaleString())}
                orientation="left"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  direction: "rtl",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value) => [
                  toPersianDigits(Number(value).toLocaleString()) + " تومان",
                  "قیمت",
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
