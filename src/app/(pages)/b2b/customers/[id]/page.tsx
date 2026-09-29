'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  AlertCircle,
  HelpCircle,
  Store,
  UserCheck,
  Tag
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { initialB2BBuyers, initialB2BOrders, type B2BBuyer } from '@/data/venvision-data'

export default function B2BCustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params?.id as string

  const initialCust = initialB2BBuyers.find(c => c.id === customerId) || initialB2BBuyers[0]
  const [customer, setCustomer] = useState<B2BBuyer>(initialCust)
  const [purchaseFrequency, setPurchaseFrequency] = useState<string>(customer.purchaseFrequency || 'Monthly Buyer')
  const orders = initialB2BOrders.filter(o => o.businessName.includes(customer.companyName) || o.crNumber === customer.crNumber)

  const handleApprove = () => {
    setCustomer(prev => ({
      ...prev,
      status: 'Approved',
      approvalDate: 'Today (28 Sep 2026)'
    }))
    toast.success(`${customer.companyName} has been approved for wholesale B2B access.`)
  }

  const handleReject = () => {
    setCustomer(prev => ({
      ...prev,
      status: 'Rejected'
    }))
    toast.error(`${customer.companyName} wholesale application was rejected.`)
  }

  const handleFrequencyChange = (val: string) => {
    setPurchaseFrequency(val)
    toast.info(`Purchase frequency updated to ${val}. (Configurable rule — TBD: Client Confirmation Required)`)
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
            <Link href="/b2b/customers" className="hover:text-foreground transition-colors">
              Customers
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{customer.companyName}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {customer.companyName}
            </h1>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5">
              {customer.tier}
            </Badge>

            {/* Account Status Badge */}
            {customer.status === 'Approved' && (
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Approved Wholesale
              </Badge>
            )}
            {customer.status === 'Pending Review' && (
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 flex items-center gap-1">
                <Clock className="size-3" />
                Pending Review
              </Badge>
            )}
            {customer.status === 'Rejected' && (
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 flex items-center gap-1">
                <XCircle className="size-3" />
                Rejected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            CR: <span className="font-mono text-foreground">{customer.crNumber}</span> &bull; ZATCA VAT: <span className="font-mono text-foreground">{customer.vatNumber}</span> &bull; Registered: {customer.registrationDate || '12 Jan 2026'}
            {customer.approvalDate && ` • Approved: ${customer.approvalDate}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/b2b/customers')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Accounts</span>
          </Button>

          {/* Admin Application Approval Actions */}
          {customer.status === 'Pending Review' ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="h-9 px-3 text-xs font-medium rounded-xl border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                Reject Application
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleApprove}
                className="h-9 px-4 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve Wholesale Access
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => toast.success('Credit limit & trade line adjustment')}
              className="h-9 px-4 text-xs font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Manage Trade Line
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards: Purchase Information Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">{customer.totalOrders}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Wholesale transactions</p>
        </Card>
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Total Purchase Value</div>
          <div className="text-2xl font-bold font-mono text-primary mt-1">
            SAR {customer.totalSpendSAR.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Cumulative trade volume</p>
        </Card>
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Average Order Value (AOV)</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            SAR {(customer.averageOrderValueSAR || (customer.totalOrders > 0 ? customer.totalSpendSAR / customer.totalOrders : 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Per wholesale procurement</p>
        </Card>
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Last Purchase Date</div>
          <div className="text-xl font-bold font-mono text-foreground mt-1">
            {customer.lastPurchaseDate || (orders.length > 0 ? orders[0].date : 'No orders yet')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Latest invoice settlement</p>
        </Card>
      </div>

      {/* 2-Column Content */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Orders, Products & Frequency (7 of 12) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Purchase Frequency & Classification Card */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Purchase Frequency & Customer Type</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Purchasing rhythm and customer categorization
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30">
                  TBD — Client Confirmation Required
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                <div>
                  <div className="font-semibold text-foreground">Current Classification:</div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Configurable rule (Calculation & manual selection rule pending confirmation)
                  </p>
                </div>
                <div className="w-48">
                  <Select value={purchaseFrequency} onValueChange={handleFrequencyChange}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekly Buyer">Weekly Buyer</SelectItem>
                      <SelectItem value="Monthly Buyer">Monthly Buyer</SelectItem>
                      <SelectItem value="Occasional Buyer">Occasional Buyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Frequently Purchased Products & Categories */}
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div className="p-3 rounded-lg border border-border/60 bg-card">
                  <div className="font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" />
                    Frequent Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(customer.frequentlyPurchasedCategories || ['21K Saudi Gold', '24K Raw Kilobars']).map((cat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[11px]">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-card">
                  <div className="font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Boxes className="size-3.5 text-primary" />
                    Frequent Products
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(customer.frequentlyPurchasedProducts || ['1000g Bullion Bar 999.9', '18K Diamond Tennis Mountings']).map((prod, idx) => (
                      <Badge key={idx} variant="outline" className="text-[11px]">
                        {prod}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders History */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Recent Wholesale Orders</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20 border-b border-border/80">
                  <TableRow className="hover:bg-transparent border-b border-border/80">
                    <TableHead className="text-xs font-semibold py-3 pl-4">Order ID</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Date</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Allocation</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Amount</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Status</TableHead>
                    <TableHead className="text-xs font-semibold py-3 pr-4 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                        No previous wholesale orders recorded for this account.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map(order => (
                      <TableRow key={order.id} className="hover:bg-muted/20 border-b border-border/50 text-xs">
                        <TableCell className="py-2.5 pl-4 font-mono font-bold text-primary">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="py-2.5 font-mono">{order.totalUnits} {order.unitType}</TableCell>
                        <TableCell className="py-2.5 font-mono font-semibold">
                          SAR {order.totalAmountSAR.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5">
                            {order.fulfillmentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 pr-4 text-right">
                          <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2">
                            <Link href={`/b2b/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Right Column: Business Profile & Verification Documents (5 of 12) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Business & Owner Profile */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                {customer.logoUrl && (
                  <img
                    src={customer.logoUrl}
                    alt={customer.companyName}
                    className="size-12 rounded-lg object-cover border border-border"
                  />
                )}
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Business Profile</CardTitle>
                  <CardDescription className="text-xs">
                    {customer.businessType || 'Licensed Jewellery Merchant'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Business Name:</span>
                <span className="font-semibold text-foreground text-right">{customer.companyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Business Type:</span>
                <span className="text-foreground">{customer.businessType || 'Retail Jewellery Store'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Commercial Reg. (CR):</span>
                <span className="font-mono font-medium text-foreground">{customer.crNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Business Licence:</span>
                <span className="font-mono text-foreground">{customer.licenceNumber || 'MOC-SA-882104'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">VAT Registration:</span>
                <span className="font-mono text-foreground">{customer.vatNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Business Email:</span>
                <span className="text-foreground">{customer.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Business Mobile:</span>
                <span className="font-mono text-foreground">{customer.phone}</span>
              </div>
              {customer.website && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Website:</span>
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {customer.website.replace('https://', '')}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
              <div className="py-1 border-b border-border/40 space-y-1">
                <span className="text-muted-foreground block">National Address:</span>
                <span className="text-foreground block font-mono text-[11px]">
                  {customer.nationalAddress || 'Bldg 3492, King Fahd Road, Al Olaya Dist, Riyadh 12214, Saudi Arabia'}
                </span>
              </div>
              <div className="py-1 border-b border-border/40 space-y-1">
                <span className="text-muted-foreground block">Shop / Business Address:</span>
                <span className="text-foreground block">
                  {customer.businessAddress || `${customer.city}, Kingdom of Saudi Arabia`}
                </span>
              </div>

              {/* Owner Information */}
              <div className="pt-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5 mb-2">
                  <UserCheck className="size-3.5 text-primary" />
                  Owner Information
                </div>
                <div className="space-y-1.5 pl-2 border-l-2 border-primary/40">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner Name:</span>
                    <span className="font-medium text-foreground">{customer.ownerName || customer.contactPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner Email:</span>
                    <span className="text-foreground">{customer.ownerEmail || customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner Mobile:</span>
                    <span className="font-mono text-foreground">{customer.ownerMobile || customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner National ID:</span>
                    <span className="font-mono text-foreground">{customer.ownerIdNumber || '1098234812'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Verification Documents */}
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                <CardTitle className="text-base font-semibold text-foreground">Uploaded Verification Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Commercial Registration (CR)</div>
                    <div className="text-[10px] text-muted-foreground font-mono">cr_{customer.crNumber}.pdf</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.info('Previewing CR document')}
                  >
                    <Eye className="size-3.5 mr-1" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.success('Downloading verified document')}
                  >
                    <Download className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Municipal Business Licence</div>
                    <div className="text-[10px] text-muted-foreground font-mono">licence_{customer.licenceNumber || '882104'}.pdf</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.info('Previewing licence document')}
                  >
                    <Eye className="size-3.5 mr-1" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.success('Downloading verified document')}
                  >
                    <Download className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">ZATCA VAT Certificate</div>
                    <div className="text-[10px] text-muted-foreground font-mono">vat_{customer.vatNumber}.pdf</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.info('Previewing VAT certificate')}
                  >
                    <Eye className="size-3.5 mr-1" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.success('Downloading verified document')}
                  >
                    <Download className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Owner National ID Document</div>
                    <div className="text-[10px] text-muted-foreground font-mono">owner_id_verified.pdf</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.info('Previewing Owner ID document')}
                  >
                    <Eye className="size-3.5 mr-1" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.success('Downloading verified document')}
                  >
                    <Download className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shop Photos */}
          {customer.shopPhotos && customer.shopPhotos.length > 0 && (
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Store className="size-4 text-primary" />
                  <CardTitle className="text-base font-semibold text-foreground">Shop / Showroom Photos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {customer.shopPhotos.map((photo, i) => (
                    <div key={i} className="group relative rounded-lg overflow-hidden border border-border/60 aspect-video">
                      <img
                        src={photo}
                        alt={`Shop Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
