'use client'

// Third-party Imports
import { Bar, BarChart } from 'recharts'

// Component Imports
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

// Product views data
const productViewsChartData = [
  { month: 'January', views: 168 },
  { month: 'February', views: 305 },
  { month: 'March', views: 213 },
  { month: 'April', views: 330 },
  { month: 'May', views: 305 }
]

const productViewsChartConfig = {
  views: {
    label: 'Views',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

// Added to cart data
const addedToCartChartData = [
  { month: 'January', carts: 168 },
  { month: 'February', carts: 305 },
  { month: 'March', carts: 213 },
  { month: 'April', carts: 330 },
  { month: 'May', carts: 305 }
]

const addedToCartChartConfig = {
  carts: {
    label: 'Cart',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig

// Conversion to cart data
const conversionChartData = [
  { month: 'January', rate: 9.8 },
  { month: 'February', rate: 10.2 },
  { month: 'March', rate: 9.6 },
  { month: 'April', rate: 10.1 },
  { month: 'May', rate: 10.0 }
]

const conversionChartConfig = {
  rate: {
    label: 'Conversion',
    color: 'var(--chart-3)'
  }
} satisfies ChartConfig

const ProductInsightsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Shopping Activity</span>
          <span className='text-muted-foreground text-sm'>Live visitor engagement metrics</span>
        </div>
        <img src='/images/widgets/image-7.webp' alt='Product' className='w-20.5 rounded-md' />
      </CardHeader>
      <CardContent>
        <Separator />
      </CardContent>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-muted-foreground'>Product Views</span>
            <span className='text-2xl font-semibold'>21,153</span>
          </div>
          <ChartContainer config={productViewsChartConfig} className='min-h-12 max-w-18'>
            <BarChart accessibilityLayer data={productViewsChartData} barSize={8}>
              <Bar dataKey='views' fill='var(--color-views)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-muted-foreground'>Added to Cart</span>
            <span className='text-2xl font-semibold'>2,123</span>
          </div>
          <ChartContainer config={addedToCartChartConfig} className='min-h-12 max-w-18'>
            <BarChart accessibilityLayer data={addedToCartChartData} barSize={8}>
              <Bar dataKey='carts' fill='var(--color-carts)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-muted-foreground'>Conversion to Cart</span>
            <span className='text-2xl font-semibold'>10.0%</span>
          </div>
          <ChartContainer config={conversionChartConfig} className='min-h-12 max-w-18'>
            <BarChart accessibilityLayer data={conversionChartData} barSize={8}>
              <Bar dataKey='rate' fill='var(--color-rate)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInsightsCard
