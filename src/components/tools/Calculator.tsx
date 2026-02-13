"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface CalculatorProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Calculator({
  title,
  description,
  children,
  className,
}: CalculatorProps) {
  return (
    <Card className={cn("mx-auto max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
