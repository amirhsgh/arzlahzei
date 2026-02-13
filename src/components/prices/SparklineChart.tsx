"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";

interface SparklineChartProps {
  data: number[];
  color?: string;
}

export function SparklineChart({ data, color }: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  const resolvedColor =
    color ?? (data[data.length - 1] >= data[0] ? "#22C55E" : "#EF4444");

  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ width: 120, height: 40 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={resolvedColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
