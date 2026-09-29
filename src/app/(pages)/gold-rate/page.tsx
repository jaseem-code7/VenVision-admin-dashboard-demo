'use client'

import React, { useState } from 'react'
import {
  Coins,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowUpRight,
  ShieldCheck,
  Scale
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { initialGoldRates, type GoldRate } from '@/data/venvision-data'

export default function GoldRatePage() {
  const [rates, setRates] = useState<GoldRate[]>(initialGoldRates)
  const [autoSync, setAutoSync] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState('Today, 13:30 AST')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRateChange = (karat: string, newBuyRate: number) => {
    setRates(prev =>
      prev.map(r => (r.karat === karat ? { ...r, buyRateSAR: newBuyRate } : r))
    )
  }

  const handleSyncNow = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      setLastSyncTime(`Today, ${now} AST`)
      toast.success('Gold rates refreshed from Saudi bullion market feed!', {
        description: 'All B2C catalogue items and B2B fixed prices updated in real-time.'
      })
    }, 800)
  }

  const handleSaveRates = () => {
    toast.success('Live Gold Rates saved!', {
      description: 'New pricing formula pushed to all active jewellery listings.'
    })
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Gold Rate Manager
            </h1>
            <Badge className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'>
              Live Pricing Engine
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage the central benchmark gold rates (SAR/gram) used to automatically price all B2C retail jewellery and B2B materials.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSyncNow}
            disabled={isUpdating}
            className='gap-1.5'
          >
            <RefreshCw className={`size-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>Sync Market Feed</span>
          </Button>
          <Button size='sm' onClick={handleSaveRates} className='gap-1.5 bg-amber-600 hover:bg-amber-700 text-white'>
            <Save className='size-4' />
            <span>Save & Apply Rates</span>
          </Button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <Card className='border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shadow-xs'>
        <CardContent className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400'>
              <Coins className='size-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-sm'>Automated Pricing Rule Active</span>
                <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-600'>
                  SAR Currency
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground'>
                Last synced: {lastSyncTime} &bull; SAMA & Tadawul Gold Market aligned
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <span className='text-xs text-muted-foreground'>Automatic 15-min Market Sync:</span>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
        </CardContent>
      </Card>

      {/* Karat Rate Cards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {rates.map(rate => (
          <Card key={rate.karat} className='hover:border-amber-500/40 transition-colors'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl font-bold text-amber-600 dark:text-amber-400'>
                  {rate.karat}
                </CardTitle>
                <Badge variant='secondary' className='text-[10px]'>
                  +{rate.change24h}% Today
                </Badge>
              </div>
              <CardDescription className='text-xs'>{rate.purity}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-foreground'>
                  Rate per Gram (SAR)
                </label>
                <Input
                  type='number'
                  step='0.05'
                  value={rate.buyRateSAR}
                  onChange={e => handleRateChange(rate.karat, parseFloat(e.target.value) || 0)}
                  className='text-lg font-bold font-mono'
                />
              </div>

              <div className='rounded-lg bg-muted/40 p-2.5 space-y-1 text-[11px] text-muted-foreground'>
                <div className='flex justify-between'>
                  <span>Selling Rate:</span>
                  <span className='font-semibold text-foreground'>{rate.sellRateSAR.toFixed(2)} SAR/g</span>
                </div>
                <div className='flex justify-between'>
                  <span>10 Grams:</span>
                  <span className='font-semibold text-foreground'>{(rate.buyRateSAR * 10).toFixed(2)} SAR</span>
                </div>
                <div className='flex justify-between'>
                  <span>1 Ounce (31.1g):</span>
                  <span className='font-semibold text-foreground'>{(rate.buyRateSAR * 31.1035).toFixed(2)} SAR</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Impact Simulation & Formula Reference */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>Retail Pricing Formula</CardTitle>
            <CardDescription className='text-xs'>
              Standardized algorithm automatically executed on every B2C product.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-xs'>
            <div className='rounded-xl border p-4 bg-muted/20 space-y-2 font-mono'>
              <div className='text-primary font-bold text-sm'>
                Final Retail Price (SAR) = [ (Weight &times; Karat Rate) + Making Charge + Gemstones ] &times; 1.15 VAT
              </div>
            </div>

            <div className='space-y-2 pt-2 text-muted-foreground'>
              <p>&bull; <strong>Gold Weight:</strong> Certified gross gold weight in grams.</p>
              <p>&bull; <strong>Karat Rate:</strong> Instant benchmark for 18K, 21K, 22K, or 24K.</p>
              <p>&bull; <strong>Making Charge:</strong> Workshop artisan crafting fee per piece.</p>
              <p>&bull; <strong>15% VAT:</strong> Legally mandated Saudi ZATCA e-invoicing tax calculated automatically.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>Live Price Impact Preview</CardTitle>
            <CardDescription className='text-xs'>
              How current rates calculate iconic sample items in the store right now.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-xs'>
            <div className='rounded-lg border p-3 flex items-center justify-between'>
              <div>
                <div className='font-semibold text-foreground'>Classic 21K Saudi Gold Choker (32.4g)</div>
                <div className='text-[10px] text-muted-foreground'>
                  32.4g &times; 273.40 SAR + 1,250 making + 15% VAT
                </div>
              </div>
              <div className='text-right font-bold text-sm text-foreground'>
                11,624.39 SAR
              </div>
            </div>

            <div className='rounded-lg border p-3 flex items-center justify-between'>
              <div>
                <div className='font-semibold text-foreground'>18K Solitaire Diamond Ring (4.85g)</div>
                <div className='text-[10px] text-muted-foreground'>
                  4.85g &times; 234.35 SAR + 450 making + diamond + 15% VAT
                </div>
              </div>
              <div className='text-right font-bold text-sm text-foreground'>
                18,154.59 SAR
              </div>
            </div>

            <div className='rounded-lg border p-3 flex items-center justify-between'>
              <div>
                <div className='font-semibold text-foreground'>24K Mint Casting Grain (500g B2B)</div>
                <div className='text-[10px] text-muted-foreground'>
                  Direct fixed wholesale bulk transaction
                </div>
              </div>
              <div className='text-right font-bold text-sm text-blue-600 dark:text-blue-400'>
                157,100.00 SAR
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
