"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatPriceWithUnit } from "@/lib/utils/format";

const KARAT_RATIOS: Record<string, number> = {
  "18": 0.75,
  "22": 0.9167,
  "24": 1.0,
};

interface GoldCalculatorClientProps {
  gold18Price: number;
}

export function GoldCalculatorClient({ gold18Price }: GoldCalculatorClientProps) {
  const [weight, setWeight] = useState("1");
  const [karat, setKarat] = useState("18");

  const result = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const ratio = KARAT_RATIOS[karat] ?? 0.75;
    const basePricePerGram = gold18Price / 0.75;
    return w * basePricePerGram * ratio;
  }, [weight, karat, gold18Price]);

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>محاسبه‌گر قیمت طلا</CardTitle>
        <p className="text-sm text-muted-foreground">
          ارزش طلای خود را بر اساس وزن و عیار محاسبه کنید
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="وزن (گرم)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min="0"
          step="0.1"
          className="text-lg"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium">عیار طلا</label>
          <select
            value={karat}
            onChange={(e) => setKarat(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="18">۱۸ عیار (۷۵۰)</option>
            <option value="22">۲۲ عیار (۹۱۶)</option>
            <option value="24">۲۴ عیار (۹۹۹)</option>
          </select>
        </div>
        <div className="rounded-xl bg-gold/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">ارزش تقریبی طلا</p>
          <p className="mt-1 text-2xl font-bold text-gold">
            {formatPriceWithUnit(result)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            قیمت هر گرم طلای ۱۸ عیار: {formatPriceWithUnit(gold18Price)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          * این محاسبه بدون احتساب اجرت ساخت و سود فروشنده است
        </p>
      </CardContent>
    </Card>
  );
}
