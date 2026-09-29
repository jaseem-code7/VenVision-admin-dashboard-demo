'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Truck,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  User,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Gift,
  Globe,
  MoreVertical
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

// ==========================================
// MOCK REPORT DATASETS
// ==========================================

// Sales over time (B2C vs B2B)
const SALES_OVER_TIME = [
  { date: '19 Sep', b2cSales: 16800, b2bSales: 12000, orders: 142, totalRevenue: 28800 },
  { date: '20 Sep', b2cSales: 21500, b2bSales: 15000, orders: 185, totalRevenue: 36500 },
  { date: '21 Sep', b2cSales: 19200, b2bSales: 18000, orders: 164, totalRevenue: 37200 },
  { date: '22 Sep', b2cSales: 24600, b2bSales: 14000, orders: 205, totalRevenue: 38600 },
  { date: '23 Sep', b2cSales: 22400, b2bSales: 19000, orders: 190, totalRevenue: 41400 },
  { date: '24 Sep', b2cSales: 19500, b2bSales: 11000, orders: 172, totalRevenue: 30500 },
  { date: '25 Sep', b2cSales: 21000, b2bSales: 11000, orders: 190, totalRevenue: 32000 }
]

// Product performance records
const PRODUCT_REPORT_DATA = [
  {
    id: 'prod-1',
    product: '18K Diamond Solitaire Ring',
    category: 'Diamond Jewellery',
    channel: 'B2C' as const,
    quantitySold: 124,
    revenueSAR: 305000,
    stock: 18,
    performance: 'Top Seller'
  },
  {
    id: 'prod-2',
    product: '100g 999.9 Fine Gold Bar',
    category: 'Bullion',
    channel: 'B2B' as const,
    quantitySold: 42,
    revenueSAR: 1140300,
    stock: 45,
    performance: 'Top Seller'
  },
  {
    id: 'prod-3',
    product: 'Emerald Cut Diamond Tennis Bracelet',
    category: 'High Jewellery',
    channel: 'B2C' as const,
    quantitySold: 68,
    revenueSAR: 442000,
    stock: 12,
    performance: 'Top Seller'
  },
  {
    id: 'prod-4',
    product: '1kg Investment Bullion Ingot',
    category: 'Bullion',
    channel: 'B2B' as const,
    quantitySold: 18,
    revenueSAR: 5610000,
    stock: 20,
    performance: 'Top Seller'
  },
  {
    id: 'prod-5',
    product: '21K Traditional Bridal Choker',
    category: 'Gold Jewellery',
    channel: 'B2C' as const,
    quantitySold: 54,
    revenueSAR: 216000,
    stock: 8,
    performance: 'Moderate'
  },
  {
    id: 'prod-6',
    product: 'Raw Gold Casting Grain 999.9 (100g)',
    category: 'Atelier Raw Materials',
    channel: 'B2B' as const,
    quantitySold: 35,
    revenueSAR: 952000,
    stock: 60,
    performance: 'Moderate'
  },
  {
    id: 'prod-7',
    product: '18K Rose Gold Eternity Band',
    category: 'Rings',
    channel: 'B2C' as const,
    quantitySold: 22,
    revenueSAR: 48400,
    stock: 4,
    performance: 'Low Stock'
  }
]

// Order status breakdown
const ORDER_REPORT_DATA = [
  {
    status: 'Completed',
    b2cOrders: 420,
    b2bOrders: 180,
    totalOrders: 600,
    orderValueSAR: 185000,
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
  },
  {
    status: 'Pending',
    b2cOrders: 85,
    b2bOrders: 32,
    totalOrders: 117,
    orderValueSAR: 41000,
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
  },
  {
    status: 'In Transit',
    b2cOrders: 75,
    b2bOrders: 15,
    totalOrders: 90,
    orderValueSAR: 32500,
    badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20'
  },
  {
    status: 'Cancelled',
    b2cOrders: 18,
    b2bOrders: 9,
    totalOrders: 27,
    orderValueSAR: 8400,
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
  },
  {
    status: 'Returned',
    b2cOrders: 10,
    b2bOrders: 4,
    totalOrders: 14,
    orderValueSAR: 5200,
    badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20'
  }
]

// Delivery courier comparison
const COURIER_DELIVERY_DATA = [
  {
    courier: 'SPL – Saudi Post',
    shipments: 520,
    delivered: 505,
    failed: 8,
    averageCostSAR: 22.0,
    averageDeliveryDays: 2.8,
    totalCostSAR: 11440
  },
  {
    courier: 'SMSA Express',
    shipments: 410,
    delivered: 397,
    failed: 9,
    averageCostSAR: 25.0,
    averageDeliveryDays: 2.1,
    totalCostSAR: 10250
  },
  {
    courier: 'Aramex',
    shipments: 280,
    delivered: 271,
    failed: 6,
    averageCostSAR: 27.0,
    averageDeliveryDays: 2.0,
    totalCostSAR: 7560
  },
  {
    courier: 'AJEX Logistics',
    shipments: 190,
    delivered: 182,
    failed: 5,
    averageCostSAR: 24.0,
    averageDeliveryDays: 2.3,
    totalCostSAR: 4560
  },
  {
    courier: 'iMile Delivery',
    shipments: 150,
    delivered: 142,
    failed: 5,
    averageCostSAR: 21.0,
    averageDeliveryDays: 2.7,
    totalCostSAR: 3150
  }
]

// Finance comparison chart data (Revenue vs Expenses)
const FINANCE_CHART_DATA = [
  { month: 'Jun', revenue: 198000, expenses: 146000, netProfit: 52000 },
  { month: 'Jul', revenue: 215000, expenses: 158000, netProfit: 57000 },
  { month: 'Aug', revenue: 232000, expenses: 171000, netProfit: 61000 },
  { month: 'Sep', revenue: 245000, expenses: 181200, netProfit: 63800 }
]

