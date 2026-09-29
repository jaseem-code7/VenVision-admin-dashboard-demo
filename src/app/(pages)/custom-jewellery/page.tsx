'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Clock,
  Ban,
  FileText,
  MoreVertical,
  Copy,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  MOCK_CUSTOM_REQUESTS,
  CustomJewelleryRequest,
  CustomRequestType,
  CustomRequestStatus
} from './data'

export default function CustomJewelleryRequestsPage() {
  const [requests, setRequests] = useState<CustomJewelleryRequest[]>(MOCK_CUSTOM_REQUESTS)
  const [activeTab, setActiveTab] = useState<'ALL' | CustomRequestType>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [dateFilter, setDateFilter] = useState<string>('ALL')

  // Selected request for slide-over drawer / detail modal
  const [selectedRequest, setSelectedRequest] = useState<CustomJewelleryRequest | null>(null)
  // Image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  // Action menu popover
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)

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
  const totalCount = requests.length // 28
  const newCount = requests.filter(r => r.status === 'New').length // 6
  const inProgressCount = requests.filter(
    r =>
      r.status === 'Under Review' ||
      r.status === 'Awaiting Customer' ||
      r.status === 'Design Confirmed' ||
      r.status === 'In Production'
  ).length // 8
  const completedCount = requests.filter(r => r.status === 'Completed').length // 10
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length // 4

  // Tab counts
  const productCustomizationCount = requests.filter(r => r.type === 'Product Customization').length // 16
  const fullCustomDesignCount = requests.filter(r => r.type === 'Full Custom Design').length // 12

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
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter

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
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    )
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => (prev ? { ...prev, status: newStatus } : null))
    }
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
      case 'Design Confirmed':
        return 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
      case 'In Production':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/10'
      case 'Completed':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
      case 'Rejected':
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
          onClick={() => setStatusFilter('Under Review')}
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
          onClick={() => setStatusFilter('Rejected')}
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
                  <option value='New'>New</option>
                  <option value='Under Review'>Under Review</option>
                  <option value='Awaiting Customer'>Awaiting Customer</option>
                  <option value='Design Confirmed'>Design Confirmed</option>
                  <option value='In Production'>In Production</option>
                  <option value='Completed'>Completed</option>
                  <option value='Rejected'>Rejected</option>
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
                    className='group hover:bg-muted/30 transition-colors'
                  >
                    {/* REQUEST ID */}
                    <td className='py-3.5 px-4 font-mono font-medium text-foreground whitespace-nowrap'>
                      <button
                        type='button'
                        onClick={() => setSelectedRequest(req)}
                        className='text-primary hover:underline flex items-center gap-1.5 font-medium cursor-pointer'
                      >
                        <Sparkles className='size-3 text-muted-foreground group-hover:text-primary transition-colors' />
                        {req.id}
                      </button>
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
                        <button
                          type='button'
                          onClick={() => setPreviewImage(req.originalProduct?.image || null)}
                          className='inline-flex items-center gap-2 group/ref text-left cursor-pointer hover:opacity-80 transition-opacity'
                          title='Click to preview original product'
                        >
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
                        </button>
                      ) : (
                        <button
                          type='button'
                          onClick={() => setPreviewImage(req.referenceImages[0] || null)}
                          className='inline-flex items-center gap-1.5 group/ref text-left cursor-pointer hover:opacity-80 transition-opacity'
                          title={`Click to preview ${req.referenceImages.length} uploaded inspiration photo(s)`}
                        >
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
                        </button>
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
                          onClick={() => setSelectedRequest(req)}
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
                                  setSelectedRequest(req)
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
                              <button
                                type='button'
                                onClick={() => handleUpdateStatus(req.id, 'Under Review')}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-amber-400'
                              >
                                Under Review
                              </button>
                              <button
                                type='button'
                                onClick={() => handleUpdateStatus(req.id, 'Design Confirmed')}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-indigo-400'
                              >
                                Design Confirmed
                              </button>
                              <button
                                type='button'
                                onClick={() => handleUpdateStatus(req.id, 'In Production')}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-purple-400'
                              >
                                In Production
                              </button>
                              <button
                                type='button'
                                onClick={() => handleUpdateStatus(req.id, 'Completed')}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-emerald-400'
                              >
                                Completed
                              </button>
                              <button
                                type='button'
                                onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                className='w-full text-left px-2.5 py-1 rounded text-xs hover:bg-muted flex items-center gap-2 text-rose-400'
                              >
                                Reject Request
                              </button>
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

      {/* ================================================== */}
      {/* 6. TAILORED VIEW REQUEST SLIDE-OVER DRAWER         */}
      {/* ================================================== */}
      {selectedRequest && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200'
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className='relative w-full max-w-2xl bg-card border-l border-border/80 h-full overflow-y-auto shadow-2xl p-6 space-y-6 animate-in slide-in-from-right duration-200 text-foreground'
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className='flex items-start justify-between border-b border-border/70 pb-4'>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-sm font-bold text-primary'>
                    {selectedRequest.id}
                  </span>
                  {selectedRequest.type === 'Product Customization' ? (
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400'>
                      <SlidersHorizontal className='size-2.5' />
                      Product Customization
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-primary/30 bg-primary/10 text-primary'>
                      <Sparkles className='size-2.5' />
                      Full Custom Design
                    </span>
                  )}
                  <Badge
                    variant='outline'
                    className={`text-[10px] font-medium border px-2 py-0.5 ${getStatusBadgeClass(selectedRequest.status)}`}
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <h2 className='text-xl font-bold tracking-tight text-foreground'>
                  {selectedRequest.jewellery}
                </h2>
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <span>Customer: <strong className='text-foreground'>{selectedRequest.customerName}</strong></span>
                  <span>•</span>
                  <span>{selectedRequest.customerPhone}</span>
                  <span>•</span>
                  <span>{selectedRequest.submittedDate}</span>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <Link
                  href={`/custom-jewellery/${selectedRequest.id}`}
                  className='p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                  title='Open full standalone page'
                >
                  <ExternalLink className='size-4' />
                </Link>
                <button
                  type='button'
                  onClick={() => setSelectedRequest(null)}
                  className='p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                  aria-label='Close drawer'
                >
                  <X className='size-4' />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------- */}
            {/* WORKFLOW A: PRODUCT CUSTOMIZATION              */}
            {/* ---------------------------------------------- */}
            {selectedRequest.type === 'Product Customization' && selectedRequest.originalProduct && (
              <div className='space-y-6'>
                {/* Step 1: Original Product */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      <span className='size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold'>
                        1
                      </span>
                      <span>Original Product</span>
                    </div>
                    <Badge variant='outline' className='text-[10px] font-mono'>
                      SKU: {selectedRequest.originalProduct.sku}
                    </Badge>
                  </div>

                  <div className='flex items-center gap-4 bg-card/60 p-3 rounded-lg border border-border/60'>
                    <div
                      className='relative size-16 rounded-md border border-border/80 overflow-hidden bg-muted/40 shrink-0 cursor-pointer'
                      onClick={() => setPreviewImage(selectedRequest.originalProduct?.image || null)}
                    >
                      <img
                        src={selectedRequest.originalProduct.image}
                        alt={selectedRequest.originalProduct.name}
                        className='size-full object-cover hover:scale-105 transition-transform'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold text-foreground truncate'>
                        {selectedRequest.originalProduct.name}
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Category: {selectedRequest.originalProduct.category}
                      </p>
                      <div className='text-xs font-bold text-primary font-mono mt-1'>
                        Original Retail: SAR {selectedRequest.originalProduct.originalPrice.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 2: Customer Requested Changes */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold'>
                      2
                    </span>
                    <span>Customer Requested Changes</span>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs'>
                    {selectedRequest.customChanges?.goldKarat && (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Gold Karat Preference
                        </span>
                        <span className='text-foreground font-medium mt-0.5 block'>
                          {selectedRequest.customChanges.goldKarat}
                        </span>
                      </div>
                    )}

                    {selectedRequest.customChanges?.goldColor && (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Gold Color Adjustment
                        </span>
                        <span className='text-foreground font-medium mt-0.5 block'>
                          {selectedRequest.customChanges.goldColor}
                        </span>
                      </div>
                    )}

                    {selectedRequest.customChanges?.size && (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Requested Size / Dimensions
                        </span>
                        <span className='text-foreground font-medium mt-0.5 block'>
                          {selectedRequest.customChanges.size}
                        </span>
                      </div>
                    )}

                    {selectedRequest.customChanges?.stone && (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Stone / Gemstone Upgrade
                        </span>
                        <span className='text-foreground font-medium mt-0.5 block'>
                          {selectedRequest.customChanges.stone}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedRequest.customChanges?.engraving && (
                    <div className='rounded-lg border border-border/60 bg-card p-2.5 text-xs'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Custom Engraving Text
                      </span>
                      <span className='text-primary font-mono font-medium mt-0.5 block italic'>
                        {selectedRequest.customChanges.engraving}
                      </span>
                    </div>
                  )}

                  {selectedRequest.customChanges?.specialInstructions && (
                    <div className='rounded-lg border border-border/60 bg-card p-2.5 text-xs'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Atelier Special Instructions
                      </span>
                      <span className='text-muted-foreground mt-0.5 block'>
                        {selectedRequest.customChanges.specialInstructions}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 3: Price / Quotation */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold'>
                      3
                    </span>
                    <span>Price &amp; Quotation</span>
                  </div>

                  <div className='rounded-lg border border-border/60 bg-card p-3 space-y-2 text-xs'>
                    <div className='flex items-center justify-between text-muted-foreground'>
                      <span>Original Base Price:</span>
                      <span className='font-mono'>
                        SAR {selectedRequest.quotation.originalPrice?.toLocaleString('en-US')}
                      </span>
                    </div>
                    {selectedRequest.quotation.customizationAdjustment !== undefined && (
                      <div className='flex items-center justify-between text-muted-foreground'>
                        <span>Customization Adjustment:</span>
                        <span className='font-mono text-amber-400'>
                          {selectedRequest.quotation.customizationAdjustment >= 0 ? '+' : ''}
                          SAR {selectedRequest.quotation.customizationAdjustment.toLocaleString('en-US')}
                        </span>
                      </div>
                    )}
                    <div className='h-px bg-border/70 my-1' />
                    <div className='flex items-center justify-between text-sm font-bold text-foreground'>
                      <span>Final Quoted Price:</span>
                      <span className='font-mono text-primary text-base'>
                        SAR {selectedRequest.quotation.finalQuote.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 4: Status & Admin Management */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold'>
                      4
                    </span>
                    <span>Status &amp; Workflow Actions</span>
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    {(
                      [
                        'New',
                        'Under Review',
                        'Awaiting Customer',
                        'Design Confirmed',
                        'In Production',
                        'Completed',
                        'Rejected'
                      ] as CustomRequestStatus[]
                    ).map(st => (
                      <button
                        key={st}
                        type='button'
                        onClick={() => handleUpdateStatus(selectedRequest.id, st)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                          selectedRequest.status === st
                            ? `${getStatusBadgeClass(st)} ring-1 ring-primary/40`
                            : 'border-border/70 bg-card hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------- */}
            {/* WORKFLOW B: FULL CUSTOM DESIGN                 */}
            {/* ---------------------------------------------- */}
            {selectedRequest.type === 'Full Custom Design' && selectedRequest.fullCustomDesign && (
              <div className='space-y-6'>
                {/* Step 1: Customer Idea */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold'>
                      1
                    </span>
                    <span>Customer Idea &amp; Concept</span>
                  </div>

                  <div className='rounded-lg border border-border/60 bg-card p-3 space-y-2 text-xs'>
                    <div>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Jewellery Type
                      </span>
                      <span className='text-sm font-bold text-foreground'>
                        {selectedRequest.fullCustomDesign.jewelleryType}
                      </span>
                    </div>

                    <div>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Material &amp; Gold Karat Preference
                      </span>
                      <span className='text-xs font-medium text-amber-400'>
                        {selectedRequest.fullCustomDesign.materialPreference}
                      </span>
                    </div>

                    <div>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Customer Design Description
                      </span>
                      <p className='text-xs text-foreground/90 italic mt-0.5 leading-relaxed bg-muted/30 p-2.5 rounded border border-border/50'>
                        &ldquo;{selectedRequest.fullCustomDesign.customerDescription}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 2: Reference Images */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      <span className='size-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold'>
                        2
                      </span>
                      <span>Reference &amp; Inspiration Images</span>
                    </div>
                    <span className='text-[11px] text-muted-foreground'>
                      {selectedRequest.fullCustomDesign.photos.length} uploaded photo(s)
                    </span>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                    {selectedRequest.fullCustomDesign.photos.map((img, idx) => (
                      <div
                        key={idx}
                        className='group relative rounded-lg border border-border/80 overflow-hidden bg-muted/40 aspect-4/3 cursor-pointer'
                        onClick={() => setPreviewImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Inspiration ${idx + 1}`}
                          className='size-full object-cover group-hover:scale-105 transition-transform'
                        />
                        <div className='absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-mono'>
                          Photo #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 3: Requirements / Measurements */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold'>
                      3
                    </span>
                    <span>Requirements &amp; Measurements</span>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs'>
                    <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Preferred Size / Measurements
                      </span>
                      <span className='text-foreground font-medium mt-0.5 block'>
                        {selectedRequest.fullCustomDesign.sizeMeasurements}
                      </span>
                    </div>

                    {selectedRequest.fullCustomDesign.customerBudget ? (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Customer Budget Guidance
                        </span>
                        <span className='text-emerald-400 font-mono font-bold mt-0.5 block'>
                          SAR {selectedRequest.fullCustomDesign.customerBudget.toLocaleString('en-US')}
                        </span>
                      </div>
                    ) : (
                      <div className='rounded-lg border border-border/60 bg-card p-2.5'>
                        <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                          Customer Budget Guidance
                        </span>
                        <span className='text-muted-foreground italic mt-0.5 block'>
                          No budget specified by client
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedRequest.fullCustomDesign.additionalRequirements && (
                    <div className='rounded-lg border border-border/60 bg-card p-2.5 text-xs'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Additional Atelier Requirements
                      </span>
                      <span className='text-muted-foreground mt-0.5 block'>
                        {selectedRequest.fullCustomDesign.additionalRequirements}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 4: Price / Quotation */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold'>
                      4
                    </span>
                    <span>Price &amp; Quotation</span>
                  </div>

                  <div className='rounded-lg border border-border/60 bg-card p-3 space-y-2 text-xs'>
                    {selectedRequest.quotation.materialsEstimate && (
                      <div className='flex items-center justify-between text-muted-foreground'>
                        <span>Gold &amp; Gems Materials Estimate:</span>
                        <span className='font-mono'>
                          SAR {selectedRequest.quotation.materialsEstimate.toLocaleString('en-US')}
                        </span>
                      </div>
                    )}
                    {selectedRequest.quotation.laborEstimate && (
                      <div className='flex items-center justify-between text-muted-foreground'>
                        <span>Atelier Craftsmanship &amp; Labor:</span>
                        <span className='font-mono'>
                          SAR {selectedRequest.quotation.laborEstimate.toLocaleString('en-US')}
                        </span>
                      </div>
                    )}
                    <div className='h-px bg-border/70 my-1' />
                    <div className='flex items-center justify-between text-sm font-bold text-foreground'>
                      <span>Total Atelier Quotation:</span>
                      <span className='font-mono text-primary text-base'>
                        SAR {selectedRequest.quotation.finalQuote.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className='flex items-center justify-center -my-2 text-muted-foreground/60'>
                  <ArrowRight className='size-4 rotate-90 text-primary' />
                </div>

                {/* Step 5: Status & Workflow */}
                <div className='rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <span className='size-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold'>
                      5
                    </span>
                    <span>Status &amp; Workflow Actions</span>
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    {(
                      [
                        'New',
                        'Under Review',
                        'Awaiting Customer',
                        'Design Confirmed',
                        'In Production',
                        'Completed',
                        'Rejected'
                      ] as CustomRequestStatus[]
                    ).map(st => (
                      <button
                        key={st}
                        type='button'
                        onClick={() => handleUpdateStatus(selectedRequest.id, st)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                          selectedRequest.status === st
                            ? `${getStatusBadgeClass(st)} ring-1 ring-primary/40`
                            : 'border-border/70 bg-card hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Footer Actions */}
            <div className='flex items-center justify-between pt-4 border-t border-border/70'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setSelectedRequest(null)}
                className='h-8 text-xs'
              >
                Close Drawer
              </Button>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => toast.success(`Client contact dossier for ${selectedRequest.customerName} copied.`)}
                  className='h-8 text-xs gap-1.5'
                >
                  <Mail className='size-3.5' />
                  Contact Client
                </Button>
                <Link href={`/custom-jewellery/${selectedRequest.id}`}>
                  <Button size='sm' className='h-8 text-xs gap-1.5'>
                    View Full Standalone Page
                    <ExternalLink className='size-3' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 7. IMAGE PREVIEW MODAL                             */}
      {/* ================================================== */}
      {previewImage && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150'
          onClick={() => setPreviewImage(null)}
        >
          <div
            className='relative max-w-xl w-full rounded-xl border border-border/80 bg-card p-3 shadow-2xl overflow-hidden'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-2 mb-2 border-b border-border/70'>
              <span className='text-xs font-medium text-foreground'>Reference Image Preview</span>
              <button
                type='button'
                onClick={() => setPreviewImage(null)}
                className='p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted'
                aria-label='Close preview'
              >
                <X className='size-4' />
              </button>
            </div>
            <div className='relative w-full aspect-4/3 rounded-lg overflow-hidden bg-black/40'>
              <img
                src={previewImage}
                alt='Preview reference'
                className='size-full object-contain'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
