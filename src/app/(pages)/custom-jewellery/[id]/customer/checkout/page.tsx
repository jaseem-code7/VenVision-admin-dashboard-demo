'use client'

import { use, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CUSTOM_RETURN_ACKNOWLEDGEMENT } from '@/lib/return-eligibility'
import {
  type CustomWorkflowState,
  MOCK_CUSTOM_REQUESTS,
  getInitialCustomWorkflow,
  loadCustomWorkflow,
  saveCustomWorkflow
} from '../../../data'

type PaymentMethod = 'Mada' | 'Credit Card' | 'Apple Pay'

export default function CustomJewelleryCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const request =
    MOCK_CUSTOM_REQUESTS.find(item => item.id.toLowerCase() === id.toLowerCase()) ?? MOCK_CUSTOM_REQUESTS[0]

  const [workflow, setWorkflow] = useState<CustomWorkflowState>(() => getInitialCustomWorkflow(request))
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mada')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setWorkflow(loadCustomWorkflow(request)), 0)

    return () => window.clearTimeout(timeoutId)
  }, [request])

  const handlePayment = () => {
    if (workflow.status !== 'Quote Sent' || !workflow.returnPolicyAcknowledgedAt || isProcessing) return

    setIsProcessing(true)

    window.setTimeout(() => {
      const nextWorkflow: CustomWorkflowState = {
        ...workflow,
        status: 'Payment Received',
        history: [
          ...workflow.history,
          {
            id: `${request.id}-payment-${Date.now()}`,
            status: 'Payment Received',
            label: 'Payment Received',
            date: new Date().toLocaleString('en-GB'),
            detail: `${paymentMethod} · SAR ${workflow.quotation.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          }
        ]
      }

      saveCustomWorkflow(request.id, nextWorkflow)
      toast.success('Payment confirmed', {
        description: 'Your custom jewellery order is ready to enter production.'
      })
      router.push(`/custom-jewellery/${request.id}/customer`)
    }, 650)
  }

  const canPay = workflow.status === 'Quote Sent' && Boolean(workflow.returnPolicyAcknowledgedAt)

  return (
    <div className='mx-auto max-w-4xl space-y-6 pb-12'>
      <div className='space-y-1 border-b border-border/40 pb-5'>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'><LockKeyhole className='size-4 text-primary' /> Secure Checkout</div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Accept Quote &amp; Pay</h1>
        <p className='text-sm text-muted-foreground'>Custom Jewellery Request <span className='font-mono text-foreground'>{request.id}</span></p>
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        <Card className='space-y-5 rounded-xl border-border/80 p-5 shadow-xs lg:col-span-3'>
          <div className='flex items-center justify-between border-b border-border/70 pb-3'>
            <h2 className='text-base font-semibold'>Payment Method</h2>
            <Badge variant='outline' className='gap-1'><ShieldCheck className='size-3' /> Protected</Badge>
          </div>

          <div className='grid gap-3'>
            {([
              ['Mada', CreditCard],
              ['Credit Card', CreditCard],
              ['Apple Pay', Smartphone]
            ] as const).map(([method, Icon]) => (
              <button
                key={method}
                type='button'
                onClick={() => setPaymentMethod(method)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                  paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border/80 hover:bg-muted/30'
                }`}
              >
                <span className='flex items-center gap-3 text-sm font-semibold'><Icon className='size-5 text-primary' /> {method}</span>
                <span className={`size-4 rounded-full border ${paymentMethod === method ? 'border-4 border-primary' : 'border-muted-foreground'}`} />
              </button>
            ))}
          </div>

          <div className='rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed'>
            <div className='font-semibold text-foreground'>Custom Jewellery Return Policy</div>
            <p className='mt-1 text-muted-foreground'>{CUSTOM_RETURN_ACKNOWLEDGEMENT}</p>
          </div>

          {canPay ? (
            <Button onClick={handlePayment} disabled={isProcessing} className='w-full gap-2'>
              {isProcessing ? 'Processing Payment…' : `Pay SAR ${workflow.quotation.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </Button>
          ) : (
            <div className='rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400'>
              {workflow.status === 'Quote Sent'
                ? 'Return to the quotation and acknowledge the custom jewellery return policy before paying.'
                : 'This quotation is no longer awaiting payment.'}
            </div>
          )}

          <Link href={`/custom-jewellery/${request.id}/customer`} className='block text-center text-xs text-muted-foreground hover:text-foreground'>Return to quotation</Link>
        </Card>

        <Card className='space-y-4 rounded-xl border-border/80 p-5 shadow-xs lg:col-span-2'>
          <div className='border-b border-border/70 pb-3'>
            <h2 className='text-base font-semibold'>Order Summary</h2>
            <p className='mt-1 text-xs text-muted-foreground'>{request.jewellery}</p>
          </div>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <div className='flex justify-between'><span>Subtotal</span><span className='font-mono'>SAR {(workflow.quotation.subtotal ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
            <div className='flex justify-between'><span>VAT ({workflow.quotation.vatRate ?? 15}%)</span><span className='font-mono'>SAR {(workflow.quotation.vatAmount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
            <div className='flex justify-between border-t border-border/70 pt-3 text-base font-bold text-foreground'><span>Total</span><span className='font-mono text-primary'>SAR {workflow.quotation.finalQuote.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
          </div>
          <div className='flex items-start gap-2 rounded-lg bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground'>
            <CheckCircle2 className='mt-0.5 size-4 shrink-0 text-emerald-400' /> Production becomes available only after this payment is confirmed.
          </div>
        </Card>
      </div>
    </div>
  )
}
