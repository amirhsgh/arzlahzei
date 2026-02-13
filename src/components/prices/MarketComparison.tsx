import { Card, CardContent } from "@/components/ui/Card";
import { formatPriceWithUnit, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface ComparisonItem {
  name: string;
  currentPrice: number;
  changePercent: number;
}

interface MarketComparisonProps {
  items: ComparisonItem[];
  title: string;
}

export function MarketComparison({ items, title }: MarketComparisonProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <h2 className="mb-4 text-lg font-bold">{title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 text-right font-medium">نام</th>
                  <th className="pb-3 text-left font-medium">قیمت</th>
                  <th className="pb-3 text-left font-medium">تغییرات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-left">
                      {formatPriceWithUnit(item.currentPrice)}
                    </td>
                    <td
                      className={cn(
                        "py-3 text-left font-medium",
                        item.changePercent > 0
                          ? "text-green-600 dark:text-green-400"
                          : item.changePercent < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-muted-foreground"
                      )}
                    >
                      {formatPercent(item.changePercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
