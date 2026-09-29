'use client'

// React Imports
import { useState } from 'react'

// Third-party Imports
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  TrendingUpIcon,
  BadgePercentIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  ChevronDown
} from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Metrics Data for Sales Overview
const MetricsData = [
  {
    icons: <TrendingUpIcon className='size-5' />,
    title: 'Gross Sales',
    value: 'SAR 184,650'
  },
  {
    icons: <BadgePercentIcon className='size-5' />,
    title: 'Discounts',
    value: 'SAR 8,320'
  },
  {
    icons: <DollarSignIcon className='size-5' />,
    title: 'Net Sales',
    value: 'SAR 176,330'
  },
  {
    icons: <ShoppingBagIcon className='size-5' />,
    title: 'Total Orders',
    value: '248'
  }
]

// Sales by Category Donut Chart Data
const categorySalesData = [
  { category: 'Rings', percentage: 36, fill: 'var(--chart-1)' },
  { category: 'Necklaces', percentage: 28, fill: 'var(--chart-2)' },
  { category: 'Earrings', percentage: 21, fill: 'var(--chart-3)' },
  { category: 'Bracelets', percentage: 15, fill: 'var(--chart-4)' }
]

const categorySalesConfig = {
  percentage: {
    label: 'Share'
  },
  Rings: {
    label: 'Rings (36%)',
    color: 'var(--chart-1)'
  },
  Necklaces: {
    label: 'Necklaces (28%)',
    color: 'var(--chart-2)'
  },
  Earrings: {
    label: 'Earrings (21%)',
    color: 'var(--chart-3)'
  },
  Bracelets: {
    label: 'Bracelets (15%)',
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig

// Monthly Order Overview Datasets per Period (Unique Orders)
interface PeriodData {
  totalOrders: number
  data: {
    month: string
    fullMonth: string
    TotalOrders: number
    Pending: number
    Confirmed: number
    Processing: number
    Delivered: number
    Cancelled: number
  }[]
}

const periodDatasets: Record<string, PeriodData> = {
  'This Year': {
    totalOrders: 248,
    data: [
      { month: 'Apr', fullMonth: 'April', TotalOrders: 158, Pending: 26, Confirmed: 34, Processing: 21, Delivered: 72, Cancelled: 5 },
      { month: 'May', fullMonth: 'May', TotalOrders: 181, Pending: 31, Confirmed: 41, Processing: 27, Delivered: 76, Cancelled: 6 },
      { month: 'Jun', fullMonth: 'June', TotalOrders: 174, Pending: 22, Confirmed: 36, Processing: 31, Delivered: 79, Cancelled: 6 },
      { month: 'Jul', fullMonth: 'July', TotalOrders: 213, Pending: 35, Confirmed: 48, Processing: 25, Delivered: 98, Cancelled: 7 },
      { month: 'Aug', fullMonth: 'August', TotalOrders: 226, Pending: 28, Confirmed: 39, Processing: 34, Delivered: 119, Cancelled: 6 },
      { month: 'Sep', fullMonth: 'September', TotalOrders: 248, Pending: 18, Confirmed: 46, Processing: 29, Delivered: 149, Cancelled: 6 }
    ]
  },
  'Last 6 Months': {
    totalOrders: 248,
    data: [
      { month: 'Apr', fullMonth: 'April', TotalOrders: 158, Pending: 26, Confirmed: 34, Processing: 21, Delivered: 72, Cancelled: 5 },
      { month: 'May', fullMonth: 'May', TotalOrders: 181, Pending: 31, Confirmed: 41, Processing: 27, Delivered: 76, Cancelled: 6 },
      { month: 'Jun', fullMonth: 'June', TotalOrders: 174, Pending: 22, Confirmed: 36, Processing: 31, Delivered: 79, Cancelled: 6 },
      { month: 'Jul', fullMonth: 'July', TotalOrders: 213, Pending: 35, Confirmed: 48, Processing: 25, Delivered: 98, Cancelled: 7 },
      { month: 'Aug', fullMonth: 'August', TotalOrders: 226, Pending: 28, Confirmed: 39, Processing: 34, Delivered: 119, Cancelled: 6 },
      { month: 'Sep', fullMonth: 'September', TotalOrders: 248, Pending: 18, Confirmed: 46, Processing: 29, Delivered: 149, Cancelled: 6 }
    ]
  },
  'Last 3 Months': {
    totalOrders: 248,
    data: [
      { month: 'Jul', fullMonth: 'July', TotalOrders: 213, Pending: 35, Confirmed: 48, Processing: 25, Delivered: 98, Cancelled: 7 },
      { month: 'Aug', fullMonth: 'August', TotalOrders: 226, Pending: 28, Confirmed: 39, Processing: 34, Delivered: 119, Cancelled: 6 },
      { month: 'Sep', fullMonth: 'September', TotalOrders: 248, Pending: 18, Confirmed: 46, Processing: 29, Delivered: 149, Cancelled: 6 }
    ]
  }
}

// Custom Tooltip for Order Overview Multi-Line Chart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderTrendsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const items = [
      { name: 'Total Orders', value: data.TotalOrders, color: 'var(--chart-1)' },
      { name: 'Pending', value: data.Pending, color: '#D97706' },
      { name: 'Confirmed', value: data.Confirmed, color: '#2563EB' },
      { name: 'Processing', value: data.Processing, color: '#7C3AED' },
      { name: 'Delivered', value: data.Delivered, color: '#16A34A' },
      { name: 'Cancelled', value: data.Cancelled, color: '#DC2626' }
    ]

    return (
      <div className='rounded-md border border-border bg-popover p-3 text-xs shadow-lg min-w-44'>
        <p className='font-semibold text-popover-foreground mb-2 text-sm border-b border-border/50 pb-1'>
          {data.fullMonth || label}
        </p>
        <div className='flex flex-col gap-1.5'>
          {items.map((item, index) => (
            <div key={index} className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-1.5'>
                <span
                  className='size-2 rounded-full shrink-0'
                  style={{ backgroundColor: item.color }}
                />
                <span className={item.name === 'Total Orders' ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                  {item.name}
                </span>
              </div>
              <span className='font-semibold text-foreground'>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Order Overview Multi-Line Chart Component (Standalone Card)
export const OrderOverviewCard = ({ className }: { className?: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Year')
  const currentPeriodData = periodDatasets[selectedPeriod] || periodDatasets['This Year']

  return (
    <Card className={cn('ring-foreground/10 shadow-none ring-1', className)}>
      <CardContent className='flex flex-col gap-6 p-6'>
        {/* Header: Title/Subtitle on left, Total Orders + Period selector on right */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <span className='text-lg font-semibold'>Order Overview</span>
            <span className='text-muted-foreground text-sm'>
              Order status trends over time
            </span>
          </div>

          <div className='flex items-center gap-5 sm:gap-6'>
            <div className='flex flex-col items-end text-right'>
              <span className='text-xs text-muted-foreground font-medium'>Total Orders</span>
              <span className='text-lg sm:text-xl font-bold tracking-tight'>{currentPeriodData.totalOrders}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='outline' size='sm' className='h-8 gap-1.5 text-xs font-normal'>
                    <span>{selectedPeriod}</span>
                    <ChevronDown className='size-3.5 opacity-60' />
                  </Button>
                }
              />
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setSelectedPeriod('This Year')}>
                  This Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod('Last 6 Months')}>
                  Last 6 Months
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod('Last 3 Months')}>
                  Last 3 Months
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Legend row */}
        <div className='flex flex-wrap items-center gap-5 text-xs font-medium'>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[var(--chart-1)]' />
            <span className='font-semibold text-foreground'>Total Orders</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#D97706]' />
            <span className='text-muted-foreground'>Pending</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#2563EB]' />
            <span className='text-muted-foreground'>Confirmed</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#7C3AED]' />
            <span className='text-muted-foreground'>Processing</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#16A34A]' />
            <span className='text-muted-foreground'>Delivered</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#DC2626]' />
            <span className='text-muted-foreground'>Cancelled</span>
          </div>
        </div>

        {/* Multi-line chart */}
        <div className='h-72 w-full min-w-0 pt-1'>
          <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={250}>
            <LineChart data={currentPeriodData.data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-border/40' />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className='text-xs fill-muted-foreground'
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 260]}
                ticks={[0, 50, 100, 150, 200, 250]}
                className='text-xs fill-muted-foreground'
              />
              <Tooltip content={<OrderTrendsTooltip />} />
              <Line
                type='monotone'
                dataKey='TotalOrders'
                name='Total Orders'
                stroke='var(--chart-1)'
                strokeWidth={3.25}
                dot={{ r: 4, fill: 'var(--chart-1)', stroke: 'var(--card)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--chart-1)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
              <Line
                type='monotone'
                dataKey='Delivered'
                name='Delivered'
                stroke='#16A34A'
                strokeWidth={2.25}
                dot={{ r: 3.5, fill: '#16A34A', stroke: 'var(--card)', strokeWidth: 1.5 }}
                activeDot={{ r: 5.5, fill: '#16A34A', stroke: 'var(--card)', strokeWidth: 2 }}
              />
              <Line
                type='monotone'
                dataKey='Confirmed'
                name='Confirmed'
                stroke='#2563EB'
                strokeWidth={2}
                dot={{ r: 3.5, fill: '#2563EB', stroke: 'var(--card)', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#2563EB', stroke: 'var(--card)', strokeWidth: 2 }}
              />
              <Line
                type='monotone'
                dataKey='Processing'
                name='Processing'
                stroke='#7C3AED'
                strokeWidth={2}
                dot={{ r: 3.5, fill: '#7C3AED', stroke: 'var(--card)', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#7C3AED', stroke: 'var(--card)', strokeWidth: 2 }}
              />
              <Line
                type='monotone'
                dataKey='Pending'
                name='Pending'
                stroke='#D97706'
                strokeWidth={2}
                dot={{ r: 3.5, fill: '#D97706', stroke: 'var(--card)', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#D97706', stroke: 'var(--card)', strokeWidth: 2 }}
              />
              <Line
                type='monotone'
                dataKey='Cancelled'
                name='Cancelled'
                stroke='#DC2626'
                strokeWidth={1.5}
                strokeDasharray='4 3'
                dot={{ r: 3, fill: '#DC2626', stroke: 'var(--card)', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#DC2626', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Sales Overview + Sales by Category Component
const SalesMetricsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardContent>
        <OrderOverviewCard />

        <div className='grid gap-6 lg:grid-cols-5'>
          <div className='flex flex-col justify-between gap-7 lg:col-span-3'>
            <span className='text-lg font-semibold'>Sales Overview</span>
            <div className='flex items-center gap-3'>
              <img src='/images/logo.png' className='size-11 object-contain shrink-0' alt='VenVision logo' />
              <div className='flex flex-col gap-0.5'>
                <span className='text-xl font-medium'>VenVision</span>
                <span className='text-muted-foreground text-sm'>contact@venvision.com</span>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {MetricsData.map((metric, index) => (
                <Card key={index} className='ring-foreground/10 py-2 shadow-none ring-1'>
                  <CardContent className='flex items-center gap-3 px-4'>
                    <Avatar className='rounded-sm after:border-0'>
                      <AvatarFallback className='bg-primary/10 text-primary shrink-0 rounded-sm'>
                        {metric.icons}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-muted-foreground text-sm font-medium'>{metric.title}</span>
                      <span className='text-lg font-medium'>{metric.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className='ring-foreground/10 justify-between gap-4 shadow-none ring-1 lg:col-span-2'>
            <CardHeader className='gap-1'>
              <CardTitle className='text-lg font-semibold'>Sales by Category</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <ChartContainer config={categorySalesConfig} className='h-38.5 w-full'>
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={categorySalesData}
                    dataKey='percentage'
                    nameKey='category'
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={58}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 8}
                                className='fill-card-foreground text-2xl font-bold'
                              >
                                36%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 16}
                                className='fill-muted-foreground text-xs font-medium'
                              >
                                Rings
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className='flex flex-col gap-2 pt-2 border-t border-border/40 text-xs'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 rounded-full bg-[var(--chart-1)]' />
                    <span className='text-muted-foreground font-medium'>Rings</span>
                  </div>
                  <span className='font-semibold'>36%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 rounded-full bg-[var(--chart-2)]' />
                    <span className='text-muted-foreground font-medium'>Necklaces</span>
                  </div>
                  <span className='font-semibold'>28%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 rounded-full bg-[var(--chart-3)]' />
                    <span className='text-muted-foreground font-medium'>Earrings</span>
                  </div>
                  <span className='font-semibold'>21%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 rounded-full bg-[var(--chart-4)]' />
                    <span className='text-muted-foreground font-medium'>Bracelets</span>
                  </div>
                  <span className='font-semibold'>15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesMetricsCard
