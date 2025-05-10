"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
interface PriceItem {
  date: string; // e.g. "2025-04-25"
  price: number;
}

interface PriceLineChartProps {
  items: PriceItem[];
}
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const CustomChartTooltipContent = ({
  active,
  payload,
  label,
}: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;

  const entry = payload[0]; // 첫 번째 라인 기준
  const price = entry.value;

  return (
    <div className="space-y-1.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-md">
      {/* 날짜 또는 라벨 */}
      <div className="text-xs font-bold text-gray-500">{label}</div>

      {/* 가격 정보 */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-600">
          {price.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

export default function PriceLineChart({ items }: PriceLineChartProps) {
  const chartData = items;
  return (
    <Card className="border-none shadow-none">
      <CardContent className="h-[250px] overflow-hidden px-0">
        {/* 여기 추가 */}
        <ChartContainer
          config={chartConfig}
          style={{ width: "100%", height: "100%" }}
        >
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis />
            <ChartTooltip content={<CustomChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              height={200}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 leading-none text-gray-400">
          최근 한달 간 가격추이 <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
