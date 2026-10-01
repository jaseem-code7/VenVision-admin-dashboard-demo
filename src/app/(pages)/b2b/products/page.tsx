'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Table2,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  Download,
  Plus,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Tag,
  Star,
  X,
  Check,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'

export interface B2BProduct {
  id: string
  name: string
  sku: string
  productType: 'Gold Bar' | 'Bullion' | 'Gold Coin' | 'Diamond Jewellery' | 'Gold Jewellery'
  metal: 'Gold' | 'Silver' | 'Platinum'
  purity: '24K' | '22K' | '21K' | '18K'
  weightDisplay: string
  currentRateSAR: number
  b2bPriceSAR: number
  stock: string
  stockCount: number
  status: 'Active' | 'Low Stock' | 'Out of Stock' | 'Draft'
  rateType: 'Live Rate' | 'Fixed Rate'
  rating: number
  updatedAt: string
  image: string
}

export const sampleB2BProducts: B2BProduct[] = [
  {
    id: 'b2b-1',
    name: '100g 999.9 Fine Gold Cast Bar',
    sku: 'VV-BAR-999-100G',
    productType: 'Gold Bar',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '100 g',
    currentRateSAR: 268.45,
    b2bPriceSAR: 27150,
    stock: '45 units',
    stockCount: 45,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 5.0,
    updatedAt: '12 mins ago',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-2',
    name: '1kg Investment Grade Gold Bullion',
    sku: 'VV-BAR-999-1KG',
    productType: 'Bullion',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '1,000 g',
    currentRateSAR: 268.45,
    b2bPriceSAR: 269200,
    stock: '8 units',
    stockCount: 8,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 5.0,
    updatedAt: '18 mins ago',
    image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-3',
    name: 'King Abdulaziz Gold Coin',
    sku: 'VV-COIN-21K-8G',
    productType: 'Gold Coin',
    metal: 'Gold',
    purity: '21K',
    weightDisplay: '8 g',
    currentRateSAR: 234.35,
    b2bPriceSAR: 2020,
    stock: '120 units',
    stockCount: 120,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 4.9,
    updatedAt: '35 mins ago',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-4',
    name: '18K White Gold Solitaire Mount',
    sku: 'VV-MNT-18K-042',
    productType: 'Diamond Jewellery',
    metal: 'Gold',
    purity: '18K',
    weightDisplay: '42 g',
    currentRateSAR: 201.20,
    b2bPriceSAR: 11850,
    stock: '3 units',
    stockCount: 3,
    status: 'Low Stock',
    rateType: 'Live Rate',
    rating: 4.8,
    updatedAt: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-5',
    name: '21K Traditional Hollow Rope Chain',
    sku: 'VV-CHN-21K-250G',
    productType: 'Gold Jewellery',
    metal: 'Gold',
    purity: '21K',
    weightDisplay: '250 g',
    currentRateSAR: 234.35,
    b2bPriceSAR: 62500,
    stock: '850 g',
    stockCount: 850,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 5.0,
    updatedAt: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-6',
    name: '50g Minted Gold Ingot PAMP Suisse',
    sku: 'VV-ING-999-50G',
    productType: 'Gold Bar',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '50 g',
    currentRateSAR: 268.45,
    b2bPriceSAR: 13600,
    stock: '0 units',
    stockCount: 0,
    status: 'Out of Stock',
    rateType: 'Fixed Rate',
    rating: 4.7,
    updatedAt: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-7',
    name: 'Laser-Cut Bridal Cuff Bangles (Pair)',
    sku: 'VV-BNG-21K-95G',
    productType: 'Gold Jewellery',
    metal: 'Gold',
    purity: '21K',
    weightDisplay: '95 g',
    currentRateSAR: 234.35,
    b2bPriceSAR: 23800,
    stock: '12 units',
    stockCount: 12,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 5.0,
    updatedAt: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-8',
    name: '18K Baguette Diamond Eternity Band',
    sku: 'VV-RNG-18K-18G',
    productType: 'Diamond Jewellery',
    metal: 'Gold',
    purity: '18K',
    weightDisplay: '18 g',
    currentRateSAR: 201.20,
    b2bPriceSAR: 8450,
    stock: '15 units',
    stockCount: 15,
    status: 'Active',
    rateType: 'Live Rate',
    rating: 4.9,
    updatedAt: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-9',
    name: '10 Tola 999 Fine Gold Cast Bar',
    sku: 'VV-TOLA-999-116G',
    productType: 'Bullion',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '116.6 g',
    currentRateSAR: 268.45,
    b2bPriceSAR: 31650,
    stock: '0 units',
    stockCount: 0,
    status: 'Out of Stock',
    rateType: 'Live Rate',
    rating: 5.0,
    updatedAt: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2b-10',
    name: '22K Heritage Medallion Sovereign',
    sku: 'VV-SOV-22K-16G',
    productType: 'Gold Coin',
    metal: 'Gold',
    purity: '22K',
    weightDisplay: '16 g',
    currentRateSAR: 245.80,
    b2bPriceSAR: 4120,
    stock: '4 units',
    stockCount: 4,
    status: 'Low Stock',
    rateType: 'Fixed Rate',
    rating: 5.0,
    updatedAt: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=200&auto=format&fit=crop&q=80'
  }
]

