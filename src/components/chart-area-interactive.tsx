'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { useIsMobile } from '@/hooks/use-mobile'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'

export const description = 'An interactive area chart for B2B sales'

// Realistic wholesale order demo data with natural daily fluctuations
const chartData = [
  { date: '2026-04-01', jewellery: 16, rawMaterial: 11 },
  { date: '2026-04-02', jewellery: 12, rawMaterial: 9 },
  { date: '2026-04-03', jewellery: 18, rawMaterial: 14 },
  { date: '2026-04-04', jewellery: 22, rawMaterial: 16 },
  { date: '2026-04-05', jewellery: 25, rawMaterial: 18 },
  { date: '2026-04-06', jewellery: 20, rawMaterial: 15 },
  { date: '2026-04-07', jewellery: 17, rawMaterial: 12 },
  { date: '2026-04-08', jewellery: 24, rawMaterial: 19 },
  { date: '2026-04-09', jewellery: 11, rawMaterial: 8 },
  { date: '2026-04-10', jewellery: 19, rawMaterial: 13 },
  { date: '2026-04-11', jewellery: 23, rawMaterial: 17 },
  { date: '2026-04-12', jewellery: 21, rawMaterial: 15 },
  { date: '2026-04-13', jewellery: 26, rawMaterial: 20 },
  { date: '2026-04-14', jewellery: 14, rawMaterial: 10 },
  { date: '2026-04-15', jewellery: 13, rawMaterial: 9 },
  { date: '2026-04-16', jewellery: 16, rawMaterial: 11 },
  { date: '2026-04-17', jewellery: 27, rawMaterial: 21 },
  { date: '2026-04-18', jewellery: 24, rawMaterial: 18 },
  { date: '2026-04-19', jewellery: 18, rawMaterial: 12 },
  { date: '2026-04-20', jewellery: 10, rawMaterial: 7 },
  { date: '2026-04-21', jewellery: 15, rawMaterial: 11 },
  { date: '2026-04-22', jewellery: 19, rawMaterial: 13 },
  { date: '2026-04-23', jewellery: 17, rawMaterial: 12 },
  { date: '2026-04-24', jewellery: 25, rawMaterial: 19 },
  { date: '2026-04-25', jewellery: 18, rawMaterial: 14 },
  { date: '2026-04-26', jewellery: 9, rawMaterial: 6 },
  { date: '2026-04-27', jewellery: 26, rawMaterial: 20 },
  { date: '2026-04-28', jewellery: 14, rawMaterial: 10 },
  { date: '2026-04-29', jewellery: 22, rawMaterial: 16 },
  { date: '2026-04-30', jewellery: 28, rawMaterial: 22 },
  { date: '2026-05-01', jewellery: 15, rawMaterial: 12 },
  { date: '2026-05-02', jewellery: 21, rawMaterial: 16 },
  { date: '2026-05-03', jewellery: 19, rawMaterial: 13 },
  { date: '2026-05-04', jewellery: 26, rawMaterial: 19 },
  { date: '2026-05-05', jewellery: 29, rawMaterial: 23 },
  { date: '2026-05-06', jewellery: 31, rawMaterial: 24 },
  { date: '2026-05-07', jewellery: 25, rawMaterial: 18 },
  { date: '2026-05-08', jewellery: 13, rawMaterial: 10 },
  { date: '2026-05-09', jewellery: 18, rawMaterial: 12 },
  { date: '2026-05-10', jewellery: 22, rawMaterial: 16 },
  { date: '2026-05-11', jewellery: 24, rawMaterial: 17 },
  { date: '2026-05-12', jewellery: 17, rawMaterial: 13 },
  { date: '2026-05-13', jewellery: 16, rawMaterial: 11 },
  { date: '2026-05-14', jewellery: 28, rawMaterial: 21 },
  { date: '2026-05-15', jewellery: 30, rawMaterial: 22 },
  { date: '2026-05-16', jewellery: 23, rawMaterial: 18 },
  { date: '2026-05-17', jewellery: 31, rawMaterial: 23 },
  { date: '2026-05-18', jewellery: 22, rawMaterial: 17 },
  { date: '2026-05-19', jewellery: 17, rawMaterial: 12 },
  { date: '2026-05-20', jewellery: 15, rawMaterial: 11 },
  { date: '2026-05-21', jewellery: 11, rawMaterial: 8 },
  { date: '2026-05-22', jewellery: 10, rawMaterial: 7 },
  { date: '2026-05-23', jewellery: 20, rawMaterial: 15 },
  { date: '2026-05-24', jewellery: 23, rawMaterial: 16 },
  { date: '2026-05-25', jewellery: 17, rawMaterial: 13 },
  { date: '2026-05-26', jewellery: 18, rawMaterial: 12 },
  { date: '2026-05-27', jewellery: 27, rawMaterial: 21 },
  { date: '2026-05-28', jewellery: 19, rawMaterial: 14 },
  { date: '2026-05-29', jewellery: 12, rawMaterial: 9 },
  { date: '2026-05-30', jewellery: 24, rawMaterial: 17 },
  { date: '2026-05-31', jewellery: 16, rawMaterial: 12 },
  { date: '2026-06-01', jewellery: 17, rawMaterial: 11 },
  { date: '2026-06-02', jewellery: 28, rawMaterial: 22 },
  { date: '2026-06-03', jewellery: 12, rawMaterial: 9 },
  { date: '2026-06-04', jewellery: 27, rawMaterial: 20 },
  { date: '2026-06-05', jewellery: 11, rawMaterial: 8 },
  { date: '2026-06-06', jewellery: 21, rawMaterial: 15 },
  { date: '2026-06-07', jewellery: 23, rawMaterial: 17 },
  { date: '2026-06-08', jewellery: 26, rawMaterial: 19 },
  { date: '2026-06-09', jewellery: 29, rawMaterial: 23 },
  { date: '2026-06-10', jewellery: 15, rawMaterial: 11 },
  { date: '2026-06-11', jewellery: 11, rawMaterial: 8 },
  { date: '2026-06-12', jewellery: 30, rawMaterial: 22 },
  { date: '2026-06-13', jewellery: 10, rawMaterial: 7 },
  { date: '2026-06-14', jewellery: 27, rawMaterial: 21 },
  { date: '2026-06-15', jewellery: 22, rawMaterial: 17 },
  { date: '2026-06-16', jewellery: 25, rawMaterial: 18 },
  { date: '2026-06-17', jewellery: 32, rawMaterial: 24 },
  { date: '2026-06-18', jewellery: 13, rawMaterial: 10 },
  { date: '2026-06-19', jewellery: 24, rawMaterial: 17 },
  { date: '2026-06-20', jewellery: 28, rawMaterial: 22 },
  { date: '2026-06-21', jewellery: 16, rawMaterial: 12 },
  { date: '2026-06-22', jewellery: 23, rawMaterial: 16 },
  { date: '2026-06-23', jewellery: 31, rawMaterial: 25 },
  { date: '2026-06-24', jewellery: 14, rawMaterial: 11 },
  { date: '2026-06-25', jewellery: 19, rawMaterial: 14 },
  { date: '2026-06-26', jewellery: 28, rawMaterial: 21 },
  { date: '2026-06-27', jewellery: 29, rawMaterial: 23 },
  { date: '2026-06-28', jewellery: 15, rawMaterial: 11 },
  { date: '2026-06-29', jewellery: 12, rawMaterial: 9 },
  { date: '2026-06-30', jewellery: 28, rawMaterial: 21 },
]

const chartConfig = {
  orders: {
    label: 'Orders',
  },
  jewellery: {
    label: 'Jewellery Orders',
    color: 'var(--chart-1)',
  },
  rawMaterial: {
    label: 'Raw Material Orders',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('90d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2026-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>B2B Sales Overview</CardTitle>
        <CardDescription>
          Wholesale order activity over time
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val: any) => {
              if (Array.isArray(val) && val[0]) setTimeRange(val[0])
              else if (typeof val === 'string' && val) setTimeRange(val)
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillJewellery" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-jewellery)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-jewellery)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRawMaterial" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rawMaterial)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rawMaterial)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="rawMaterial"
              type="natural"
              fill="url(#fillRawMaterial)"
              stroke="var(--color-rawMaterial)"
              stackId="a"
            />
            <Area
              dataKey="jewellery"
              type="natural"
              fill="url(#fillJewellery)"
              stroke="var(--color-jewellery)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