// Detailed Daily Finance Table rows
const DETAILED_FINANCE_ROWS = [
  {
    date: '01 Sep 2026',
    revenueSAR: 18500,
    productCostSAR: 11200,
    deliverySAR: 950,
    paymentFeesSAR: 240,
    discountSAR: 300,
    vatSAR: 2413,
    netProfitSAR: 5810
  },
  {
    date: '02 Sep 2026',
    revenueSAR: 22400,
    productCostSAR: 14100,
    deliverySAR: 1150,
    paymentFeesSAR: 290,
    discountSAR: 450,
    vatSAR: 2921,
    netProfitSAR: 6410
  },
  {
    date: '03 Sep 2026',
    revenueSAR: 19800,
    productCostSAR: 12500,
    deliverySAR: 1020,
    paymentFeesSAR: 255,
    discountSAR: 350,
    vatSAR: 2582,
    netProfitSAR: 5675
  },
  {
    date: '04 Sep 2026',
    revenueSAR: 26500,
    productCostSAR: 17200,
    deliverySAR: 1350,
    paymentFeesSAR: 345,
    discountSAR: 500,
    vatSAR: 3456,
    netProfitSAR: 7105
  },
  {
    date: '05 Sep 2026',
    revenueSAR: 21200,
    productCostSAR: 13800,
    deliverySAR: 1100,
    paymentFeesSAR: 275,
    discountSAR: 400,
    vatSAR: 2765,
    netProfitSAR: 5625
  },
  {
    date: '06 Sep 2026',
    revenueSAR: 24800,
    productCostSAR: 16100,
    deliverySAR: 1280,
    paymentFeesSAR: 320,
    discountSAR: 420,
    vatSAR: 3234,
    netProfitSAR: 6680
  },
  {
    date: '07 Sep 2026',
    revenueSAR: 28500,
    productCostSAR: 18900,
    deliverySAR: 1450,
    paymentFeesSAR: 370,
    discountSAR: 600,
    vatSAR: 3717,
    netProfitSAR: 7180
  }
]

// ==========================================
// ANALYTICS INCOME VS EXPENSES DATASET
// ==========================================

const ANALYTICS_DATA = [
  { month: 'Jan', income: 42000, expenses: 26000 },
  { month: 'Feb', income: 38000, expenses: 24000 },
  { month: 'Mar', income: 49000, expenses: 31000 },
  { month: 'Apr', income: 58000, expenses: 34000 },
  { month: 'May', income: 72000, expenses: 39000 },
  { month: 'Jun', income: 84000, expenses: 45000 },
  { month: 'Jul', income: 68000, expenses: 42000 },
  { month: 'Aug', income: 62000, expenses: 38000 },
  { month: 'Sep', income: 76000, expenses: 43000 },
  { month: 'Oct', income: 81000, expenses: 46000 },
  { month: 'Nov', income: 94000, expenses: 51000 },
  { month: 'Dec', income: 112000, expenses: 58000 }
]

// ==========================================
// ACTIVITY BY TIME HEATMAP DATASET
// ==========================================

const ACTIVITY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const ACTIVITY_HOURS = ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'] as const

type ActivityLevel = 1 | 2 | 3 | 4 | 5

interface ActivityCell {
  orders: number
  sales: number
  level: ActivityLevel
}

const ACTIVITY_DATA: Record<string, Record<string, ActivityCell>> = {
  '1 PM': {
    Mon: { orders: 8, sales: 2950, level: 1 },
    Tue: { orders: 10, sales: 3400, level: 1 },
    Wed: { orders: 11, sales: 3850, level: 1 },
    Thu: { orders: 18, sales: 6420, level: 2 },
    Fri: { orders: 12, sales: 4100, level: 1 },
    Sat: { orders: 9, sales: 3150, level: 1 },
    Sun: { orders: 7, sales: 2450, level: 1 }
  },
  '2 PM': {
    Mon: { orders: 11, sales: 3850, level: 1 },
    Tue: { orders: 13, sales: 4550, level: 1 },
    Wed: { orders: 22, sales: 7920, level: 3 },
    Thu: { orders: 31, sales: 11480, level: 4 },
    Fri: { orders: 24, sales: 8640, level: 3 },
    Sat: { orders: 14, sales: 4900, level: 1 },
    Sun: { orders: 9, sales: 3150, level: 1 }
  },
  '3 PM': {
    Mon: { orders: 12, sales: 4200, level: 1 },
    Tue: { orders: 20, sales: 7200, level: 2 },
    Wed: { orders: 32, sales: 11840, level: 4 },
    Thu: { orders: 35, sales: 12950, level: 4 },
    Fri: { orders: 34, sales: 12580, level: 4 },
    Sat: { orders: 21, sales: 7560, level: 2 },
    Sun: { orders: 11, sales: 3850, level: 1 }
  },
  '4 PM': {
    Mon: { orders: 19, sales: 6840, level: 2 },
    Tue: { orders: 14, sales: 4900, level: 1 },
    Wed: { orders: 26, sales: 9360, level: 3 },
    Thu: { orders: 42, sales: 18450, level: 5 },
    Fri: { orders: 28, sales: 10080, level: 3 },
    Sat: { orders: 25, sales: 9000, level: 2 },
    Sun: { orders: 13, sales: 4550, level: 1 }
  },
  '5 PM': {
    Mon: { orders: 12, sales: 4320, level: 1 },
    Tue: { orders: 23, sales: 8280, level: 2 },
    Wed: { orders: 27, sales: 9720, level: 3 },
    Thu: { orders: 36, sales: 13320, level: 4 },
    Fri: { orders: 40, sales: 17200, level: 5 },
    Sat: { orders: 15, sales: 5400, level: 1 },
    Sun: { orders: 10, sales: 3600, level: 1 }
  },
  '6 PM': {
    Mon: { orders: 9, sales: 3240, level: 1 },
    Tue: { orders: 11, sales: 3960, level: 1 },
    Wed: { orders: 13, sales: 4680, level: 1 },
    Thu: { orders: 22, sales: 8140, level: 2 },
    Fri: { orders: 16, sales: 5760, level: 1 },
    Sat: { orders: 12, sales: 4320, level: 1 },
    Sun: { orders: 8, sales: 2880, level: 1 }
  }
}