export default function B2BProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<B2BProduct[]>(sampleB2BProducts)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showStatistics, setShowStatistics] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('recently_updated')

  // Column Visibility Config (Customize)
  const [visibleColumns, setVisibleColumns] = useState({
    productType: true,
    purity: true,
    weight: true,
    currentRate: true,
    b2bPrice: true,
    stock: true,
    status: true,
    rating: true
  })

  // Filters State
  const [filters, setFilters] = useState({
    productType: 'ALL',
    metal: 'ALL',
    purity: 'ALL',
    stockStatus: 'ALL',
    status: 'ALL',
    rateType: 'ALL'
  })

  // Checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.productType.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = filters.productType === 'ALL' || p.productType === filters.productType
        const matchesMetal = filters.metal === 'ALL' || p.metal === filters.metal
        const matchesPurity = filters.purity === 'ALL' || p.purity === filters.purity
        const matchesStatus = filters.status === 'ALL' || p.status === filters.status
        const matchesRateType = filters.rateType === 'ALL' || p.rateType === filters.rateType

        return matchesSearch && matchesType && matchesMetal && matchesPurity && matchesStatus && matchesRateType
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') return a.b2bPriceSAR - b.b2bPriceSAR
        if (sortOption === 'price_desc') return b.b2bPriceSAR - a.b2bPriceSAR
        if (sortOption === 'stock_asc') return a.stockCount - b.stockCount
        if (sortOption === 'stock_desc') return b.stockCount - a.stockCount
        return 0 // default
      })
  }, [products, searchQuery, filters, sortOption])

  const isAllSelected =
    filteredProducts.length > 0 && selectedIds.length === filteredProducts.length

  const resetFilters = () => {
    setFilters({
      productType: 'ALL',
      metal: 'ALL',
      purity: 'ALL',
      stockStatus: 'ALL',
      status: 'ALL',
      rateType: 'ALL'
    })
    setSearchQuery('')
    toast.info('Filters have been reset')
  }

  return (
    <div className='space-y-4 pb-16'>
      {/* 1. PAGE TITLE ROW */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              Wholesale Products
            </h1>
            <Badge variant='outline' className='bg-secondary/70 border-border/80 text-foreground font-medium text-xs'>
              B2B Bullion & Wholesale
            </Badge>
          </div>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Manage bullion bars, wholesale finished jewellery, live metal purities, and bulk pricing
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Link href='/b2b/products/add'>
            <Button
              size='sm'
              className='h-9 px-3.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 shadow-xs'
            >
              <Plus className='size-4' />
              <span>Add B2B Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. COMPACT TOOLBAR ROW (Matches Reference) */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        {/* LEFT SIDE */}
        <div className='flex flex-wrap items-center gap-2'>
          {/* Table View Dropdown */}
          <div className='inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors shadow-2xs'>
            <Table2 className='size-3.5 text-muted-foreground' />
            <span>Table View</span>
            <span className='text-[10px] text-muted-foreground'>▼</span>
          </div>

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger className='inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors shadow-2xs'>
              <Filter className='size-3.5 text-muted-foreground' />
              <span>Filter</span>
              {(filters.productType !== 'ALL' || filters.purity !== 'ALL' || filters.status !== 'ALL') && (
                <span className='size-1.5 rounded-full bg-primary' />
              )}
            </PopoverTrigger>
            <PopoverContent align='start' className='w-80 p-4 space-y-3.5 bg-card border-border/80 shadow-md'>
              <div className='flex items-center justify-between border-b border-border/60 pb-2'>
                <span className='font-semibold text-xs text-foreground'>Filter Products</span>
                <button onClick={resetFilters} className='text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1'>
                  <RotateCcw className='size-3' /> Reset
                </button>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div>
                  <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>Product Type</label>
                  <select
                    value={filters.productType}
                    onChange={e => setFilters({ ...filters, productType: e.target.value })}
                    className='h-8 w-full rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none'
                  >
                    <option value='ALL'>All Product Types</option>
                    <option value='Gold Bar'>Gold Bar</option>
                    <option value='Bullion'>Bullion</option>
                    <option value='Gold Coin'>Gold Coin</option>
                    <option value='Diamond Jewellery'>Diamond Jewellery</option>
                    <option value='Gold Jewellery'>Gold Jewellery</option>
                  </select>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>Purity</label>
                    <select
                      value={filters.purity}
                      onChange={e => setFilters({ ...filters, purity: e.target.value })}
                      className='h-8 w-full rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none'
                    >
                      <option value='ALL'>All Karats</option>
                      <option value='24K'>24K</option>
                      <option value='22K'>22K</option>
                      <option value='21K'>21K</option>
                      <option value='18K'>18K</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>Status</label>
                    <select
                      value={filters.status}
                      onChange={e => setFilters({ ...filters, status: e.target.value })}
                      className='h-8 w-full rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none'
                    >
                      <option value='ALL'>All Status</option>
                      <option value='Active'>Active</option>
                      <option value='Low Stock'>Low Stock</option>
                      <option value='Out of Stock'>Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>Rate Type</label>
                  <select
                    value={filters.rateType}
                    onChange={e => setFilters({ ...filters, rateType: e.target.value })}
                    className='h-8 w-full rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none'
                  >
                    <option value='ALL'>All Rate Types</option>
                    <option value='Live Rate'>Live Rate</option>
                    <option value='Fixed Rate'>Fixed Rate</option>
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Popover */}
          <Popover>
            <PopoverTrigger className='inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors shadow-2xs'>
              <ArrowUpDown className='size-3.5 text-muted-foreground' />
              <span>Sort</span>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-48 p-2 bg-card border-border/80 shadow-md'>
              <div className='text-xs space-y-1'>
                {[
                  { key: 'recently_updated', label: 'Recently Updated' },
                  { key: 'price_asc', label: 'Price: Low to High' },
                  { key: 'price_desc', label: 'Price: High to Low' },
                  { key: 'stock_asc', label: 'Stock: Low to High' },
                  { key: 'stock_desc', label: 'Stock: High to Low' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortOption(opt.key)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs ${
                      sortOption === opt.key
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortOption === opt.key && <Check className='size-3.5' />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Show Statistics Toggle (Exact style from reference) */}
          <div className='flex items-center gap-2 pl-1'>
            <span className='text-xs text-muted-foreground font-medium'>Show Statistics</span>
            <Switch
              checked={showStatistics}
              onCheckedChange={setShowStatistics}
            />
          </div>

          {/* Compact Integrated Search */}
          <div className='relative w-44 sm:w-56'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none' />
            <Input
              type='text'
              placeholder='Search bullion or SKU...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='h-9 pl-8 pr-7 text-xs bg-background/60 border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='size-3' />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex items-center gap-2'>
          {/* Customize Columns Popover */}
          <Popover>
            <PopoverTrigger className='inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors shadow-2xs'>
              <SlidersHorizontal className='size-3.5 text-muted-foreground' />
              <span>Customize</span>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-52 p-3 bg-card border-border/80 shadow-md space-y-2'>
              <span className='font-semibold text-xs text-foreground block border-b border-border/60 pb-1.5'>
                Visible Columns
              </span>
              <div className='space-y-1.5 text-xs'>
                {Object.entries({
                  productType: 'Product Type',
                  purity: 'Purity / Karat',
                  weight: 'Weight',
                  currentRate: 'Current Rate',
                  b2bPrice: 'B2B Price',
                  stock: 'Available Stock',
                  status: 'Status',
                  rating: 'Rating'
                }).map(([colKey, label]) => (
                  <label key={colKey} className='flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 rounded'>
                    <input
                      type='checkbox'
                      checked={(visibleColumns as any)[colKey]}
                      onChange={e =>
                        setVisibleColumns({ ...visibleColumns, [colKey]: e.target.checked })
                      }
                      className='rounded border-border accent-primary size-3.5'
                    />
                    <span className='text-xs text-foreground'>{label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => toast.success('Exporting B2B Product list to CSV...')}
            className='h-9 px-3 text-xs border-border/80 text-foreground hover:bg-muted/50 gap-1.5 shadow-2xs'
          >
            <Download className='size-3.5 text-muted-foreground' />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* 3. 4 COMPACT KPI CARDS IN ONE HORIZONTAL ROW (Exact Match to Reference) */}
      {showStatistics && (
        <div className='rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs'>
          <div className='grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60 gap-4 md:gap-0'>
            {/* KPI 1 */}
            <div className='md:px-4 first:pl-0 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span>Total Product</span>
                <Info className='size-3 text-muted-foreground/60' />
              </div>
              <div className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono'>
                64
              </div>
              <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5'>
                <span>vs last month</span>
                <span className='text-emerald-500 font-medium bg-emerald-500/10 px-1 py-0.2 rounded'>
                  +3 product
                </span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className='md:px-4 pt-3 md:pt-0 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span>Product Revenue</span>
                <Info className='size-3 text-muted-foreground/60' />
              </div>
              <div className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono'>
                SAR 894,500
              </div>
              <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5'>
                <span>vs last month</span>
                <span className='text-emerald-500 font-medium bg-emerald-500/10 px-1 py-0.2 rounded'>
                  +9%
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className='md:px-4 pt-3 md:pt-0 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span>Product Sold</span>
                <Info className='size-3 text-muted-foreground/60' />
              </div>
              <div className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono'>
                2,355
              </div>
              <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5'>
                <span>vs last month</span>
                <span className='text-emerald-500 font-medium bg-emerald-500/10 px-1 py-0.2 rounded'>
                  +7%
                </span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className='md:px-4 last:pr-0 pt-3 md:pt-0 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span>Avg. Monthly Sales</span>
                <Info className='size-3 text-muted-foreground/60' />
              </div>
              <div className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono'>
                890
              </div>
              <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5'>
                <span>vs last month</span>
                <span className='text-emerald-500 font-medium bg-emerald-500/10 px-1 py-0.2 rounded'>
                  +5%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ONE LARGE PRODUCT TABLE CONTAINER */}
      <div className='rounded-xl border border-border/70 bg-card shadow-2xs overflow-hidden relative'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-muted/30 text-[11px] font-semibold text-muted-foreground border-b border-border/70'>
              <tr>
                {/* Header Checkbox */}
                <th className='py-3 pl-4 pr-2 w-10'>
                  <input
                    type='checkbox'
                    checked={isAllSelected}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className='rounded border-border accent-primary size-3.5 cursor-pointer'
                  />
                </th>
                <th className='py-3 px-3'>Product</th>
                {visibleColumns.productType && <th className='py-3 px-3'>Product Type</th>}
                {visibleColumns.purity && <th className='py-3 px-3'>Purity</th>}
                {visibleColumns.weight && <th className='py-3 px-3'>Weight</th>}
                {visibleColumns.currentRate && <th className='py-3 px-3'>Current Rate</th>}
                {visibleColumns.b2bPrice && <th className='py-3 px-3'>B2B Price</th>}
                {visibleColumns.stock && <th className='py-3 px-3'>Stock</th>}
                {visibleColumns.status && <th className='py-3 px-3 text-center'>Status</th>}
                {visibleColumns.rating && <th className='py-3 px-3 text-center'>Rating</th>}
                <th className='py-3 px-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/50'>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className='py-12 text-center text-muted-foreground'>
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isSelected = selectedIds.includes(p.id)

                  return (
                    <tr
                      key={p.id}
                      role='link'
                      tabIndex={0}
                      aria-label={`View ${p.name}`}
                      onClick={event => handleClickableRow(event, () => router.push(`/b2b/products/${p.id}`))}
                      onKeyDown={event => handleClickableRowKeyDown(event, () => router.push(`/b2b/products/${p.id}`))}
                      className={`group transition-colors h-[50px] ${
                        isSelected
                          ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer'
                          : 'hover:bg-muted/40 cursor-pointer'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className='py-2.5 pl-4 pr-2'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => handleSelectRow(p.id)}
                          className='rounded border-border accent-primary size-3.5 cursor-pointer'
                        />
                      </td>

                      {/* Product Cell (Thumbnail + Name + SKU) */}
                      <td className='py-2.5 px-3'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={p.image}
                            alt={p.name}
                            className='size-9 rounded-md object-cover border border-border/70 bg-muted/40 shrink-0'
                          />
                          <div>
                            <div className='font-medium text-foreground text-xs line-clamp-1'>
                              {p.name}
                            </div>
                            <div className='text-[10px] text-muted-foreground font-mono'>
                              {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product Type */}
                      {visibleColumns.productType && (
                        <td className='py-2.5 px-3 text-muted-foreground whitespace-nowrap'>
                          {p.productType}
                        </td>
                      )}

                      {/* Purity */}
                      {visibleColumns.purity && (
                        <td className='py-2.5 px-3 whitespace-nowrap font-medium text-foreground'>
                          {p.purity}
                        </td>
                      )}

                      {/* Weight */}
                      {visibleColumns.weight && (
                        <td className='py-2.5 px-3 text-muted-foreground whitespace-nowrap font-mono'>
                          {p.weightDisplay}
                        </td>
                      )}

                      {/* Current Rate */}
                      {visibleColumns.currentRate && (
                        <td className='py-2.5 px-3 whitespace-nowrap'>
                          <span className='font-mono font-medium text-foreground'>
                            SAR {p.currentRateSAR.toFixed(2)}
                          </span>
                          <span className='text-[10px] text-muted-foreground'>/g</span>
                        </td>
                      )}

                      {/* B2B Price */}
                      {visibleColumns.b2bPrice && (
                        <td className='py-2.5 px-3 whitespace-nowrap font-mono font-semibold text-foreground'>
                          SAR {p.b2bPriceSAR.toLocaleString()}
                        </td>
                      )}

                      {/* Stock */}
                      {visibleColumns.stock && (
                        <td className='py-2.5 px-3 whitespace-nowrap'>
                          <span
                            className={`font-mono text-xs ${
                              p.stockCount === 0
                                ? 'text-rose-500 font-semibold'
                                : p.stockCount <= 5
                                ? 'text-amber-500 font-semibold'
                                : 'text-foreground'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.status && (
                        <td className='py-2.5 px-3 text-center whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              p.status === 'Active'
                                ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                : p.status === 'Low Stock'
                                ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                                : p.status === 'Out of Stock'
                                ? 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10'
                                : 'border-border text-muted-foreground bg-muted/40'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      )}

                      {/* Rating */}
                      {visibleColumns.rating && (
                        <td className='py-2.5 px-3 text-center whitespace-nowrap'>
                          <span className='inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground'>
                            <Star className='size-3 fill-amber-400 text-amber-400' />
                            <span>{p.rating.toFixed(1)}</span>
                          </span>
                        </td>
                      )}

                      {/* Actions */}
                      <td className='py-2.5 px-4 text-right whitespace-nowrap'>
                        <DropdownMenu>
                          <DropdownMenuTrigger className='inline-flex items-center justify-center size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'>
                            <MoreVertical className='size-3.5' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-36 text-xs'>
                            <DropdownMenuItem onClick={() => router.push(`/b2b/products/${p.id}`)} className='gap-2'>
                              <Eye className='size-3.5' /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Editing ${p.name}`)} className='gap-2'>
                              <Edit2 className='size-3.5' /> Edit Info
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success(`Duplicated ${p.sku}`)} className='gap-2'>
                              <Copy className='size-3.5' /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setProducts(prev => prev.filter(x => x.id !== p.id))
                                toast.success(`Deleted ${p.name}`)
                              }}
                              className='gap-2 text-destructive focus:text-destructive'
                            >
                              <Trash2 className='size-3.5' /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. FLOATING / INLINE BULK SELECTION ACTION PILL (Exact match to reference bottom toolbar) */}
        {selectedIds.length > 0 && (
          <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-full px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200'>
            <span className='text-xs font-semibold text-foreground px-2 py-0.5 rounded-full bg-muted/60'>
              {selectedIds.length} Selected
            </span>

            <div className='h-4 w-px bg-border' />

            <Button
              variant='ghost'
              size='sm'
              onClick={() => toast.info(`Applying code to ${selectedIds.length} products...`)}
              className='h-7 px-2.5 text-xs text-foreground hover:bg-muted gap-1 rounded-full'
            >
              <Tag className='size-3 text-muted-foreground' />
              <span>Apply Code</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => toast.info(`Editing info for ${selectedIds.length} products...`)}
              className='h-7 px-2.5 text-xs text-foreground hover:bg-muted gap-1 rounded-full'
            >
              <Edit2 className='size-3 text-muted-foreground' />
              <span>Edit Info</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)))
                setSelectedIds([])
                toast.success('Selected products deleted')
              }}
              className='h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 gap-1 rounded-full'
            >
              <Trash2 className='size-3 text-destructive' />
              <span>Delete</span>
            </Button>

            <div className='h-4 w-px bg-border' />

            <button
              onClick={() => setSelectedIds([])}
              className='p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'
            >
              <X className='size-3.5' />
            </button>
          </div>
        )}

        {/* 6. PAGINATION FOOTER - MATCH REFERENCE */}
        <div className='p-3.5 bg-card border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs'>
          {/* LEFT: Showing per page */}
          <div className='flex items-center gap-2 text-muted-foreground'>
            <span>Showing per page</span>
            <select
              value={rowsPerPage}
              onChange={e => setRowsPerPage(e.target.value)}
              className='h-7 rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none'
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
            </select>
          </div>

          {/* CENTER: Pagination Controls (Visually Centered) */}
          <div className='flex items-center justify-center gap-1'>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className='size-7 rounded border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none'
            >
              <ChevronsLeft className='size-3.5' />
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className='size-7 rounded border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none'
            >
              <ChevronLeft className='size-3.5' />
            </button>

            {/* Page Buttons */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`size-7 rounded text-xs font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'border border-border/70 text-foreground hover:bg-secondary/60'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`size-7 rounded text-xs font-medium transition-colors ${
                currentPage === 2
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'border border-border/70 text-foreground hover:bg-secondary/60'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`size-7 rounded text-xs font-medium transition-colors ${
                currentPage === 3
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'border border-border/70 text-foreground hover:bg-secondary/60'
              }`}
            >
              3
            </button>
            <span className='px-1 text-muted-foreground font-mono'>…</span>
            <button
              onClick={() => setCurrentPage(25)}
              className={`size-7 rounded text-xs font-medium transition-colors ${
                currentPage === 25
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'border border-border/70 text-foreground hover:bg-secondary/60'
              }`}
            >
              25
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(25, prev + 1))}
              className='size-7 rounded border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground'
            >
              <ChevronRight className='size-3.5' />
            </button>
            <button
              onClick={() => setCurrentPage(25)}
              className='size-7 rounded border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground'
            >
              <ChevronsRight className='size-3.5' />
            </button>
          </div>

          {/* RIGHT: Go to page */}
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <span>Go to page</span>
            <input
              type='number'
              min='1'
              max='25'
              defaultValue='1'
              className='h-7 w-12 rounded border border-border/80 bg-background text-center text-xs text-foreground focus:outline-none'
            />
            <button
              onClick={() => toast.info('Navigating to page')}
              className='h-7 px-2 rounded border border-border/80 text-xs font-medium text-foreground hover:bg-muted/60 flex items-center gap-0.5'
            >
              Go <ChevronRight className='size-3' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
