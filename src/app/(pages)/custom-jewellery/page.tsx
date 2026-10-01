'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Sparkles,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Ban,
  FileText,
  MoreVertical,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'

import {
  type CustomJewelleryRequest,
  type CustomRequestStatus,
  type CustomRequestType,
  MOCK_CUSTOM_REQUESTS,
  IN_PROGRESS_CUSTOM_STATUSES,
  REJECTED_CUSTOM_STATUSES,
  loadCustomWorkflow,
  saveCustomWorkflow
} from './data'

export default function CustomJewelleryRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<CustomJewelleryRequest[]>(MOCK_CUSTOM_REQUESTS)
  const [activeTab, setActiveTab] = useState<'ALL' | CustomRequestType>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [dateFilter, setDateFilter] = useState<string>('ALL')

  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRequests(
        MOCK_CUSTOM_REQUESTS.map(request => {
          const workflow = loadCustomWorkflow(request)

          return { ...request, status: workflow.status, quotation: workflow.quotation, history: workflow.history }
        })
      )
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  // Sync tab with type filter
  const handleTabChange = (tab: 'ALL' | CustomRequestType) => {
    setActiveTab(tab)
    setTypeFilter(tab)
  }

  const handleTypeFilterChange = (val: string) => {
    setTypeFilter(val)

    if (val === 'ALL' || val === 'Product Customization' || val === 'Full Custom Design') {
      setActiveTab(val as 'ALL' | CustomRequestType)
    }
  }

  // Summary counts
  const totalCount = requests.length
  const newCount = requests.filter(r => r.status === 'New').length
  const inProgressCount = requests.filter(r => IN_PROGRESS_CUSTOM_STATUSES.includes(r.status)).length
  const completedCount = requests.filter(r => r.status === 'Completed').length
  const rejectedCount = requests.filter(r => REJECTED_CUSTOM_STATUSES.includes(r.status)).length

  // Tab counts
  const productCustomizationCount = requests.filter(r => r.type === 'Product Customization').length
  const fullCustomDesignCount = requests.filter(r => r.type === 'Full Custom Design').length

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const query = searchQuery.trim().toLowerCase()

      const matchesSearch =
        !query ||
        r.id.toLowerCase().includes(query) ||
        r.customerName.toLowerCase().includes(query) ||
        r.jewellery.toLowerCase().includes(query) ||
        r.requestDetails.toLowerCase().includes(query)

      const matchesType = typeFilter === 'ALL' || r.type === typeFilter

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'IN_PROGRESS' && IN_PROGRESS_CUSTOM_STATUSES.includes(r.status)) ||
        (statusFilter === 'REJECTED_GROUP' && REJECTED_CUSTOM_STATUSES.includes(r.status)) ||
        r.status === statusFilter

      let matchesDate = true

      if (dateFilter === 'Today') {
        matchesDate = r.dateCategory === 'Today'
      } else if (dateFilter === 'Last 7 Days') {
        matchesDate = r.dateCategory === 'Today' || r.dateCategory === 'Last 7 Days'
      } else if (dateFilter === 'Last 30 Days') {
        matchesDate =
          r.dateCategory === 'Today' ||
          r.dateCategory === 'Last 7 Days' ||
          r.dateCategory === 'Last 30 Days'
      } else if (dateFilter === 'This Month') {
        matchesDate = r.dateCategory !== 'Older'
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }, [requests, searchQuery, typeFilter, statusFilter, dateFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setActiveTab('ALL')
    setTypeFilter('ALL')
    setStatusFilter('ALL')
    setDateFilter('ALL')
    toast.info('Filters reset to default view.')
  }

  const handleUpdateStatus = (id: string, newStatus: CustomRequestStatus) => {
    setRequests(prev =>
      prev.map(item => {
        if (item.id !== id) return item

        const workflow = loadCustomWorkflow(item)

        const nextWorkflow = {
          ...workflow,
          status: newStatus,
          history: [
            ...workflow.history,
            {
              id: `${id}-${Date.now()}`,
              status: newStatus,
              label: newStatus,
              date: new Date().toLocaleString('en-GB'),
              detail: 'Updated from the Custom Jewellery requests list'
            }
          ]
        }

        saveCustomWorkflow(id, nextWorkflow)

        return { ...item, status: newStatus, quotation: nextWorkflow.quotation, history: nextWorkflow.history }
      })
    )

    toast.success(`Request ${id} status updated to "${newStatus}"`)
    setActiveActionMenuId(null)
  }

  const getStatusBadgeClass = (status: CustomRequestStatus) => {
    switch (status) {
      case 'New':
        return 'border-sky-500/30 text-sky-400 bg-sky-500/10'
      case 'Under Review':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/10'
      case 'Awaiting Customer':
        return 'border-orange-500/30 text-orange-400 bg-orange-500/10'
      case 'Approved':
        return 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
      case 'Quote Sent':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
      case 'Payment Received':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
      case 'In Production':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/10'
      case 'Ready':
        return 'border-teal-500/30 text-teal-400 bg-teal-500/10'
      case 'Completed':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
      case 'Rejected':
      case 'Quote Declined':
      case 'Cancelled':
        return 'border-rose-500/30 text-rose-400 bg-rose-500/10'
      default:
        return 'border-muted-foreground/30 text-muted-foreground bg-muted/20'
    }
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* ================================================== */}
      {/* 1. PAGE HEADER                                     */}
      {/* ================================================== */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Custom Jewellery</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5'>
            <Sparkles className='size-6 text-primary' />
            Custom Jewellery Requests
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Review and manage product customizations and full custom jewellery requests.
          </p>
        </div>

        <div className='flex items-center gap-2.5'>
          <Badge
            variant='outline'
            className='text-xs border-primary/30 text-primary bg-secondary/50 font-medium px-3 py-1'
          >
            {newCount + inProgressCount} Active Requests
          </Badge>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. SUMMARY CARDS                                   */}
      {/* ================================================== */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
        {/* Total Requests */}
        <Card
          onClick={() => {
            setStatusFilter('ALL')
            setActiveTab('ALL')
            setTypeFilter('ALL')
          }}
          className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all'
        >
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Total Requests</span>
            <FileText className='size-3.5 text-muted-foreground' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
              {totalCount}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>All submitted inquiries</p>
          </div>
        </Card>

        {/* New Requests */}
        <Card
          onClick={() => setStatusFilter('New')}
          className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-all'
        >
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>New Requests</span>
            <span className='size-2 rounded-full bg-sky-400 animate-pulse' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-sky-400'>
              {newCount}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Awaiting admin triage</p>
          </div>
        </Card>

        {/* In Progress */}
        <Card
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-amber-500/50 transition-all'
        >
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>In Progress</span>
            <Clock className='size-3.5 text-amber-500/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-amber-400'>
              {inProgressCount}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Review &amp; atelier craft</p>
          </div>
        </Card>

        {/* Completed */}
        <Card
          onClick={() => setStatusFilter('Completed')}
          className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-all'
        >
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Completed</span>
            <CheckCircle2 className='size-3.5 text-emerald-500/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-emerald-400'>
              {completedCount}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Delivered to clients</p>
          </div>
        </Card>

        {/* Rejected */}
        <Card
          onClick={() => setStatusFilter('REJECTED_GROUP')}
          className='rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-rose-500/50 transition-all'
        >
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span className='font-medium'>Rejected</span>
            <Ban className='size-3.5 text-rose-500/70' />
          </div>
          <div className='mt-2'>
            <div className='text-2xl font-bold font-mono tracking-tight text-rose-400'>
              {rejectedCount}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Declined / infeasible</p>
          </div>
        </Card>
      </div>

      {/* ================================================== */}
      {/* 3. REQUEST TYPE TABS                               */}
      {/* ================================================== */}
      <div className='flex flex-wrap items-center gap-2 border-b border-border/70 pb-3'>
        <button
          type='button'
          onClick={() => handleTabChange('ALL')}
          className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          }`}
        >
          <span>All Requests</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'ALL'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type='button'
          onClick={() => handleTabChange('Product Customization')}
          className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'Product Customization'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          }`}
        >
          <SlidersHorizontal className='size-3.5' />
          <span>Product Customization</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'Product Customization'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            }`}
          >
            {productCustomizationCount}
          </span>
        </button>

        <button
          type='button'
          onClick={() => handleTabChange('Full Custom Design')}
          className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'Full Custom Design'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
          }`}
        >
          <Sparkles className='size-3.5' />
          <span>Full Custom Design</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'Full Custom Design'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/20 text-muted-foreground'
            }`}
          >
            {fullCustomDesignCount}
          </span>
        </button>
      </div>

      {/* ================================================== */}
      {/* 4. MAIN CONTAINER: SEARCH, FILTERS & TABLE         */}
      {/* ================================================== */}
      <div className='rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden'>
        {/* Controls Section */}
        <div className='p-4 space-y-3.5 bg-card'>
          {/* Search Input */}
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
            <Input
              type='text'
              placeholder='Search by request ID, customer, jewellery type...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 bg-background/50 h-9 text-xs sm:text-sm border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                aria-label='Clear search'
              >
                <X className='size-3.5' />
              </button>
            )}
          </div>

          {/* Compact Filter Row on One Line */}
          <div className='flex flex-wrap items-center justify-between gap-3 pt-0.5'>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Request Type Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Request Type:</span>
                <select
                  value={typeFilter}
                  onChange={e => handleTypeFilterChange(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Types</option>
                  <option value='Product Customization'>Product Customization</option>
                  <option value='Full Custom Design'>Full Custom Design</option>
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
                  <option value='IN_PROGRESS'>In Progress (group)</option>
                  <option value='REJECTED_GROUP'>Rejected (group)</option>
                  <option value='New'>New</option>
                  <option value='Under Review'>Under Review</option>
                  <option value='Awaiting Customer'>Awaiting Customer</option>
                  <option value='Approved'>Approved</option>
                  <option value='Quote Sent'>Quote Sent</option>
                  <option value='Payment Received'>Payment Received</option>
                  <option value='In Production'>In Production</option>
                  <option value='Ready'>Ready</option>
                  <option value='Completed'>Completed</option>
                  <option value='Rejected'>Rejected</option>
                  <option value='Quote Declined'>Quote Declined</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Date Range:</span>
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Time</option>
                  <option value='Today'>Today</option>
                  <option value='Last 7 Days'>Last 7 Days</option>
                  <option value='Last 30 Days'>Last 30 Days</option>
                  <option value='This Month'>This Month</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
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
              Showing <span className='font-semibold text-foreground'>{filteredRequests.length}</span> of{' '}
              <span className='font-semibold text-foreground'>{totalCount}</span> requests
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* ================================================== */}
        {/* 5. TABLE                                           */}
        {/* ================================================== */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70'>
              <tr>
                <th className='py-3 px-4'>REQUEST ID</th>
                <th className='py-3 px-4'>TYPE</th>
                <th className='py-3 px-4'>CUSTOMER</th>
                <th className='py-3 px-4'>JEWELLERY</th>
                <th className='py-3 px-4'>REQUEST DETAILS</th>
                <th className='py-3 px-4'>REFERENCE</th>
                <th className='py-3 px-4 text-center'>STATUS</th>
                <th className='py-3 px-4'>SUBMITTED</th>
                <th className='py-3 px-4 text-right'>ACTION</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/60'>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className='py-12 text-center text-muted-foreground'>
                    No matching custom jewellery requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr
                    key={req.id}
                    role='button'
                    tabIndex={0}
                    aria-label={`View custom jewellery request ${req.id}`}
                    onClick={event => handleClickableRow(event, () => router.push(`/custom-jewellery/${req.id}`))}
                    onKeyDown={event => handleClickableRowKeyDown(event, () => router.push(`/custom-jewellery/${req.id}`))}
                    className='group hover:bg-muted/30 transition-colors cursor-pointer'
                  >
                    {/* REQUEST ID */}
                    <td className='py-3.5 px-4 font-mono font-medium text-foreground whitespace-nowrap'>
                      <Link
                        href={`/custom-jewellery/${req.id}`}
                        className='text-primary hover:underline flex items-center gap-1.5 font-medium cursor-pointer'
                      >
                        <Sparkles className='size-3 text-muted-foreground group-hover:text-primary transition-colors' />
                        {req.id}
                      </Link>
                    </td>

                    {/* TYPE */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      {req.type === 'Product Customization' ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400'>
                          <SlidersHorizontal className='size-2.5' />
                          Product Customization
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-primary/30 bg-primary/10 text-primary'>
                          <Sparkles className='size-2.5' />
                          Full Custom Design
                        </span>
                      )}
                    </td>

                    {/* CUSTOMER */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      <div className='font-semibold text-foreground'>{req.customerName}</div>
                      <div className='text-[10px] text-muted-foreground'>{req.customerPhone}</div>
                    </td>

                    {/* JEWELLERY */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      <div className='text-foreground font-medium'>{req.jewellery}</div>
                    </td>

                    {/* REQUEST DETAILS */}
                    <td className='py-3.5 px-4 text-muted-foreground max-w-[240px] truncate' title={req.requestDetails}>
                      &ldquo;{req.requestDetails}&rdquo;
                    </td>

                    {/* REFERENCE */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      {req.type === 'Product Customization' && req.originalProduct ? (
                        <div className='inline-flex items-center gap-2 text-left'>
                          <div className='relative size-7 rounded border border-border/80 overflow-hidden bg-muted/30 shrink-0'>
                            <img
                              src={req.originalProduct.image}
                              alt={req.originalProduct.name}
                              className='size-full object-cover'
                            />
                          </div>
                          <span className='text-[11px] text-muted-foreground group-hover/ref:text-foreground transition-colors'>
                            Original Product
                          </span>
                        </div>
                      ) : (
                        <div className='inline-flex items-center gap-1.5 text-left'>
                          <div className='flex -space-x-1.5 overflow-hidden shrink-0'>
                            {req.referenceImages.slice(0, 2).map((img, idx) => (
                              <div
                                key={idx}
                                className='size-6 rounded-full border border-background overflow-hidden bg-muted/40'
                              >
                                <img
                                  src={img}
                                  alt={`Ref ${idx + 1}`}
                                  className='size-full object-cover'
                                />
                              </div>
                            ))}
                          </div>
                          <span className='text-[11px] text-muted-foreground group-hover/ref:text-foreground transition-colors'>
                            {req.referenceImages.length}{' '}
                            {req.referenceImages.length === 1 ? 'Photo' : 'Photos'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className='py-3.5 px-4 text-center whitespace-nowrap'>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border px-2.5 py-0.5 ${getStatusBadgeClass(req.status)}`}
                      >
                        {req.status}
                      </Badge>
                    </td>

                    {/* SUBMITTED */}
                    <td className='py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]'>
                      {req.submittedDate}
                    </td>

                    {/* ACTION */}
                    <td className='py-3.5 px-4 text-right whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-1 relative'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => router.push(`/custom-jewellery/${req.id}`)}
                          className='h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted'
                        >
                          <Eye className='size-3.5 mr-1' />
                          View Request
                        </Button>

                        {/* Three-dot secondary menu */}
                        <div className='relative'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              setActiveActionMenuId(activeActionMenuId === req.id ? null : req.id)
                            }
                            className='h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted'
                            aria-label='More options'
                          >
                            <MoreVertical className='size-3.5' />
                          </Button>

                          {activeActionMenuId === req.id && (
                            <div
                              className='absolute right-0 top-full mt-1 z-30 w-44 rounded-lg border border-border/80 bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95'
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                type='button'
                                onClick={() => {
                                  router.push(`/custom-jewellery/${req.id}`)
                                  setActiveActionMenuId(null)
                                }}
                                className='w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-muted flex items-center gap-2 text-foreground'
                              >
                                <Eye className='size-3.5 text-primary' />
                                View Details
                              </button>
                              <button
                                type='button'
                                onClick={() => {
                                  navigator.clipboard.writeText(req.id)
                                  toast.success(`Copied ${req.id} to clipboard`)
                                  setActiveActionMenuId(null)
                                }}
                                className='w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-muted flex items-center gap-2 text-muted-foreground'
                              >
                                <Copy className='size-3.5' />
                                Copy Request ID
                              </button>
                              <div className='h-px bg-border/60 my-1' />
                              <div className='px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
                                Quick Status:
                              </div>
                              {(req.status === 'New' || req.status === 'Awaiting Customer') && (
                                <button
                                  type='button'
                                  onClick={() => handleUpdateStatus(req.id, 'Under Review')}
                                  className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-amber-400'
                                >
                                  {req.status === 'New' ? 'Start Review' : 'Resume Review'}
                                </button>
                              )}
                              {(req.status === 'New' || req.status === 'Under Review') && (
                                <button
                                  type='button'
                                  onClick={() => handleUpdateStatus(req.id, 'Awaiting Customer')}
                                  className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-orange-400'
                                >
                                  Request More Information
                                </button>
                              )}
                              {req.status === 'Under Review' && (
                                <button
                                  type='button'
                                  onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                  className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-rose-400'
                                >
                                  Reject Request
                                </button>
                              )}
                              <Link
                                href={`/custom-jewellery/${req.id}`}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-primary'
                              >
                                Open Approval Workflow
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* 3-Column Pagination Footer */}
        <div className='p-4 bg-card grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs'>
          <div className='text-muted-foreground text-center sm:text-left'>
            Showing <span className='font-semibold text-foreground'>1–{filteredRequests.length}</span> of{' '}
            <span className='font-semibold text-foreground'>{filteredRequests.length}</span> requests
          </div>

          <div className='flex items-center justify-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              disabled
              className='h-7 px-2.5 text-xs border-border/80 opacity-60'
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
              disabled
              className='h-7 px-2.5 text-xs border-border/80 opacity-60'
            >
              Next
              <ChevronRight className='size-3.5 ml-0.5' />
            </Button>
          </div>

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

    </div>
  )
}
