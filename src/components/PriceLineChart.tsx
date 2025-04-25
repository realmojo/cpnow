"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, TooltipProps } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
const chartData = [
  { date: "03-25", price: 17900 },
  { date: "03-26", price: 17900 },
  { date: "03-27", price: 16500 },
  { date: "03-28", price: 16500 },
  { date: "03-29", price: 15800 },
  { date: "03-30", price: 15800 },
  { date: "03-31", price: 15800 },
  { date: "04-01", price: 19900 },
  { date: "04-02", price: 19900 },
  { date: "04-03", price: 19200 },
  { date: "04-04", price: 19200 },
  { date: "04-05", price: 18900 },
  { date: "04-06", price: 18900 },
  { date: "04-07", price: 18900 },
  { date: "04-08", price: 17900 },
  { date: "04-09", price: 17900 },
  { date: "04-10", price: 16900 },
  { date: "04-11", price: 16900 },
  { date: "04-12", price: 14900 },
  { date: "04-13", price: 14900 },
  { date: "04-14", price: 14900 },
  { date: "04-15", price: 15500 },
  { date: "04-16", price: 15500 },
  { date: "04-17", price: 15900 },
  { date: "04-18", price: 15900 },
  { date: "04-19", price: 14900 },
  { date: "04-20", price: 14900 },
  { date: "04-21", price: 15500 },
  { date: "04-22", price: 16500 },
  { date: "04-23", price: 16500 },
];

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

export default function PriceLineChart() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)} // "04-12" 유지
            />
            {/* <YAxis /> */}
            <ChartTooltip content={<CustomChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
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
