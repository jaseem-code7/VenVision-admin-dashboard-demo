'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Printer,
  FileText,
  Truck,
  ShieldCheck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Boxes,
  Coins,
  Scale,
  Lock,
  SlidersHorizontal,
  Ban,
  Check,
  X
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { initialB2BOrders, type B2BOrder } from '@/data/venvision-data'

export default function B2BOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string

  const [order, setOrder] = useState<B2BOrder>(
    initialB2BOrders.find(o => o.id === orderId) || initialB2BOrders[0]
  )
  const [currentStatus, setCurrentStatus] = useState<string>(order.fulfillmentStatus)
  const [counterInput, setCounterInput] = useState<string>(
    order.counterOfferSAR ? String(order.counterOfferSAR) : ''
  )

  const isFixed = order.pricingType === 'Fixed Rate'

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    toast.success(`Wholesale Order ${order.orderNumber} updated to ${newStatus}`)
  }

  const handleAcceptOffer = () => {
    const agreedPrice = order.customerOfferSAR || order.items[0]?.ratePerUnitSAR || 0
    const updatedTotal = agreedPrice * order.totalUnits
    setOrder(prev => ({
      ...prev,
      negotiationStatus: 'Offer Accepted',
      totalAmountSAR: updatedTotal
    }))
    toast.success('Customer offer accepted and trade terms updated.')
  }

  const handleSendCounter = () => {
    const val = parseFloat(counterInput)
    if (!val || val <= 0) {
      toast.error('Please enter a valid counter-offer in SAR.')
      return
    }
    const updatedTotal = val * order.totalUnits
    setOrder(prev => ({
      ...prev,
      counterOfferSAR: val,
      negotiationStatus: 'Counter-Offered',
      totalAmountSAR: updatedTotal
    }))
    toast.success(`Counter-offer of SAR ${val.toLocaleString()}/unit sent to buyer.`)
  }

  const handleDeclineOffer = () => {
    setOrder(prev => ({
      ...prev,
      negotiationStatus: 'Offer Declined',
      status: 'Cancelled',
      fulfillmentStatus: 'Cancelled'
    }))
    setCurrentStatus('Cancelled')
    toast.info('Customer offer declined. Order cancelled.')
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2b/dashboard" className="hover:text-foreground transition-colors">
              B2B
            </Link>
            <span>&gt;</span>
            <Link href="/b2b/orders" className="hover:text-foreground transition-colors">
              Orders
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{order.orderNumber}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Wholesale Order {order.orderNumber}
            </h1>

            {/* Pricing Type Badge */}
            {isFixed ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-md">
                <Lock className="size-3" />
                <span>Fixed Rate</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 rounded-md">
                <SlidersHorizontal className="size-3" />
                <span>Negotiation</span>
              </span>
            )}

            <Badge
              className={`text-xs px-2.5 py-0.5 rounded-md ${
                currentStatus === 'Delivered'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : currentStatus === 'Cancelled'
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
              }`}
            >
              {currentStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Institutional trade executed on {order.date} &bull; Buyer: {order.businessName} (CR: {order.crNumber})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/b2b/orders')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Orders</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Printing Official ZATCA Commercial Invoice...')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <Printer className="size-3.5" />
            <span>Print Tax Invoice</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 65% (8 of 12) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Bullion Allocation Card */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">
                Bullion &amp; Wholesale Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-background border border-border flex items-center justify-center">
                      <Boxes className="size-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {order.items[0]?.productName || 'Wholesale Gold Bullion'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Batch Fineness: 999.9 &bull; SKU: {order.items[0]?.sku}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-base text-foreground">
                      {order.totalUnits.toLocaleString()} {order.unitType}
                    </div>
                    <span className="text-xs text-muted-foreground">Vault Allocated</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Spot Benchmark:</span>
                    <span className="font-mono font-medium text-foreground">SAR 268.45/g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Rate Mechanism:</span>
                    <span className="font-medium text-foreground">
                      {isFixed ? `Fixed Rate (${order.rateLockRef || 'Pre-locked'})` : 'Bargaining / Negotiation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Minting Premium:</span>
                    <span className="font-mono font-medium text-foreground">SAR 1,250.00</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Assay Seal:</span>
                    <span className="font-mono font-medium text-emerald-600">Included</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PRICING & NEGOTIATION WORKFLOW CARD */}
          {isFixed ? (
            /* FIXED RATE NOTICE CARD */
            <Card className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Fixed Rate Lock Agreement</h3>
                </div>
                <Badge variant="outline" className="text-[11px] text-muted-foreground border-border/80 flex items-center gap-1">
                  <Ban className="size-3 text-muted-foreground/70" />
                  <span>Negotiation Not Available</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This order was booked and bound under a guaranteed bullion spot rate of{' '}
                <strong className="text-foreground font-mono">
                  SAR {order.fixedRateSAR?.toLocaleString()}
                </strong>{' '}
                (Reference: <span className="font-mono text-primary font-medium">{order.rateLockRef}</span>).
                Under institutional compliance rules, fixed rate executions cannot be bargained, discounted, or renegotiated after commitment.
              </p>
            </Card>
          ) : (
            /* NEGOTIATION WORKFLOW CARD */
            <Card className="rounded-xl border border-sky-500/30 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-sky-400" />
                  <h3 className="font-semibold text-sm text-foreground">B2B Quotation &amp; Bargaining Workflow</h3>
                </div>
                <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[11px]">
                  {order.negotiationStatus || 'Offer Pending Review'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Catalog Quotation</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    SAR {order.quotationPriceSAR?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">List unit price</span>
                </div>
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-3 space-y-1">
                  <span className="text-sky-400 block text-[11px] font-medium">Customer Proposed Offer</span>
                  <span className="font-mono font-bold text-sm text-sky-400">
                    SAR {order.customerOfferSAR?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Submitted by buyer</span>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-1">
                  <span className="text-primary block text-[11px] font-medium">Admin Counter-Offer</span>
                  <span className="font-mono font-bold text-sm text-primary">
                    {order.counterOfferSAR ? `SAR ${order.counterOfferSAR.toLocaleString()}` : 'None proposed yet'}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Revised quote</span>
                </div>
              </div>

              {/* Negotiation Actions */}
              <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="number"
                    placeholder="Enter counter-offer (SAR)"
                    value={counterInput}
                    onChange={e => setCounterInput(e.target.value)}
                    className="h-8 text-xs font-mono w-44 rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSendCounter}
                    className="h-8 px-3 text-xs rounded-lg bg-primary text-primary-foreground font-medium"
                  >
                    Submit Counter
                  </Button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeclineOffer}
                    className="h-8 text-xs rounded-lg text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <X className="size-3 mr-1" />
                    Decline
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAcceptOffer}
                    className="h-8 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    <Check className="size-3 mr-1" />
                    Accept Offer
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Wholesale Order Timeline */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Trade &amp; Logistics Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                <div className="relative">
                  <span className="absolute -left-6 top-1 size-4 rounded-full bg-emerald-600 ring-4 ring-background" />
                  <div className="text-xs font-semibold text-foreground">B2B Trade Booked &amp; Terms Confirmed</div>
                  <div className="text-[11px] text-muted-foreground">{order.date} &bull; SAMA/SARIE Direct Transfer Validated</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 size-4 rounded-full bg-emerald-600 ring-4 ring-background" />
                  <div className="text-xs font-semibold text-foreground">Vault Pull &amp; Dual-Custodian Assay Scan</div>
                  <div className="text-[11px] text-muted-foreground">Vault A-12 &bull; Serial list logged in ZATCA clearance</div>
                </div>
                <div className="relative">
                  <span className={`absolute -left-6 top-1 size-4 rounded-full ring-4 ring-background ${
                    currentStatus === 'Delivered' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`} />
                  <div className="text-xs font-semibold text-foreground">Armoured Transport Escort Initiated</div>
                  <div className="text-[11px] text-muted-foreground">Security Manifest #{order.trackingNumber} &bull; Destination: {order.shippingCity}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 35% (4 of 12) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status Update */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Update Dispatch Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10 text-xs rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Preparing Dispatch">Preparing Dispatch</SelectItem>
                  <SelectItem value="In Transit">In Transit (Armoured)</SelectItem>
                  <SelectItem value="Delivered">Delivered (Vault Accepted)</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => handleStatusChange(currentStatus)}
                className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                Confirm Dispatch Status
              </Button>
            </CardContent>
          </Card>

          {/* Business & Buyer Info */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Institutional Buyer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4 text-xs">
              <div className="font-semibold text-sm text-foreground">{order.businessName}</div>
              <div className="flex justify-between text-muted-foreground">
                <span>Authorized Buyer:</span>
                <span className="font-medium text-foreground">{order.buyerName}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Commercial Reg (CR):</span>
                <span className="font-mono text-foreground">{order.crNumber}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>ZATCA VAT ID:</span>
                <span className="font-mono text-foreground">{order.vatNumber}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Vault Destination:</span>
                <span className="font-medium text-foreground">{order.shippingCity}, KSA</span>
              </div>
            </CardContent>
          </Card>

          {/* Wholesale Financial Summary */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Wholesale Trade Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Allocation Subtotal:</span>
                <span className="font-mono text-foreground">SAR {(order.totalAmountSAR - 1250).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fabrication &amp; Assay:</span>
                <span className="font-mono text-foreground">SAR 1,250.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (Investment Exemption):</span>
                <span className="font-mono text-emerald-600">0% (Exempt)</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-1">
                <span className="font-bold text-sm text-foreground">Final Order Value:</span>
                <span className="font-mono font-bold text-base text-primary">
                  SAR {order.totalAmountSAR.toLocaleString('en-US')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
