'use client'

import { use, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Gem,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  CUSTOM_RETURN_ACKNOWLEDGEMENT,
  CUSTOM_RETURN_POLICY
} from '@/lib/return-eligibility'
import {
  type CustomRequestStatus,
  type CustomWorkflowState,
  MOCK_CUSTOM_REQUESTS,
  getInitialCustomWorkflow,
  loadCustomWorkflow,
  saveCustomWorkflow
} from '../../data'

const customerStatusLabels: Record<CustomRequestStatus, string> = {
  New: 'Submitted',
  'Under Review': 'Under Review',
  'Awaiting Customer': 'Information Required',
  Approved: 'Approved',
  'Quote Sent': 'Quotation Received',
  'Payment Received': 'Payment Confirmed',
  'In Production': 'In Production',
  Ready: 'Ready',
  Completed: 'Completed',
  Rejected: 'Rejected',
  'Quote Declined': 'Quote Declined',
  Cancelled: 'Cancelled'
}

const quoteStatuses: CustomRequestStatus[] = [
  'Quote Sent',
  'Payment Received',
  'In Production',
  'Ready',
  'Completed',
  'Quote Declined'
]

const getStatusStyle = (status: CustomRequestStatus) => {
  if (['Payment Received', 'Ready', 'Completed'].includes(status)) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  }

  if (['Rejected', 'Quote Declined', 'Cancelled'].includes(status)) {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-400'
  }

  if (status === 'Quote Sent') return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'

  if (status === 'In Production') return 'border-purple-500/30 bg-purple-500/10 text-purple-400'

  return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
}

