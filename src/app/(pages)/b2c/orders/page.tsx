'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { toast } from 'sonner'
import { initialB2COrders, type B2COrder } from '@/data/venvision-data'

export default function B2COrdersPage() {
  const [orders, setOrders] = useState<B2COrder[]>(initialB2COrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All')
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== '' ||
      orderStatusFilter !== 'All' ||
      paymentStatusFilter !== 'All' ||
      deliveryStatusFilter !== 'All'
    )
  }, [searchQuery, orderStatusFilter, paymentStatusFilter, deliveryStatusFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setOrderStatusFilter('All')
    setPaymentStatusFilter('All')
    setDeliveryStatusFilter('All')
    setCurrentPage(1)
    toast.info('Order filters reset to default')
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesOrderStatus =
        orderStatusFilter === 'All' || order.fulfillmentStatus === orderStatusFilter
      const matchesPayment =
        paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter
      const matchesDelivery =
        deliveryStatusFilter === 'All' ||
        (deliveryStatusFilter === 'Delivered' && order.fulfillmentStatus === 'Delivered') ||
        (deliveryStatusFilter === 'Shipped' && order.fulfillmentStatus === 'Shipped') ||
        (deliveryStatusFilter === 'Processing' && (order.fulfillmentStatus === 'Processing' || order.fulfillmentStatus === 'In Production'))

      return matchesSearch && matchesOrderStatus && matchesPayment && matchesDelivery
    })
  }, [orders, searchQuery, orderStatusFilter, paymentStatusFilter, deliveryStatusFilter])

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleUpdateStatus = (orderNumber: string, newStatus: string) => {
    toast.success(`Order ${orderNumber} updated`, {
      description: `Status changed to ${newStatus}`
    })
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2c/dashboard" className="hover:text-foreground transition-colors">
              B2C
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Orders</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            B2C Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage customer jewellery orders, delivery tracking and payment reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Exporting orders CSV...')}
            className="h-9 px-3 text-xs rounded-xl"
          >
            Export Orders
          </Button>
        </div>
      </div>

      {/* 2. ONE MAIN ORDER CONTAINER */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Top Filters */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search order ID, customer name, phone, tracking..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 pl-10 pr-4 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Order Status */}
            <div className="w-full sm:w-auto">
              <Select value={orderStatusFilter} onValueChange={v => { setOrderStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[155px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Order:</span>
                    <span className="font-medium text-foreground">{orderStatusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="w-full sm:w-auto">
              <Select value={paymentStatusFilter} onValueChange={v => { setPaymentStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Payment:</span>
                    <span className="font-medium text-foreground">{paymentStatusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Payments</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Status */}
            <div className="w-full sm:w-auto">
              <Select value={deliveryStatusFilter} onValueChange={v => { setDeliveryStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Delivery:</span>
                    <span className="font-medium text-foreground">{deliveryStatusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Delivery</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped (In Transit)</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filters</span>
              </Button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/80" />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/80">
              <TableRow className="hover:bg-transparent border-b border-border/80">
                <TableHead className="w-[130px] text-xs font-semibold text-foreground py-3.5 pl-5">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Products
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Payment
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Order Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Delivery
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
                  <TableCell colSpan={9} className="h-40 text-center text-sm text-muted-foreground">
                    No orders match your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                displayedOrders.map(order => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/20 border-b border-border/50 h-[58px] transition-colors"
                  >
                    {/* Order ID */}
                    <TableCell className="py-2.5 pl-5">
                      <Link
                        href={`/b2c/orders/${order.id}`}
                        className="font-mono text-xs font-bold text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {order.customerPhone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Products */}
                    <TableCell className="py-2.5 text-xs text-foreground max-w-[200px] truncate">
                      {order.items.map(it => it.productName).join(', ')}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="py-2.5 text-sm font-semibold font-mono text-foreground whitespace-nowrap">
                      SAR {order.totalAmountSAR.toLocaleString('en-US')}
                    </TableCell>

                    {/* Payment */}
                    <TableCell className="py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <Badge
                          className={`w-fit text-[10px] px-1.5 py-0 rounded ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                          }`}
                        >
                          {order.paymentStatus}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                          {order.paymentMethod.replace('Moyasar ', '')}
                        </span>
                      </div>
                    </TableCell>

                    {/* Order Status */}
                    <TableCell className="py-2.5">
                      {order.fulfillmentStatus === 'Delivered' && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded-md px-2 py-0.5">
                          Delivered
                        </Badge>
                      )}
                      {order.fulfillmentStatus === 'Shipped' && (
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-medium rounded-md px-2 py-0.5">
                          Shipped
                        </Badge>
                      )}
                      {order.fulfillmentStatus === 'Processing' && (
                        <Badge variant="outline" className="bg-muted/50 text-foreground text-xs font-medium rounded-md px-2 py-0.5">
                          Processing
                        </Badge>
                      )}
                      {order.fulfillmentStatus === 'In Production' && (
                        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-medium rounded-md px-2 py-0.5">
                          In Production
                        </Badge>
                      )}
                      {order.fulfillmentStatus === 'Returned' && (
                        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-medium rounded-md px-2 py-0.5">
                          Returned
                        </Badge>
                      )}
                    </TableCell>

                    {/* Delivery */}
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">{order.courier}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">{order.trackingNumber}</span>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {order.date}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-2.5 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link href={`/b2c/orders/${order.id}`} className="flex items-center gap-2 text-xs">
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.orderNumber, 'Shipped')}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <Truck className="size-3.5 text-muted-foreground" />
                            <span>Mark as Shipped</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.success(`Invoice downloaded for ${order.orderNumber}`)}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <FileText className="size-3.5 text-muted-foreground" />
                            <span>Download Invoice</span>
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

        {/* 3-Column Centered Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 border-t border-border/80 text-xs text-muted-foreground">
          <div className="flex items-center justify-center md:justify-start">
            <span>
              Showing 1–{displayedOrders.length} of {filteredOrders.length} orders
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
            <Button
              variant={currentPage === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(1)}
              className={`size-8 p-0 text-xs rounded-lg font-medium ${
                currentPage === 1 ? 'bg-primary text-primary-foreground' : 'border-border/80 bg-background text-foreground'
              }`}
            >
              1
            </Button>
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
    </div>
  )
}
