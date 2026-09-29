'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Printer,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Ban,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Gem,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  MOCK_CUSTOM_REQUESTS,
  CustomRequestStatus,
  CustomJewelleryRequest
} from '../data'

const sharedStatuses: CustomRequestStatus[] = [
  'New',
  'Under Review',
  'Awaiting Customer',
  'Design Confirmed',
  'In Production',
  'Completed',
  'Rejected'
]

export default function CustomJewelleryDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const requestId = resolvedParams.id || 'REQ-7091'

  const request: CustomJewelleryRequest =
    MOCK_CUSTOM_REQUESTS.find(r => r.id.toLowerCase() === requestId.toLowerCase()) ||
    MOCK_CUSTOM_REQUESTS[0]

  const [currentStatus, setCurrentStatus] = useState<CustomRequestStatus>(request.status)
  const [quotedAmount, setQuotedAmount] = useState<string>(
    request.quotation.finalQuote.toString()
  )
  const [adminNotes, setAdminNotes] = useState([
    {
      id: 'n1',
      author: 'Master Goldsmith Mansoor',
      date: '24 Sep 2026, 12:30',
      text: 'Verified alloy composition and stone specifications. Quotation confirmed within client tolerances.'
    },
    {
      id: 'n2',
      author: 'Atelier Reception',
      date: '24 Sep 2026, 11:30',
      text: 'Client contacted via WhatsApp. Customer confirmed desired dimensions and receipt of initial estimate.'
    }
  ])
  const [newNote, setNewNote] = useState('')

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setAdminNotes(prev => [
      ...prev,
      {
        id: `n-${Date.now()}`,
        author: 'Admin (You)',
        date: 'Just now',
        text: newNote
      }
    ])
    setNewNote('')
    toast.success('Internal atelier note added')
  }

  const handleUpdateStatus = (stage: CustomRequestStatus) => {
    setCurrentStatus(stage)
    toast.success(`Request status updated to "${stage}"`)
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
      {/* Header & Breadcrumb */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <Link href='/custom-jewellery' className='hover:text-foreground transition-colors'>
              Custom Jewellery
            </Link>
            <span>/</span>
            <span className='font-mono font-medium text-foreground'>{request.id}</span>
          </div>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2'>
              <Sparkles className='size-6 text-primary' />
              {request.id}
            </h1>
            {request.type === 'Product Customization' ? (
              <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400'>
                <SlidersHorizontal className='size-3' />
                Product Customization
              </span>
            ) : (
              <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-primary/30 bg-primary/10 text-primary'>
                <Sparkles className='size-3' />
                Full Custom Design
              </span>
            )}
            <Badge
              variant='outline'
              className={`text-xs font-medium border px-2.5 py-0.5 ${getStatusBadgeClass(currentStatus)}`}
            >
              {currentStatus}
            </Badge>
          </div>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            {request.jewellery} inquiry submitted by {request.customerName} on {request.submittedDate}.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => toast.success('Printing Atelier Work Order Card...')}
            className='h-9 text-xs border-border/80 gap-1.5'
          >
            <Printer className='size-3.5' />
            Print Job Card
          </Button>
          <Link href='/custom-jewellery'>
            <Button
              variant='outline'
              className='h-9 text-xs border-border/80 gap-1.5'
            >
              <ArrowLeft className='size-3.5' />
              Back to Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Sidebar */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* LEFT 2 COLUMNS: TAILORED WORKFLOW UI */}
        <div className='lg:col-span-2 space-y-6'>
          {/* ================================================= */}
          {/* WORKFLOW A: PRODUCT CUSTOMIZATION                 */}
          {/* ================================================= */}
          {request.type === 'Product Customization' && request.originalProduct && (
            <div className='space-y-6'>
              {/* Step 1: Original Product */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center justify-between border-b border-border/70 pb-3'>
                  <div className='flex items-center gap-2'>
                    <span className='size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold'>
                      1
                    </span>
                    <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                      Original Product
                    </h3>
                  </div>
                  <Badge variant='outline' className='text-xs font-mono'>
                    SKU: {request.originalProduct.sku}
                  </Badge>
                </div>

                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
                  <div className='relative size-28 rounded-lg border border-border/80 overflow-hidden bg-muted/40 shrink-0'>
                    <img
                      src={request.originalProduct.image}
                      alt={request.originalProduct.name}
                      className='size-full object-cover'
                    />
                  </div>
                  <div className='space-y-1.5 text-center sm:text-left flex-1'>
                    <h4 className='text-base font-bold text-foreground'>
                      {request.originalProduct.name}
                    </h4>
                    <p className='text-xs text-muted-foreground'>
                      Standard Catalog Category: <span className='text-foreground'>{request.originalProduct.category}</span>
                    </p>
                    <div className='text-sm font-bold text-primary font-mono mt-1'>
                      Catalog Price: SAR {request.originalProduct.originalPrice.toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Step 2: Customer Requested Changes */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 border-b border-border/70 pb-3'>
                  <span className='size-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold'>
                    2
                  </span>
                  <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                    Customer Requested Changes
                  </h3>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                  {request.customChanges?.goldKarat && (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Gold Karat Modification
                      </span>
                      <span className='text-foreground font-semibold mt-1 block text-sm'>
                        {request.customChanges.goldKarat}
                      </span>
                    </div>
                  )}

                  {request.customChanges?.goldColor && (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Gold Color Modification
                      </span>
                      <span className='text-foreground font-semibold mt-1 block text-sm'>
                        {request.customChanges.goldColor}
                      </span>
                    </div>
                  )}

                  {request.customChanges?.size && (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Requested Custom Size
                      </span>
                      <span className='text-foreground font-semibold mt-1 block text-sm'>
                        {request.customChanges.size}
                      </span>
                    </div>
                  )}

                  {request.customChanges?.stone && (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Gemstone / Diamond Preference
                      </span>
                      <span className='text-foreground font-semibold mt-1 block text-sm'>
                        {request.customChanges.stone}
                      </span>
                    </div>
                  )}
                </div>

                {request.customChanges?.engraving && (
                  <div className='rounded-lg border border-border/70 bg-muted/30 p-3 text-xs'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                      Laser / Hand Engraving Details
                    </span>
                    <span className='text-primary font-mono font-bold mt-1 block text-sm italic'>
                      {request.customChanges.engraving}
                    </span>
                  </div>
                )}

                {request.customChanges?.specialInstructions && (
                  <div className='rounded-lg border border-border/70 bg-muted/30 p-3 text-xs'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                      Special Atelier Instructions
                    </span>
                    <p className='text-muted-foreground mt-1 leading-relaxed'>
                      {request.customChanges.specialInstructions}
                    </p>
                  </div>
                )}
              </Card>

              {/* Step 3: Price / Quotation */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 border-b border-border/70 pb-3'>
                  <span className='size-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'>
                    3
                  </span>
                  <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                    Price &amp; Quotation
                  </h3>
                </div>

                <div className='rounded-lg border border-border/70 bg-muted/20 p-4 space-y-2.5 text-xs'>
                  <div className='flex items-center justify-between text-muted-foreground'>
                    <span>Original Base Retail:</span>
                    <span className='font-mono font-medium'>
                      SAR {request.quotation.originalPrice?.toLocaleString('en-US')}
                    </span>
                  </div>
                  {request.quotation.customizationAdjustment !== undefined && (
                    <div className='flex items-center justify-between text-muted-foreground'>
                      <span>Customization Modification Surcharge:</span>
                      <span className='font-mono font-medium text-amber-400'>
                        {request.quotation.customizationAdjustment >= 0 ? '+' : ''}
                        SAR {request.quotation.customizationAdjustment.toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                  <div className='h-px bg-border/70 my-2' />
                  <div className='flex items-center justify-between text-base font-bold text-foreground'>
                    <span>Final Custom Quoted Price:</span>
                    <span className='font-mono text-primary text-xl'>
                      SAR {request.quotation.finalQuote.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ================================================= */}
          {/* WORKFLOW B: FULL CUSTOM DESIGN                    */}
          {/* ================================================= */}
          {request.type === 'Full Custom Design' && request.fullCustomDesign && (
            <div className='space-y-6'>
              {/* Step 1: Customer Idea & Concept */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 border-b border-border/70 pb-3'>
                  <span className='size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold'>
                    1
                  </span>
                  <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                    Customer Idea &amp; Concept
                  </h3>
                </div>

                <div className='space-y-3 text-xs'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Jewellery Type
                      </span>
                      <span className='text-foreground font-bold mt-1 block text-sm'>
                        {request.fullCustomDesign.jewelleryType}
                      </span>
                    </div>
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Material &amp; Gold Karat
                      </span>
                      <span className='text-amber-400 font-semibold mt-1 block text-sm'>
                        {request.fullCustomDesign.materialPreference}
                      </span>
                    </div>
                  </div>

                  <div className='rounded-lg border border-border/70 bg-muted/30 p-3.5'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1'>
                      Customer Design Description
                    </span>
                    <p className='text-xs text-foreground italic leading-relaxed'>
                      &ldquo;{request.fullCustomDesign.customerDescription}&rdquo;
                    </p>
                  </div>
                </div>
              </Card>

              {/* Step 2: Reference & Inspiration Images */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center justify-between border-b border-border/70 pb-3'>
                  <div className='flex items-center gap-2'>
                    <span className='size-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold'>
                      2
                    </span>
                    <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                      Reference &amp; Inspiration Photos
                    </h3>
                  </div>
                  <span className='text-xs text-muted-foreground font-mono'>
                    {request.fullCustomDesign.photos.length} uploaded image(s)
                  </span>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {request.fullCustomDesign.photos.map((img, idx) => (
                    <div
                      key={idx}
                      className='group relative rounded-lg border border-border/80 overflow-hidden bg-muted/40 aspect-4/3'
                    >
                      <img
                        src={img}
                        alt={`Inspiration ${idx + 1}`}
                        className='size-full object-cover group-hover:scale-105 transition-transform'
                      />
                      <div className='absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono'>
                        Photo #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Step 3: Requirements & Measurements */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 border-b border-border/70 pb-3'>
                  <span className='size-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold'>
                    3
                  </span>
                  <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                    Requirements &amp; Measurements
                  </h3>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                  <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                      Target Size / Measurements
                    </span>
                    <span className='text-foreground font-semibold mt-1 block text-sm'>
                      {request.fullCustomDesign.sizeMeasurements}
                    </span>
                  </div>

                  {request.fullCustomDesign.customerBudget ? (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Customer Budget Guidance
                      </span>
                      <span className='text-emerald-400 font-mono font-bold mt-1 block text-sm'>
                        SAR {request.fullCustomDesign.customerBudget.toLocaleString('en-US')}
                      </span>
                    </div>
                  ) : (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-3'>
                      <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                        Customer Budget Guidance
                      </span>
                      <span className='text-muted-foreground italic mt-1 block text-sm'>
                        No budget entered by customer
                      </span>
                    </div>
                  )}
                </div>

                {request.fullCustomDesign.additionalRequirements && (
                  <div className='rounded-lg border border-border/70 bg-muted/30 p-3 text-xs'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                      Additional Requirements &amp; Notes
                    </span>
                    <p className='text-muted-foreground mt-1 leading-relaxed'>
                      {request.fullCustomDesign.additionalRequirements}
                    </p>
                  </div>
                )}
              </Card>

              {/* Step 4: Price & Quotation */}
              <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 border-b border-border/70 pb-3'>
                  <span className='size-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'>
                    4
                  </span>
                  <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                    Atelier Price &amp; Quotation
                  </h3>
                </div>

                <div className='rounded-lg border border-border/70 bg-muted/20 p-4 space-y-2.5 text-xs'>
                  {request.quotation.materialsEstimate && (
                    <div className='flex items-center justify-between text-muted-foreground'>
                      <span>Materials Estimate (Gold + Gems):</span>
                      <span className='font-mono font-medium'>
                        SAR {request.quotation.materialsEstimate.toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                  {request.quotation.laborEstimate && (
                    <div className='flex items-center justify-between text-muted-foreground'>
                      <span>Master Atelier Labor &amp; Setting:</span>
                      <span className='font-mono font-medium'>
                        SAR {request.quotation.laborEstimate.toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                  <div className='h-px bg-border/70 my-2' />
                  <div className='flex items-center justify-between text-base font-bold text-foreground'>
                    <span>Total Final Quotation:</span>
                    <span className='font-mono text-primary text-xl'>
                      SAR {request.quotation.finalQuote.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT 1 COLUMN: STATUS WORKFLOW, CUSTOMER INFO, NOTES */}
        <div className='space-y-6'>
          {/* Status Management Card */}
          <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Status &amp; Stage
              </h3>
              <Badge
                variant='outline'
                className={`text-[10px] font-medium border px-2 py-0.5 ${getStatusBadgeClass(currentStatus)}`}
              >
                {currentStatus}
              </Badge>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-muted-foreground'>Update Request Status:</label>
              <select
                value={currentStatus}
                onChange={e => handleUpdateStatus(e.target.value as CustomRequestStatus)}
                className='w-full h-9 rounded-md border border-border/80 bg-background/60 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
              >
                {sharedStatuses.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className='pt-2 border-t border-border/70'>
              <label className='text-xs text-muted-foreground block mb-1'>Quotation Amount (SAR):</label>
              <div className='flex items-center gap-2'>
                <Input
                  value={quotedAmount}
                  onChange={e => setQuotedAmount(e.target.value)}
                  className='h-8 text-xs font-mono'
                />
                <Button
                  size='sm'
                  onClick={() => toast.success(`Quotation updated to SAR ${quotedAmount}`)}
                  className='h-8 px-3 text-xs'
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>

          {/* Customer Profile Card */}
          <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3.5'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70 pb-2.5'>
              Customer Information
            </h3>
            <div className='space-y-2.5 text-xs'>
              <div className='flex items-center gap-2 text-foreground font-semibold'>
                <User className='size-3.5 text-muted-foreground' />
                <span>{request.customerName}</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='size-3.5 text-muted-foreground' />
                <a href={`mailto:${request.customerEmail}`} className='hover:text-foreground hover:underline'>
                  {request.customerEmail}
                </a>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Phone className='size-3.5 text-muted-foreground' />
                <a href={`tel:${request.customerPhone}`} className='hover:text-foreground hover:underline font-mono'>
                  {request.customerPhone}
                </a>
              </div>
            </div>

            <div className='pt-2 border-t border-border/70 flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => toast.success(`Opened WhatsApp dialogue for ${request.customerPhone}`)}
                className='w-full h-8 text-xs gap-1.5'
              >
                <Phone className='size-3.5 text-emerald-400' />
                WhatsApp Client
              </Button>
            </div>
          </Card>

          {/* Internal Atelier Notes Card */}
          <Card className='rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3.5'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70 pb-2.5 flex items-center justify-between'>
              <span>Internal Atelier Notes</span>
              <span className='font-mono text-[10px]'>{adminNotes.length} notes</span>
            </h3>

            <div className='space-y-3 max-h-56 overflow-y-auto pr-1'>
              {adminNotes.map(n => (
                <div key={n.id} className='rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs space-y-1'>
                  <div className='flex items-center justify-between text-[10px] text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className='text-muted-foreground leading-normal'>{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className='space-y-2 pt-2 border-t border-border/70'>
              <Input
                placeholder='Add note for goldsmith / CAD team...'
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className='h-8 text-xs'
              />
              <Button type='submit' size='sm' className='w-full h-8 text-xs gap-1.5'>
                <Plus className='size-3.5' />
                Add Atelier Note
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
