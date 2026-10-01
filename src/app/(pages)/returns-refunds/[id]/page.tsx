'use client'

import { use, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  CreditCard,
  ImageIcon,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  User,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  type InspectionCheckKey,
  type InspectionResult,
  type ReturnItem,
  type ReturnStatus,
  INSPECTION_CHECKS,
  MOCK_RETURNS,
  loadReturnItem,
  normalizeReturnItem,
  saveReturnItem
} from '../data'

const getStatusClass = (status: ReturnStatus) => {
  if (['Refund Completed', 'Return Closed'].includes(status)) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  }

  if (status === 'Refund Rejected') return 'border-rose-500/30 bg-rose-500/10 text-rose-400'

  if (['Refund Approved', 'Partial Refund Approved', 'Refund Processing'].includes(status)) {
    return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
}

const formatSAR = (amount: number) =>
  `SAR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const source = MOCK_RETURNS.find(item => item.id.toLowerCase() === id.toLowerCase()) ?? MOCK_RETURNS[0]
  const [returnItem, setReturnItem] = useState<ReturnItem>(() => normalizeReturnItem(source))
  const [returnRejectionReason, setReturnRejectionReason] = useState('')
  const [refundRejectionReason, setRefundRejectionReason] = useState('')
  const [deductionAmount, setDeductionAmount] = useState(0)
  const [deductionReason, setDeductionReason] = useState('')
  const [receivedDate, setReceivedDate] = useState('')
  const [receivedBy, setReceivedBy] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = loadReturnItem(source)

      setReturnItem(stored)
      setDeductionAmount(stored.refundDecision?.deductionAmountSAR ?? 0)
      setDeductionReason(stored.refundDecision?.deductionReason ?? '')
      setReceivedDate(stored.receivedDate ?? '')
      setReceivedBy(stored.receivedBy ?? '')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [source])

  const inspection = returnItem.inspection!
  const refundDecision = returnItem.refundDecision!
  const moyasarRefund = returnItem.moyasarRefund!
  const eligibleFullRefund = returnItem.originalProductPriceSAR + returnItem.shippingRefundSAR
  const partialRefundAmount = Math.max(0, eligibleFullRefund - deductionAmount)
  const inspectionComplete = inspection.status === 'Passed' || inspection.status === 'Failed'

  const updateReturn = (changes: Partial<ReturnItem>, stage: string, detail?: string) => {
    setReturnItem(previous => {
      const next: ReturnItem = {
        ...previous,
        ...changes,
        timeline: [
          ...previous.timeline.map(entry => ({ ...entry, current: false })),
          {
            stage,
            date: new Date().toLocaleString('en-GB'),
            completed: true,
            current: true
          }
        ]
      }

      saveReturnItem(next)

      return next
    })
    toast.success(stage, detail ? { description: detail } : undefined)
  }

  const updateInspectionCheck = (key: InspectionCheckKey, result: InspectionResult) => {
    const nextInspection = {
      ...inspection,
      status: 'In Progress' as const,
      checklist: { ...inspection.checklist, [key]: result }
    }

    const next = { ...returnItem, inspection: nextInspection }

    setReturnItem(next)
    saveReturnItem(next)
  }

  const updateInspectorNotes = (value: string) => {
    const next = { ...returnItem, inspection: { ...inspection, inspectorNotes: value } }

    setReturnItem(next)
    saveReturnItem(next)
  }

  const completeInspection = () => {
    const hasFailure = Object.values(inspection.checklist).includes('Fail')

    const nextInspection = {
      ...inspection,
      status: hasFailure ? 'Failed' as const : 'Passed' as const,
      inspectorName: 'VenVision Quality Team',
      inspectedDate: new Date().toLocaleString('en-GB')
    }

    updateReturn(
      { inspection: nextInspection, refundStatus: 'Awaiting Inspection' },
      hasFailure ? 'Quality Inspection Failed' : 'Quality Inspection Passed',
      inspection.inspectorNotes || 'Inspection checklist completed.'
    )
  }

  const approveFullRefund = () => {
    const decision = {
      type: 'Full' as const,
      originalPaidAmountSAR: eligibleFullRefund,
      deductionAmountSAR: 0,
      finalRefundAmountSAR: eligibleFullRefund,
      decidedDate: new Date().toLocaleString('en-GB')
    }

    updateReturn(
      {
        returnStatus: 'Refund Approved',
        refundStatus: 'Approved',
        refundAmountSAR: eligibleFullRefund,
        refundDecision: decision
      },
      'Full Refund Approved',
      formatSAR(eligibleFullRefund)
    )
  }

  const approvePartialRefund = () => {
    if (deductionAmount <= 0 || !deductionReason.trim()) {
      toast.error('Enter a deduction amount and reason for a partial refund.')

      return
    }

    const decision = {
      type: 'Partial' as const,
      originalPaidAmountSAR: eligibleFullRefund,
      deductionAmountSAR: deductionAmount,
      deductionReason: deductionReason.trim(),
      finalRefundAmountSAR: partialRefundAmount,
      decidedDate: new Date().toLocaleString('en-GB')
    }

    updateReturn(
      {
        returnStatus: 'Partial Refund Approved',
        refundStatus: 'Partial Approved',
        refundAmountSAR: partialRefundAmount,
        refundDecision: decision
      },
      'Partial Refund Approved',
      `${formatSAR(partialRefundAmount)} after ${formatSAR(deductionAmount)} deduction`
    )
  }

  const rejectRefund = () => {
    if (!refundRejectionReason.trim()) {
      toast.error('Enter a refund rejection reason.')

      return
    }

    updateReturn(
      {
        returnStatus: 'Refund Rejected',
        refundStatus: 'Rejected',
        refundAmountSAR: 0,
        refundDecision: {
          ...refundDecision,
          type: 'Rejected',
          finalRefundAmountSAR: 0,
          rejectionReason: refundRejectionReason.trim(),
          decidedDate: new Date().toLocaleString('en-GB')
        }
      },
      'Refund Rejected',
      refundRejectionReason.trim()
    )
  }

  const startMoyasarRefund = () => {
    if (!['Approved', 'Partial Approved'].includes(returnItem.refundStatus)) return

    const refundId = `RFN-${Date.now()}`

    updateReturn(
      {
        returnStatus: 'Refund Processing',
        refundStatus: 'Processing',
        moyasarRefund: {
          ...moyasarRefund,
          refundId,
          refundAmountSAR: returnItem.refundAmountSAR,
          requestedDate: new Date().toLocaleString('en-GB'),
          status: 'Processing',
          apiReference: `MOYASAR-${returnItem.id}-${Date.now()}`
        }
      },
      'Moyasar Refund Requested',
      `${refundId} · ${formatSAR(returnItem.refundAmountSAR)}`
    )
  }

  const completeMoyasarRefund = () => {
    updateReturn(
      {
        returnStatus: 'Refund Completed',
        refundStatus: 'Completed',
        moyasarRefund: {
          ...moyasarRefund,
          processedDate: new Date().toLocaleString('en-GB'),
          status: 'Completed'
        }
      },
      'Refund Completed',
      `${moyasarRefund.refundId ?? 'Moyasar refund'} · ${formatSAR(returnItem.refundAmountSAR)}`
    )
  }

  const confirmProductReceived = () => {
    if (!receivedDate || !receivedBy.trim()) {
      toast.error('Enter the received date and who received the product.')

      return
    }

    updateReturn(
      { returnStatus: 'Product Received', receivedDate, receivedBy: receivedBy.trim() },
      'Product Received',
      `${receivedBy.trim()} · ${receivedDate}`
    )
  }

  const rejectReturn = () => {
    if (!returnRejectionReason.trim()) {
      toast.error('Enter a return rejection reason.')

      return
    }

    updateReturn(
      { returnStatus: 'Return Closed', refundStatus: 'Rejected', refundAmountSAR: 0 },
      'Return Rejected',
      returnRejectionReason.trim()
    )
  }

  const statusMessage = useMemo(() => {
    if (returnItem.returnStatus === 'Return Approved') return 'Return eligibility is approved. No refund has been initiated.'
    if (returnItem.returnStatus === 'Awaiting Product') return 'Waiting for the customer to send the product back.'
    if (returnItem.returnStatus === 'Product Received') return 'The product is recorded as received and must be inspected.'
    if (returnItem.returnStatus === 'Quality Inspection') return 'Complete the inspection before making a refund decision.'

    return 'Follow the next available workflow action.'
  }, [returnItem.returnStatus])

  return (
    <div className='space-y-6 pb-12'>
      <div className='flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1.5'>
          <Link href='/returns-refunds' className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground'>
            <ArrowLeft className='size-3.5' /> Back to Returns &amp; Refunds
          </Link>
          <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl'>
            <RotateCcw className='size-6 text-primary' /> {returnItem.id}
          </h1>
          <p className='text-sm text-muted-foreground'>Return for order <span className='font-mono text-foreground'>{returnItem.orderId}</span></p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='outline'>{returnItem.channel}</Badge>
          <Badge variant='outline' className={getStatusClass(returnItem.returnStatus)}>{returnItem.returnStatus}</Badge>
          <Badge variant='outline'>Inspection: {inspection.status}</Badge>
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-3'>
        <div className='space-y-6 xl:col-span-2'>
          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'><h2 className='text-base font-semibold'>Return Request</h2><span className='text-xs text-muted-foreground'>{returnItem.requestedDate}</span></div>
            <dl className='grid gap-4 text-sm sm:grid-cols-2'>
              <div><dt className='text-xs text-muted-foreground'>Customer</dt><dd className='mt-1 font-semibold'>{returnItem.customer}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Order ID</dt><dd className='mt-1 font-mono font-semibold'>{returnItem.orderId}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Return Reason</dt><dd className='mt-1 font-semibold'>{returnItem.returnReason}</dd></div>
              <div><dt className='text-xs text-muted-foreground'>Original Payment</dt><dd className='mt-1 font-semibold'>{returnItem.originalPaymentMethod}</dd></div>
            </dl>
            {returnItem.businessName && <div className='rounded-lg border border-border/70 bg-muted/20 p-3 text-sm'>{returnItem.businessName}</div>}
            <div className='rounded-lg border border-border/70 bg-muted/20 p-4'><div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Customer Notes</div><p className='mt-2 text-sm leading-relaxed'>{returnItem.customerNotes}</p></div>
          </Card>

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='border-b border-border/70 pb-3 text-base font-semibold'>Returned Product</h2>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <img src={returnItem.productImage} alt={returnItem.product} className='size-28 rounded-lg border border-border object-cover' />
              <div className='space-y-1'><div className='font-semibold'>{returnItem.product}</div><div className='font-mono text-xs text-muted-foreground'>{returnItem.productSku}</div><div className='text-sm font-bold text-primary'>{formatSAR(returnItem.originalProductPriceSAR)}</div><div className='text-xs text-muted-foreground'>Quantity: {returnItem.quantity}</div></div>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
              {(returnItem.evidencePhotos ?? []).map((photo, index) => <div key={`${photo}-${index}`} className='space-y-1'><img src={photo} alt={`Return evidence ${index + 1}`} className='aspect-4/3 w-full rounded-lg border border-border object-cover' /><div className='flex items-center gap-1 text-[10px] text-muted-foreground'><ImageIcon className='size-3' /> Evidence {index + 1}</div></div>)}
            </div>
          </Card>

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center gap-2 border-b border-border/70 pb-3'><Truck className='size-4 text-primary' /><h2 className='text-base font-semibold'>Return Shipment</h2></div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-1.5 text-xs text-muted-foreground'>Courier<Input value={returnItem.courierUsed} disabled /></label>
              <label className='space-y-1.5 text-xs text-muted-foreground'>Tracking Number<Input value={returnItem.trackingNumber} disabled className='font-mono' /></label>
              <label className='space-y-1.5 text-xs text-muted-foreground'>Received Date<Input type='date' value={receivedDate} onChange={event => setReceivedDate(event.target.value)} disabled={returnItem.returnStatus !== 'Awaiting Product'} /></label>
              <label className='space-y-1.5 text-xs text-muted-foreground'>Received By<Input value={receivedBy} onChange={event => setReceivedBy(event.target.value)} placeholder='Warehouse or staff member' disabled={returnItem.returnStatus !== 'Awaiting Product'} /></label>
            </div>
            {returnItem.returnStatus === 'Awaiting Product' && <Button onClick={confirmProductReceived} className='gap-2'><PackageCheck className='size-4' /> Confirm Product Received</Button>}
          </Card>

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3'><div><h2 className='flex items-center gap-2 text-base font-semibold'><ClipboardCheck className='size-4 text-primary' /> Quality Inspection</h2><p className='mt-1 text-xs text-muted-foreground'>Refund decisions remain locked until this inspection is complete.</p></div><Badge variant='outline'>Inspection: {inspection.status}</Badge></div>
            {returnItem.returnStatus === 'Product Received' && <Button onClick={() => updateReturn({ returnStatus: 'Quality Inspection', inspection: { ...inspection, status: 'In Progress' }, refundStatus: 'Awaiting Inspection' }, 'Quality Inspection Started')}><ClipboardCheck className='size-4' /> Start Inspection</Button>}
            {['Quality Inspection', 'Refund Approved', 'Partial Refund Approved', 'Refund Rejected', 'Refund Processing', 'Refund Completed', 'Return Closed'].includes(returnItem.returnStatus) && <><div className='grid gap-3 sm:grid-cols-2'>{INSPECTION_CHECKS.map(check => <label key={check.key} className='space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground'><span>{check.label}</span><select value={inspection.checklist[check.key]} onChange={event => updateInspectionCheck(check.key, event.target.value as InspectionResult)} disabled={inspectionComplete} className='h-9 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground'><option value='Pass'>Pass</option><option value='Fail'>Fail</option><option value='Not Applicable'>Not Applicable</option></select></label>)}</div><label className='block space-y-1.5 text-xs text-muted-foreground'>Inspector Notes<Textarea value={inspection.inspectorNotes} onChange={event => updateInspectorNotes(event.target.value)} disabled={inspectionComplete} placeholder='Record condition, damage, missing items, and supporting observations.' /></label>{!inspectionComplete && <Button onClick={completeInspection} className='gap-2'><CheckCircle2 className='size-4' /> Complete Inspection</Button>}</>}
          </Card>

          {inspectionComplete && <Card className='space-y-5 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='border-b border-border/70 pb-3'><h2 className='text-base font-semibold'>Refund Decision</h2><p className='mt-1 text-xs text-muted-foreground'>Return approval and refund approval are separate decisions.</p></div>
            <div className='grid gap-3 sm:grid-cols-3'><div className='rounded-lg border border-border/70 bg-muted/20 p-3'><div className='text-xs text-muted-foreground'>Original Paid Amount</div><div className='mt-1 font-mono font-bold'>{formatSAR(eligibleFullRefund)}</div></div><label className='space-y-1.5 text-xs text-muted-foreground'>Deduction Amount<Input type='number' min='0' max={eligibleFullRefund} value={deductionAmount} onChange={event => setDeductionAmount(Number(event.target.value) || 0)} disabled={refundDecision.type !== 'None'} /></label><div className='rounded-lg border border-border/70 bg-muted/20 p-3'><div className='text-xs text-muted-foreground'>Final Partial Refund</div><div className='mt-1 font-mono font-bold text-primary'>{formatSAR(partialRefundAmount)}</div></div></div>
            <label className='block space-y-1.5 text-xs text-muted-foreground'>Deduction Reason<Textarea value={deductionReason} onChange={event => setDeductionReason(event.target.value)} disabled={refundDecision.type !== 'None'} placeholder='Required for partial refunds' /></label>
            <label className='block space-y-1.5 text-xs text-muted-foreground'>Refund Rejection Reason<Textarea value={refundRejectionReason} onChange={event => setRefundRejectionReason(event.target.value)} disabled={refundDecision.type !== 'None'} placeholder='Required when rejecting the refund' /></label>
            {refundDecision.type === 'None' ? <div className='flex flex-wrap gap-2'><Button onClick={approveFullRefund}>Approve Full Refund</Button><Button variant='outline' onClick={approvePartialRefund}>Approve Partial Refund</Button><Button variant='outline' onClick={rejectRefund} className='text-destructive'>Reject Refund</Button></div> : <div className='rounded-lg border border-border/70 bg-muted/20 p-4 text-sm'>Decision: <strong>{refundDecision.type}</strong>{refundDecision.deductionReason ? ` · ${refundDecision.deductionReason}` : ''}{refundDecision.rejectionReason ? ` · ${refundDecision.rejectionReason}` : ''}</div>}
          </Card>}

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'><h2 className='flex items-center gap-2 text-base font-semibold'><CreditCard className='size-4 text-primary' /> Moyasar Refund</h2><Badge variant='outline'>{moyasarRefund.status}</Badge></div>
            <dl className='grid gap-4 text-sm sm:grid-cols-2'><div><dt className='text-xs text-muted-foreground'>Moyasar Payment ID</dt><dd className='mt-1 font-mono'>{moyasarRefund.paymentId}</dd></div><div><dt className='text-xs text-muted-foreground'>Refund ID</dt><dd className='mt-1 font-mono'>{moyasarRefund.refundId ?? 'Not created'}</dd></div><div><dt className='text-xs text-muted-foreground'>Refund Amount</dt><dd className='mt-1 font-mono'>{moyasarRefund.refundAmountSAR ? formatSAR(moyasarRefund.refundAmountSAR) : 'Not requested'}</dd></div><div><dt className='text-xs text-muted-foreground'>API Reference</dt><dd className='mt-1 break-all font-mono text-xs'>{moyasarRefund.apiReference ?? 'Not available'}</dd></div><div><dt className='text-xs text-muted-foreground'>Requested Date</dt><dd className='mt-1'>{moyasarRefund.requestedDate ?? 'Not requested'}</dd></div><div><dt className='text-xs text-muted-foreground'>Processed Date</dt><dd className='mt-1'>{moyasarRefund.processedDate ?? 'Not processed'}</dd></div></dl>
            {['Refund Approved', 'Partial Refund Approved'].includes(returnItem.returnStatus) && <Button onClick={startMoyasarRefund} className='gap-2'><CreditCard className='size-4' /> Send Approved Refund to Moyasar</Button>}
            {returnItem.returnStatus === 'Refund Processing' && <Button onClick={completeMoyasarRefund} className='gap-2'><CheckCircle2 className='size-4' /> Confirm Moyasar Refund Completed</Button>}
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/70 pb-3'><h2 className='text-sm font-semibold'>Workflow Actions</h2><ShieldCheck className='size-4 text-primary' /></div>
            <p className='text-xs leading-relaxed text-muted-foreground'>{statusMessage}</p>
            {returnItem.returnStatus === 'Return Requested' && <Button className='w-full' onClick={() => updateReturn({ returnStatus: 'Under Review' }, 'Eligibility Review Started')}>Start Eligibility Review</Button>}
            {returnItem.returnStatus === 'Under Review' && <div className='space-y-2'><Button className='w-full' onClick={() => updateReturn({ returnStatus: 'Return Approved', refundStatus: 'Not Started' }, 'Return Approved', 'Refund remains locked until receipt and inspection.')}>Approve Return</Button><Button variant='outline' className='w-full' onClick={() => updateReturn({}, 'More Information Requested')}>Request More Information</Button><Textarea value={returnRejectionReason} onChange={event => setReturnRejectionReason(event.target.value)} placeholder='Return rejection reason' /><Button variant='outline' className='w-full text-destructive' onClick={rejectReturn}><XCircle className='size-4' /> Reject Return</Button></div>}
            {returnItem.returnStatus === 'Return Approved' && <Button className='w-full' onClick={() => updateReturn({ returnStatus: 'Awaiting Product' }, 'Awaiting Product Return')}>Send Return Instructions</Button>}
            {returnItem.returnStatus === 'Refund Rejected' && <Button className='w-full' onClick={() => updateReturn({ returnStatus: 'Return Closed' }, 'Return Closed')}>Close Return</Button>}
            {returnItem.returnStatus === 'Refund Completed' && <Button className='w-full' onClick={() => updateReturn({ returnStatus: 'Return Closed' }, 'Return Closed')}>Close Return</Button>}
          </Card>

          <Card className='space-y-3 rounded-xl border-border/80 p-5 shadow-xs'><h2 className='flex items-center gap-2 border-b border-border/70 pb-3 text-sm font-semibold'><User className='size-4' /> Customer &amp; Order</h2><div className='text-sm font-semibold'>{returnItem.customer}</div><div className='font-mono text-xs text-muted-foreground'>{returnItem.orderId}</div><div className='text-xs text-muted-foreground'>{returnItem.originalPaymentMethod}</div></Card>

          <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs'>
            <h2 className='flex items-center gap-2 border-b border-border/70 pb-3 text-sm font-semibold'><Clock3 className='size-4' /> Timeline</h2>
            {returnItem.timeline.map((entry, index) => <div key={`${entry.stage}-${index}`} className='grid grid-cols-[18px_1fr] gap-3'><div className='flex flex-col items-center'><span className={`mt-1 size-2.5 rounded-full ${entry.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />{index < returnItem.timeline.length - 1 && <span className='mt-1 h-full w-px bg-border' />}</div><div className='pb-3'><div className='text-sm font-semibold'>{entry.stage}</div><div className='text-xs text-muted-foreground'>{entry.date}</div></div></div>)}
          </Card>
        </div>
      </div>
    </div>
  )
}
