'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  Building2,
  FileCheck2,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  QrCode,
  DollarSign,
  Wallet,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'

interface PaymentTransaction {
  id: string
  orderId: string
  orderPath: string
  customerOrBusiness: string
  customerEmail: string
  customerType: 'Individual' | 'Corporate'
  channel: 'B2C' | 'B2B'
  method: 'Mada Debit' | 'Apple Pay' | 'Credit Card' | 'Corporate Wire (SNB)' | 'Gold Metal Clearing'
  amount: number
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  date: string
  gatewayRef: string
  zatcaUuid: string
  fees: number
  netAmount: number
}

const mockTransactions: PaymentTransaction[] = [
  {
    id: 'TXN-90481',
    orderId: 'ORD-B2B-1089',
    orderPath: '/b2b/orders/ORD-B2B-1089',
    customerOrBusiness: 'Al-Safwa Luxury Jewels Ltd',
    customerEmail: 'treasury@alsafwa-jewels.sa',
    customerType: 'Corporate',
    channel: 'B2B',
    method: 'Corporate Wire (SNB)',
    amount: 840000.0,
    status: 'Paid',
    date: '24 Sep 2026, 14:15',
    gatewayRef: 'SNB-SWIFT-99382109',
    zatcaUuid: 'e9a4f210-99c1-4b72-8412-f1948123fa01',
    fees: 150.0,
    netAmount: 839850.0
  },
  {
    id: 'TXN-90482',
    orderId: 'ORD-9428',
    orderPath: '/b2c/orders/ORD-9428',
    customerOrBusiness: 'Nouf Al-Shahrani',
    customerEmail: 'nouf.shahrani@gmail.com',
    customerType: 'Individual',
    channel: 'B2C',
    method: 'Apple Pay',
    amount: 18975.0,
    status: 'Paid',
    date: '24 Sep 2026, 13:42',
    gatewayRef: 'APL-MOY-4491028',
    zatcaUuid: 'c3b1e772-4011-4a18-9121-aa099182390c',
    fees: 189.75,
    netAmount: 18785.25
  },
  {
    id: 'TXN-90483',
    orderId: 'ORD-9425',
    orderPath: '/b2c/orders/ORD-9425',
    customerOrBusiness: 'Sultan Al-Otaibi',
    customerEmail: 'sultan.otaibi@outlook.sa',
    customerType: 'Individual',
    channel: 'B2C',
    method: 'Mada Debit',
    amount: 6500.0,
    status: 'Paid',
    date: '24 Sep 2026, 11:20',
    gatewayRef: 'MADA-AUTH-77192',
    zatcaUuid: 'f1a94022-7721-4f10-b991-884910284711',
    fees: 32.5,
    netAmount: 6467.5
  },
  {
    id: 'TXN-90484',
    orderId: 'ORD-B2B-1088',
    orderPath: '/b2b/orders/ORD-B2B-1088',
    customerOrBusiness: 'Riyadh Royal Ateliers Co.',
    customerEmail: 'finance@riyadhroyalgold.com',
    customerType: 'Corporate',
    channel: 'B2B',
    method: 'Gold Metal Clearing',
    amount: 472500.0,
    status: 'Pending',
    date: '24 Sep 2026, 09:30',
    gatewayRef: 'GMC-VAULT-2026-08',
    zatcaUuid: 'a9118022-3841-4882-aa31-901848172938',
    fees: 250.0,
    netAmount: 472250.0
  },
  {
    id: 'TXN-90485',
    orderId: 'ORD-9422',
    orderPath: '/b2c/orders/ORD-9422',
    customerOrBusiness: 'Reem Al-Ghamdi',
    customerEmail: 'reem.ghamdi@yahoo.com',
    customerType: 'Individual',
    channel: 'B2C',
    method: 'Credit Card',
    amount: 32400.0,
    status: 'Paid',
    date: '23 Sep 2026, 17:15',
    gatewayRef: 'STRIPE-CH-8829104',
    zatcaUuid: '44102911-ff01-4472-a128-448102938472',
    fees: 486.0,
    netAmount: 31914.0
  },
  {
    id: 'TXN-90486',
    orderId: 'ORD-9419',
    orderPath: '/b2c/orders/ORD-9419',
    customerOrBusiness: 'Lama Al-Husseini',
    customerEmail: 'lama.husseini@icloud.com',
    customerType: 'Individual',
    channel: 'B2C',
    method: 'Apple Pay',
    amount: 14200.0,
    status: 'Refunded',
    date: '23 Sep 2026, 14:00',
    gatewayRef: 'REF-APL-99210',
    zatcaUuid: 'b7128919-4481-4991-cc12-990182746194',
    fees: 0.0,
    netAmount: -14200.0
  },
  {
    id: 'TXN-90487',
    orderId: 'ORD-9415',
    orderPath: '/b2c/orders/ORD-9415',
    customerOrBusiness: 'Fahad Al-Dossari',
    customerEmail: 'fahad.dossari@gmail.com',
    customerType: 'Individual',
    channel: 'B2C',
    method: 'Mada Debit',
    amount: 9800.0,
    status: 'Failed',
    date: '23 Sep 2026, 10:20',
    gatewayRef: 'ERR-INSUFFICIENT-FUNDS',
    zatcaUuid: 'UNREGISTERED-FAIL',
    fees: 0.0,
    netAmount: 0.0
  },
  {
    id: 'TXN-90488',
    orderId: 'ORD-B2B-1085',
    orderPath: '/b2b/orders/ORD-B2B-1085',
    customerOrBusiness: 'Dammam Gold Refinery LLC',
    customerEmail: 'accounts@dammamrefinery.sa',
    customerType: 'Corporate',
    channel: 'B2B',
    method: 'Corporate Wire (SNB)',
    amount: 1250000.0,
    status: 'Paid',
    date: '22 Sep 2026, 16:45',
    gatewayRef: 'SNB-SWIFT-8831092',
    zatcaUuid: '99018274-1234-4567-890a-bcdef1234567',
    fees: 150.0,
    netAmount: 1249850.0
  }
]

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockTransactions)
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [methodFilter, setMethodFilter] = useState('ALL')

  // Selected Transaction for Drawer
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Calculations for top small summary
  const summary = useMemo(() => {
    let received = 0
    let pending = 0
    let refunded = 0
    let failed = 0

    transactions.forEach(t => {
      if (t.status === 'Paid') received += t.amount
      if (t.status === 'Pending') pending += t.amount
      if (t.status === 'Refunded') refunded += t.amount
      if (t.status === 'Failed') failed += t.amount
    })

    return { received, pending, refunded, failed }
  }, [transactions])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerOrBusiness.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesChannel = channelFilter === 'ALL' || t.channel === channelFilter
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
      const matchesMethod = methodFilter === 'ALL' || t.method === methodFilter

      return matchesSearch && matchesChannel && matchesStatus && matchesMethod
    })
  }, [transactions, searchQuery, channelFilter, statusFilter, methodFilter])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setChannelFilter('ALL')
    setStatusFilter('ALL')
    setMethodFilter('ALL')
  }

  // Open Details Drawer
  const handleOpenDrawer = (txn: PaymentTransaction) => {
    setSelectedTxn(txn)
    setIsDrawerOpen(true)
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* Breadcrumb & Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Payments</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Payments
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Track transactions, electronic invoices, settlements, and payment gateway logs.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => toast.success('Exporting ZATCA tax-cleared settlement statement...')}
            className='h-9 text-xs sm:text-sm border-border/80 gap-1.5'
          >
            <Download className='size-3.5' />
            Export Statement
          </Button>
        </div>
      </div>

      {/* TOP SMALL SUMMARY (Received, Pending, Refunded, Failed) */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3.5'>
        {/* Received */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-1 shadow-sm'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Received (Settled)</span>
            <span className='size-2 rounded-full bg-emerald-500' />
          </div>
          <div className='text-xl sm:text-2xl font-bold text-foreground font-mono'>
            {summary.received.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className='text-xs font-normal text-muted-foreground ml-1.5 font-sans'>SAR</span>
          </div>
          <p className='text-[10px] text-muted-foreground'>Completed client transactions</p>
        </div>

        {/* Pending */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-1 shadow-sm'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Pending Settlement</span>
            <span className='size-2 rounded-full bg-amber-500' />
          </div>
          <div className='text-xl sm:text-2xl font-bold text-foreground font-mono'>
            {summary.pending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className='text-xs font-normal text-muted-foreground ml-1.5 font-sans'>SAR</span>
          </div>
          <p className='text-[10px] text-muted-foreground'>Bank clearing & wire confirmation</p>
        </div>

        {/* Refunded */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-1 shadow-sm'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Refunded</span>
            <span className='size-2 rounded-full bg-blue-500' />
          </div>
          <div className='text-xl sm:text-2xl font-bold text-foreground font-mono'>
            {summary.refunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className='text-xs font-normal text-muted-foreground ml-1.5 font-sans'>SAR</span>
          </div>
          <p className='text-[10px] text-muted-foreground'>Reversed or cancelled orders</p>
        </div>

        {/* Failed */}
        <div className='rounded-xl border border-border/70 bg-card p-4 space-y-1 shadow-sm'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Failed / Declined</span>
            <span className='size-2 rounded-full bg-rose-500' />
          </div>
          <div className='text-xl sm:text-2xl font-bold text-foreground font-mono'>
            {summary.failed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className='text-xs font-normal text-muted-foreground ml-1.5 font-sans'>SAR</span>
          </div>
          <p className='text-[10px] text-muted-foreground'>Declined card or expired session</p>
        </div>
      </div>

      {/* ONE MAIN CONTAINER: Search + Filters + Table + Centered Pagination */}
      <div className='rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden'>
        {/* Top Controls Section */}
        <div className='p-4 space-y-3.5 bg-card'>
          {/* Search Input */}
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
            <Input
              type='text'
              placeholder='Search transaction ID, order ID, customer name, gateway reference...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 bg-background/50 h-9 text-xs sm:text-sm border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='size-3.5' />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className='flex flex-wrap items-center justify-between gap-3 pt-0.5'>
            <div className='flex flex-wrap items-center gap-2'>
              {/* Channel Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Channel:</span>
                <select
                  value={channelFilter}
                  onChange={e => setChannelFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Channels</option>
                  <option value='B2C'>B2C Retail</option>
                  <option value='B2B'>B2B Wholesale</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Statuses</option>
                  <option value='Paid'>Paid</option>
                  <option value='Pending'>Pending</option>
                  <option value='Refunded'>Refunded</option>
                  <option value='Failed'>Failed</option>
                </select>
              </div>

              {/* Method Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Method:</span>
                <select
                  value={methodFilter}
                  onChange={e => setMethodFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Payment Methods</option>
                  <option value='Mada Debit'>Mada Debit</option>
                  <option value='Apple Pay'>Apple Pay</option>
                  <option value='Credit Card'>Credit Card</option>
                  <option value='Corporate Wire (SNB)'>Corporate Wire (SNB)</option>
                  <option value='Gold Metal Clearing'>Gold Metal Clearing</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              {(searchQuery || channelFilter !== 'ALL' || statusFilter !== 'ALL' || methodFilter !== 'ALL') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleResetFilters}
                  className='h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1'
                >
                  <RotateCcw className='size-3' />
                  Reset
                </Button>
              )}
            </div>

            <div className='text-xs text-muted-foreground'>
              Showing <span className='font-semibold text-foreground'>{filteredTransactions.length}</span> transactions
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* Payments Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70'>
              <tr>
                <th className='py-3 px-4'>Transaction ID</th>
                <th className='py-3 px-4'>Order</th>
                <th className='py-3 px-4'>Customer / Business</th>
                <th className='py-3 px-4 text-center'>Channel</th>
                <th className='py-3 px-4'>Method</th>
                <th className='py-3 px-4 text-right'>Amount</th>
                <th className='py-3 px-4 text-center'>Status</th>
                <th className='py-3 px-4'>Date</th>
                <th className='py-3 px-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/60'>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className='py-12 text-center text-muted-foreground'>
                    No payment transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => (
                  <tr
                    key={txn.id}
                    role='button'
                    tabIndex={0}
                    aria-label={`View payment ${txn.id}`}
                    onClick={event => handleClickableRow(event, () => handleOpenDrawer(txn))}
                    onKeyDown={event => handleClickableRowKeyDown(event, () => handleOpenDrawer(txn))}
                    className='group hover:bg-muted/30 transition-colors cursor-pointer'
                  >
                    {/* Transaction ID */}
                    <td className='py-3.5 px-4 font-mono font-medium text-foreground whitespace-nowrap'>
                      <div className='flex items-center gap-1.5'>
                        <CreditCard className='size-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                        {txn.id}
                      </div>
                    </td>

                    {/* Order */}
                    <td className='py-3.5 px-4 whitespace-nowrap' onClick={e => e.stopPropagation()}>
                      <Link
                        href={txn.orderPath}
                        className='font-mono text-primary hover:underline flex items-center gap-1 font-medium'
                      >
                        {txn.orderId}
                        <ExternalLink className='size-2.5 opacity-60' />
                      </Link>
                    </td>

                    {/* Customer / Business */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      <div className='font-semibold text-foreground'>{txn.customerOrBusiness}</div>
                      <div className='text-[10px] text-muted-foreground'>{txn.customerEmail}</div>
                    </td>

                    {/* Channel */}
                    <td className='py-3.5 px-4 text-center whitespace-nowrap'>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border ${
                          txn.channel === 'B2B'
                            ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                            : 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                        }`}
                      >
                        {txn.channel}
                      </Badge>
                    </td>

                    {/* Method */}
                    <td className='py-3.5 px-4 text-muted-foreground whitespace-nowrap'>
                      {txn.method}
                    </td>

                    {/* Amount */}
                    <td className='py-3.5 px-4 text-right font-mono font-bold text-foreground whitespace-nowrap'>
                      {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className='text-[10px] font-normal text-muted-foreground ml-1'>SAR</span>
                    </td>

                    {/* Status */}
                    <td className='py-3.5 px-4 text-center whitespace-nowrap'>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border ${
                          txn.status === 'Paid'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                            : txn.status === 'Pending'
                            ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                            : txn.status === 'Refunded'
                            ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                            : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {txn.status}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className='py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]'>
                      {txn.date}
                    </td>

                    {/* Actions */}
                    <td className='py-3.5 px-4 text-right whitespace-nowrap' onClick={e => e.stopPropagation()}>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleOpenDrawer(txn)}
                        className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                      >
                        <Eye className='size-3.5 mr-1' />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* Centered 3-Column Pagination Footer */}
        <div className='p-4 bg-card grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs'>
          {/* LEFT: Showing count */}
          <div className='text-muted-foreground text-center sm:text-left'>
            Showing <span className='font-semibold text-foreground'>1–{filteredTransactions.length}</span> of{' '}
            <span className='font-semibold text-foreground'>64</span> transactions
          </div>

          {/* CENTER: Pagination controls visually centered */}
          <div className='flex items-center justify-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              disabled
              className='h-7 px-2.5 text-xs border-border/80'
            >
              <ChevronLeft className='size-3.5 mr-0.5' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-xs'
            >
              1
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs border-border/80 hover:bg-muted'
            >
              2
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs border-border/80 hover:bg-muted'
            >
              3
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 px-2.5 text-xs border-border/80'
            >
              Next
              <ChevronRight className='size-3.5 ml-0.5' />
            </Button>
          </div>

          {/* RIGHT: Rows per page */}
          <div className='flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground'>
            <span>Rows per page:</span>
            <select
              defaultValue='10'
              className='h-7 rounded-md border border-border/80 bg-background/60 px-2 text-xs text-foreground focus:outline-none'
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* PAYMENT TRANSACTION DETAILS DRAWER / SHEET */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className='w-full sm:max-w-md bg-card border-border/80 p-0 overflow-y-auto'>
          {selectedTxn && (
            <div className='p-6 space-y-6'>
              <SheetHeader className='space-y-1 text-left'>
                <div className='flex items-center justify-between'>
                  <span className='font-mono text-xs text-muted-foreground'>Payment Details</span>
                  <Badge
                    variant='outline'
                    className={`text-[10px] font-medium border ${
                      selectedTxn.status === 'Paid'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : selectedTxn.status === 'Pending'
                        ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                        : selectedTxn.status === 'Refunded'
                        ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {selectedTxn.status}
                  </Badge>
                </div>
                <SheetTitle className='text-lg font-bold text-foreground font-mono'>
                  {selectedTxn.id}
                </SheetTitle>
                <SheetDescription className='text-xs'>
                  Settled through Saudi National Bank gateway & ZATCA Phase-2.
                </SheetDescription>
              </SheetHeader>

              {/* Amount Display */}
              <div className='rounded-lg border border-border/70 bg-background/50 p-4 text-center space-y-1'>
                <span className='text-xs text-muted-foreground'>Total Transaction Value</span>
                <div className='text-2xl font-bold font-mono text-foreground'>
                  {selectedTxn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className='text-sm font-normal text-muted-foreground'>SAR</span>
                </div>
                <div className='text-[11px] text-muted-foreground'>
                  Net Settled to Merchant: {selectedTxn.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  SAR
                </div>
              </div>

              {/* Order & Customer */}
              <div className='space-y-3 text-xs'>
                <h4 className='font-semibold text-foreground uppercase tracking-wider text-[11px]'>
                  Associated Party
                </h4>
                <div className='space-y-2 rounded-lg border border-border/70 p-3 bg-muted/20'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Order Number:</span>
                    <Link
                      href={selectedTxn.orderPath}
                      className='font-mono font-medium text-primary hover:underline flex items-center gap-1'
                    >
                      {selectedTxn.orderId}
                      <ExternalLink className='size-2.5' />
                    </Link>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Customer / Entity:</span>
                    <span className='font-medium text-foreground'>{selectedTxn.customerOrBusiness}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Account Email:</span>
                    <span className='font-mono text-muted-foreground'>{selectedTxn.customerEmail}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Channel Segment:</span>
                    <Badge variant='outline' className='text-[10px]'>
                      {selectedTxn.channel} ({selectedTxn.customerType})
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Gateway & Settlement Details */}
              <div className='space-y-3 text-xs'>
                <h4 className='font-semibold text-foreground uppercase tracking-wider text-[11px]'>
                  Gateway Clearance
                </h4>
                <div className='space-y-2 rounded-lg border border-border/70 p-3 bg-muted/20'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Payment Method:</span>
                    <span className='font-medium text-foreground'>{selectedTxn.method}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Gateway Ref / Auth:</span>
                    <span className='font-mono text-foreground'>{selectedTxn.gatewayRef}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Gateway Processing Fee:</span>
                    <span className='font-mono text-muted-foreground'>{selectedTxn.fees.toFixed(2)} SAR</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Processed At:</span>
                    <span className='text-foreground'>{selectedTxn.date}</span>
                  </div>
                </div>
              </div>

              {/* ZATCA Tax Compliance Stamp */}
              <div className='rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2 text-xs'>
                <div className='flex items-center gap-2 text-emerald-400 font-semibold'>
                  <ShieldCheck className='size-4' />
                  <span>ZATCA Phase-2 E-Invoice Cleared</span>
                </div>
                <div className='font-mono text-[10px] text-muted-foreground break-all'>
                  UUID: {selectedTxn.zatcaUuid}
                </div>
                <div className='text-[11px] text-muted-foreground'>
                  Tax invoice cryptographic hash authenticated by Zakat, Tax and Customs Authority.
                </div>
              </div>

              {/* Actions in Drawer */}
              <div className='pt-2 flex flex-col gap-2'>
                <Button
                  onClick={() => toast.success(`Receipt for ${selectedTxn.id} downloaded successfully`)}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 gap-1.5 shadow-xs font-medium'
                >
                  <Download className='size-3.5' />
                  Download Official Receipt (PDF)
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsDrawerOpen(false)}
                  className='w-full text-xs h-9 border-border/80'
                >
                  Close Drawer
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
