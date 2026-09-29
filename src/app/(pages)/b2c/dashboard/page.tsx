import { ShoppingBag, TrendingUp, Users, Gem, Sparkles, Disc, CircleDot } from 'lucide-react'

import { Card } from '@/components/ui/card'

import ProductInsightsCard from '@/views/dashboards/widgets/widget-product-insights'
import SalesMetricsCard from '@/views/dashboards/charts/chart-sales-metrics'
import StatisticsCard from '@/views/dashboards/statistics/statistics-card-01'
import TotalEarningCard from '@/views/dashboards/widgets/widget-total-earning'
import TransactionDatatable, { type Item } from '@/views/datatables/datatable-transaction'

// Statistics card data for B2C Retail Jewellery
const StatisticsCardData = [
  {
    icon: <ShoppingBag className='size-4' />,
    value: '248',
    title: 'Total Orders',
    changePercentage: '+12.4%',
    comparisonText: 'vs last month'
  },
  {
    icon: <TrendingUp className='size-4' />,
    value: 'SAR 184,650',
    title: 'Total Revenue',
    changePercentage: '+8.7%',
    comparisonText: 'vs last month'
  },
  {
    icon: <Users className='size-4' />,
    value: '1,284',
    title: 'Total Customers',
    changePercentage: '+5.3%',
    comparisonText: 'vs last month'
  }
]

// Top-selling categories for B2C Revenue card
const earningData = [
  {
    icon: <Gem className='size-5 text-primary' />,
    platform: 'Rings',
    technologies: 'Solitaires, Eternity & Bands',
    earnings: 'SAR 32,800',
    progressPercentage: 37
  },
  {
    icon: <Sparkles className='size-5 text-primary' />,
    platform: 'Necklaces',
    technologies: 'Chokers & Diamond Pendants',
    earnings: 'SAR 24,650',
    progressPercentage: 28
  },
  {
    icon: <Disc className='size-5 text-primary' />,
    platform: 'Earrings',
    technologies: 'Diamond Studs & Drop Earrings',
    earnings: 'SAR 18,400',
    progressPercentage: 20
  },
  {
    icon: <CircleDot className='size-5 text-primary' />,
    platform: 'Bracelets',
    technologies: 'Tennis Bracelets & Bangles',
    earnings: 'SAR 13,600',
    progressPercentage: 15
  }
]

// Transaction table data for B2C Retail Customers
const transactionData: Item[] = [
  {
    id: 'b2c-1',
    avatar: '/images/avatars/avatar-1.webp',
    avatarFallback: 'NS',
    name: 'Nouf Al-Shahrani',
    amount: 18154.59,
    status: 'paid',
    email: 'nouf.shahrani@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: 'b2c-2',
    avatar: '/images/avatars/avatar-2.webp',
    avatarFallback: 'TH',
    name: 'Tariq Al-Harbi',
    amount: 20244.11,
    status: 'paid',
    email: 'tariq.harbi@outlook.sa',
    paidBy: 'visa'
  },
  {
    id: 'b2c-3',
    avatar: '/images/avatars/avatar-3.webp',
    avatarFallback: 'SF',
    name: 'Sarah Bint Fahad',
    amount: 43467.59,
    status: 'paid',
    email: 'sarah.f@yahoo.com',
    paidBy: 'mastercard'
  },
  {
    id: 'b2c-4',
    avatar: '/images/avatars/avatar-4.webp',
    avatarFallback: 'FQ',
    name: 'Faisal Al-Qahtani',
    amount: 16821.93,
    status: 'pending',
    email: 'faisal.q@hotmail.com',
    paidBy: 'visa'
  },
  {
    id: 'b2c-5',
    avatar: '/images/avatars/avatar-5.webp',
    avatarFallback: 'NO',
    name: 'Noura Al-Otaibi',
    amount: 8619.72,
    status: 'paid',
    email: 'noura.otaibi@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: 'b2c-6',
    avatar: '/images/avatars/avatar-6.webp',
    avatarFallback: 'MS',
    name: 'Maha Al-Sudairi',
    amount: 11624.39,
    status: 'paid',
    email: 'maha.sudairi@outlook.com',
    paidBy: 'visa'
  },
  {
    id: 'b2c-7',
    avatar: '/images/avatars/avatar-7.webp',
    avatarFallback: 'HM',
    name: 'Hessa Al-Muhaidib',
    amount: 23500.0,
    status: 'processing',
    email: 'hessa.m@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: 'b2c-8',
    avatar: '/images/avatars/avatar-8.webp',
    avatarFallback: 'LG',
    name: 'Lulwa Al-Ghamdi',
    amount: 7450.0,
    status: 'paid',
    email: 'lulwa.g@yahoo.com',
    paidBy: 'visa'
  }
]

const B2CDashboard = () => {
  return (
    <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
      {/* 1. Top KPI cards */}
      <div className='col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1'>
        {StatisticsCardData.map((card, index) => (
          <StatisticsCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            changePercentage={card.changePercentage}
            comparisonText={card.comparisonText}
          />
        ))}
      </div>

      {/* Row 2 & 3 Left: Shopping Activity + B2C Revenue */}
      <div className='grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2'>
        {/* Shopping Activity */}
        <ProductInsightsCard className='justify-between gap-3 *:data-[slot=card-content]:space-y-5' />

        {/* B2C Revenue Card */}
        <TotalEarningCard
          title='B2C Revenue'
          earning='SAR 89,450'
          trend='up'
          percentage={15}
          comparisonText='+15% vs last month'
          earningData={earningData}
          className='justify-between gap-5 sm:min-w-0'
        />
      </div>

      {/* Row 2 & 3 Right: Sales Overview with Sales by Category & Order Overview */}
      <SalesMetricsCard className='col-span-full *:data-[slot=card-content]:space-y-6 xl:col-span-2' />

      <Card className='col-span-full w-full py-0'>

        <TransactionDatatable data={transactionData} />
      </Card>
    </div>
  )
}

export default B2CDashboard