export default function CustomJewelleryCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const request =
    MOCK_CUSTOM_REQUESTS.find(item => item.id.toLowerCase() === id.toLowerCase()) ?? MOCK_CUSTOM_REQUESTS[0]

  const [workflow, setWorkflow] = useState<CustomWorkflowState>(() => getInitialCustomWorkflow(request))

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setWorkflow(loadCustomWorkflow(request)), 0)

    return () => window.clearTimeout(timeoutId)
  }, [request])

  const updateStatus = (status: CustomRequestStatus, label: string, detail: string) => {
    const nextWorkflow: CustomWorkflowState = {
      ...workflow,
      status,
      history: [
        ...workflow.history,
        {
          id: `${request.id}-${Date.now()}`,
          status,
          label,
          date: new Date().toLocaleString('en-GB'),
          detail
        }
      ]
    }

    setWorkflow(nextWorkflow)
    saveCustomWorkflow(request.id, nextWorkflow)
  }

  const handleAcceptAndPay = () => {
    if (!workflow.returnPolicyAcknowledgedAt) {
      toast.error('Please acknowledge the custom jewellery return policy before continuing.')

      return
    }

    router.push(`/custom-jewellery/${request.id}/customer/checkout`)
  }

  const handleReturnPolicyAcknowledgement = (acknowledged: boolean) => {
    const nextWorkflow: CustomWorkflowState = {
      ...workflow,
      returnPolicyAcknowledgedAt: acknowledged ? new Date().toISOString() : undefined
    }

    setWorkflow(nextWorkflow)
    saveCustomWorkflow(request.id, nextWorkflow)
  }

  const handleDecline = () => {
    updateStatus('Quote Declined', 'Quote Declined', 'Customer declined the quotation.')
    toast.success('Response sent', { description: 'The quotation has been declined.' })
  }

  const handleRequestChanges = () => {
    updateStatus('Under Review', 'Quote Changes Requested', 'Customer requested changes to the quotation.')
    toast.success('Change request sent', { description: 'Our team will review the quotation and contact you.' })
  }

  const showQuote = quoteStatuses.includes(workflow.status) || Boolean(workflow.quotation.quoteDate)
  const quote = workflow.quotation

  return (
    <div className='mx-auto max-w-5xl space-y-6 pb-12'>
      <div className='flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Sparkles className='size-4 text-primary' /> VenVision Custom Jewellery
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>Your Jewellery Request</h1>
          <p className='text-sm text-muted-foreground'>Request <span className='font-mono text-foreground'>{request.id}</span></p>
        </div>
        <Badge variant='outline' className={getStatusStyle(workflow.status)}>
          {customerStatusLabels[workflow.status]}
        </Badge>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'>
              <h2 className='flex items-center gap-2 text-base font-semibold'><Gem className='size-4 text-primary' /> Request Details</h2>
              <Badge variant='outline'>{request.type}</Badge>
            </div>
            <dl className='grid gap-4 text-sm sm:grid-cols-2'>
              <div><dt className='text-xs text-muted-foreground'>Jewellery</dt><dd className='mt-1 font-semibold'>{request.jewellery}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Submitted</dt><dd className='mt-1 font-semibold'>{request.submittedDate}</dd></div>
            </dl>
            <div className='rounded-lg border border-border/70 bg-muted/20 p-4'>
              <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Your Request</div>
              <p className='mt-2 text-sm leading-relaxed'>{request.requestDetails}</p>
            </div>
            {request.originalProduct && (
              <div className='flex gap-4 rounded-lg border border-border/70 p-4'>
                <img src={request.originalProduct.image} alt={request.originalProduct.name} className='size-20 rounded-lg object-cover' />
                <div className='space-y-1'>
                  <div className='font-semibold'>{request.originalProduct.name}</div>
                  <div className='font-mono text-xs text-muted-foreground'>{request.originalProduct.sku}</div>
                  <div className='text-xs text-muted-foreground'>Original product price: SAR {request.originalProduct.originalPrice.toLocaleString('en-US')}</div>
                  <div className='text-xs text-primary'>Your custom quotation is separate from the original product price.</div>
                </div>
              </div>
            )}
          </Card>

          {showQuote && (
            <Card className='space-y-5 rounded-xl border-primary/30 bg-primary/3 p-5 shadow-xs'>
              <div className='flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-3'>
                <div>
                  <h2 className='text-lg font-semibold'>Your Quotation</h2>
                  <p className='text-xs text-muted-foreground'>All amounts are in Saudi Riyals (SAR).</p>
                </div>
                {quote.expiryDate && <Badge variant='outline'>Valid until {quote.expiryDate}</Badge>}
              </div>
              <div className='space-y-2 text-sm'>
                {[
                  ['Gold Value', quote.goldValue],
                  ['Stone / Diamond Value', quote.stoneValue],
                  ['Making Charge', quote.makingCharge],
                  ['Customization Charge', quote.customizationCharge],
                  ['Other Charges', quote.otherCharges]
                ].map(([label, value]) => (
                  <div key={label as string} className='flex justify-between text-muted-foreground'>
                    <span>{label}</span><span className='font-mono'>SAR {Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {(quote.discount ?? 0) > 0 && (
                  <div className='flex justify-between text-emerald-400'><span>Discount</span><span className='font-mono'>- SAR {(quote.discount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                )}
                <div className='flex justify-between border-t border-border/70 pt-2 text-muted-foreground'><span>Subtotal</span><span className='font-mono'>SAR {(quote.subtotal ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                <div className='flex justify-between text-muted-foreground'><span>VAT ({quote.vatRate ?? 15}%)</span><span className='font-mono'>SAR {(quote.vatAmount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                <div className='flex justify-between border-t border-border/70 pt-3 text-lg font-bold'><span>Final Quote</span><span className='font-mono text-primary'>SAR {quote.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
              </div>
              {quote.adminNotes && <div className='rounded-lg border border-border/70 bg-background/50 p-3 text-sm text-muted-foreground'>{quote.adminNotes}</div>}
              {workflow.status === 'Quote Sent' && (
                <div className='space-y-3'>
                  <label className='flex cursor-pointer items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed'>
                    <input
                      type='checkbox'
                      checked={Boolean(workflow.returnPolicyAcknowledgedAt)}
                      onChange={event => handleReturnPolicyAcknowledgement(event.target.checked)}
                      className='mt-0.5 size-4 shrink-0 accent-primary'
                    />
                    <span>{CUSTOM_RETURN_ACKNOWLEDGEMENT}</span>
                  </label>
                  <div className='grid gap-2 sm:grid-cols-3'>
                    <Button onClick={handleAcceptAndPay} disabled={!workflow.returnPolicyAcknowledgedAt} className='gap-2'><CreditCard className='size-4' /> Accept &amp; Pay</Button>
                    <Button variant='outline' onClick={handleRequestChanges} className='gap-2'><MessageSquare className='size-4' /> Request Changes</Button>
                    <Button variant='outline' onClick={handleDecline} className='gap-2 text-destructive'><XCircle className='size-4' /> Decline</Button>
                  </div>
                </div>
              )}
              {workflow.status === 'Payment Received' && (
                <div className='flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400'>
                  <CheckCircle2 className='size-4' /> Payment received. Your order is ready for production.
                </div>
              )}
            </Card>
          )}
        </div>

        <div className='space-y-6'>
          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='border-b border-border/70 pb-3 text-sm font-semibold'>Request Progress</h2>
            {workflow.history.map((entry, index) => (
              <div key={entry.id} className='grid grid-cols-[18px_1fr] gap-3'>
                <div className='flex flex-col items-center'>
                  <span className='mt-1 size-2.5 rounded-full bg-primary' />
                  {index < workflow.history.length - 1 && <span className='mt-1 h-full w-px bg-border' />}
                </div>
                <div className='pb-3'>
                  <div className='text-sm font-semibold'>{customerStatusLabels[entry.status] ?? entry.label}</div>
                  <div className='text-xs text-muted-foreground'>{entry.date}</div>
                  {entry.detail && <div className='mt-1 text-xs text-muted-foreground'>{entry.detail}</div>}
                </div>
              </div>
            ))}
          </Card>

          <Card className='space-y-3 rounded-xl border-border/80 p-5 text-sm shadow-xs'>
            <div className='flex items-center gap-2 font-semibold'><ShieldCheck className='size-4 text-primary' /> What happens next?</div>
            <p className='text-xs leading-relaxed text-muted-foreground'>Production begins only after you approve the quotation and payment is confirmed. We will keep this page updated as your piece moves through the atelier.</p>
            <div className='rounded-lg border border-border/70 bg-muted/20 p-3 text-xs'>
              <div className='font-semibold text-foreground'>Return Policy</div>
              <p className='mt-1 text-muted-foreground'>{CUSTOM_RETURN_POLICY}</p>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'><Clock3 className='size-4' /> Need help? Contact your VenVision concierge.</div>
          </Card>

          <Link href='/custom-jewellery' className='block text-center text-xs text-muted-foreground hover:text-foreground'>Return to requests</Link>
        </div>
      </div>
    </div>
  )
}
