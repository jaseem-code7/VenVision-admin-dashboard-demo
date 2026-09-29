'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  RefreshCw,
  Clock,
  Radio,
  Sliders,
  Save,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calculator,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface RateHistoryRecord {
  id: string
  dateTime: string
  k24: number
  k22: number
  k21: number
  k18: number
  changePercent: number
  updatedBy: string
  source: string
}

const mockHistory: RateHistoryRecord[] = [
  {
    id: 'rh-1',
    dateTime: '24 Sep 2026, 15:00 AST',
    k24: 312.50,
    k22: 286.46,
    k21: 273.44,
    k18: 234.38,
    changePercent: 0.35,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Live WebSocket'
  },
  {
    id: 'rh-2',
    dateTime: '24 Sep 2026, 12:00 AST',
    k24: 311.40,
    k22: 285.45,
    k21: 272.48,
    k18: 233.55,
    changePercent: -0.15,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Live WebSocket'
  },
  {
    id: 'rh-3',
    dateTime: '24 Sep 2026, 09:00 AST',
    k24: 311.85,
    k22: 285.86,
    k21: 272.87,
    k18: 233.89,
    changePercent: 0.22,
    updatedBy: 'Tariq Al-Mansoor (Chief Trader)',
    source: 'Manual Adjustment'
  },
  {
    id: 'rh-4',
    dateTime: '23 Sep 2026, 18:00 AST',
    k24: 310.90,
    k22: 284.99,
    k21: 272.04,
    k18: 233.18,
    changePercent: 0.45,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Daily Close'
  },
  {
    id: 'rh-5',
    dateTime: '23 Sep 2026, 12:00 AST',
    k24: 309.50,
    k22: 283.71,
    k21: 270.81,
    k18: 232.13,
    changePercent: -0.30,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Live WebSocket'
  },
  {
    id: 'rh-6',
    dateTime: '23 Sep 2026, 08:30 AST',
    k24: 310.40,
    k22: 284.53,
    k21: 271.60,
    k18: 232.80,
    changePercent: 0.12,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Market Open'
  },
  {
    id: 'rh-7',
    dateTime: '22 Sep 2026, 18:00 AST',
    k24: 309.80,
    k22: 283.98,
    k21: 271.08,
    k18: 232.35,
    changePercent: 0.60,
    updatedBy: 'Automated Feed (LBMA / SAMA)',
    source: 'Daily Close'
  }
]

