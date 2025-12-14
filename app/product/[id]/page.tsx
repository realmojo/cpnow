"use client"

import * as React from "react"
import { ArrowLeft, ExternalLink, TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"

// Mock data based on the provided JSON structure
const generateMockData = (id: string) => {
  return {
    title: "국내산 청경채",
    image: "https://image.coupangcdn.com/image/retail/images/772868379108268-d27cf929-adec-43b4-b2fb-004667e775b7.jpg",
    currentPrice: 990,
    unitPrice: "100g당 660원",
    rating: 5,
    reviewCount: 167281,
    delivery: {
      description: "내일(일) 12/14 새벽 7시 전 도착 보장",
      badgeUrl: "https://image.coupangcdn.com/image/mobile_app/v3/brandsdp/loyalty/pc/rocket-fresh@2x.png"
    },
    // Mock history for chart (since real history wasn't in the snippet)
    history: [
      { date: "2024-06", price: 1200 },
      { date: "2024-07", price: 1100 },
      { date: "2024-08", price: 990 },
      { date: "2024-09", price: 1050 },
      { date: "2024-10", price: 990 },
      { date: "2024-11", price: 990 },
    ],
    lowestPrice: 990,
    averagePrice: 1080,
  }
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  
  const product = generateMockData(id)

  const isGoodPrice = product.currentPrice <= product.averagePrice

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Back to Search</span>
          </Link>
          <div className="flex items-center gap-2">
             <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image Section */}
          <div className="flex flex-col gap-4">
             <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted/50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="object-contain w-full h-full hover:scale-105 transition-transform duration-500"
                />
             </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isGoodPrice ? "default" : "secondary"} className="text-sm">
                  {isGoodPrice ? "Great Price" : "Average Price"}
                </Badge>
                {/* Simulated Discount Badge */}
                {product.averagePrice > product.currentPrice && (
                   <Badge variant="destructive" className="text-sm">
                     {Math.round(((product.averagePrice - product.currentPrice) / product.averagePrice) * 100)}% Lower vs Avg
                   </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-balance mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                 <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TrendingUp 
                        key={i} 
                        className={`w-4 h-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`} 
                        fill={i < product.rating ? "currentColor" : "none"}
                      />
                    ))}
                 </div>
                 <span>({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {product.currentPrice.toLocaleString()}원
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.unitPrice})
                </span>
              </div>
            
              {/* Delivery Info */}
              <div className="mt-4 flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={product.delivery.badgeUrl} alt="Delivery Badge" className="h-4" />
                 <span className="text-sm font-medium text-green-700 dark:text-green-500">
                    {product.delivery.description}
                 </span>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
               <Card>
                 <CardHeader className="pb-2">
                   <CardDescription>Lowest Price (6 Months)</CardDescription>
                   <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                     {product.lowestPrice.toLocaleString()}원
                   </CardTitle>
                 </CardHeader>
               </Card>
               <Card>
                 <CardHeader className="pb-2">
                   <CardDescription>Average Price</CardDescription>
                   <CardTitle className="text-xl">
                      {product.averagePrice.toLocaleString()}원
                   </CardTitle>
                 </CardHeader>
               </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Price History (6 Months)</CardTitle>
                <CardDescription>
                  Tracking price changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={product.history}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(5)} // Show MM
                    />
                     <YAxis 
                      hide
                      domain={['dataMin - 100000', 'dataMax + 100000']}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="price"
                      type="monotone"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-auto">
              <Button className="w-full flex-1" size="lg">
                View on Coupang
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
