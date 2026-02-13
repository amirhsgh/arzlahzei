"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeftRight } from "lucide-react";
import { formatPrice, toPersianDigits } from "@/lib/utils/format";

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

interface CurrencyConverterClientProps {
  currencyRates: CurrencyRate[];
}

export function CurrencyConverterClient({ currencyRates }: CurrencyConverterClientProps) {
  const currencies = useMemo(
    () => [{ code: "IRR", name: "تومان", rate: 1 }, ...currencyRates],
    [currencyRates]
  );

  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("IRR");

  const result = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const fromRate = currencies.find((c) => c.code === from)?.rate ?? 1;
    const toRate = currencies.find((c) => c.code === to)?.rate ?? 1;
    if (to === "IRR") return num * fromRate;
    if (from === "IRR") return num / toRate;
    return (num * fromRate) / toRate;
  }, [amount, from, to, currencies]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>تبدیل ارز</CardTitle>
        <p className="text-sm text-muted-foreground">
          تبدیل سریع بین ارزهای مختلف با نرخ لحظه‌ای بازار
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            label="مقدار"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            className="text-lg"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium">از</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <Button variant="ghost" size="icon" onClick={swap} className="mb-0.5">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium">به</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="rounded-xl bg-primary/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">نتیجه</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {toPersianDigits(formatPrice(result))}
          </p>
          <p className="text-xs text-muted-foreground">
            {currencies.find((c) => c.code === to)?.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
