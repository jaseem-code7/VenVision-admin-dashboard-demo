'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CreditCard,
  Calendar,
  ExternalLink,
  Clock,
  Sparkles
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
import { toast } from 'sonner'
import { initialB2CCustomers, initialB2COrders } from '@/data/venvision-data'

export default function B2CCustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params?.id as string

  const customer = initialB2CCustomers.find(c => c.id === customerId) || initialB2CCustomers[0]
  const recentOrders = initialB2COrders.filter(o => o.customerName === customer.name || o.customerEmail === customer.email)

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
            <Link href="/b2c/customers" className="hover:text-foreground transition-colors">
              Customers
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{customer.name}</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {customer.name}
            </h1>
            {customer.nafathVerified && (
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5">
                <ShieldCheck className="size-3.5 mr-1" />
                Nafath Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customer ID: {customer.id} &bull; Member since {customer.registeredDate}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/b2c/customers')}
            className="h-9 px-3 text-xs rounded-xl gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Customers</span>
          </Button>
          <Button
            type="button"
            onClick={() => toast.success('Customer profile saved')}
            className="h-9 px-4 text-xs font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            {customer.totalOrders}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Last order on {customer.lastOrderDate}</p>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Lifetime Spend</div>
          <div className="text-2xl font-bold font-mono text-primary mt-1">
            SAR {customer.totalSpentSAR.toLocaleString('en-US')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">High-value jewellery tier</p>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Average Order Value</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            SAR {(customer.totalSpentSAR / (customer.totalOrders || 1)).toFixed(0)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Per transaction average</p>
        </Card>
      </div>

      {/* 2-Column Content */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Recent Orders (8 of 12) */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold text-foreground">Recent Orders</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20 border-b border-border/80">
                  <TableRow className="hover:bg-transparent border-b border-border/80">
                    <TableHead className="text-xs font-semibold py-3 pl-4">Order ID</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Date</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Items</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Amount</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Status</TableHead>
                    <TableHead className="text-xs font-semibold py-3 pr-4 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                        No previous orders recorded for this account.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.map(order => (
                      <TableRow key={order.id} className="hover:bg-muted/20 border-b border-border/50 text-xs">
                        <TableCell className="py-2.5 pl-4 font-mono font-bold text-primary">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="py-2.5 max-w-[180px] truncate">{order.itemsCount} items</TableCell>
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
                            <Link href={`/b2c/orders/${order.id}`}>View</Link>
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

        {/* Right: Customer Profile (4 of 12) */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0 text-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono">
                <Phone className="size-4 shrink-0 text-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-foreground mt-0.5" />
                <span>Primary Address: {customer.city}, Kingdom of Saudi Arabia</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="font-medium text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">National ID Auth:</span>
                <span className="font-medium text-foreground">Nafath IAM Portal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
