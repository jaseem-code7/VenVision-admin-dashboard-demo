'use client'

import React, { use, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CUSTOM_RETURN_POLICY } from '@/lib/return-eligibility'
import {
  type CustomRequestStatus,
  type QuotationInfo,
  type StatusHistoryEntry,
  MOCK_CUSTOM_REQUESTS,
  getInitialCustomWorkflow,
  loadCustomWorkflow,
  saveCustomWorkflow
} from '../data'

const quotationStatuses: CustomRequestStatus[] = [
  'Approved',
  'Quote Sent',
  'Payment Received',
  'In Production',
  'Ready',
  'Completed',
  'Quote Declined'
]

const getStatusBadgeClass = (status: CustomRequestStatus) => {
  if (status === 'New') return 'border-sky-500/30 text-sky-400 bg-sky-500/10'
  if (status === 'Under Review') return 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  if (status === 'Awaiting Customer') return 'border-orange-500/30 text-orange-400 bg-orange-500/10'
  if (status === 'Approved') return 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
  if (status === 'Quote Sent') return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  if (status === 'Payment Received') return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  if (status === 'In Production') return 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  if (status === 'Ready') return 'border-teal-500/30 text-teal-400 bg-teal-500/10'
  if (status === 'Completed') return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'

  return 'border-rose-500/30 text-rose-400 bg-rose-500/10'
}