export default function PricingPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true)

  // Current Live Gold Rates (SAR/g)
  const [rates, setRates] = useState({
    k24: 312.50,
    k22: 286.46,
    k21: 273.44,
    k18: 234.38
  })

  // Pricing Rules
  const [rules, setRules] = useState({
    makingCharge: 35.00,
    vatPercent: 15,
    additionalCharge: 12.00,
    b2cMargin: 12.5,
    b2bMargin: 1.8
  })

  // Handle Refreshing Rates
  const handleRefreshRates = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setRates({
        k24: +(312.50 + (Math.random() * 0.6 - 0.3)).toFixed(2),
        k22: +(286.46 + (Math.random() * 0.5 - 0.25)).toFixed(2),
        k21: +(273.44 + (Math.random() * 0.5 - 0.25)).toFixed(2),
        k18: +(234.38 + (Math.random() * 0.4 - 0.2)).toFixed(2)
      })
      setIsRefreshing(false)
      toast.success('Live gold rates synchronized with London Bullion Market (LBMA)')
    }, 700)
  }

  // Handle Saving Rules
  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Pricing and formulation rules successfully saved.')
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Gold Rate & Pricing</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Gold Rate & Pricing
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Configure live bullion benchmark rates, pricing formulas, margins, and audit logs.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className='h-9 text-xs sm:text-sm border-border/80 gap-1.5'
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Live Rates
          </Button>
          <Button
            onClick={() => {
              setAutoUpdateEnabled(!autoUpdateEnabled)
              toast.info(`Auto-update set to ${!autoUpdateEnabled ? 'Enabled' : 'Paused'}`)
            }}
            className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs font-medium text-xs sm:text-sm h-9 px-4 gap-1.5'
          >
            <Radio className='size-3.5' />
            {autoUpdateEnabled ? 'Auto-Update Active' : 'Auto-Update Paused'}
          </Button>
        </div>
      </div>

      {/* TOP SECTION: Current Gold Rates */}
      <div className='rounded-xl border border-border/70 bg-card p-5 space-y-4 shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/60'>
          <div className='flex items-center gap-2.5'>
            <div className='size-2.5 rounded-full bg-emerald-500 animate-pulse' />
            <h2 className='text-sm font-semibold text-foreground tracking-wide uppercase'>
              Current Gold Benchmark Rates
            </h2>
            <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
              SAR / gram
            </Badge>
          </div>

          <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <Clock className='size-3.5 text-muted-foreground' />
              <span>Last Updated: <strong className='text-foreground font-medium'>Today, 15:00 AST</strong></span>
            </div>
            <div className='flex items-center gap-1.5'>
              <ShieldCheck className='size-3.5 text-muted-foreground' />
              <span>Source: <strong className='text-foreground font-medium'>LBMA / SAMA Feed</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Compact Rate Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3.5'>
          {/* 24K */}
          <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-1 hover:border-primary/40 transition-colors'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-bold text-foreground text-sm'>24K Gold</span>
              <span className='text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium flex items-center gap-0.5'>
                <ArrowUpRight className='size-2.5' /> +0.35%
              </span>
            </div>
            <div className='text-[11px] text-muted-foreground'>999.9 Fine Purity</div>
            <div className='pt-1'>
              <span className='text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono'>
                {rates.k24.toFixed(2)}
              </span>
              <span className='text-xs text-muted-foreground ml-1.5'>SAR / g</span>
            </div>
          </div>

          {/* 22K */}
          <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-1 hover:border-primary/40 transition-colors'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-bold text-foreground text-sm'>22K Gold</span>
              <span className='text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium flex items-center gap-0.5'>
                <ArrowUpRight className='size-2.5' /> +0.35%
              </span>
            </div>
            <div className='text-[11px] text-muted-foreground'>916 Fine Purity</div>
            <div className='pt-1'>
              <span className='text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono'>
                {rates.k22.toFixed(2)}
              </span>
              <span className='text-xs text-muted-foreground ml-1.5'>SAR / g</span>
            </div>
          </div>

          {/* 21K */}
          <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-1 hover:border-primary/40 transition-colors'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-bold text-foreground text-sm'>21K Gold</span>
              <span className='text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium flex items-center gap-0.5'>
                <ArrowUpRight className='size-2.5' /> +0.35%
              </span>
            </div>
            <div className='text-[11px] text-muted-foreground'>875 Fine Purity</div>
            <div className='pt-1'>
              <span className='text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono'>
                {rates.k21.toFixed(2)}
              </span>
              <span className='text-xs text-muted-foreground ml-1.5'>SAR / g</span>
            </div>
          </div>

          {/* 18K */}
          <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-1 hover:border-primary/40 transition-colors'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-bold text-foreground text-sm'>18K Gold</span>
              <span className='text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium flex items-center gap-0.5'>
                <ArrowUpRight className='size-2.5' /> +0.35%
              </span>
            </div>
            <div className='text-[11px] text-muted-foreground'>750 Fine Purity</div>
            <div className='pt-1'>
              <span className='text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono'>
                {rates.k18.toFixed(2)}
              </span>
              <span className='text-xs text-muted-foreground ml-1.5'>SAR / g</span>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD-PARTY GOLD PRICE API CONFIGURATION */}
      <div className='rounded-xl border border-border/70 bg-card p-5 space-y-4 shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/60'>
          <div className='flex items-center gap-2.5'>
            <div className='size-2.5 rounded-full bg-emerald-500 animate-pulse' />
            <h2 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
              Third-Party Gold Price API Configuration
            </h2>
            <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
              API Connected
            </Badge>
          </div>
          <Badge variant='outline' className='text-[10px] text-amber-500 border-amber-500/30'>
            Provider Selection Pending Client Finalization
          </Badge>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5'>
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground'>API Provider</label>
            <Input
              value='GoldAPI.io (Live Bullion Feed)'
              readOnly
              className='h-8 text-xs bg-muted/30 font-medium'
            />
            <p className='text-[10px] text-muted-foreground'>Third-party provider configurable</p>
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground'>API Key / Token</label>
            <Input
              type='password'
              value='goldapi-sec-live-99281a8c90'
              readOnly
              className='h-8 text-xs bg-muted/30 font-mono'
            />
            <p className='text-[10px] text-muted-foreground'>Secured integration credentials</p>
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground'>API Status</label>
            <div className='h-8 px-3 rounded-md bg-muted/30 border border-input flex items-center justify-between text-xs'>
              <span className='font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5'>
                <span className='size-2 rounded-full bg-emerald-500' /> Active & Polling
              </span>
              <span className='text-[10px] text-muted-foreground font-mono'>HTTP 200</span>
            </div>
            <p className='text-[10px] text-muted-foreground'>Manual refresh supported above</p>
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground'>Last API Update</label>
            <div className='h-8 px-3 rounded-md bg-muted/30 border border-input flex items-center text-xs font-mono text-muted-foreground'>
              Today, 15:00 AST
            </div>
            <p className='text-[10px] text-muted-foreground'>Automatic synchronization</p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Pricing Rules & Formulas */}
      <div className='rounded-xl border border-border/70 bg-card p-5 space-y-4 shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/60'>
          <div className='flex items-center gap-2'>
            <Sliders className='size-4 text-primary' />
            <h2 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
              Jewellery Pricing Formula & Parameters
            </h2>
          </div>
          <Badge variant='outline' className='text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10'>
            TBD — Client Confirmation Required
          </Badge>
        </div>

        <div className='p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200'>
          <strong>Important Architecture Notice:</strong> The mathematical formula for converting gold market rates into final retail and wholesale jewellery product prices is <strong>NOT finalized</strong>. No arbitrary conversion formulas are active. Values below represent configurable placeholders ready for client confirmation.
        </div>

        <form onSubmit={handleSaveRules} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5'>
            {/* Making Charge */}
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-foreground'>
                Default Making Charge
              </label>
              <div className='relative'>
                <Input
                  type='number'
                  step='0.5'
                  value={rules.makingCharge}
                  onChange={e => setRules({ ...rules, makingCharge: parseFloat(e.target.value) || 0 })}
                  className='h-8 text-xs pr-14'
                />
                <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono'>
                  SAR / g
                </span>
              </div>
              <p className='text-[10px] text-muted-foreground'>Crafting labor fee per gram</p>
            </div>

            {/* VAT % */}
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-foreground'>
                VAT Percentage
              </label>
              <div className='relative'>
                <Input
                  type='number'
                  value={rules.vatPercent}
                  onChange={e => setRules({ ...rules, vatPercent: parseFloat(e.target.value) || 0 })}
                  className='h-8 text-xs pr-7'
                />
                <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono'>
                  %
                </span>
              </div>
              <p className='text-[10px] text-muted-foreground'>Shown separately at checkout</p>
            </div>

            {/* Additional Charge */}
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-foreground'>
                Additional Fixed Charge
              </label>
              <div className='relative'>
                <Input
                  type='number'
                  value={rules.additionalCharge}
                  onChange={e => setRules({ ...rules, additionalCharge: parseFloat(e.target.value) || 0 })}
                  className='h-8 text-xs pr-10'
                />
                <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono'>
                  SAR
                </span>
              </div>
              <p className='text-[10px] text-muted-foreground'>Hallmark & assay certification</p>
            </div>

            {/* B2C Margin */}
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold text-foreground'>
                B2C Retail Margin
              </label>
              <div className='relative'>
                <Input
                  type='number'
                  step='0.1'
                  value={rules.b2cMargin}
                  onChange={e => setRules({ ...rules, b2cMargin: parseFloat(e.target.value) || 0 })}
                  className='h-8 text-xs pr-7'
                />
                <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono'>
                  %
                </span>
              </div>
              <p className='text-[10px] text-muted-foreground'>Retail catalogue configuration</p>
            </div>

            {/* B2B Product Pricing */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <label className='text-xs font-semibold text-foreground'>
                  B2B Product Pricing
                </label>
                <Badge variant='outline' className='text-[9px] text-amber-600'>TBD</Badge>
              </div>
              <div className='relative'>
                <Input
                  disabled
                  value='Pending Client Confirmation'
                  className='h-8 text-[11px] bg-muted/40 text-muted-foreground italic'
                />
              </div>
              <p className='text-[10px] text-muted-foreground'>No negotiation / bargaining feature</p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Calculator className='size-3.5 text-primary' />
              <span>
                Jewellery Pricing Formula: <strong className='text-amber-600 dark:text-amber-400 font-normal'>TBD — Client Confirmation Required</strong>
              </span>
            </div>

            <Button
              type='submit'
              size='sm'
              className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 shadow-xs'
            >
              <Save className='size-3.5' />
              Save Staged Configuration
            </Button>
          </div>
        </form>
      </div>

      {/* BOTTOM SECTION: Rate History Table (Inside ONE Main Container) */}
      <div className='rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden'>
        <div className='p-4 flex items-center justify-between bg-card border-b border-border/70'>
          <div>
            <h3 className='font-semibold text-foreground text-sm'>Gold Rate Audit History</h3>
            <p className='text-xs text-muted-foreground'>Historical benchmark rate updates and authorization logs</p>
          </div>
          <div className='text-xs text-muted-foreground'>
            Showing last 7 updates
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70'>
              <tr>
                <th className='py-3 px-4'>Date / Time</th>
                <th className='py-3 px-4'>24K (SAR/g)</th>
                <th className='py-3 px-4'>22K (SAR/g)</th>
                <th className='py-3 px-4'>21K (SAR/g)</th>
                <th className='py-3 px-4'>18K (SAR/g)</th>
                <th className='py-3 px-4 text-center'>Change</th>
                <th className='py-3 px-4'>Updated By</th>
                <th className='py-3 px-4 text-right'>Source</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/60'>
              {mockHistory.map(rec => (
                <tr key={rec.id} className='hover:bg-muted/30 transition-colors'>
                  <td className='py-3 px-4 font-medium text-foreground whitespace-nowrap'>
                    {rec.dateTime}
                  </td>
                  <td className='py-3 px-4 font-mono font-semibold text-foreground whitespace-nowrap'>
                    {rec.k24.toFixed(2)}
                  </td>
                  <td className='py-3 px-4 font-mono text-muted-foreground whitespace-nowrap'>
                    {rec.k22.toFixed(2)}
                  </td>
                  <td className='py-3 px-4 font-mono text-muted-foreground whitespace-nowrap'>
                    {rec.k21.toFixed(2)}
                  </td>
                  <td className='py-3 px-4 font-mono text-muted-foreground whitespace-nowrap'>
                    {rec.k18.toFixed(2)}
                  </td>
                  <td className='py-3 px-4 text-center whitespace-nowrap'>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                        rec.changePercent >= 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {rec.changePercent >= 0 ? `+${rec.changePercent.toFixed(2)}%` : `${rec.changePercent.toFixed(2)}%`}
                    </span>
                  </td>
                  <td className='py-3 px-4 text-muted-foreground whitespace-nowrap'>
                    {rec.updatedBy}
                  </td>
                  <td className='py-3 px-4 text-right whitespace-nowrap'>
                    <Badge variant='outline' className='text-[10px] border-border/80 text-muted-foreground'>
                      {rec.source}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Centered 3-Column Pagination Footer */}
        <div className='p-4 bg-card grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs border-t border-border/70'>
          {/* LEFT: Showing count */}
          <div className='text-muted-foreground text-center sm:text-left'>
            Showing <span className='font-semibold text-foreground'>1–7</span> of{' '}
            <span className='font-semibold text-foreground'>120</span> records
          </div>

          {/* CENTER: Pagination controls visually centered */}
          <div className='flex items-center justify-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              disabled
              className='h-7 px-2.5 text-xs border-border/80'
            >
              <ChevronLeft className='size-3.5 mr-0.5' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-xs'
            >
              1
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs border-border/80 hover:bg-muted'
            >
              2
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs border-border/80 hover:bg-muted'
            >
              3
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 px-2.5 text-xs border-border/80'
            >
              Next
              <ChevronRight className='size-3.5 ml-0.5' />
            </Button>
          </div>

          {/* RIGHT: Rows per page */}
          <div className='flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground'>
            <span>Rows per page:</span>
            <select
              defaultValue='10'
              className='h-7 rounded-md border border-border/80 bg-background/60 px-2 text-xs text-foreground focus:outline-none'
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
