'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  MoreHorizontal,
  Eye,
  Check,
  X,
  PackageCheck,
  CreditCard,
  Building2,
  User,
  ArrowUpDown
} from 'lucide-react'
import { toast } from 'sonner'

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

import {
  MOCK_RETURNS,
  ReturnItem,
  ReturnStatus,
  RefundStatus,
  ReturnReason
} from './data'

export default function ReturnsRefundsPage() {
  const [returnsList, setReturnsList] = React.useState<ReturnItem[]>(MOCK_RETURNS)

  // Filters State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [returnStatusFilter, setReturnStatusFilter] = React.useState<string>('ALL')
  const [refundStatusFilter, setRefundStatusFilter] = React.useState<string>('ALL')
  const [channelFilter, setChannelFilter] = React.useState<string>('ALL')
  const [dateFilter, setDateFilter] = React.useState<string>('ALL')

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1)
  const rowsPerPage = 10

  // New Return Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newReturn, setNewReturn] = React.useState({
    orderId: '',
    customer: '',
    product: '',
    channel: 'B2C' as 'B2C' | 'B2B',
    returnReason: 'Wrong Size' as ReturnReason,
    productPrice: 2500,
    notes: ''
  })

  // Status Badge Helpers
  const getReturnStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case 'Requested':
      case 'Under Review':
        return (
          <Badge
            variant='outline'
            className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      case 'Approved':
      case 'Item Received':
        return (
          <Badge
            variant='outline'
            className='bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      case 'Completed':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium'
          >
            Completed
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge
            variant='outline'
            className='bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-[11px] font-medium'
          >
            Rejected
          </Badge>
        )
      default:
        return <Badge variant='outline' className='text-[11px]'>{status}</Badge>
    }
  }

  const getRefundStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'Not Started':
        return (
          <Badge variant='outline' className='text-[11px] text-muted-foreground border-border/80'>
            Not Started
          </Badge>
        )
      case 'Pending':
      case 'Processing':
        return (
          <Badge
            variant='outline'
            className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      case 'Refunded':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium'
          >
            Refunded
          </Badge>
        )
      case 'Failed':
        return (
          <Badge
            variant='outline'
            className='bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-[11px] font-medium'
          >
            Failed
          </Badge>
        )
      default:
        return <Badge variant='outline' className='text-[11px]'>{status}</Badge>
    }
  }

  // Row Quick Actions
  const handleUpdateStatus = (returnId: string, newReturnStatus: ReturnStatus, newRefundStatus?: RefundStatus) => {
    setReturnsList(prev =>
      prev.map(item => {
        if (item.id === returnId) {
          return {
            ...item,
            returnStatus: newReturnStatus,
            ...(newRefundStatus ? { refundStatus: newRefundStatus } : {})
          }
        }
        return item
      })
    )
    toast.success(`Updated ${returnId}: ${newReturnStatus}`)
  }

  // Create Return Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReturn.orderId || !newReturn.customer || !newReturn.product) {
      toast.error('Please fill in Order ID, Customer name and Product.')
      return
    }

    const created: ReturnItem = {
      id: `RET-${1030 + returnsList.length}`,
      orderId: newReturn.orderId,
      customer: newReturn.customer,
      product: newReturn.product,
      productSku: 'VV-SKU-CUSTOM',
      productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
      channel: newReturn.channel,
      quantity: 1,
      originalProductPriceSAR: newReturn.productPrice,
      shippingRefundSAR: 0,
      returnDeliveryCostSAR: 25,
      customerReturnFeeSAR: 0,
      venvisionReturnExpenseSAR: 25,
      restockingFeeSAR: 0,
      refundAmountSAR: newReturn.productPrice,
      returnReason: newReturn.returnReason,
      returnStatus: 'Requested',
      refundStatus: 'Pending',
      requestedDate: 'Today',
      customerNotes: newReturn.notes || 'Initiated manually via VenVision Admin.',
      originalPaymentMethod: 'Mada Debit Card (Moyasar)',
      courierUsed: 'SMSA Express',
      trackingNumber: `SMSA${Math.floor(1000000 + Math.random() * 9000000)}`,
      timeline: [
        { stage: 'Return Requested', date: 'Today', completed: true, current: true },
        { stage: 'Under Atelier Review', date: 'Pending', completed: false },
        { stage: 'Item Received at Vault', date: 'Pending', completed: false },
        { stage: 'Refund Processing', date: 'Pending', completed: false },
        { stage: 'Completed', date: 'Pending', completed: false }
      ]
    }

    setReturnsList(prev => [created, ...prev])
    setIsCreateOpen(false)
    toast.success(`Return ticket ${created.id} created successfully.`)
  }

  // Filtered List
  const filteredReturns = React.useMemo(() => {
    return returnsList.filter(item => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.orderId.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q)

      const matchesReturnStatus = returnStatusFilter === 'ALL' || item.returnStatus === returnStatusFilter
      const matchesRefundStatus = refundStatusFilter === 'ALL' || item.refundStatus === refundStatusFilter
      const matchesChannel = channelFilter === 'ALL' || item.channel === channelFilter

      return matchesSearch && matchesReturnStatus && matchesRefundStatus && matchesChannel
    })
  }, [returnsList, searchQuery, returnStatusFilter, refundStatusFilter, channelFilter])

  const totalReturnsCount = 24 // Base total count matching user prompt
  const displayedReturns = filteredReturns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )
  const totalPages = Math.ceil(filteredReturns.length / rowsPerPage) || 1

  const handleResetFilters = () => {
    setSearchQuery('')
    setReturnStatusFilter('ALL')
    setRefundStatusFilter('ALL')
    setChannelFilter('ALL')
    setDateFilter('ALL')
    setCurrentPage(1)
    toast.info('Filters reset to default view.')
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
            <span className='font-medium text-foreground'>Returns &amp; Refunds</span>
          </nav>

          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5'>
            <RotateCcw className='size-7 text-primary' />
            Returns &amp; Refunds
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Manage product returns, cancellations and customer refunds.
          </p>
        </div>

        {/* Top-Right Action Button */}
        <div className='flex items-center gap-2.5'>
          <Button
            size='sm'
            onClick={() => setIsCreateOpen(true)}
            className='h-9 px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 shadow-xs'
          >
            <Plus className='size-4' />
            <span>Create Return</span>
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. TOP SUMMARY - 4 COMPACT KPI CARDS               */}
      {/* ================================================== */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3.5'>
        {/* Card 1: Return Requests */}
        <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Return Requests</span>
            <RotateCcw className='size-4 text-muted-foreground/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
              24
            </div>
            <p className='text-[11px] text-muted-foreground mt-0.5'>
              Total return tickets recorded
            </p>
          </div>
        </Card>

        {/* Card 2: Awaiting Approval */}
        <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Awaiting Approval</span>
            <Clock className='size-4 text-amber-600/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-amber-600'>
              8
            </div>
            <p className='text-[11px] text-muted-foreground mt-0.5'>
              Under atelier &amp; vault review
            </p>
          </div>
        </Card>

        {/* Card 3: Refund Processing */}
        <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Refund Processing</span>
            <CreditCard className='size-4 text-sky-600/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
              5
            </div>
            <p className='text-[11px] text-muted-foreground mt-0.5'>
              With Mada / Bank Gateways
            </p>
          </div>
        </Card>

        {/* Card 4: Refunded Amount */}
        <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Refunded Amount</span>
            <DollarSign className='size-4 text-primary/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-primary'>
              SAR 18,450
            </div>
            <p className='text-[11px] text-muted-foreground mt-0.5'>
              Settled to customer accounts
            </p>
          </div>
        </Card>
      </div>

      {/* ================================================== */}
      {/* 3. MAIN CONTAINER: SEARCH, FILTERS & TABLE         */}
      {/* ================================================== */}
      <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
        {/* Top Toolbar */}
        <CardHeader className='pb-3.5 border-b border-border/60'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            {/* Search Input */}
            <div className='relative w-full sm:w-80'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none' />
              <Input
                type='text'
                placeholder='Search return ID, order ID, customer...'
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className='h-9 pl-8 pr-3 text-xs bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
              />
            </div>

            {/* Filter Dropdowns */}
            <div className='flex flex-wrap items-center gap-2 text-xs'>
              {/* Return Status */}
              <Select value={returnStatusFilter} onValueChange={v => { setReturnStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className='h-9 w-36 text-xs rounded-lg bg-background border-border/80'>
                  <SelectValue placeholder='Return Status' />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='ALL'>All Return Statuses</SelectItem>
                  <SelectItem value='Requested'>Requested</SelectItem>
                  <SelectItem value='Under Review'>Under Review</SelectItem>
                  <SelectItem value='Approved'>Approved</SelectItem>
                  <SelectItem value='Item Received'>Item Received</SelectItem>
                  <SelectItem value='Completed'>Completed</SelectItem>
                  <SelectItem value='Rejected'>Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Refund Status */}
              <Select value={refundStatusFilter} onValueChange={v => { setRefundStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className='h-9 w-32 text-xs rounded-lg bg-background border-border/80'>
                  <SelectValue placeholder='Refund Status' />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='ALL'>All Refund Statuses</SelectItem>
                  <SelectItem value='Not Started'>Not Started</SelectItem>
                  <SelectItem value='Pending'>Pending</SelectItem>
                  <SelectItem value='Processing'>Processing</SelectItem>
                  <SelectItem value='Refunded'>Refunded</SelectItem>
                  <SelectItem value='Failed'>Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Channel */}
              <Select value={channelFilter} onValueChange={v => { setChannelFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className='h-9 w-28 text-xs rounded-lg bg-background border-border/80'>
                  <SelectValue placeholder='Channel' />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='ALL'>All Channels</SelectItem>
                  <SelectItem value='B2C'>B2C Retail</SelectItem>
                  <SelectItem value='B2B'>B2B Wholesale</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Apply / Reset */}
              <Button
                size='sm'
                variant='outline'
                onClick={() => toast.success('Filters applied')}
                className='h-9 text-xs px-3'
              >
                Filter
              </Button>

              {(searchQuery || returnStatusFilter !== 'ALL' || refundStatusFilter !== 'ALL' || channelFilter !== 'ALL') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleResetFilters}
                  className='h-9 px-2 text-xs text-muted-foreground hover:text-foreground'
                >
                  <RotateCcw className='size-3 mr-1' /> Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Returns Table */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-muted/20 border-b border-border/80 text-xs'>
              <TableRow className='hover:bg-transparent border-b border-border/80'>
                <TableHead className='py-3 pl-5 font-semibold text-foreground'>Return ID</TableHead>
                <TableHead className='py-3 font-semibold text-foreground'>Order ID</TableHead>
                <TableHead className='py-3 font-semibold text-foreground'>Customer</TableHead>
                <TableHead className='py-3 font-semibold text-foreground'>Product</TableHead>
                <TableHead className='py-3 font-semibold text-foreground text-center'>Channel</TableHead>
                <TableHead className='py-3 font-semibold text-foreground'>Return Reason</TableHead>
                <TableHead className='py-3 font-semibold text-foreground text-center'>Return Status</TableHead>
                <TableHead className='py-3 font-semibold text-foreground text-right'>Refund Amount</TableHead>
                <TableHead className='py-3 font-semibold text-foreground text-center'>Refund Status</TableHead>
                <TableHead className='py-3 font-semibold text-foreground'>Requested Date</TableHead>
                <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-xs divide-y divide-border/50'>
              {displayedReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className='h-36 text-center text-muted-foreground'>
                    No return records found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                displayedReturns.map(item => (
                  <TableRow key={item.id} className='hover:bg-muted/20 h-[56px] transition-colors'>
                    {/* Return ID Link */}
                    <TableCell className='py-2.5 pl-5 font-mono font-bold text-primary'>
                      <Link href={`/returns-refunds/${item.id}`} className='hover:underline'>
                        {item.id}
                      </Link>
                    </TableCell>

                    {/* Order ID Link */}
                    <TableCell className='py-2.5 font-mono text-muted-foreground'>
                      <Link
                        href={item.channel === 'B2B' ? `/b2b/orders` : `/b2c/orders`}
                        className='hover:underline hover:text-foreground'
                      >
                        {item.orderId}
                      </Link>
                    </TableCell>

                    {/* Customer */}
                    <TableCell className='py-2.5'>
                      <div className='font-semibold text-foreground'>{item.customer}</div>
                      {item.businessName && (
                        <span className='text-[10px] text-muted-foreground block truncate max-w-[140px]'>
                          {item.businessName}
                        </span>
                      )}
                    </TableCell>

                    {/* Product */}
                    <TableCell className='py-2.5 max-w-[180px]'>
                      <span className='truncate block text-foreground font-medium'>{item.product}</span>
                      <span className='font-mono text-[10px] text-muted-foreground'>{item.productSku}</span>
                    </TableCell>

                    {/* Channel */}
                    <TableCell className='py-2.5 text-center'>
                      <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
                        {item.channel}
                      </Badge>
                    </TableCell>

                    {/* Return Reason */}
                    <TableCell className='py-2.5 text-muted-foreground'>
                      {item.returnReason}
                    </TableCell>

                    {/* Return Status */}
                    <TableCell className='py-2.5 text-center'>
                      {getReturnStatusBadge(item.returnStatus)}
                    </TableCell>

                    {/* Refund Amount */}
                    <TableCell className='py-2.5 text-right font-mono font-bold text-foreground'>
                      SAR {item.refundAmountSAR.toLocaleString()}
                    </TableCell>

                    {/* Refund Status */}
                    <TableCell className='py-2.5 text-center'>
                      {getRefundStatusBadge(item.refundStatus)}
                    </TableCell>

                    {/* Requested Date */}
                    <TableCell className='py-2.5 text-muted-foreground whitespace-nowrap text-[11px]'>
                      {item.requestedDate}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className='py-2.5 pr-5 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm' className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'>
                            <MoreHorizontal className='size-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-44 text-xs rounded-xl shadow-md'>
                          <DropdownMenuLabel className='text-[11px] text-muted-foreground'>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/returns-refunds/${item.id}`} className='flex items-center gap-2 cursor-pointer'>
                              <Eye className='size-3.5' /> View Return
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(item.id, 'Approved')}
                            className='flex items-center gap-2 cursor-pointer text-emerald-600'
                          >
                            <Check className='size-3.5' /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(item.id, 'Item Received')}
                            className='flex items-center gap-2 cursor-pointer text-sky-600'
                          >
                            <PackageCheck className='size-3.5' /> Mark Item Received
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(item.id, 'Completed', 'Refunded')}
                            className='flex items-center gap-2 cursor-pointer text-primary font-medium'
                          >
                            <CreditCard className='size-3.5' /> Process Refund
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                            className='flex items-center gap-2 cursor-pointer text-rose-600'
                          >
                            <X className='size-3.5' /> Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toast.success(`Printing return manifest for ${item.id}...`)}
                            className='flex items-center gap-2 cursor-pointer text-muted-foreground'
                          >
                            <Printer className='size-3.5' /> Print Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className='p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground'>
          {/* Left: Record Count */}
          <div className='order-2 sm:order-1'>
            Showing 1–{displayedReturns.length} of {totalReturnsCount} returns
          </div>

          {/* Center: Pagination Buttons */}
          <div className='flex items-center gap-1.5 order-1 sm:order-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className='h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground'
            >
              <ChevronLeft className='size-3.5' />
              <span>Previous</span>
            </Button>

            <Button
              variant={currentPage === 1 ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(1)}
              className={`size-8 p-0 text-xs rounded-lg font-medium ${
                currentPage === 1 ? 'bg-primary text-primary-foreground' : 'border-border/80 bg-background text-foreground'
              }`}
            >
              1
            </Button>

            <Button
              variant={currentPage === 2 ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(2)}
              className={`size-8 p-0 text-xs rounded-lg font-medium ${
                currentPage === 2 ? 'bg-primary text-primary-foreground' : 'border-border/80 bg-background text-foreground'
              }`}
            >
              2
            </Button>

            <Button
              variant={currentPage === 3 ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(3)}
              className={`size-8 p-0 text-xs rounded-lg font-medium ${
                currentPage === 3 ? 'bg-primary text-primary-foreground' : 'border-border/80 bg-background text-foreground'
              }`}
            >
              3
            </Button>

            <Button
              variant='outline'
              size='sm'
              disabled={currentPage >= 3}
              onClick={() => setCurrentPage(p => p + 1)}
              className='h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground'
            >
              <span>Next</span>
              <ChevronRight className='size-3.5' />
            </Button>
          </div>

          {/* Right: Rows Per Page */}
          <div className='flex items-center gap-1.5 order-3'>
            <span>Rows per page</span>
            <Select defaultValue='10'>
              <SelectTrigger className='h-8 w-16 text-xs rounded-lg bg-background border-border/80 text-foreground'>
                <SelectValue placeholder='10' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* ================================================== */}
      {/* 4. MODAL: CREATE RETURN TICKET                     */}
      {/* ================================================== */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className='max-w-lg bg-card border-border/80 shadow-xl rounded-xl'>
          <DialogHeader className='pb-2 border-b border-border/60'>
            <DialogTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
              <RotateCcw className='size-5 text-primary' />
              Create Return Request
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground'>
              Initiate an official product return or order cancellation ticket for inspection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className='space-y-4 py-2 text-xs'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Order ID</Label>
                <Input
                  required
                  placeholder='e.g. ORD-4530'
                  value={newReturn.orderId}
                  onChange={e => setNewReturn({ ...newReturn, orderId: e.target.value })}
                  className='h-8 text-xs font-mono uppercase'
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Customer Name</Label>
                <Input
                  required
                  placeholder='e.g. Mariam Al-Harbi'
                  value={newReturn.customer}
                  onChange={e => setNewReturn({ ...newReturn, customer: e.target.value })}
                  className='h-8 text-xs'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Channel</Label>
                <Select
                  value={newReturn.channel}
                  onValueChange={(val: any) => setNewReturn({ ...newReturn, channel: val })}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    <SelectItem value='B2C'>B2C Retail</SelectItem>
                    <SelectItem value='B2B'>B2B Wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Return Reason</Label>
                <Select
                  value={newReturn.returnReason}
                  onValueChange={(val: any) => setNewReturn({ ...newReturn, returnReason: val })}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    <SelectItem value='Wrong Size'>Wrong Size</SelectItem>
                    <SelectItem value='Damaged Product'>Damaged Product</SelectItem>
                    <SelectItem value='Incorrect Product'>Incorrect Product</SelectItem>
                    <SelectItem value='Changed Mind'>Changed Mind</SelectItem>
                    <SelectItem value='Order Cancellation'>Order Cancellation</SelectItem>
                    <SelectItem value='Quality Issue'>Quality Issue</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Product Name</Label>
                <Input
                  required
                  placeholder='e.g. 18K Diamond Solitaire Ring'
                  value={newReturn.product}
                  onChange={e => setNewReturn({ ...newReturn, product: e.target.value })}
                  className='h-8 text-xs'
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Original Price (SAR)</Label>
                <Input
                  type='number'
                  required
                  value={newReturn.productPrice}
                  onChange={e => setNewReturn({ ...newReturn, productPrice: Number(e.target.value) })}
                  className='h-8 text-xs font-mono'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <Label className='text-xs font-semibold'>Customer Inspection Notes</Label>
              <textarea
                rows={2}
                placeholder='Describe reason for return, condition of tamper seals, or client message...'
                value={newReturn.notes}
                onChange={e => setNewReturn({ ...newReturn, notes: e.target.value })}
                className='w-full rounded-md border border-input bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>

            <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t border-border/60'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsCreateOpen(false)}
                className='h-8 text-xs'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='sm'
                className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
              >
                File Return Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