export default function CustomJewelleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const request =
    MOCK_CUSTOM_REQUESTS.find(item => item.id.toLowerCase() === id.toLowerCase()) ?? MOCK_CUSTOM_REQUESTS[0]

  const initialWorkflow = getInitialCustomWorkflow(request)

  const [currentStatus, setCurrentStatus] = useState<CustomRequestStatus>(initialWorkflow.status)
  const [quotation, setQuotation] = useState<QuotationInfo>(initialWorkflow.quotation)
  const [history, setHistory] = useState<StatusHistoryEntry[]>(initialWorkflow.history)
  const [internalNotes, setInternalNotes] = useState<string[]>([])
  const [newInternalNote, setNewInternalNote] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = loadCustomWorkflow(request)

      setCurrentStatus(stored.status)
      setQuotation(stored.quotation)
      setHistory(stored.history)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [request])

  const totals = useMemo(() => {
    const subtotal = Math.max(
      0,
      (quotation.goldValue ?? 0) +
        (quotation.stoneValue ?? 0) +
        (quotation.makingCharge ?? 0) +
        (quotation.customizationCharge ?? 0) +
      (quotation.otherCharges ?? 0) -
        (quotation.discount ?? 0)
    )

    const vatAmount = subtotal * ((quotation.vatRate ?? 15) / 100)

    return { subtotal, vatAmount, finalQuote: subtotal + vatAmount }
  }, [quotation])

  const persistWorkflow = (
    status: CustomRequestStatus,
    nextQuotation: QuotationInfo,
    nextHistory: StatusHistoryEntry[]
  ) => {
    saveCustomWorkflow(request.id, { status, quotation: nextQuotation, history: nextHistory })
  }

  const transitionTo = (status: CustomRequestStatus, label: string, detail?: string) => {
    const entry: StatusHistoryEntry = {
      id: `${request.id}-${Date.now()}`,
      status,
      label,
      date: new Date().toLocaleString('en-GB'),
      detail
    }

    const nextHistory = [...history, entry]

    setCurrentStatus(status)
    setHistory(nextHistory)
    persistWorkflow(status, quotation, nextHistory)
    toast.success(label, { description: `Customer notification queued for ${request.customerName}.` })
  }

  const updateQuoteNumber = (
    field:
      | 'goldValue'
      | 'stoneValue'
      | 'makingCharge'
      | 'customizationCharge'
      | 'otherCharges'
      | 'discount'
      | 'vatRate',
    value: string
  ) => {
    setQuotation(previous => ({ ...previous, [field]: Number(value) || 0 }))
  }

  const handleSendQuote = () => {
    if (currentStatus !== 'Approved' || totals.finalQuote <= 0) return

    const nextQuotation: QuotationInfo = {
      ...quotation,
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      finalQuote: totals.finalQuote,
      quoteDate: new Date().toLocaleString('en-GB')
    }

    const entry: StatusHistoryEntry = {
      id: `${request.id}-quote-${Date.now()}`,
      status: 'Quote Sent',
      label: 'Quote Sent',
      date: nextQuotation.quoteDate ?? 'Just now',
      detail: `SAR ${totals.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    }

    const nextHistory = [...history, entry]

    setQuotation(nextQuotation)
    setCurrentStatus('Quote Sent')
    setHistory(nextHistory)
    persistWorkflow('Quote Sent', nextQuotation, nextHistory)
    toast.success('Quote sent to customer', {
      description: `SAR ${totals.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })} is ready for customer approval.`
    })
  }

  const handleAddInternalNote = () => {
    if (!newInternalNote.trim()) return

    setInternalNotes(previous => [...previous, newInternalNote.trim()])
    setNewInternalNote('')
    toast.success('Internal atelier note added')
  }

  const showQuotation = quotationStatuses.includes(currentStatus)
  const quoteEditable = currentStatus === 'Approved'

  return (
    <div className='space-y-6 pb-12'>
      <div className='flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/custom-jewellery' className='hover:text-foreground'>Custom Jewellery</Link>
            <span>/</span>
            <span className='font-mono text-foreground'>{request.id}</span>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              <Sparkles className='size-6 text-primary' /> {request.id}
            </h1>
            <Badge variant='outline'>{request.type}</Badge>
            <Badge variant='outline' className={getStatusBadgeClass(currentStatus)}>{currentStatus}</Badge>
          </div>
          <p className='text-sm text-muted-foreground'>{request.jewellery} request from {request.customerName}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Link href={`/custom-jewellery/${request.id}/customer`} className='inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted'>
            Customer View <ExternalLink className='size-3.5' />
          </Link>
          <Link href='/custom-jewellery' className='inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted'>
            <ArrowLeft className='size-3.5' /> Back to Custom Jewellery Requests
          </Link>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'>
              <h2 className='text-base font-semibold'>Request Review</h2>
              <span className='text-xs text-muted-foreground'>{request.submittedDate}</span>
            </div>
            <dl className='grid gap-4 text-sm sm:grid-cols-2'>
              <div><dt className='text-xs text-muted-foreground'>Request ID</dt><dd className='mt-1 font-mono font-semibold'>{request.id}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Customer</dt><dd className='mt-1 font-semibold'>{request.customerName}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Jewellery Type</dt><dd className='mt-1 font-semibold'>{request.jewellery}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Request Type</dt><dd className='mt-1 font-semibold'>{request.type}</dd></div>
            </dl>
            <div className='rounded-lg border border-border/70 bg-muted/20 p-4'>
              <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Customer Instructions</div>
              <p className='mt-2 text-sm leading-relaxed text-foreground'>{request.requestDetails}</p>
            </div>
            {(request.customerNotes || request.customChanges?.specialInstructions || request.fullCustomDesign?.additionalRequirements) && (
              <div className='rounded-lg border border-border/70 bg-muted/20 p-4'>
                <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Customer Notes</div>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {request.customerNotes ?? request.customChanges?.specialInstructions ?? request.fullCustomDesign?.additionalRequirements}
                </p>
              </div>
            )}
          </Card>

          {request.type === 'Product Customization' && request.originalProduct && (
            <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
              <div className='border-b border-border/70 pb-3'><h2 className='text-base font-semibold'>Original Product &amp; Requested Changes</h2></div>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <img src={request.originalProduct.image} alt={request.originalProduct.name} className='size-28 rounded-lg border border-border object-cover' />
                <div className='space-y-1'>
                  <div className='font-semibold text-foreground'>{request.originalProduct.name}</div>
                  <div className='font-mono text-xs text-muted-foreground'>{request.originalProduct.sku}</div>
                  <div className='text-sm font-bold text-primary'>Original Price: SAR {request.originalProduct.originalPrice.toLocaleString()}</div>
                  <p className='text-xs text-muted-foreground'>The catalogue price remains unchanged. This request receives its own quotation.</p>
                </div>
              </div>
              <div className='grid gap-3 text-sm sm:grid-cols-2'>
                {Object.entries(request.customChanges ?? {}).map(([label, value]) => value && (
                  <div key={label} className='rounded-lg border border-border/70 bg-muted/20 p-3'>
                    <div className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>{label.replace(/([A-Z])/g, ' $1')}</div>
                    <div className='mt-1 text-xs font-medium text-foreground'>{value}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {request.type === 'Full Custom Design' && request.fullCustomDesign && (
            <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
              <div className='border-b border-border/70 pb-3'><h2 className='text-base font-semibold'>Full Custom Design Requirements</h2></div>
              <dl className='grid gap-4 text-sm sm:grid-cols-2'>
                <div><dt className='text-xs text-muted-foreground'>Jewellery Type</dt><dd className='mt-1 font-semibold'>{request.fullCustomDesign.jewelleryType}</dd></div>
                <div><dt className='text-xs text-muted-foreground'>Preferred Metal / Purity</dt><dd className='mt-1 font-semibold'>{request.fullCustomDesign.materialPreference}</dd></div>
                <div><dt className='text-xs text-muted-foreground'>Size / Measurements</dt><dd className='mt-1 font-semibold'>{request.fullCustomDesign.sizeMeasurements}</dd></div>
                <div><dt className='text-xs text-muted-foreground'>Stones / Design Notes</dt><dd className='mt-1 font-semibold'>{request.fullCustomDesign.additionalRequirements ?? 'See customer requirements'}</dd></div>
              </dl>
              <div className='rounded-lg border border-border/70 bg-muted/20 p-4 text-sm leading-relaxed'>{request.fullCustomDesign.customerDescription}</div>
            </Card>
          )}

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'>
              <h2 className='text-base font-semibold'>Reference Images</h2>
              <span className='text-xs text-muted-foreground'>{request.referenceImages.length} uploaded</span>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
              {request.referenceImages.map((image, index) => (
                <img key={image} src={image} alt={`Reference ${index + 1}`} className='aspect-4/3 w-full rounded-lg border border-border object-cover' />
              ))}
            </div>
          </Card>

          {showQuotation && (
            <Card className='space-y-5 rounded-xl border-border/80 p-5 shadow-xs'>
              <div className='flex items-center justify-between border-b border-border/70 pb-3'>
                <div>
                  <h2 className='text-base font-semibold'>Quotation</h2>
                  <p className='text-xs text-muted-foreground'>Customer-specific SAR pricing. The catalogue product price is not modified.</p>
                </div>
                {quotation.quoteDate && <Badge variant='outline'>Sent {quotation.quoteDate}</Badge>}
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                {([
                  ['goldValue', 'Gold Value'],
                  ['stoneValue', 'Stone / Diamond Value'],
                  ['makingCharge', 'Making Charge'],
                  ['customizationCharge', 'Customization Charge'],
                  ['otherCharges', 'Other Charges'],
                  ['discount', 'Discount']
                ] as const).map(([field, label]) => (
                  <label key={field} className='space-y-1.5 text-xs text-muted-foreground'>
                    <span>{label} (SAR)</span>
                    <Input type='number' min='0' value={quotation[field] ?? 0} disabled={!quoteEditable} onChange={event => updateQuoteNumber(field, event.target.value)} className='font-mono' />
                  </label>
                ))}
                <label className='space-y-1.5 text-xs text-muted-foreground'>
                  <span>VAT (%)</span>
                  <Input type='number' min='0' value={quotation.vatRate ?? 15} disabled={!quoteEditable} onChange={event => updateQuoteNumber('vatRate', event.target.value)} className='font-mono' />
                </label>
                <label className='space-y-1.5 text-xs text-muted-foreground'>
                  <span>Quote Expiry Date (optional)</span>
                  <Input type='date' value={quotation.expiryDate ?? ''} disabled={!quoteEditable} onChange={event => setQuotation(previous => ({ ...previous, expiryDate: event.target.value }))} />
                </label>
              </div>
              <label className='block space-y-1.5 text-xs text-muted-foreground'>
                <span>Admin Notes for Customer</span>
                <Textarea value={quotation.adminNotes ?? ''} disabled={!quoteEditable} onChange={event => setQuotation(previous => ({ ...previous, adminNotes: event.target.value }))} placeholder='Explain materials, craftsmanship, timing, or quote conditions.' />
              </label>
              <div className='space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm'>
                <div className='flex justify-between text-muted-foreground'><span>Subtotal</span><span className='font-mono'>SAR {totals.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                <div className='flex justify-between text-muted-foreground'><span>VAT ({quotation.vatRate ?? 15}%)</span><span className='font-mono'>SAR {totals.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                <div className='flex justify-between border-t border-border/70 pt-2 text-base font-bold'><span>Final Quote</span><span className='font-mono text-primary'>SAR {totals.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
              </div>
              {quoteEditable && (
                <Button onClick={handleSendQuote} disabled={totals.finalQuote <= 0} className='gap-2'>
                  <Send className='size-4' /> Send Quote to Customer
                </Button>
              )}
            </Card>
          )}

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='border-b border-border/70 pb-3'><h2 className='text-base font-semibold'>Status History</h2></div>
            <div className='space-y-4'>
              {history.map((entry, index) => (
                <div key={entry.id} className='grid grid-cols-[20px_1fr] gap-3'>
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 size-2.5 rounded-full bg-primary' />
                    {index < history.length - 1 && <span className='mt-1 h-full w-px bg-border' />}
                  </div>
                  <div className='pb-2'>
                    <div className='font-semibold text-sm'>{entry.label}</div>
                    <div className='text-xs text-muted-foreground'>{entry.date}</div>
                    {entry.detail && <div className='mt-1 text-xs text-muted-foreground'>{entry.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='space-y-2 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='text-sm font-semibold'>Return Policy</h2>
            <Badge variant='outline' className='border-amber-500/30 bg-amber-500/10 text-amber-400'>Non-returnable / Non-refundable</Badge>
            <p className='text-xs leading-relaxed text-muted-foreground'>{CUSTOM_RETURN_POLICY} Serious fulfillment issues can be reviewed manually by an administrator.</p>
          </Card>

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'>
              <h2 className='text-sm font-semibold'>Admin Review</h2>
              <Badge variant='outline' className={getStatusBadgeClass(currentStatus)}>{currentStatus}</Badge>
            </div>
            {currentStatus === 'New' && (
              <div className='space-y-2'>
                <Button className='w-full' onClick={() => transitionTo('Under Review', 'Request moved to Under Review')}><ShieldCheck className='size-4' /> Start Review</Button>
                <Button variant='outline' className='w-full' onClick={() => transitionTo('Awaiting Customer', 'More information requested')}><MessageSquare className='size-4' /> Request More Information</Button>
              </div>
            )}
            {currentStatus === 'Under Review' && (
              <div className='space-y-2'>
                <Button className='w-full' onClick={() => transitionTo('Approved', 'Request Approved')}><CheckCircle2 className='size-4' /> Approve Request</Button>
                <Button variant='outline' className='w-full' onClick={() => transitionTo('Awaiting Customer', 'More information requested')}><MessageSquare className='size-4' /> Request More Information</Button>
                <Button variant='outline' className='w-full text-destructive' onClick={() => transitionTo('Rejected', 'Request Rejected')}><XCircle className='size-4' /> Reject Request</Button>
              </div>
            )}
            {currentStatus === 'Awaiting Customer' && (
              <div className='space-y-2'>
                <Button className='w-full' onClick={() => transitionTo('Under Review', 'Review resumed after customer response')}><ShieldCheck className='size-4' /> Resume Review</Button>
                <Button variant='outline' className='w-full' onClick={() => transitionTo('Cancelled', 'Request Cancelled')}>Cancel Request</Button>
              </div>
            )}
            {currentStatus === 'Approved' && <p className='text-xs text-muted-foreground'>Approval recorded. Complete the quotation before contacting the customer for payment.</p>}
            {currentStatus === 'Quote Sent' && <p className='text-xs text-muted-foreground'>Quote sent. Production stays locked until the customer accepts the quote and checkout confirms payment.</p>}
            {currentStatus === 'Payment Received' && <Button className='w-full' onClick={() => transitionTo('In Production', 'Production Started')}>Start Production</Button>}
            {currentStatus === 'In Production' && <Button className='w-full' onClick={() => transitionTo('Ready', 'Order Ready')}>Mark Ready</Button>}
            {currentStatus === 'Ready' && <Button className='w-full' onClick={() => transitionTo('Completed', 'Request Completed')}>Complete Request</Button>}
            {['Rejected', 'Quote Declined', 'Cancelled', 'Completed'].includes(currentStatus) && <p className='text-xs text-muted-foreground'>This request has reached a terminal status.</p>}
          </Card>

          <Card className='space-y-3 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='border-b border-border/70 pb-3 text-sm font-semibold'>Customer</h2>
            <div className='flex items-center gap-2 text-sm font-semibold'><User className='size-4 text-muted-foreground' /> {request.customerName}</div>
            <a href={`mailto:${request.customerEmail}`} className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground'><Mail className='size-4' /> {request.customerEmail}</a>
            <a href={`tel:${request.customerPhone}`} className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground'><Phone className='size-4' /> {request.customerPhone}</a>
          </Card>

          <Card className='space-y-3 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='flex items-center gap-2 border-b border-border/70 pb-3 text-sm font-semibold'><Clock className='size-4' /> Internal Notes</h2>
            {internalNotes.map((note, index) => <div key={`${note}-${index}`} className='rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground'>{note}</div>)}
            <Textarea value={newInternalNote} onChange={event => setNewInternalNote(event.target.value)} placeholder='Add a private atelier note…' />
            <Button variant='outline' onClick={handleAddInternalNote} className='w-full'>Add Note</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