export default function ReportsPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const isDark = mounted ? resolvedTheme === 'dark' : true

  const [activeTab, setActiveTab] = React.useState('overview')

  // Global Filter Toolbar State
  const [dateRange, setDateRange] = React.useState('last_30_days')
  const [channelFilter, setChannelFilter] = React.useState('ALL')
  const [categoryFilter, setCategoryFilter] = React.useState('ALL')
  const [appliedFilters, setAppliedFilters] = React.useState({
    dateRange: 'last_30_days',
    channel: 'ALL',
    category: 'ALL'
  })

  // Apply filters action
  const handleApplyFilters = () => {
    setAppliedFilters({
      dateRange,
      channel: channelFilter,
      category: categoryFilter
    })
    toast.success(`Filters applied: ${dateRange.replace(/_/g, ' ')} &bull; ${channelFilter === 'ALL' ? 'All Channels' : channelFilter}`)
  }

  // Reset filters action
  const handleResetFilters = () => {
    setDateRange('last_30_days')
    setChannelFilter('ALL')
    setCategoryFilter('ALL')
    setAppliedFilters({
      dateRange: 'last_30_days',
      channel: 'ALL',
      category: 'ALL'
    })
    toast.info('Filters reset to default 30-day view.')
  }

  // Export handlers
  const handleExport = (type: 'PDF' | 'Excel') => {
    const rangeLabel =
      dateRange === 'today'
        ? 'Today'
        : dateRange === 'yesterday'
        ? 'Yesterday'
        : dateRange === 'last_7_days'
        ? 'Last 7 Days'
        : dateRange === 'last_30_days'
        ? 'Last 30 Days'
        : dateRange === 'this_month'
        ? 'This Month'
        : 'Last Month'

    toast.success(
      `Exporting ${type}: ${activeTab.toUpperCase()} report for ${rangeLabel} (${channelFilter} channel)...`
    )
  }

  return (
    <div className='flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full'>
      {/* ================================================== */}
      {/* 1. BREADCRUMB & PAGE HEADER                        */}
      {/* ================================================== */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5'>
        <div className='space-y-1.5'>
          {/* Breadcrumb */}
          <nav className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <ChevronRight className='size-3 text-muted-foreground/60' />
            <span className='font-medium text-foreground'>Reports</span>
          </nav>

          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5'>
            <BarChart3 className='size-7 text-primary' />
            Reports
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            View business performance, sales, orders, delivery costs and financial reports.
          </p>
        </div>

        {/* Top-Right Export Buttons */}
        <div className='flex items-center gap-2.5'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleExport('PDF')}
            className='h-9 px-3.5 text-xs rounded-xl border-border/80 text-foreground hover:bg-muted/50 gap-1.5 shadow-2xs'
          >
            <FileText className='size-3.5 text-muted-foreground' />
            <span>Export PDF</span>
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => handleExport('Excel')}
            className='h-9 px-3.5 text-xs rounded-xl border-border/80 text-foreground hover:bg-muted/50 gap-1.5 shadow-2xs'
          >
            <FileSpreadsheet className='size-3.5 text-emerald-600 dark:text-emerald-400' />
            <span>Export Excel</span>
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. GLOBAL REPORT FILTERS TOOLBAR                   */}
      {/* ================================================== */}
      <Card className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs'>
        <div className='flex flex-wrap items-center justify-between gap-3 text-xs'>
          <div className='flex flex-wrap items-center gap-2.5'>
            <span className='font-semibold text-foreground flex items-center gap-1.5'>
              <Filter className='size-3.5 text-primary' />
              Report Filters:
            </span>

            {/* Date Range Selector */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className='h-8 w-36 text-xs rounded-lg bg-background border-border/80'>
                <Calendar className='size-3 mr-1 text-muted-foreground' />
                <SelectValue placeholder='Date Range' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='yesterday'>Yesterday</SelectItem>
                <SelectItem value='last_7_days'>Last 7 Days</SelectItem>
                <SelectItem value='last_30_days'>Last 30 Days</SelectItem>
                <SelectItem value='this_month'>This Month</SelectItem>
                <SelectItem value='last_month'>Last Month</SelectItem>
                <SelectItem value='custom'>Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {/* Channel Selector */}
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className='h-8 w-28 text-xs rounded-lg bg-background border-border/80'>
                <SelectValue placeholder='Channel' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='ALL'>All Channels</SelectItem>
                <SelectItem value='B2C'>B2C Retail</SelectItem>
                <SelectItem value='B2B'>B2B Wholesale</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Selector */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='h-8 w-36 text-xs rounded-lg bg-background border-border/80'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='ALL'>All Categories</SelectItem>
                <SelectItem value='Diamond Jewellery'>Diamond Jewellery</SelectItem>
                <SelectItem value='Gold Jewellery'>Gold Jewellery</SelectItem>
                <SelectItem value='Bullion'>Bullion &amp; Ingots</SelectItem>
                <SelectItem value='Rings'>Rings</SelectItem>
                <SelectItem value='Necklaces'>Necklaces &amp; Chokers</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size='sm'
              onClick={handleApplyFilters}
              className='h-8 px-3 text-xs rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
            >
              Apply Filters
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-[11px] font-mono hidden sm:inline'>
              Active Filter: {dateRange.replace(/_/g, ' ')} ({channelFilter})
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleResetFilters}
              className='h-8 px-2 text-xs text-muted-foreground hover:text-foreground'
            >
              <RotateCcw className='size-3 mr-1' /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* ================================================== */}
      {/* 3. REPORT TABS                                     */}
      {/* ================================================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
        <TabsList className='bg-muted/40 p-1 border border-border/60 rounded-xl h-auto'>
          <TabsTrigger value='overview' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Overview
          </TabsTrigger>
          <TabsTrigger value='sales' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Sales
          </TabsTrigger>
          <TabsTrigger value='products' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Products
          </TabsTrigger>
          <TabsTrigger value='orders' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Orders
          </TabsTrigger>
          <TabsTrigger value='delivery' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Delivery
          </TabsTrigger>
          <TabsTrigger value='finance' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Finance
          </TabsTrigger>
        </TabsList>

        {/* ================================================== */}
        {/* TAB 1: OVERVIEW REPORT                             */}
        {/* ================================================== */}
        <TabsContent value='overview' className='space-y-6 pt-1 outline-none'>
          {/* 5 Compact KPI Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-5 gap-3.5'>
            {/* Card 1: Total Revenue */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Total Revenue</span>
                <DollarSign className='size-4 text-muted-foreground/70' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
                  SAR 245,000
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1'>
                  <span className='text-emerald-600 font-medium'>+12.4%</span>
                  <span>vs last period</span>
                </p>
              </div>
            </Card>

            {/* Card 2: Total Orders */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Total Orders</span>
                <ShoppingCart className='size-4 text-muted-foreground/70' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
                  1,248
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  B2C Retail &amp; B2B Wholesale
                </p>
              </div>
            </Card>

            {/* Card 3: Products Sold */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Products Sold</span>
                <Package className='size-4 text-muted-foreground/70' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
                  2,355
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Units dispatched
                </p>
              </div>
            </Card>

            {/* Card 4: Delivery Expense */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Delivery Expense</span>
                <Truck className='size-4 text-muted-foreground/70' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
                  SAR 12,500
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Net courier subsidy paid
                </p>
              </div>
            </Card>

            {/* Card 5: Net Profit */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between col-span-2 lg:col-span-1'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Net Profit</span>
                <Badge variant='outline' className='text-[9px] px-1 py-0 border-primary/20 text-primary'>
                  Post-VAT &amp; COGS
                </Badge>
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-primary'>
                  SAR 63,800
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  26.0% operating margin
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Nav Snapshot Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Sales Snapshot */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors'>
              <div className='flex items-center justify-between pb-2 border-b border-border/60'>
                <span className='font-semibold text-xs text-foreground'>Sales Channels Split</span>
                <Badge variant='outline' className='text-[10px]'>SAR</Badge>
              </div>
              <div className='mt-3 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>B2C Retail:</span>
                  <span className='font-mono font-semibold text-foreground'>SAR 145,000 (59.2%)</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>B2B Bullion &amp; Wholesale:</span>
                  <span className='font-mono font-semibold text-foreground'>SAR 100,000 (40.8%)</span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setActiveTab('sales')}
                  className='w-full text-xs text-primary hover:bg-primary/10 h-7 mt-1'
                >
                  View Full Sales Report &rarr;
                </Button>
              </div>
            </Card>

            {/* Delivery Snapshot */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors'>
              <div className='flex items-center justify-between pb-2 border-b border-border/60'>
                <span className='font-semibold text-xs text-foreground'>Courier &amp; Subsidies</span>
                <Badge variant='outline' className='text-[10px] text-emerald-600 border-emerald-500/20'>
                  5 Carriers
                </Badge>
              </div>
              <div className='mt-3 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Gross Courier Invoiced:</span>
                  <span className='font-mono font-semibold text-foreground'>SAR 31,420</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Customer Paid Delivery:</span>
                  <span className='font-mono font-semibold text-emerald-600'>SAR 8,450</span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setActiveTab('delivery')}
                  className='w-full text-xs text-primary hover:bg-primary/10 h-7 mt-1'
                >
                  View Full Delivery Report &rarr;
                </Button>
              </div>
            </Card>

            {/* Financial Health Snapshot */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors'>
              <div className='flex items-center justify-between pb-2 border-b border-border/60'>
                <span className='font-semibold text-xs text-foreground'>Financial Overview</span>
                <Badge variant='outline' className='text-[10px] border-primary/20 text-primary'>
                  ZATCA VAT 15%
                </Badge>
              </div>
              <div className='mt-3 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Gross Profit:</span>
                  <span className='font-mono font-semibold text-foreground'>SAR 84,000</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Net Retained Earnings:</span>
                  <span className='font-mono font-bold text-primary'>SAR 63,800</span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setActiveTab('finance')}
                  className='w-full text-xs text-primary hover:bg-primary/10 h-7 mt-1'
                >
                  View Full Financial Statement &rarr;
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 2: SALES REPORT                                */}
        {/* ================================================== */}
        <TabsContent value='sales' className='space-y-6 pt-1 outline-none'>
          {/* Sales Metric Row */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>B2C Retail Sales</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 145,000</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>B2B Wholesale Sales</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 100,000</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Gross Sales</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 245,000</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Discounts</span>
              <span className='font-mono font-bold text-lg text-rose-600'>SAR 4,500</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>15% ZATCA VAT</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 31,956</span>
            </div>
            <div className='p-3 rounded-xl border border-primary/20 bg-primary/5 shadow-2xs'>
              <span className='text-primary text-[11px] font-medium block'>Net Sales</span>
              <span className='font-mono font-bold text-lg text-primary'>SAR 208,544</span>
            </div>
          </div>

          {/* Chart: Sales Over Time */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs'>
            <CardHeader className='pb-2 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-sm font-semibold text-foreground'>
                    Sales Over Time
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Comparing daily B2C Retail and B2B Wholesale bullion &amp; jewellery sales
                  </CardDescription>
                </div>
                <Badge variant='outline' className='text-[10px] font-mono'>SAR Currency</Badge>
              </div>
            </CardHeader>
            <CardContent className='p-4 pt-5'>
              <div className='h-[250px] w-full min-w-0'>
                <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={200}>
                  <AreaChart data={SALES_OVER_TIME}>
                    <defs>
                      <linearGradient id='colorB2C' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={isDark ? '#9668FF' : 'oklch(0.32 0.12 18)'} stopOpacity={isDark ? 0.35 : 0.25} />
                        <stop offset='95%' stopColor={isDark ? '#9668FF' : 'oklch(0.32 0.12 18)'} stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id='colorB2B' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={isDark ? '#38BDF8' : 'oklch(0.72 0.11 75)'} stopOpacity={isDark ? 0.3 : 0.25} />
                        <stop offset='95%' stopColor={isDark ? '#38BDF8' : 'oklch(0.72 0.11 75)'} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' vertical={false} opacity={0.6} />
                    <XAxis dataKey='date' stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '11px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                      }}
                      formatter={(val: any) => [`SAR ${Number(val).toLocaleString()}`, '']}
                    />
                    <Legend verticalAlign='top' align='right' iconType='circle' wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                    <Area type='monotone' dataKey='b2cSales' name='B2C Retail' stroke={isDark ? '#9668FF' : 'oklch(0.32 0.12 18)'} strokeWidth={2} fillOpacity={1} fill='url(#colorB2C)' />
                    <Area type='monotone' dataKey='b2bSales' name='B2B Wholesale' stroke={isDark ? '#38BDF8' : 'oklch(0.72 0.11 75)'} strokeWidth={2} fillOpacity={1} fill='url(#colorB2B)' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales Data Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3 border-b border-border/60'>
              <CardTitle className='text-sm font-semibold text-foreground'>
                Daily Sales Ledger
              </CardTitle>
              <CardDescription className='text-xs text-muted-foreground'>
                Daily transaction volume and revenue breakdown
              </CardDescription>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
                  <TableRow className='hover:bg-transparent border-b border-border/80'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Date</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>B2C Sales</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>B2B Sales</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Orders</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {SALES_OVER_TIME.map(row => (
                    <TableRow key={row.date} className='hover:bg-muted/20 h-[50px] transition-colors'>
                      <TableCell className='py-2.5 pl-5 font-mono text-foreground font-medium'>
                        {row.date} 2026
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono'>
                        SAR {row.b2cSales.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono'>
                        SAR {row.b2bSales.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium'>
                        {row.orders}
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right font-mono font-bold text-primary'>
                        SAR {row.totalRevenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 3: PRODUCT REPORT                              */}
        {/* ================================================== */}
        <TabsContent value='products' className='space-y-6 pt-1 outline-none'>
          {/* Summary Metric Pills */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Top Selling SKUs</span>
              <span className='font-mono font-bold text-lg text-foreground'>14 Items</span>
              <span className='text-[10px] text-emerald-600 block mt-0.5'>82% of gross revenue</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Low Velocity Items</span>
              <span className='font-mono font-bold text-lg text-muted-foreground'>6 Items</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Review marketing</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Revenue by Category</span>
              <span className='font-mono font-bold text-lg text-foreground'>6 Active</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Bullion lead category</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Total Units Sold</span>
              <span className='font-mono font-bold text-lg text-primary'>2,355 units</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Avg 78 items / day</span>
            </div>
          </div>

          {/* Product Performance Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold text-foreground'>
                    Product Performance Analysis
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Catalog SKU movement, gross sales value, stock balance, and sales velocity
                  </CardDescription>
                </div>
                <Badge variant='outline' className='text-xs font-mono'>
                  {PRODUCT_REPORT_DATA.length} SKUs Listed
                </Badge>
              </div>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
                  <TableRow className='hover:bg-transparent border-b border-border/80'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Product</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Category</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Channel</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Quantity Sold</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Revenue</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Stock</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {PRODUCT_REPORT_DATA.map(p => (
                    <TableRow key={p.id} className='hover:bg-muted/20 h-[54px] transition-colors'>
                      <TableCell className='py-2.5 pl-5 font-semibold text-foreground'>
                        {p.product}
                      </TableCell>
                      <TableCell className='py-2.5 text-muted-foreground'>
                        {p.category}
                      </TableCell>
                      <TableCell className='py-2.5 text-center'>
                        <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
                          {p.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium'>
                        {p.quantitySold}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono font-bold text-foreground'>
                        SAR {p.revenueSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-muted-foreground'>
                        {p.stock} units
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right'>
                        <Badge
                          variant='outline'
                          className={`text-[10px] ${
                            p.performance === 'Top Seller'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : p.performance === 'Low Stock'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {p.performance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 4: ORDER REPORT                                */}
        {/* ================================================== */}
        <TabsContent value='orders' className='space-y-6 pt-1 outline-none'>
          {/* Order Summary Strip */}
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Total Orders</span>
              <span className='font-mono font-bold text-lg text-foreground'>848</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Combined channels</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Completed &bull; Delivered</span>
              <span className='font-mono font-bold text-lg text-emerald-600'>600</span>
              <span className='text-[10px] text-emerald-600 block mt-0.5'>70.8% completed</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Pending &bull; Production</span>
              <span className='font-mono font-bold text-lg text-amber-600'>117</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Awaiting dispatch</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Cancelled Orders</span>
              <span className='font-mono font-bold text-lg text-rose-600'>27</span>
              <span className='text-[10px] text-rose-600 block mt-0.5'>3.1% cancellation rate</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Returned Orders</span>
              <span className='font-mono font-bold text-lg text-slate-600'>14</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Inspection passed</span>
            </div>
          </div>

          {/* Order Status Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <CardTitle className='text-base font-semibold text-foreground'>
                Order Status &amp; Channel Allocation
              </CardTitle>
              <CardDescription className='text-xs text-muted-foreground'>
                Distribution of order volume and financial values by fulfillment state
              </CardDescription>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
                  <TableRow className='hover:bg-transparent border-b border-border/80'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Order Status</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>B2C Orders</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>B2B Orders</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Total Orders</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {ORDER_REPORT_DATA.map(row => (
                    <TableRow key={row.status} className='hover:bg-muted/20 h-[52px] transition-colors'>
                      <TableCell className='py-2.5 pl-5'>
                        <Badge variant='outline' className={`text-[11px] font-medium ${row.badgeColor}`}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium text-foreground'>
                        {row.b2cOrders}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium text-foreground'>
                        {row.b2bOrders}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-bold text-foreground'>
                        {row.totalOrders}
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right font-mono font-bold text-primary'>
                        SAR {row.orderValueSAR.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 5: DELIVERY REPORT                             */}
        {/* ================================================== */}
        <TabsContent value='delivery' className='space-y-6 pt-1 outline-none'>
          {/* Key Delivery Reconciliation Strip */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Total Shipments</span>
              <span className='font-mono font-bold text-lg text-foreground'>1,248</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>5 active couriers</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Courier Cost</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 31,420</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Invoiced by carriers</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Customer Revenue</span>
              <span className='font-mono font-bold text-lg text-emerald-600'>SAR 8,450</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Collected fees</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Free Delivery Cost</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 18,750</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>750 promo orders</span>
            </div>
            <div className='p-3 rounded-xl border border-primary/20 bg-primary/5 shadow-2xs'>
              <span className='text-primary text-[11px] font-medium block'>VenVision Subsidy</span>
              <span className='font-mono font-bold text-lg text-primary'>SAR 22,970</span>
              <span className='text-[10px] text-primary/80 block mt-0.5'>Courier - Customer fee</span>
            </div>
            <div className='p-3 rounded-xl border border-border/80 bg-card shadow-2xs'>
              <span className='text-muted-foreground text-[11px] block'>Average Delivery Cost</span>
              <span className='font-mono font-bold text-lg text-foreground'>SAR 25.17</span>
              <span className='text-[10px] text-muted-foreground block mt-0.5'>Per parcel blended</span>
            </div>
          </div>

          {/* Courier Comparison Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold text-foreground'>
                    Courier Performance &amp; Expense Audit
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Third-party logistics carriers operating across Saudi Arabia
                  </CardDescription>
                </div>
                <Link href='/delivery'>
                  <Button variant='ghost' size='sm' className='h-8 text-xs text-primary hover:bg-primary/10 gap-1'>
                    <span>Manage Carriers</span>
                    <ChevronRight className='size-3' />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
                  <TableRow className='hover:bg-transparent border-b border-border/80'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Courier</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Shipments</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Delivered</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Failed</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Average Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Average Delivery Time</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {COURIER_DELIVERY_DATA.map(c => (
                    <TableRow key={c.courier} className='hover:bg-muted/20 h-[52px] transition-colors'>
                      <TableCell className='py-2.5 pl-5 font-semibold text-foreground'>
                        {c.courier}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium'>
                        {c.shipments}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-emerald-600 font-medium'>
                        {c.delivered}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-rose-600 font-medium'>
                        {c.failed}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono'>
                        SAR {c.averageCostSAR.toFixed(2)}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-muted-foreground'>
                        {c.averageDeliveryDays} days
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right font-mono font-bold text-foreground'>
                        SAR {c.totalCostSAR.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 6: FINANCE REPORT                              */}
        {/* ================================================== */}
        <TabsContent value='finance' className='space-y-6 pt-1 outline-none'>
          {/* Financial P&L Statement Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
            {/* Left: Financial Statement Card (6 cols) */}
            <Card className='lg:col-span-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between overflow-hidden'>
              <CardHeader className='pb-3.5 border-b border-border/60 bg-muted/10'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-foreground flex items-center gap-2'>
                    <DollarSign className='size-4 text-primary' />
                    Monthly Financial Profit &amp; Loss Statement
                  </CardTitle>
                  <Badge variant='outline' className='text-[10px] font-mono'>
                    SAR Currency
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='p-5 space-y-2.5 text-xs'>
                <div className='flex justify-between py-1 border-b border-border/50'>
                  <span className='font-semibold text-foreground text-sm'>Gross Revenue</span>
                  <span className='font-mono font-bold text-foreground text-sm'>SAR 245,000.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>Product &amp; Metal Cost (COGS):</span>
                  <span className='font-mono'>- SAR 161,000.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>Atelier Making &amp; Crafting Fee:</span>
                  <span className='font-mono'>- SAR 12,000.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>Net Delivery Cost:</span>
                  <span className='font-mono'>- SAR 12,500.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>Mada &amp; Card Gateway Fees:</span>
                  <span className='font-mono'>- SAR 3,200.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>Customer Promotional Discounts:</span>
                  <span className='font-mono'>- SAR 4,500.00</span>
                </div>

                <div className='flex justify-between py-1 text-muted-foreground'>
                  <span>ZATCA 15% VAT Withheld:</span>
                  <span className='font-mono'>- SAR 31,956.00</span>
                </div>

                {/* Net Profit Prominent Callout */}
                <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 mt-3 flex items-center justify-between'>
                  <div>
                    <span className='font-bold text-sm text-primary block'>Net Operating Profit</span>
                    <span className='text-[11px] text-muted-foreground'>Retained atelier earnings</span>
                  </div>
                  <span className='font-mono text-2xl font-bold text-primary'>
                    SAR 63,800.00
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Right: Revenue vs Expenses Chart (6 cols) */}
            <Card className='lg:col-span-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between'>
              <CardHeader className='pb-2 border-b border-border/60'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-foreground'>
                    Revenue vs. Expenses
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    4-Month operating cash flow trajectory
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-5'>
                <div className='h-[240px] w-full min-w-0'>
                  <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={200}>
                    <BarChart data={FINANCE_CHART_DATA} barGap={6}>
                      <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' vertical={false} opacity={0.6} />
                      <XAxis dataKey='month' stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                        }}
                        formatter={(v: any) => [`SAR ${Number(v).toLocaleString()}`, '']}
                      />
                      <Legend verticalAlign='top' align='right' iconType='circle' wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                      <Bar dataKey='revenue' name='Revenue' fill={isDark ? '#7447E8' : 'oklch(0.32 0.12 18)'} radius={[4, 4, 0, 0]} />
                      <Bar dataKey='expenses' name='Total Expenses' fill={isDark ? '#64748B' : 'oklch(0.72 0.11 75)'} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className='mt-3 pt-3 border-t border-border/60 flex justify-between text-xs text-center'>
                  <div className='flex-1 p-2 rounded-lg bg-background border border-border/70'>
                    <span className='text-[10px] text-muted-foreground block'>September Revenue</span>
                    <span className='font-mono font-bold text-foreground'>SAR 245,000</span>
                  </div>
                  <div className='flex-1 mx-2 p-2 rounded-lg bg-background border border-border/70'>
                    <span className='text-[10px] text-muted-foreground block'>Total Incurred Costs</span>
                    <span className='font-mono font-bold text-foreground'>SAR 181,200</span>
                  </div>
                  <div className='flex-1 p-2 rounded-lg bg-primary/5 border border-primary/20'>
                    <span className='text-[10px] text-primary block font-medium'>Net Profit</span>
                    <span className='font-mono font-bold text-primary'>SAR 63,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Daily Finance Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold text-foreground'>
                    Detailed Daily Financial Ledger
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Itemized daily sales revenue, metal production costs, courier delivery, gateway fees, discounts, and VAT
                  </CardDescription>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleExport('Excel')}
                  className='h-8 text-xs gap-1.5'
                >
                  <FileSpreadsheet className='size-3 text-emerald-600' />
                  <span>Download Ledger</span>
                </Button>
              </div>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
                  <TableRow className='hover:bg-transparent border-b border-border/80'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Date</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Revenue</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Product Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Delivery</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Payment Fees</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Discount</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>VAT (15%)</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Net Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {DETAILED_FINANCE_ROWS.map(row => (
                    <TableRow key={row.date} className='hover:bg-muted/20 h-[50px] transition-colors'>
                      <TableCell className='py-2.5 pl-5 font-mono text-foreground font-medium'>
                        {row.date}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono font-semibold text-foreground'>
                        SAR {row.revenueSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-muted-foreground'>
                        SAR {row.productCostSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-muted-foreground'>
                        SAR {row.deliverySAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-muted-foreground'>
                        SAR {row.paymentFeesSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-rose-600'>
                        SAR {row.discountSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-muted-foreground'>
                        SAR {row.vatSAR.toLocaleString()}
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right font-mono font-bold text-primary'>
                        SAR {row.netProfitSAR.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ================================================== */}
      {/* 4. BOTTOM SECTION: ANALYTICS + ACTIVITY BY TIME    */}
      {/* ================================================== */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* LEFT CARD: ANALYTICS */}
        <Card className='rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden'>
          <div>
            {/* Header */}
            <div className='flex items-center justify-between pb-3'>
              <div className='flex items-center gap-2.5'>
                <div className='size-8 rounded-full bg-muted/70 dark:bg-muted/40 border border-border/60 flex items-center justify-center text-foreground'>
                  <BarChart3 className='size-4 text-foreground' />
                </div>
                <h3 className='text-base font-semibold text-foreground tracking-tight'>
                  Analytics
                </h3>
              </div>
              <button
                type='button'
                className='size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors'
                aria-label='Analytics Options'
                title='More Options'
              >
                <MoreVertical className='size-4' />
              </button>
            </div>

            {/* Small Legend at Top: Income  Expenses */}
            <div className='flex items-center gap-4 text-xs font-medium pb-2 pt-1'>
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    'size-2.5 rounded-sm transition-colors',
                    isDark ? 'bg-[#9668FF]' : 'bg-[#C5A059]'
                  )}
                />
                <span className='text-foreground'>Income</span>
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    'size-2.5 rounded-sm transition-colors',
                    isDark ? 'bg-[#38BDF8]' : 'bg-slate-400'
                  )}
                />
                <span className='text-muted-foreground'>Expenses</span>
              </div>
            </div>
          </div>

          {/* Minimal Line Chart */}
          <div className='h-[250px] sm:h-[270px] w-full pt-2'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart
                data={ANALYTICS_DATA}
                margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id='analyticsIncomeGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor={isDark ? '#9668FF' : '#C5A059'}
                      stopOpacity={isDark ? 0.32 : 0.22}
                    />
                    <stop
                      offset='95%'
                      stopColor={isDark ? '#9668FF' : '#C5A059'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey='month'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }}
                  dy={8}
                />
                <YAxis hide domain={['dataMin - 5000', 'dataMax + 10000']} />
                <RechartsTooltip
                  cursor={{
                    stroke: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                    strokeWidth: 1.5,
                    strokeDasharray: '4 4'
                  }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const incomeVal = payload.find(p => p.dataKey === 'income')?.value
                      const expVal = payload.find(p => p.dataKey === 'expenses')?.value

                      return (
                        <div className='rounded-xl border border-border/80 bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-md min-w-[170px] space-y-2 text-xs'>
                          <div className='font-semibold text-foreground pb-1 border-b border-border/60'>
                            {label}
                          </div>
                          <div className='space-y-1.5 font-mono text-[11px]'>
                            <div className='flex items-center justify-between'>
                              <span className='text-muted-foreground flex items-center gap-1.5'>
                                <span
                                  className={cn(
                                    'size-2 rounded-full',
                                    isDark ? 'bg-[#9668FF]' : 'bg-[#C5A059]'
                                  )}
                                />
                                Income:
                              </span>
                              <span
                                className={cn(
                                  'font-bold',
                                  isDark ? 'text-[#9668FF]' : 'text-primary'
                                )}
                              >
                                SAR {Number(incomeVal || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-muted-foreground flex items-center gap-1.5'>
                                <span
                                  className={cn(
                                    'size-2 rounded-full',
                                    isDark ? 'bg-[#38BDF8]' : 'bg-slate-400'
                                  )}
                                />
                                Expenses:
                              </span>
                              <span
                                className={cn(
                                  'font-semibold',
                                  isDark ? 'text-[#38BDF8]' : 'text-muted-foreground'
                                )}
                              >
                                SAR {Number(expVal || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {/* Income: Solid Line with Smooth Curve + Gradient Fill */}
                <Area
                  type='monotone'
                  dataKey='income'
                  stroke={isDark ? '#9668FF' : '#C5A059'}
                  strokeWidth={2.5}
                  fill='url(#analyticsIncomeGradient)'
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: isDark ? '#9668FF' : '#C5A059',
                    stroke: isDark ? '#141414' : '#FFFFFF',
                    strokeWidth: 2
                  }}
                />
                {/* Expenses: Subtle Dashed Line */}
                <Line
                  type='monotone'
                  dataKey='expenses'
                  stroke={isDark ? '#38BDF8' : '#94A3B8'}
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: isDark ? '#38BDF8' : '#94A3B8',
                    stroke: isDark ? '#141414' : '#FFFFFF',
                    strokeWidth: 2
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RIGHT CARD: ACTIVITY BY TIME */}
        <Card className='rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden'>
          <div>
            {/* Header */}
            <div className='flex items-center justify-between pb-5'>
              <div className='flex items-center gap-2.5'>
                <div className='size-8 rounded-full bg-muted/70 dark:bg-muted/40 border border-border/60 flex items-center justify-center text-foreground'>
                  <Globe className='size-4 text-primary' />
                </div>
                <h3 className='text-base font-semibold text-foreground tracking-tight'>
                  Activity by Time
                </h3>
              </div>
              <button
                type='button'
                className='size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors'
                aria-label='View Activity Details'
                title='Activity Details'
              >
                <ArrowUpRight className='size-4' />
              </button>
            </div>

            {/* Heatmap Grid */}
            <TooltipProvider delay={50}>
              <div className='overflow-x-auto pb-1'>
                <div className='min-w-[420px] w-full space-y-2'>
                  {/* Columns Header: Mon Tue Wed Thu Fri Sat Sun */}
                  <div className='grid grid-cols-[45px_repeat(7,1fr)] gap-2 items-center text-center'>
                    <div /> {/* Top-left empty spacer */}
                    {ACTIVITY_DAYS.map(day => (
                      <span
                        key={day}
                        className='text-xs font-medium text-muted-foreground'
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Rows: 1 PM to 6 PM */}
                  {ACTIVITY_HOURS.map(time => (
                    <div
                      key={time}
                      className='grid grid-cols-[45px_repeat(7,1fr)] gap-2 items-center'
                    >
                      {/* Row Label (1 PM, 2 PM, etc.) */}
                      <span className='text-xs font-medium text-muted-foreground text-left pl-0.5 select-none'>
                        {time.toLowerCase()}
                      </span>

                      {/* 7 Day Cells */}
                      {ACTIVITY_DAYS.map(day => {
                        const cell = ACTIVITY_DATA[time]?.[day] || {
                          orders: 8,
                          sales: 2950,
                          level: 1 as const
                        }

                        return (
                          <Tooltip key={`${day}-${time}`}>
                            <TooltipTrigger
                              className={cn(
                                'h-10 sm:h-11 w-full rounded-xl transition-all duration-150 cursor-pointer border select-none',
                                cell.level === 1 &&
                                  'bg-[#C5A059]/15 border-[#C5A059]/25 hover:border-[#C5A059]/50 hover:scale-[1.04] dark:bg-[#21183B] dark:border-[#21183B] dark:hover:border-[#32205E]',
                                cell.level === 2 &&
                                  'bg-[#C5A059]/38 border-[#C5A059]/50 hover:border-[#C5A059]/75 hover:scale-[1.04] dark:bg-[#32205E] dark:border-[#32205E] dark:hover:border-[#51309A]',
                                cell.level === 3 &&
                                  'bg-[#C5A059]/68 border-[#C5A059]/80 hover:border-[#C5A059] hover:scale-[1.04] dark:bg-[#51309A] dark:border-[#51309A] dark:hover:border-[#7447E8]',
                                cell.level === 4 &&
                                  'bg-[#C5A059]/85 border-[#C5A059] hover:brightness-105 hover:scale-[1.04] dark:bg-[#7447E8] dark:border-[#7447E8] dark:hover:border-[#9668FF]',
                                cell.level === 5 &&
                                  'bg-[#C5A059] border-[#C5A059] shadow-sm hover:brightness-110 hover:scale-[1.04] dark:bg-[#9668FF] dark:border-[#9668FF] dark:hover:brightness-110'
                              )}
                            />
                            <TooltipContent
                              side='top'
                              sideOffset={8}
                              className='z-50 rounded-xl border border-border/80 bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-md min-w-[160px] space-y-1.5'
                            >
                              <div className='font-semibold text-xs text-foreground pb-1 border-b border-border/60'>
                                {day} &bull; {time}
                              </div>
                              <div className='space-y-1 text-xs'>
                                <div className='flex items-center justify-between text-muted-foreground'>
                                  <span>Orders:</span>
                                  <span className='font-mono font-semibold text-foreground'>{cell.orders}</span>
                                </div>
                                <div className='flex items-center justify-between text-muted-foreground'>
                                  <span>Sales:</span>
                                  <span className='font-mono font-bold text-primary dark:text-[#9668FF]'>SAR {cell.sales.toLocaleString()}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </TooltipProvider>
          </div>

          {/* Legend at Bottom-Right */}
          <div className='flex items-center justify-end gap-2 pt-4 border-t border-border/40 text-xs text-muted-foreground'>
            <span className='text-[11px] font-medium'>Less</span>
            <div className='flex items-center gap-1.5'>
              <div
                className='size-3 rounded-[3px] bg-[#C5A059]/15 border border-[#C5A059]/25 dark:bg-[#21183B] dark:border-[#21183B]'
                title='Very low activity'
              />
              <div
                className='size-3 rounded-[3px] bg-[#C5A059]/38 border border-[#C5A059]/50 dark:bg-[#32205E] dark:border-[#32205E]'
                title='Low activity'
              />
              <div
                className='size-3 rounded-[3px] bg-[#C5A059]/68 border border-[#C5A059]/80 dark:bg-[#51309A] dark:border-[#51309A]'
                title='Medium activity'
              />
              <div
                className='size-3 rounded-[3px] bg-[#C5A059]/85 border border-[#C5A059] dark:bg-[#7447E8] dark:border-[#7447E8]'
                title='High activity'
              />
              <div
                className='size-3 rounded-[3px] bg-[#C5A059] border border-[#C5A059] dark:bg-[#9668FF] dark:border-[#9668FF]'
                title='Very high activity'
              />
            </div>
            <span className='text-[11px] font-medium'>More</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
