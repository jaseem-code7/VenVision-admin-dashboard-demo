// Type Imports
import type { ReactNode } from 'react'

// Component Imports
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Statistics card data type
type StatisticsCardProps = {
  icon: ReactNode
  value: string
  title: string
  changePercentage: string
  comparisonText?: string
  className?: string
}

const StatisticsCard = ({ icon, value, title, changePercentage, comparisonText = 'vs last month', className }: StatisticsCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className='flex items-center gap-2'>
        <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm'>
          {icon}
        </div>
        <span className='text-2xl font-semibold'>{value}</span>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <span className='text-base font-semibold'>{title}</span>
        <p className='space-x-2'>
          <span>{changePercentage}</span>
          <span className='text-muted-foreground'>{comparisonText}</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
