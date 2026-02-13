import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPercent, toPersianDigits } from "@/lib/utils/format";

interface PriceChangeProps {
  changePercent: number;
  changeAmount?: number;
  showIcon?: boolean;
  showAmount?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PriceChange({
  changePercent,
  changeAmount,
  showIcon = true,
  showAmount = false,
  size = "md",
}: PriceChangeProps) {
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const isNeutral = changePercent === 0;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 font-medium",
        sizeClasses[size],
        isPositive && "text-positive",
        isNegative && "text-negative",
        isNeutral && "text-muted-foreground"
      )}
    >
      {showIcon &&
        (isPositive ? (
          <TrendingUp className={iconSizes[size]} />
        ) : isNegative ? (
          <TrendingDown className={iconSizes[size]} />
        ) : (
          <Minus className={iconSizes[size]} />
        ))}
      <span>{formatPercent(changePercent)}</span>
      {showAmount && changeAmount !== undefined && (
        <span className="text-muted-foreground">
          ({toPersianDigits(Math.abs(changeAmount).toLocaleString())})
        </span>
      )}
    </div>
  );
}
