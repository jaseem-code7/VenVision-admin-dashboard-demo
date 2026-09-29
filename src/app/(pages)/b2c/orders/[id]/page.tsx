'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
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
  Package,
  AlertCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { initialB2COrders } from '@/data/venvision-data'

export default function B2COrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string

  // Look up order or fallback to first order
  const order = initialB2COrders.find(o => o.id === orderId) || initialB2COrders[0]
  const [currentStatus, setCurrentStatus] = useState<string>(order.fulfillmentStatus)

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    toast.success(`Order ${order.orderNumber} updated to ${newStatus}`)
  }

  // Calculation breakdown
  const subtotal = order.totalAmountSAR / 1.15
  const vat = order.totalAmountSAR - subtotal
  const shippingFee = 0 // Free insured delivery over 5,000 SAR

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2c/dashboard" className="hover:text-foreground transition-colors">
              B2C
            </Link>
            <span>&gt;</span>
            <Link href="/b2c/orders" className="hover:text-foreground transition-colors">
              Orders
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{order.orderNumber}</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Order {order.orderNumber}
            </h1>
            <Badge
              className={`text-xs px-2.5 py-0.5 rounded-md ${
                currentStatus === 'Delivered'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}
            >
              {currentStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on {order.date} &bull; Paid via {order.paymentMethod.replace('Moyasar ', '')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/b2c/orders')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Orders</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Printing commercial invoice...')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <Printer className="size-3.5" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>

      {/* 2-Column Layout (LEFT 65% / RIGHT 35%) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT 65% (8 of 12 columns) */}
        <div className="space-y-6 lg:col-span-8">
          {/* 1. Products Purchased Card */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Products Purchased ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-border/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="size-14 rounded-lg bg-muted/40 border border-border/80 flex items-center justify-center shrink-0">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{item.productName}</div>
                        <div className="text-xs font-mono text-muted-foreground mt-0.5">
                          SKU: {item.sku} &bull; 18K Hallmarked
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Quantity: {item.quantity} &times; SAR {item.priceSAR.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-sm text-foreground">
                        SAR {(item.priceSAR * item.quantity).toLocaleString()}
                      </div>
                      <span className="text-[11px] text-muted-foreground">Includes 15% VAT</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Order Timeline Card */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Order Timeline</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Courier and vault fulfillment progression.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 size-4 rounded-full bg-emerald-600 ring-4 ring-background" />
                  <div className="text-xs font-semibold text-foreground">Order Placed &amp; Payment Cleared</div>
                  <div className="text-[11px] text-muted-foreground">{order.date} at 10:15 AM &bull; Moyasar Mada Authorization</div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 size-4 rounded-full bg-emerald-600 ring-4 ring-background" />
                  <div className="text-xs font-semibold text-foreground">Assay Verification &amp; Security Packaging</div>
                  <div className="text-[11px] text-muted-foreground">{order.date} at 02:40 PM &bull; Tamper seal #TS-884920 applied</div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className={`absolute -left-6 top-1 size-4 rounded-full ring-4 ring-background ${
                    currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'bg-emerald-600' : 'bg-muted-foreground/40'
                  }`} />
                  <div className="text-xs font-semibold text-foreground">Handed to Secure Armoured Courier ({order.courier})</div>
                  <div className="text-[11px] text-muted-foreground">Waybill #{order.trackingNumber} &bull; GPS Tracked Van</div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className={`absolute -left-6 top-1 size-4 rounded-full ring-4 ring-background ${
                    currentStatus === 'Delivered' ? 'bg-emerald-600' : 'bg-muted-foreground/40'
                  }`} />
                  <div className="text-xs font-semibold text-foreground">Delivered &amp; OTP Confirmed</div>
                  <div className="text-[11px] text-muted-foreground">Recipient identity verified via OTP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Customer Notes */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Customer Notes &amp; Gift Request</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p className="rounded-lg bg-muted/30 p-3 border border-border/60 text-foreground">
                &ldquo;Please package in luxury velvet presentation box with gold ribbon. It is an anniversary gift.&rdquo;
              </p>
              <div className="text-[11px] text-muted-foreground">Complimentary gift wrapping applied by fulfillment team.</div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT 35% (4 of 12 columns) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Update Status Card */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10 text-xs rounded-lg">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => handleStatusChange(currentStatus)}
                className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                Save Status Change
              </Button>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-foreground">Customer</CardTitle>
                {order.nafathVerified && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5">
                    <ShieldCheck className="size-3 mr-1" />
                    Nafath Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="font-semibold text-sm text-foreground">{order.customerName}</div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono">
                <Phone className="size-3.5" />
                <span>{order.customerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-foreground mt-0.5" />
                <span className="text-foreground leading-relaxed">{order.shippingAddress}</span>
              </div>
              <div className="border-t border-border/40 pt-2 flex justify-between text-muted-foreground">
                <span>Courier:</span>
                <span className="font-medium text-foreground">{order.courier}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tracking:</span>
                <span className="font-mono text-foreground">{order.trackingNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Gateway:</span>
                <span className="font-medium text-foreground">Moyasar Financial</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Method:</span>
                <span className="font-medium text-foreground">{order.paymentMethod.replace('Moyasar ', '')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Transaction Status:</span>
                <span className="font-medium text-emerald-600">{order.paymentStatus}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal (Excl. VAT):</span>
                <span className="font-mono text-foreground">SAR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (15% ZATCA):</span>
                <span className="font-mono text-foreground">SAR {vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Armoured Delivery:</span>
                <span className="font-mono text-emerald-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-1">
                <span className="font-bold text-sm text-foreground">Total:</span>
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
