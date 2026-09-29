'use client'

import React, { useState } from 'react'
import {
  Tag,
  PlusCircle,
  Percent,
  Coins,
  Calendar,
  Check,
  CheckCircle2,
  XCircle,
  Copy
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { initialCoupons, type Coupon } from '@/data/venvision-data'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [showAddForm, setShowAddForm] = useState(false)
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed SAR'>('Percentage')
  const [discountValue, setDiscountValue] = useState<number>(10)
  const [applicableTo, setApplicableTo] = useState<'All' | 'B2C Only' | 'B2B Only'>('B2C Only')
  const [minSpend, setMinSpend] = useState<number>(5000)
  const [expiry, setExpiry] = useState('2026-12-31')
  const [limit, setLimit] = useState<number>(250)

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      applicableTo,
      minSpendSAR: minSpend,
      startDate: '2026-09-23',
      expiryDate: expiry,
      usageLimit: limit,
      usedCount: 0,
      isActive: true
    }

    setCoupons(prev => [newCoupon, ...prev])
    setShowAddForm(false)
    setCode('')
    toast.success(`Discount code ${newCoupon.code} created!`)
  }

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
    toast.info('Coupon status updated')
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Coupons & Promotions
            </h1>
            <Badge variant='outline' className='border-primary/30 text-primary'>
              {coupons.length} Discount Codes
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Create and manage promotional discount codes for B2C retail customers and B2B wholesale buyers.
          </p>
        </div>

        <Button onClick={() => setShowAddForm(!showAddForm)} className='gap-1.5'>
          <PlusCircle className='size-4' />
          <span>{showAddForm ? 'Close' : 'Create Coupon'}</span>
        </Button>
      </div>

      {/* Add Coupon Form */}
      {showAddForm && (
        <Card className='border-primary/30 bg-muted/10'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>Generate New Discount Code</CardTitle>
            <CardDescription className='text-xs'>Configure code, discount amount, applicability, and minimum spend.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCoupon} className='space-y-4 text-xs'>
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='space-y-1.5'>
                  <label className='font-semibold'>Promo Code *</label>
                  <Input
                    placeholder='e.g. AUTUMN15'
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    className='uppercase font-mono text-xs'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='font-semibold'>Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className='h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs'
                  >
                    <option value='Percentage'>Percentage (%)</option>
                    <option value='Fixed SAR'>Fixed Amount (SAR)</option>
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <label className='font-semibold'>
                    Value ({discountType === 'Percentage' ? '%' : 'SAR'}) *
                  </label>
                  <Input
                    type='number'
                    value={discountValue}
                    onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                    required
                    className='text-xs'
                  />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='space-y-1.5'>
                  <label className='font-semibold'>Applicability *</label>
                  <select
                    value={applicableTo}
                    onChange={e => setApplicableTo(e.target.value as any)}
                    className='h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs'
                  >
                    <option value='B2C Only'>B2C Retail Only</option>
                    <option value='B2B Only'>B2B Wholesale Only</option>
                    <option value='All'>All Storefronts</option>
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <label className='font-semibold'>Minimum Spend (SAR)</label>
                  <Input
                    type='number'
                    value={minSpend}
                    onChange={e => setMinSpend(parseFloat(e.target.value) || 0)}
                    className='text-xs'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='font-semibold'>Expiry Date</label>
                  <Input
                    type='date'
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className='text-xs'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <Button type='button' variant='outline' size='sm' onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type='submit' size='sm' className='gap-1.5'>
                  <Check className='size-4' /> Save Code
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {coupons.map(coupon => (
          <Card key={coupon.id} className='hover:border-primary/40 transition-colors'>
            <CardContent className='p-5 space-y-3'>
              <div className='flex items-start justify-between'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-base font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20'>
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code)
                        toast.success(`Copied ${coupon.code}`)
                      }}
                      className='text-muted-foreground hover:text-foreground'
                      title='Copy code'
                    >
                      <Copy className='size-3.5' />
                    </button>
                  </div>
                  <Badge variant='outline' className='text-[10px] mt-1'>
                    {coupon.applicableTo}
                  </Badge>
                </div>

                <Switch
                  checked={coupon.isActive}
                  onCheckedChange={() => toggleCouponStatus(coupon.id)}
                />
              </div>

              {/* Discount Spec */}
              <div className='rounded-lg bg-muted/30 p-3 text-xs space-y-1'>
                <div className='flex justify-between font-medium'>
                  <span className='text-muted-foreground'>Discount:</span>
                  <span className='font-bold text-foreground'>
                    {coupon.discountType === 'Percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `${coupon.discountValue} SAR OFF`}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Min Spend:</span>
                  <span>{coupon.minSpendSAR.toLocaleString()} SAR</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Valid Until:</span>
                  <span>{coupon.expiryDate}</span>
                </div>
              </div>

              {/* Usage Progress */}
              <div className='space-y-1 pt-1'>
                <div className='flex justify-between text-[11px] text-muted-foreground'>
                  <span>Usage:</span>
                  <span>
                    <strong>{coupon.usedCount}</strong> of {coupon.usageLimit} redemptions
                  </span>
                </div>
                <div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
                  <div
                    className='h-full bg-primary rounded-full'
                    style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
