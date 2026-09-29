'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  RotateCcw,
  ArrowLeft,
  Printer,
  FileText,
  Truck,
  ShieldCheck,
  CreditCard,
  Building2,
  User,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  HelpCircle,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
  AlertTriangle,
  Receipt,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'

import {
  MOCK_RETURNS,
  ReturnItem,
  ReturnStatus,
  RefundStatus,
  ReturnReason
} from '../data'

export default function ReturnDetailPage() {
  const params = useParams()
  const router = useRouter()
  const returnId = (params?.id as string) || 'RET-1024'

  // Look up return item or fallback to first mock item
  const initialData = React.useMemo(() => {
    return MOCK_RETURNS.find(r => r.id.toLowerCase() === returnId.toLowerCase()) || MOCK_RETURNS[0]
  }, [returnId])

  const [returnItem, setReturnItem] = React.useState<ReturnItem>(initialData)

  // Interactive Form States
  const [selectedStatus, setSelectedStatus] = React.useState<ReturnStatus>(initialData.returnStatus)
  const [selectedRefundStatus, setSelectedRefundStatus] = React.useState<RefundStatus>(initialData.refundStatus)
  const [isProcessingRefund, setIsProcessingRefund] = React.useState(false)
  const [isProcessRefundModalOpen, setIsProcessRefundModalOpen] = React.useState(false)

  // Refund Calculation Overrides
  const [shippingRefund, setShippingRefund] = React.useState<number>(initialData.shippingRefundSAR)
  const [returnFee, setReturnFee] = React.useState<number>(initialData.customerReturnFeeSAR)
  const [restockingFee, setRestockingFee] = React.useState<number>(initialData.restockingFeeSAR)

  // Dynamic Refund Calculation
  // Refund Amount = Product Refund + Shipping Refund - Return Fee - Restocking Fee
  const calculatedRefundAmount = Math.max(
    0,
    returnItem.originalProductPriceSAR + shippingRefund - returnFee - restockingFee
  )

  // Update status handler
  const handleUpdateStatus = () => {
    setReturnItem(prev => {
      // update timeline accordingly
      const updatedTimeline = prev.timeline.map(t => {
        if (
          (selectedStatus === 'Approved' && (t.stage.includes('Requested') || t.stage.includes('Approved'))) ||
          (selectedStatus === 'Item Received' && (t.stage.includes('Requested') || t.stage.includes('Approved') || t.stage.includes('Received'))) ||
          (selectedStatus === 'Completed' && true)
        ) {
          return { ...t, completed: true }
        }
        return t
      })

      return {
        ...prev,
        returnStatus: selectedStatus,
        timeline: updatedTimeline
      }
    })

    toast.success(`Return status updated to "${selectedStatus}"`)
  }

  // Process refund submit
  const handleConfirmProcessRefund = () => {
    setIsProcessingRefund(true)
    setTimeout(() => {
      setIsProcessingRefund(false)
      setIsProcessRefundModalOpen(false)
      setSelectedRefundStatus('Refunded')
      setSelectedStatus('Completed')
      setReturnItem(prev => ({
        ...prev,
        refundStatus: 'Refunded',
        returnStatus: 'Completed',
        refundAmountSAR: calculatedRefundAmount,
        timeline: prev.timeline.map(t => ({ ...t, completed: true }))
      }))
      toast.success(
        `Refund of SAR ${calculatedRefundAmount.toLocaleString()} successfully processed via ${returnItem.originalPaymentMethod}`
      )
    }, 900)
  }

  // Status Badges
  const getReturnStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case 'Requested':
        return (
          <Badge
            variant='outline'
            className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Requested
          </Badge>
        )
      case 'Under Review':
        return (
          <Badge
            variant='outline'
            className='bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Under Review
          </Badge>
        )
      case 'Approved':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Approved
          </Badge>
        )
      case 'Item Received':
        return (
          <Badge
            variant='outline'
            className='bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Item Received
          </Badge>
        )
      case 'Completed':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Completed
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge
            variant='outline'
            className='bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Rejected
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getRefundStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'Not Started':
        return (
          <Badge variant='outline' className='text-xs text-muted-foreground border-border/80 px-2.5 py-0.5'>
            Not Started
          </Badge>
        )
      case 'Pending':
      case 'Processing':
        return (
          <Badge
            variant='outline'
            className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            {status}
          </Badge>
        )
      case 'Refunded':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Refunded
          </Badge>
        )
      case 'Failed':
        return (
          <Badge
            variant='outline'
            className='bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-xs font-medium px-2.5 py-0.5'
          >
            Failed
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const isB2B = returnItem.channel === 'B2B'

  return (
    <div className='space-y-6 pb-20 max-w-[1400px] mx-auto'>
      {/* Top Breadcrumb & Actions Bar */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5'>
        <div className='space-y-1.5'>
          <nav className='flex items-center gap-1.5 text-xs text-muted-foreground font-medium'>
            <span>Management</span>
            <ChevronRight className='h-3.5 w-3.5 text-muted-foreground/60' />
            <Link
              href='/returns-refunds'
              className='hover:text-foreground transition-colors hover:underline underline-offset-4'
            >
              Returns & Refunds
            </Link>
            <ChevronRight className='h-3.5 w-3.5 text-muted-foreground/60' />
            <span className='text-foreground font-semibold'>{returnItem.id}</span>
          </nav>
          <div className='flex items-center gap-3'>
            <Link href='/returns-refunds'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-lg border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground'
                title='Back to Returns list'
              >
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <h1 className='text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50'>
              Return {returnItem.id}
            </h1>
            <div className='flex items-center gap-2'>
              {getReturnStatusBadge(returnItem.returnStatus)}
              {getRefundStatusBadge(returnItem.refundStatus)}
              <Badge
                variant='outline'
                className={
                  isB2B
                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 text-xs font-medium'
                    : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs font-medium'
                }
              >
                {returnItem.channel}
              </Badge>
            </div>
          </div>
          <p className='text-xs text-muted-foreground'>
            Requested on {returnItem.requestedDate} for Order{' '}
            <span className='font-mono font-medium text-foreground'>{returnItem.orderId}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2 self-start sm:self-auto'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.print()}
            className='h-9 text-xs rounded-lg border-border/80 hover:bg-muted font-medium text-foreground'
          >
            <Printer className='h-3.5 w-3.5 mr-1.5' />
            Print Return Slip
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => toast.success(`Return dossier ${returnItem.id} downloaded.`)}
            className='h-9 text-xs rounded-lg border-border/80 hover:bg-muted font-medium text-foreground'
          >
            <Download className='h-3.5 w-3.5 mr-1.5' />
            Export Dossier
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid Layout: LEFT 65% / RIGHT 35% */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        {/* =========================================================================
            LEFT COLUMN (65% on desktop -> lg:col-span-8)
           ========================================================================= */}
        <div className='lg:col-span-8 space-y-6'>
          {/* Card 1: Return Information */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-4 border-b border-border/40'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-8 w-8 rounded-lg bg-[#6b1d2f]/10 text-[#6b1d2f] dark:text-[#a53b53] flex items-center justify-center'>
                    <RotateCcw className='h-4 w-4' />
                  </div>
                  <div>
                    <CardTitle className='text-base font-semibold text-neutral-900 dark:text-neutral-50'>
                      Return Information
                    </CardTitle>
                    <CardDescription className='text-xs text-muted-foreground'>
                      Customer return justification and core request parameters
                    </CardDescription>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-[11px] text-muted-foreground block'>Channel</span>
                  <span className='text-xs font-semibold text-neutral-900 dark:text-neutral-100'>
                    {isB2B ? 'B2B Wholesale / Institutional' : 'B2C Retail Customer'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-5 space-y-5 text-sm'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Return ID
                  </span>
                  <span className='font-mono font-semibold text-foreground text-sm'>{returnItem.id}</span>
                </div>

                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Order ID
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <span className='font-mono font-semibold text-foreground text-sm'>{returnItem.orderId}</span>
                    <Link
                      href={isB2B ? `/b2b/orders` : `/b2c/orders`}
                      className='text-[#6b1d2f] hover:underline inline-flex items-center'
                      title='Open order'
                    >
                      <ExternalLink className='h-3 w-3 ml-0.5' />
                    </Link>
                  </div>
                </div>

                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Customer / Account
                  </span>
                  <div className='flex items-center gap-1.5 truncate'>
                    {isB2B ? (
                      <Building2 className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                    ) : (
                      <User className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                    )}
                    <span className='font-semibold text-foreground truncate'>{returnItem.customer}</span>
                  </div>
                </div>

                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Return Reason
                  </span>
                  <Badge variant='secondary' className='text-xs font-semibold px-2 py-0.5 bg-neutral-200/60 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'>
                    {returnItem.returnReason}
                  </Badge>
                </div>

                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Units Returned
                  </span>
                  <span className='font-semibold text-foreground text-sm'>{returnItem.quantity} unit(s)</span>
                </div>

                <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Return Courier
                  </span>
                  <span className='font-medium text-foreground text-sm'>
                    {returnItem.courierUsed}
                  </span>
                  <span className='text-[11px] font-mono text-muted-foreground block truncate'>
                    AWB: {returnItem.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Customer Notes */}
              <div className='space-y-2 pt-1'>
                <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Customer Declaration & Notes
                </Label>
                <div className='p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-border/60 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans'>
                  &ldquo;{returnItem.customerNotes}&rdquo;
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Product Information (B2C Jewellery vs B2B Bullion distinction) */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-4 border-b border-border/40'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-8 w-8 rounded-lg bg-[#6b1d2f]/10 text-[#6b1d2f] dark:text-[#a53b53] flex items-center justify-center'>
                    <Package className='h-4 w-4' />
                  </div>
                  <div>
                    <CardTitle className='text-base font-semibold text-neutral-900 dark:text-neutral-50'>
                      Product Information
                    </CardTitle>
                    <CardDescription className='text-xs text-muted-foreground'>
                      Item specifications, gold attributes and vault inspection state
                    </CardDescription>
                  </div>
                </div>
                {isB2B && (
                  <Badge variant='outline' className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-medium'>
                    Institutional Gold Bullion Spec
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='pt-5 space-y-6'>
              {/* Product Overview Row */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                <div className='h-20 w-20 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-border/60 shrink-0 relative'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={returnItem.productImage}
                    alt={returnItem.product}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='flex-1 space-y-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-[11px] text-muted-foreground font-semibold uppercase'>
                      SKU: {returnItem.productSku}
                    </span>
                    <span className='text-[10px] text-muted-foreground'>•</span>
                    <span className='text-xs text-muted-foreground font-medium'>
                      Qty: {returnItem.quantity}
                    </span>
                  </div>
                  <h3 className='text-base font-bold text-neutral-900 dark:text-neutral-50 truncate'>
                    {returnItem.product}
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Original Invoice Price:{' '}
                    <span className='font-semibold text-foreground'>
                      SAR {returnItem.originalProductPriceSAR.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className='text-left sm:text-right shrink-0'>
                  <span className='text-xs text-muted-foreground block'>Item Subtotal</span>
                  <span className='text-lg font-bold text-neutral-900 dark:text-neutral-50'>
                    SAR {returnItem.originalProductPriceSAR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* B2B Returns Specific Details Section */}
              {isB2B && returnItem.b2bDetails ? (
                <div className='space-y-3 pt-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Scale className='h-4 w-4 text-[#6b1d2f]' />
                      <h4 className='text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider'>
                        B2B Bullion & Commercial Verification
                      </h4>
                    </div>
                    <Badge variant='outline' className='text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'>
                      Assay Passed & Verified
                    </Badge>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs'>
                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Business Name
                      </span>
                      <p className='font-semibold text-foreground text-xs truncate' title={returnItem.businessName}>
                        {returnItem.businessName || returnItem.customer}
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Original Weight
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        {returnItem.b2bDetails.weightGrams.toFixed(2)} g ({returnItem.b2bDetails.purity})
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Vault Return Weight
                      </span>
                      <p className='font-semibold text-emerald-700 dark:text-emerald-400 text-xs'>
                        {returnItem.b2bDetails.returnWeightGrams.toFixed(2)} g (Exact Match)
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Purchase Gold Rate
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        SAR {returnItem.b2bDetails.originalGoldRateSAR.toFixed(2)} / g
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Locked Spot Rate
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        SAR {returnItem.b2bDetails.lockedRateSAR.toFixed(2)} / g
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Assay Certification
                      </span>
                      <p className='font-semibold text-foreground text-xs flex items-center gap-1'>
                        <ShieldCheck className='h-3.5 w-3.5 text-emerald-600' />
                        Certified London Good Delivery
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Purchase Quantity
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        {returnItem.quantity} Ingot(s)
                      </p>
                    </div>

                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        B2B Refund Value
                      </span>
                      <p className='font-bold text-[#6b1d2f] dark:text-[#a53b53] text-xs'>
                        SAR {returnItem.originalProductPriceSAR.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* B2C Jewellery Quality Check Section */
                <div className='space-y-3 pt-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Sparkles className='h-4 w-4 text-[#6b1d2f]' />
                      <h4 className='text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider'>
                        B2C Atelier Quality & Authenticity Check
                      </h4>
                    </div>
                    <Badge variant='outline' className='text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'>
                      Tamper Tag Intact
                    </Badge>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs'>
                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Gold Hallmark
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        18 Karat Yellow Gold
                      </p>
                    </div>
                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Diamond Specification
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        0.75ct F / VS1 Solitaire
                      </p>
                    </div>
                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Condition Check
                      </span>
                      <p className='font-semibold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1'>
                        <CheckCircle2 className='h-3.5 w-3.5' />
                        Unworn & Pristine
                      </p>
                    </div>
                    <div className='p-3 rounded-lg border border-border/60 bg-card space-y-1'>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        Packaging Check
                      </span>
                      <p className='font-semibold text-foreground text-xs'>
                        Original Box & Warranty Card
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Delivery Cost Tracking (Crucial requirement: Track return delivery cost separately) */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-4 border-b border-border/40'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-8 w-8 rounded-lg bg-[#6b1d2f]/10 text-[#6b1d2f] dark:text-[#a53b53] flex items-center justify-center'>
                    <Truck className='h-4 w-4' />
                  </div>
                  <div>
                    <CardTitle className='text-base font-semibold text-neutral-900 dark:text-neutral-50'>
                      Return Delivery Cost Accounting
                    </CardTitle>
                    <CardDescription className='text-xs text-muted-foreground'>
                      Separate tracking of courier charges and VenVision subsidized return delivery expenses
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant='outline'
                  className={
                    returnItem.venvisionReturnExpenseSAR > 0
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 text-xs'
                  }
                >
                  {returnItem.venvisionReturnExpenseSAR > 0
                    ? 'Subsidized by VenVision'
                    : 'Customer Paid Return Fee'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-5 space-y-4'>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs'>
                <div className='p-3.5 rounded-lg border border-border/60 bg-neutral-50/70 dark:bg-neutral-900/50 space-y-1'>
                  <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Original Delivery Cost
                  </span>
                  <span className='text-base font-bold text-foreground'>
                    SAR 25
                  </span>
                  <span className='text-[10px] text-muted-foreground block'>
                    Outbound shipment
                  </span>
                </div>

                <div className='p-3.5 rounded-lg border border-border/60 bg-neutral-50/70 dark:bg-neutral-900/50 space-y-1'>
                  <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Return Pickup Cost
                  </span>
                  <span className='text-base font-bold text-foreground'>
                    SAR {returnItem.returnDeliveryCostSAR}
                  </span>
                  <span className='text-[10px] text-muted-foreground block'>
                    Billed by {returnItem.courierUsed}
                  </span>
                </div>

                <div className='p-3.5 rounded-lg border border-border/60 bg-neutral-50/70 dark:bg-neutral-900/50 space-y-1'>
                  <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Customer Return Fee
                  </span>
                  <span className='text-base font-bold text-foreground'>
                    SAR {returnFee}
                  </span>
                  <span className='text-[10px] text-muted-foreground block'>
                    Deducted from refund
                  </span>
                </div>

                <div className='p-3.5 rounded-lg border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 space-y-1'>
                  <span className='text-[10px] font-medium text-amber-800 dark:text-amber-400 uppercase tracking-wider block'>
                    VenVision Return Expense
                  </span>
                  <span className='text-base font-bold text-amber-900 dark:text-amber-300'>
                    SAR {returnItem.venvisionReturnExpenseSAR}
                  </span>
                  <span className='text-[10px] text-amber-700/80 dark:text-amber-400/80 block'>
                    Direct company absorption
                  </span>
                </div>
              </div>

              {/* Informative subsidy banner */}
              <div className='p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-2.5'>
                <HelpCircle className='h-4 w-4 text-muted-foreground shrink-0' />
                <span>
                  {returnFee === 0 ? (
                    <>
                      <strong>Free Customer Return Policy:</strong> Customer was not charged for return pickup. VenVision absorbs the courier pickup charge of <strong>SAR {returnItem.returnDeliveryCostSAR}</strong> via operational logistics expense.
                    </>
                  ) : (
                    <>
                      <strong>Standard Return Delivery Policy:</strong> A courier return fee of <strong>SAR {returnFee}</strong> is deducted from the customer&apos;s product refund balance.
                    </>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Return Timeline */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-4 border-b border-border/40'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-lg bg-[#6b1d2f]/10 text-[#6b1d2f] dark:text-[#a53b53] flex items-center justify-center'>
                  <Clock className='h-4 w-4' />
                </div>
                <div>
                  <CardTitle className='text-base font-semibold text-neutral-900 dark:text-neutral-50'>
                    Return Lifecycle Timeline
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Sequential audit trail from customer request to final gateway settlement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/70'>
                {returnItem.timeline.map((step, idx) => (
                  <div key={idx} className='relative flex items-start gap-4'>
                    <div
                      className={`absolute -left-6 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                        step.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : step.current
                          ? 'bg-[#6b1d2f] border-[#6b1d2f] text-white ring-4 ring-[#6b1d2f]/10'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                    >
                      {step.completed ? <Check className='h-3 w-3 stroke-[2.5]' /> : idx + 1}
                    </div>
                    <div className='space-y-0.5 flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <h4
                          className={`text-xs font-semibold ${
                            step.completed || step.current
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.stage}
                        </h4>
                        <span className='text-[11px] text-muted-foreground'>{step.date}</span>
                      </div>
                      <p className='text-[11px] text-muted-foreground'>
                        {step.completed
                          ? 'Milestone completed and verified in audit log.'
                          : step.current
                          ? 'Current operational bottleneck awaiting action.'
                          : 'Pending previous milestone fulfillment.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (35% on desktop -> lg:col-span-4)
           ========================================================================= */}
        <div className='lg:col-span-4 space-y-6'>
          {/* Card 1: Return Status Manager */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-3.5 border-b border-border/40'>
              <CardTitle className='text-sm font-semibold text-neutral-900 dark:text-neutral-50'>
                Return Status
              </CardTitle>
              <CardDescription className='text-xs text-muted-foreground'>
                Update the physical item inspection and authorization stage
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4 space-y-4'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-medium text-foreground'>Current Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(val: ReturnStatus) => setSelectedStatus(val)}
                >
                  <SelectTrigger className='w-full h-9 rounded-lg border-border/80 text-xs font-medium'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Requested' className='text-xs'>Requested</SelectItem>
                    <SelectItem value='Under Review' className='text-xs'>Under Review</SelectItem>
                    <SelectItem value='Approved' className='text-xs'>Approved</SelectItem>
                    <SelectItem value='Rejected' className='text-xs'>Rejected</SelectItem>
                    <SelectItem value='Item Received' className='text-xs'>Item Received</SelectItem>
                    <SelectItem value='Completed' className='text-xs'>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateStatus}
                className='w-full h-9 text-xs rounded-lg font-medium bg-[#6b1d2f] hover:bg-[#581827] text-white shadow-xs'
              >
                Update Status
              </Button>

              {/* Quick shortcut pills */}
              <div className='pt-1 flex flex-wrap gap-1.5'>
                {returnItem.returnStatus !== 'Approved' && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setSelectedStatus('Approved')
                      setReturnItem(prev => ({ ...prev, returnStatus: 'Approved' }))
                      toast.success(`Marked as Approved`)
                    }}
                    className='h-7 text-[11px] px-2 rounded-md border-border/80 text-foreground'
                  >
                    Quick Approve
                  </Button>
                )}
                {returnItem.returnStatus !== 'Item Received' && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setSelectedStatus('Item Received')
                      setReturnItem(prev => ({ ...prev, returnStatus: 'Item Received' }))
                      toast.success(`Marked as Item Received at Vault`)
                    }}
                    className='h-7 text-[11px] px-2 rounded-md border-border/80 text-foreground'
                  >
                    Mark Received
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Refund Summary (Refund Calculation) */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-3.5 border-b border-border/40'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-semibold text-neutral-900 dark:text-neutral-50'>
                  Refund Summary
                </CardTitle>
                <Badge variant='outline' className='text-[10px] font-mono'>
                  SAR Settlement
                </Badge>
              </div>
              <CardDescription className='text-xs text-muted-foreground'>
                Refund Amount = Product + Delivery Fee − Return Fee − Restocking
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4 space-y-3.5 text-xs'>
              {/* Line items */}
              <div className='space-y-2.5'>
                <div className='flex items-center justify-between text-muted-foreground'>
                  <span>Original Product Price</span>
                  <span className='font-medium text-foreground font-mono'>
                    SAR {returnItem.originalProductPriceSAR.toLocaleString()}
                  </span>
                </div>

                <div className='flex items-center justify-between text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <span>Delivery Fee Refund</span>
                    <span className='text-[10px] text-muted-foreground'>(+)</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-foreground font-mono'>SAR</span>
                    <Input
                      type='number'
                      value={shippingRefund}
                      onChange={e => setShippingRefund(Number(e.target.value) || 0)}
                      className='h-7 w-16 text-right px-1.5 text-xs font-mono rounded-md border-border/80'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <span>Return Delivery Cost</span>
                    <span className='text-[10px] text-rose-600 dark:text-rose-400 font-semibold'>(−)</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-foreground font-mono'>SAR</span>
                    <Input
                      type='number'
                      value={returnFee}
                      onChange={e => setReturnFee(Number(e.target.value) || 0)}
                      className='h-7 w-16 text-right px-1.5 text-xs font-mono rounded-md border-border/80'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <span>Restocking Fee</span>
                    <span className='text-[10px] text-rose-600 dark:text-rose-400 font-semibold'>(−)</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-foreground font-mono'>SAR</span>
                    <Input
                      type='number'
                      value={restockingFee}
                      onChange={e => setRestockingFee(Number(e.target.value) || 0)}
                      className='h-7 w-16 text-right px-1.5 text-xs font-mono rounded-md border-border/80'
                    />
                  </div>
                </div>
              </div>

              <Separator className='my-2' />

              {/* Total Refund Amount */}
              <div className='p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-border/60 flex items-center justify-between'>
                <div>
                  <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider block'>
                    Total Refund Due
                  </span>
                  <span className='text-[10px] text-muted-foreground'>
                    Net customer credit
                  </span>
                </div>
                <div className='text-right'>
                  <span className='text-xl font-bold font-mono text-[#6b1d2f] dark:text-[#a53b53] block'>
                    SAR {calculatedRefundAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Refund Method & Processing */}
          <Card className='rounded-xl border-border/70 bg-card shadow-xs'>
            <CardHeader className='pb-3.5 border-b border-border/40'>
              <CardTitle className='text-sm font-semibold text-neutral-900 dark:text-neutral-50'>
                Refund Method
              </CardTitle>
              <CardDescription className='text-xs text-muted-foreground'>
                Payment gateway gateway integration and settlement execution
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4 space-y-4 text-xs'>
              <div className='space-y-1 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border/50'>
                <span className='text-[10px] text-muted-foreground uppercase font-medium block'>
                  Original Payment Method
                </span>
                <div className='flex items-center gap-2 text-foreground font-semibold text-xs pt-0.5'>
                  <CreditCard className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                  <span>{returnItem.originalPaymentMethod}</span>
                </div>
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-medium text-foreground'>Refund Status</span>
                  {getRefundStatusBadge(returnItem.refundStatus)}
                </div>
                <Select
                  value={selectedRefundStatus}
                  onValueChange={(val: RefundStatus) => {
                    setSelectedRefundStatus(val)
                    setReturnItem(prev => ({ ...prev, refundStatus: val }))
                    toast.success(`Refund status changed to ${val}`)
                  }}
                >
                  <SelectTrigger className='w-full h-8 rounded-lg border-border/80 text-xs font-medium'>
                    <SelectValue placeholder='Select refund status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Not Started' className='text-xs'>Not Started</SelectItem>
                    <SelectItem value='Pending' className='text-xs'>Pending</SelectItem>
                    <SelectItem value='Processing' className='text-xs'>Processing</SelectItem>
                    <SelectItem value='Refunded' className='text-xs'>Refunded</SelectItem>
                    <SelectItem value='Failed' className='text-xs'>Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {returnItem.refundStatus === 'Refunded' ? (
                <div className='p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 space-y-1'>
                  <div className='flex items-center gap-1.5 font-semibold text-xs'>
                    <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                    <span>Refund Successfully Disbursed</span>
                  </div>
                  <p className='text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-normal'>
                    Settled to original payment instrument on {returnItem.requestedDate}. ARN: 829103859201.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => setIsProcessRefundModalOpen(true)}
                  disabled={isProcessingRefund || returnItem.returnStatus === 'Rejected'}
                  className='w-full h-9 text-xs rounded-lg font-medium bg-[#6b1d2f] hover:bg-[#581827] text-white shadow-xs'
                >
                  <Receipt className='h-3.5 w-3.5 mr-1.5' />
                  Process Refund (SAR {calculatedRefundAmount.toLocaleString()})
                </Button>
              )}

              {returnItem.returnStatus === 'Rejected' && (
                <p className='text-[11px] text-rose-600 dark:text-rose-400 text-center font-medium'>
                  Cannot disburse refund for rejected returns.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Process Refund */}
      <Dialog open={isProcessRefundModalOpen} onOpenChange={setIsProcessRefundModalOpen}>
        <DialogContent className='sm:max-w-[440px] rounded-xl'>
          <DialogHeader>
            <DialogTitle className='text-base font-bold text-neutral-900 dark:text-neutral-50'>
              Authorize Refund Disbursement
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground'>
              You are about to disburse funds to the customer&apos;s original payment instrument.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-2 text-xs'>
            <div className='p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-border/70 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Return ID:</span>
                <span className='font-mono font-semibold'>{returnItem.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Customer:</span>
                <span className='font-semibold'>{returnItem.customer}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Destination:</span>
                <span className='font-medium'>{returnItem.originalPaymentMethod}</span>
              </div>
              <Separator />
              <div className='flex justify-between items-center text-sm pt-1'>
                <span className='font-semibold'>Net Refund Amount:</span>
                <span className='font-bold font-mono text-[#6b1d2f] text-base'>
                  SAR {calculatedRefundAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className='p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2'>
              <AlertTriangle className='h-4 w-4 shrink-0 mt-0.5 text-amber-600' />
              <span>
                This will trigger an irreversible reversal through the Saudi payment gateway. Please ensure warehouse has verified physical return authenticity.
              </span>
            </div>
          </div>

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsProcessRefundModalOpen(false)}
              className='h-8 text-xs rounded-lg'
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleConfirmProcessRefund}
              disabled={isProcessingRefund}
              className='h-8 text-xs rounded-lg bg-[#6b1d2f] hover:bg-[#581827] text-white font-medium'
            >
              {isProcessingRefund ? 'Connecting Gateway...' : 'Authorize Disbursement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
