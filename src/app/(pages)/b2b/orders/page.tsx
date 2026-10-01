'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  FileText,
  Truck,
  RotateCcw,
  CheckCircle2,
  Building2,
  Coins,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
  SlidersHorizontal,
  Ban,
  ArrowRight,
  Check,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'
import { toast } from 'sonner'
import { initialB2BOrders, type B2BOrder } from '@/data/venvision-data'
import { cn } from '@/lib/utils'

type TabFilter = 'all' | 'fixed' | 'negotiation' | 'pending' | 'completed' | 'cancelled'

export default function B2BOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<B2BOrder[]>(initialB2BOrders)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Negotiation Modal State
  const [negotiationModalOpen, setNegotiationModalOpen] = useState(false)
  const [activeNegotiationOrder, setActiveNegotiationOrder] = useState<B2BOrder | null>(null)
  const [counterOfferInput, setCounterOfferInput] = useState('')

  // Tab counts
  const allCount = orders.length
  const fixedCount = orders.filter(o => o.pricingType === 'Fixed Rate').length
  const negotiationCount = orders.filter(o => o.pricingType === 'Negotiation').length
  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const completedCount = orders.filter(o => o.status === 'Completed').length
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchQuery('')
    setActiveTab('all')
    setStatusFilter('All')
    setCurrentPage(1)
    toast.info('B2B order filters reset')
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.businessName.toLowerCase().includes(q) ||
        order.crNumber.includes(q) ||
        order.trackingNumber.toLowerCase().includes(q) ||
        order.items.some(i => i.productName.toLowerCase().includes(q))

      // Tab filter
      let matchesTab = true
      if (activeTab === 'fixed') {
        matchesTab = order.pricingType === 'Fixed Rate'
      } else if (activeTab === 'negotiation') {
        matchesTab = order.pricingType === 'Negotiation'
      } else if (activeTab === 'pending') {
        matchesTab = order.status === 'Pending'
      } else if (activeTab === 'completed') {
        matchesTab = order.status === 'Completed'
      } else if (activeTab === 'cancelled') {
        matchesTab = order.status === 'Cancelled'
      }

      // Dropdown status filter
      const matchesStatus =
        statusFilter === 'All' ||
        order.fulfillmentStatus === statusFilter ||
        order.status === statusFilter

      return matchesSearch && matchesTab && matchesStatus
    })
  }, [orders, searchQuery, activeTab, statusFilter])

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Negotiation Actions
  const handleOpenNegotiation = (order: B2BOrder) => {
    setActiveNegotiationOrder(order)
    setCounterOfferInput(order.counterOfferSAR ? String(order.counterOfferSAR) : '')
    setNegotiationModalOpen(true)
  }

  const handleAcceptOffer = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const agreedPrice = ord.customerOfferSAR || ord.items[0]?.ratePerUnitSAR || 0
          const updatedTotal = agreedPrice * ord.totalUnits
          return {
            ...ord,
            negotiationStatus: 'Offer Accepted',
            totalAmountSAR: updatedTotal,
            items: ord.items.map(item => ({
              ...item,
              ratePerUnitSAR: agreedPrice,
              totalSAR: updatedTotal
            }))
          }
        }
        return ord
      })
    )
    toast.success('Customer offer accepted. Order pricing and trade invoice updated.')
    setNegotiationModalOpen(false)
  }

  const handleSendCounterOffer = (orderId: string) => {
    const counterAmount = parseFloat(counterOfferInput)
    if (!counterAmount || counterAmount <= 0) {
      toast.error('Please enter a valid counter-offer amount in SAR.')
      return
    }

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTotal = counterAmount * ord.totalUnits
          return {
            ...ord,
            counterOfferSAR: counterAmount,
            negotiationStatus: 'Counter-Offered',
            totalAmountSAR: updatedTotal
          }
        }
        return ord
      })
    )
    toast.success(`Counter-offer of SAR ${counterAmount.toLocaleString()}/unit sent to buyer.`)
    setNegotiationModalOpen(false)
  }

  const handleDeclineOffer = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            negotiationStatus: 'Offer Declined',
            status: 'Cancelled',
            fulfillmentStatus: 'Cancelled'
          }
        }
        return ord
      })
    )
    toast.info('Customer offer declined. Order marked as declined/cancelled.')
    setNegotiationModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2b/dashboard" className="hover:text-foreground transition-colors">
              B2B
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Orders</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            B2B Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage wholesale bullion orders, rate lock executions and negotiation requests.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Exporting B2B trade manifest...')}
          className="h-9 px-3 text-xs rounded-xl"
        >
          Export Manifest
        </Button>
      </div>

      {/* 2. Order Filters / Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
        {/* All Orders */}
        <button
          type="button"
          onClick={() => handleTabChange('all')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <span>All Orders</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'all'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {allCount}
          </span>
        </button>

        {/* Fixed Rate */}
        <button
          type="button"
          onClick={() => handleTabChange('fixed')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'fixed'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <Lock className="size-3" />
          <span>Fixed Rate</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'fixed'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {fixedCount}
          </span>
        </button>

        {/* Negotiation */}
        <button
          type="button"
          onClick={() => handleTabChange('negotiation')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'negotiation'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <SlidersHorizontal className="size-3" />
          <span>Negotiation</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'negotiation'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {negotiationCount}
          </span>
        </button>

        {/* Pending */}
        <button
          type="button"
          onClick={() => handleTabChange('pending')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'pending'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <span>Pending</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'pending'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {pendingCount}
          </span>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() => handleTabChange('completed')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'completed'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <span>Completed</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'completed'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {completedCount}
          </span>
        </button>

        {/* Cancelled */}
        <button
          type="button"
          onClick={() => handleTabChange('cancelled')}
          className={cn(
            'h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'cancelled'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          )}
        >
          <span>Cancelled</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
              activeTab === 'cancelled'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {cancelledCount}
          </span>
        </button>
      </div>

      {/* 3. Main Single Container */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Search & Secondary Filter Toolbar */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by wholesale order ID, business name, CR number, product, waybill..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 pl-10 pr-4 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="h-9 w-full sm:w-[165px] rounded-lg text-xs bg-background border-border">
                    <span className="truncate">
                      <span className="text-muted-foreground mr-1">Fulfillment:</span>
                      <span className="font-medium text-foreground">{statusFilter}</span>
                    </span>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="All">All Fulfillments</SelectItem>
                    <SelectItem value="Preparing Dispatch">Preparing Dispatch</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery !== '' || activeTab !== 'all' || statusFilter !== 'All') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Showing {displayedOrders.length} of {filteredOrders.length} orders
            </div>
          </div>
        </div>

        <div className="border-t border-border/80" />

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/80">
              <TableRow className="hover:bg-transparent border-b border-border/80">
                <TableHead className="w-[130px] text-xs font-semibold text-foreground py-3.5 pl-5">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Business / Buyer
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Product
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Quantity / Weight
                </TableHead>
                {/* PRICING TYPE COLUMN */}
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Pricing Type
                </TableHead>
                {/* RATE & NEGOTIATION DETAILS */}
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Rate / Negotiation Details
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Order Value
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Payment
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Order Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Date
                </TableHead>
                <TableHead className="w-[50px] text-right py-3.5 pr-5">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-40 text-center text-sm text-muted-foreground">
                    No B2B wholesale orders match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                displayedOrders.map(order => {
                  const isFixed = order.pricingType === 'Fixed Rate'
                  const mainItem = order.items[0]

                  return (
                    <TableRow
                      key={order.id}
                      role="link"
                      tabIndex={0}
                      aria-label={`View order ${order.orderNumber}`}
                      onClick={event => handleClickableRow(event, () => router.push(`/b2b/orders/${order.id}`))}
                      onKeyDown={event => handleClickableRowKeyDown(event, () => router.push(`/b2b/orders/${order.id}`))}
                      className="hover:bg-muted/20 border-b border-border/50 h-[64px] transition-colors cursor-pointer"
                    >
                      {/* 1. Order ID */}
                      <TableCell className="py-2.5 pl-5">
                        <Link
                          href={`/b2b/orders/${order.id}`}
                          className="font-mono text-xs font-bold text-primary hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </TableCell>

                      {/* 2. Business / Buyer */}
                      <TableCell className="py-2.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-foreground truncate max-w-[190px]">
                            {order.businessName}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[190px]">
                            CR: {order.crNumber} &bull; {order.buyerName}
                          </span>
                        </div>
                      </TableCell>

                      {/* 3. Product */}
                      <TableCell className="py-2.5 text-xs text-foreground">
                        <span className="truncate max-w-[180px] block font-medium">
                          {mainItem?.productName || 'Wholesale Gold Bullion'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {mainItem?.sku}
                        </span>
                      </TableCell>

                      {/* 4. Quantity / Weight */}
                      <TableCell className="py-2.5 text-xs font-mono font-medium text-foreground whitespace-nowrap">
                        {order.totalUnits.toLocaleString()} {order.unitType}
                      </TableCell>

                      {/* 5. PRICING TYPE BADGE */}
                      <TableCell className="py-2.5 whitespace-nowrap">
                        {isFixed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
                            <Lock className="size-3" />
                            <span>Fixed Rate</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-md">
                            <SlidersHorizontal className="size-3" />
                            <span>Negotiation</span>
                          </span>
                        )}
                      </TableCell>

                      {/* 6. RATE / NEGOTIATION DETAILS */}
                      <TableCell className="py-2.5 text-xs whitespace-nowrap">
                        {isFixed ? (
                          <div className="space-y-0.5">
                            <div className="font-mono font-semibold text-foreground">
                              {order.unitType.includes('kilogram')
                                ? `SAR ${order.fixedRateSAR?.toLocaleString()}/kg`
                                : `SAR ${order.fixedRateSAR?.toLocaleString()}/g`}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80">
                              <Ban className="size-2.5 text-muted-foreground/60" />
                              <span>Negotiation Not Available</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="text-muted-foreground" title="Catalog Quotation">
                                Quote: SAR {order.quotationPriceSAR?.toLocaleString()}
                              </span>
                              <span className="text-foreground font-semibold" title="Customer Proposed Offer">
                                Offer: SAR {order.customerOfferSAR?.toLocaleString()}
                              </span>
                            </div>

                            {/* Negotiation status badge */}
                            <div>
                              {order.negotiationStatus === 'Offer Pending Review' && (
                                <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[10px] px-1.5 py-0 font-normal">
                                  Pending Review
                                </Badge>
                              )}
                              {order.negotiationStatus === 'Counter-Offered' && (
                                <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] px-1.5 py-0 font-normal">
                                  Counter: SAR {order.counterOfferSAR?.toLocaleString()}
                                </Badge>
                              )}
                              {order.negotiationStatus === 'Offer Accepted' && (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] px-1.5 py-0 font-normal">
                                  Offer Accepted
                                </Badge>
                              )}
                              {order.negotiationStatus === 'Offer Declined' && (
                                <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] px-1.5 py-0 font-normal">
                                  Offer Declined
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </TableCell>

                      {/* 7. Order Value */}
                      <TableCell className="py-2.5 text-xs font-semibold font-mono text-primary whitespace-nowrap">
                        SAR {order.totalAmountSAR.toLocaleString('en-US')}
                      </TableCell>

                      {/* 8. Payment */}
                      <TableCell className="py-2.5 whitespace-nowrap">
                        {order.paymentStatus === 'Paid' && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] px-2 py-0.5">
                            Paid
                          </Badge>
                        )}
                        {order.paymentStatus === 'Processing' && (
                          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[10px] px-2 py-0.5">
                            Processing
                          </Badge>
                        )}
                        {order.paymentStatus === 'Pending Wire' && (
                          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] px-2 py-0.5">
                            Pending Wire
                          </Badge>
                        )}
                        {order.paymentStatus === 'Failed' && (
                          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] px-2 py-0.5">
                            Failed
                          </Badge>
                        )}
                      </TableCell>

                      {/* 9. Order Status */}
                      <TableCell className="py-2.5 whitespace-nowrap">
                        {order.status === 'Completed' && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-medium px-2 py-0.5">
                            Completed
                          </Badge>
                        )}
                        {order.status === 'Pending' && (
                          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-xs font-medium px-2 py-0.5">
                            Pending
                          </Badge>
                        )}
                        {order.status === 'Cancelled' && (
                          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-xs font-medium px-2 py-0.5">
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>

                      {/* 10. Date */}
                      <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {order.date}
                      </TableCell>

                      {/* 11. Actions */}
                      <TableCell className="py-2.5 pr-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl">
                            <DropdownMenuItem asChild>
                              <Link href={`/b2b/orders/${order.id}`} className="flex items-center gap-2 text-xs">
                                <Eye className="size-3.5 text-muted-foreground" />
                                <span>View Order</span>
                              </Link>
                            </DropdownMenuItem>

                            {/* NEGOTIATION ACTION: ONLY FOR NEGOTIATION ORDERS */}
                            {!isFixed && (
                              <DropdownMenuItem
                                onClick={() => handleOpenNegotiation(order)}
                                className="flex items-center gap-2 text-xs cursor-pointer text-sky-400 focus:text-sky-300"
                              >
                                <SlidersHorizontal className="size-3.5" />
                                <span>Review Offer &amp; Bargain</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => toast.success(`Vault Delivery Pass printed for ${order.orderNumber}`)}
                              className="flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <Truck className="size-3.5 text-muted-foreground" />
                              <span>Vault Delivery Pass</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => toast.success(`Trade settlement agreement downloaded for ${order.orderNumber}`)}
                              className="flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <FileText className="size-3.5 text-muted-foreground" />
                              <span>Download Contract</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 border-t border-border/80 text-xs text-muted-foreground">
          <div className="flex items-center justify-center md:justify-start">
            <span>
              Showing {displayedOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}–
              {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} wholesale orders
            </span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(p)}
                className={cn(
                  'size-8 p-0 text-xs rounded-lg font-medium',
                  currentPage === p
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border/80 bg-background text-foreground'
                )}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-1.5">
            <span>Rows per page:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={v => { setRowsPerPage(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-8 w-16 text-xs rounded-lg bg-background border-border/80 text-foreground">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 4. Negotiation & Counter-Offer Modal (for Negotiation orders only) */}
      <Dialog open={negotiationModalOpen} onOpenChange={setNegotiationModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <SlidersHorizontal className="size-4 text-sky-400" />
              <span>B2B Quotation &amp; Price Negotiation</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Wholesale Order {activeNegotiationOrder?.orderNumber} &bull; Buyer: {activeNegotiationOrder?.businessName}
            </DialogDescription>
          </DialogHeader>

          {activeNegotiationOrder && (
            <div className="space-y-4 py-2 text-xs">
              {/* Product and Buyer Specs */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-sm text-foreground block">
                      {activeNegotiationOrder.items[0]?.productName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Volume: {activeNegotiationOrder.totalUnits.toLocaleString()} {activeNegotiationOrder.unitType}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-[10px]">
                    Negotiation Mode
                  </Badge>
                </div>
              </div>

              {/* Price Breakdown Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Catalog Quote Price</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    SAR {activeNegotiationOrder.quotationPriceSAR?.toLocaleString()} / unit
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Standard wholesale list price</span>
                </div>

                <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-3 space-y-1">
                  <span className="text-sky-400 block text-[11px] font-medium">Customer's Proposed Offer</span>
                  <span className="font-mono font-bold text-sm text-sky-400">
                    SAR {activeNegotiationOrder.customerOfferSAR?.toLocaleString()} / unit
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Discount: {Math.round((1 - (activeNegotiationOrder.customerOfferSAR || 0) / (activeNegotiationOrder.quotationPriceSAR || 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Counter-Offer Section */}
              <div className="space-y-2 pt-1">
                <Label htmlFor="counterOffer" className="text-xs font-semibold text-foreground">
                  Propose Counter-Offer (SAR per unit)
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                      SAR
                    </span>
                    <Input
                      id="counterOffer"
                      type="number"
                      placeholder="e.g. 3350"
                      value={counterOfferInput}
                      onChange={e => setCounterOfferInput(e.target.value)}
                      className="pl-12 font-mono text-sm h-10 rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleSendCounterOffer(activeNegotiationOrder.id)}
                    className="h-10 px-4 text-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  >
                    Submit Counter
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Submitting a counter-offer updates the order value and sends a revised formal proforma quotation to the buyer.
                </p>
              </div>

              {/* Status Notice */}
              <div className="flex items-center justify-between text-[11px] rounded-lg bg-background p-2.5 border border-border/70">
                <span className="text-muted-foreground">Current Negotiation Status:</span>
                <span className="font-medium text-foreground font-mono">
                  {activeNegotiationOrder.negotiationStatus || 'Offer Pending Review'}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => activeNegotiationOrder && handleDeclineOffer(activeNegotiationOrder.id)}
              className="text-xs rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20"
            >
              <X className="size-3.5 mr-1" />
              Decline Offer
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setNegotiationModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => activeNegotiationOrder && handleAcceptOffer(activeNegotiationOrder.id)}
                className="text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5"
              >
                <Check className="size-3.5" />
                Accept Customer Offer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
