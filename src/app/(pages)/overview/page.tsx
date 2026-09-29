'use client'

import React from 'react'
import Link from 'next/link'
import {
  Gem,
  Coins,
  ShieldCheck,
  TrendingUp,
  Building2,
  ShoppingBag,
  ExternalLink,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  ArrowDownRight
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine
} from '@/components/ui/timeline'

// Executive Wholesale Manufacturing Contracts
const wholesaleContracts = [
  {
    id: 'CTR-2026-081',
    partner: 'Al-Safwa Luxury Jewels',
    partnerLogo: 'AS',
    project: '18K Bridal Collection Spring 2026',
    category: 'Finished Jewellery',
    value: 'SAR 840,000',
    progress: 78,
    status: 'In Production',
    statusColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    team: [
      { avatar: '/images/avatars/avatar-1.webp', initials: 'FA' },
      { avatar: '/images/avatars/avatar-2.webp', initials: 'TH' },
      { initials: 'MK' }
    ],
    deliveryDate: 'Oct 15, 2026'
  },
  {
    id: 'CTR-2026-082',
    partner: 'Riyadh Royal Ateliers',
    partnerLogo: 'RR',
    project: '24K Minted 100g Bullion Bar Supply (10kg)',
    category: 'Bullion Ingot',
    value: 'SAR 3,125,000',
    progress: 95,
    status: 'Ready for Vault Dispatch',
    statusColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    team: [
      { avatar: '/images/avatars/avatar-3.webp', initials: 'SA' },
      { avatar: '/images/avatars/avatar-4.webp', initials: 'AA' }
    ],
    deliveryDate: 'Sep 28, 2026'
  },
  {
    id: 'CTR-2026-083',
    partner: 'Damas Wholesale Network',
    partnerLogo: 'DW',
    project: 'Natural Solitaire Diamond Rings (50 Pcs)',
    category: 'Diamond Jewelry',
    value: 'SAR 620,000',
    progress: 45,
    status: 'Diamond Setting',
    statusColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    team: [
      { avatar: '/images/avatars/avatar-5.webp', initials: 'RK' },
      { initials: 'OS' },
      { initials: 'WA' }
    ],
    deliveryDate: 'Nov 02, 2026'
  },
  {
    id: 'CTR-2026-084',
    partner: 'Gulf Diamond Gallery',
    partnerLogo: 'GD',
    project: '21K Traditional Handcrafted Bangles (25kg)',
    category: 'Casting & Handcraft',
    value: 'SAR 6,835,000',
    progress: 62,
    status: 'Hallmarking / SAMA Inspection',
    statusColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    team: [
      { avatar: '/images/avatars/avatar-6.webp', initials: 'YB' },
      { avatar: '/images/avatars/avatar-7.webp', initials: 'HM' }
    ],
    deliveryDate: 'Oct 22, 2026'
  }
]

// Key Wholesale B2B Partner Accounts
const keyWholesalePartners = [
  {
    name: 'Al-Safwa Luxury Jewels',
    tier: 'Tier 1 Platinum',
    region: 'Riyadh, KSA',
    annualVolume: 'SAR 4.2M',
    growth: '+24.5%',
    ordersCount: 48,
    avatar: '/images/avatars/avatar-1.webp',
    initials: 'AS'
  },
  {
    name: 'Riyadh Royal Ateliers',
    tier: 'Tier 1 Bullion VIP',
    region: 'Jeddah, KSA',
    annualVolume: 'SAR 6.8M',
    growth: '+31.2%',
    ordersCount: 62,
    avatar: '/images/avatars/avatar-3.webp',
    initials: 'RR'
  },
  {
    name: 'Damas Wholesale Network',
    tier: 'Tier 1 Diamond',
    region: 'Khobar, KSA',
    annualVolume: 'SAR 3.5M',
    growth: '+12.8%',
    ordersCount: 35,
    avatar: '/images/avatars/avatar-5.webp',
    initials: 'DW'
  },
  {
    name: 'Red Sea Gold Trading Co.',
    tier: 'Tier 2 Gold',
    region: 'Dammam, KSA',
    annualVolume: 'SAR 2.1M',
    growth: '+18.0%',
    ordersCount: 29,
    avatar: '/images/avatars/avatar-6.webp',
    initials: 'RS'
  }
]

// Executive Activity Log
const executiveActivities = [
  {
    id: 1,
    title: 'High-Value Bullion Dispatch Approved',
    time: '18 minutes ago',
    detail: 'Order #VV-B2B-902 (SAR 312,500 - 1000g 24K Minted Bars) verified by vault manager.',
    badge: 'SAR 312,500',
    badgeVariant: 'outline',
    type: 'bullion'
  },
  {
    id: 2,
    title: 'Custom Royal Tiara CAD Model Finalized',
    time: '1 hour ago',
    detail: '3D interactive CAD preview approved by VIP client for casting in 18K White Gold.',
    badge: 'CAD Approved',
    badgeVariant: 'secondary',
    type: 'design'
  },
  {
    id: 3,
    title: 'Live Bullion Exchange Synchronization',
    time: '2 hours ago',
    detail: 'SAMA benchmark adjusted 24K to 312.50 SAR/g. Wholesale fixed margins auto-recalculated.',
    badge: 'Rate Synced',
    badgeVariant: 'outline',
    type: 'market'
  },
  {
    id: 4,
    title: 'Nafath AML Identity Verification Completed',
    time: '4 hours ago',
    detail: 'B2B Wholesale account Damas Network completed compliance threshold validation.',
    badge: 'Nafath Passed',
    badgeVariant: 'secondary',
    type: 'compliance'
  }
]

// Revenue Stream Mix
const revenueStreams = [
  { name: 'B2B Wholesale & Bullion Supply', share: 58, revenue: 'SAR 8,613,116', color: 'bg-primary' },
  { name: 'B2C Retail Jewellery (Online Store)', share: 28, revenue: 'SAR 4,158,056', color: 'bg-amber-500' },
  { name: 'Custom Jewellery & Royal Bespoke', share: 14, revenue: 'SAR 2,079,028', color: 'bg-emerald-500' }
]

const ExecutiveOverview = () => {
  return (
    <div className='space-y-6 pb-12'>
      {/* Header with Title and Live Metal Ribbon */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Executive Overview
            </h1>
            <Badge className='bg-primary/10 text-primary border-primary/20 font-semibold text-xs'>
              VenVision Boardroom
            </Badge>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            Consolidated performance across B2C Luxury Retail, B2B Wholesale Trading, and Bullion Treasury.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button asChild variant='outline' size='sm' className='gap-1.5'>
            <Link href='/gold-rate'>
              <Coins className='size-3.5 text-amber-500' />
              <span>Gold Fixing: 312.50 SAR</span>
            </Link>
          </Button>
          <Button asChild size='sm' className='gap-1.5 bg-primary hover:bg-primary/90'>
            <Link href='/dashboard/orders'>
              <span>View B2B Orders</span>
              <ArrowUpRight className='size-3.5' />
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Row: 4 Key Executive Performance Indicators */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='p-5 space-y-2'>
          <div className='flex items-center justify-between text-muted-foreground'>
            <span className='text-xs font-medium uppercase tracking-wider'>Total Gross Revenue</span>
            <div className='size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
              <Coins className='size-4' />
            </div>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-2xl font-bold tracking-tight'>SAR 14,850,200</span>
            <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5'>
              <TrendingUp className='size-3' /> +14.2%
            </span>
          </div>
          <p className='text-[11px] text-muted-foreground'>Combined B2C Retail + B2B Wholesale</p>
        </Card>

        <Card className='p-5 space-y-2'>
          <div className='flex items-center justify-between text-muted-foreground'>
            <span className='text-xs font-medium uppercase tracking-wider'>B2B Wholesale GMV</span>
            <div className='size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center'>
              <Building2 className='size-4' />
            </div>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-2xl font-bold tracking-tight'>SAR 9,420,000</span>
            <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5'>
              <TrendingUp className='size-3' /> +18.5%
            </span>
          </div>
          <p className='text-[11px] text-muted-foreground'>102 Verified Wholesale Shipments</p>
        </Card>

        <Card className='p-5 space-y-2'>
          <div className='flex items-center justify-between text-muted-foreground'>
            <span className='text-xs font-medium uppercase tracking-wider'>B2C Retail Volume</span>
            <div className='size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center'>
              <ShoppingBag className='size-4' />
            </div>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-2xl font-bold tracking-tight'>SAR 3,680,200</span>
            <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5'>
              <TrendingUp className='size-3' /> +9.8%
            </span>
          </div>
          <p className='text-[11px] text-muted-foreground'>1,420 Luxury Retail Transactions</p>
        </Card>

        <Card className='p-5 space-y-2'>
          <div className='flex items-center justify-between text-muted-foreground'>
            <span className='text-xs font-medium uppercase tracking-wider'>Bullion Vault Reserve</span>
            <div className='size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center'>
              <ShieldCheck className='size-4' />
            </div>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-2xl font-bold tracking-tight'>160.7 kg</span>
            <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
              999.9 Purity
            </span>
          </div>
          <p className='text-[11px] text-muted-foreground'>SAR 50.2M SAMA Vault Backed Value</p>
        </Card>
      </div>

      {/* Middle Row: Active Wholesale Manufacturing Contracts (Datatable) & Key Wholesale Accounts */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Active Wholesale Contracts (8 cols) */}
        <Card className='col-span-12 xl:col-span-8 overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between pb-3'>
            <div>
              <CardTitle className='text-base font-semibold'>
                Wholesale Manufacturing Contracts & Vault Shipments
              </CardTitle>
              <CardDescription className='text-xs'>
                High-volume custom production batches, bullion allotments, and delivery milestones.
              </CardDescription>
            </div>
            <Button asChild variant='ghost' size='sm' className='text-xs gap-1'>
              <Link href='/dashboard/orders'>
                <span>All Orders</span>
                <ChevronRight className='size-3.5' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='pl-6'>Contract / Batch</TableHead>
                  <TableHead>Partner Client</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead className='w-40'>Production Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='pr-6 text-right'>Est. Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wholesaleContracts.map(contract => (
                  <TableRow key={contract.id} className='hover:bg-muted/50'>
                    <TableCell className='pl-6 py-4'>
                      <div className='font-semibold text-sm text-foreground'>{contract.project}</div>
                      <div className='text-xs text-muted-foreground font-mono mt-0.5'>{contract.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='size-7'>
                          <AvatarFallback className='text-[10px] font-bold bg-primary/10 text-primary'>
                            {contract.partnerLogo}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium'>{contract.partner}</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-xs'>{contract.value}</TableCell>
                    <TableCell>
                      <div className='space-y-1.5'>
                        <div className='flex items-center justify-between text-[11px]'>
                          <span className='text-muted-foreground font-medium'>{contract.progress}%</span>
                        </div>
                        <Progress value={contract.progress} className='h-1.5' />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className={`text-[10px] font-medium ${contract.statusColor}`}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='pr-6 text-right text-xs text-muted-foreground'>
                      {contract.deliveryDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Key Wholesale Partner Accounts (4 cols) */}
        <Card className='col-span-12 xl:col-span-4'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-semibold'>VIP Wholesale Partners</CardTitle>
              <Badge variant='outline' className='text-[10px] font-semibold text-primary border-primary/20'>
                Top Accounts
              </Badge>
            </div>
            <CardDescription className='text-xs'>
              Leading regional jewellery houses & bullion trading partners.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {keyWholesalePartners.map((partner, i) => (
              <div key={i} className='flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-9'>
                    <AvatarImage src={partner.avatar} alt={partner.name} />
                    <AvatarFallback className='text-xs font-bold'>{partner.initials}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold truncate'>{partner.name}</p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>{partner.region}</span>
                      <span>•</span>
                      <span className='text-primary font-medium'>{partner.tier}</span>
                    </div>
                  </div>
                </div>

                <div className='text-right shrink-0'>
                  <div className='text-xs font-bold'>{partner.annualVolume}</div>
                  <div className='text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'>
                    {partner.growth}
                  </div>
                </div>
              </div>
            ))}

            <Button asChild variant='outline' className='w-full text-xs mt-2'>
              <Link href='/b2b/buyers'>View All Wholesale Clients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Executive Operations Timeline & Revenue Stream Mix */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Executive Timeline (7 cols) */}
        <Card className='col-span-12 lg:col-span-7'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <Clock className='size-4 text-primary' />
                <span>Executive Operations & Audit Timeline</span>
              </CardTitle>
              <Badge variant='secondary' className='text-[10px]'>Live Events</Badge>
            </div>
            <CardDescription className='text-xs'>
              High-value order sign-offs, live gold fixing updates, and compliance events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline>
              {executiveActivities.map((act, index) => (
                <TimelineItem key={act.id}>
                  <TimelineDot className='bg-primary' />
                  {index < executiveActivities.length - 1 && <TimelineLine />}
                  <TimelineHeading className='text-sm font-semibold flex items-center justify-between gap-2'>
                    <span>{act.title}</span>
                    <Badge variant={act.badgeVariant as any} className='text-[10px] shrink-0'>
                      {act.badge}
                    </Badge>
                  </TimelineHeading>
                  <TimelineContent className='text-xs text-muted-foreground mt-1'>
                    <p>{act.detail}</p>
                    <span className='text-[10px] text-muted-foreground/75 mt-0.5 block'>{act.time}</span>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>

        {/* Revenue Distribution & Live Metals (5 cols) */}
        <Card className='col-span-12 lg:col-span-5 flex flex-col justify-between'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold flex items-center gap-2'>
              <BarChart3 className='size-4 text-primary' />
              <span>Revenue Stream Distribution</span>
            </CardTitle>
            <CardDescription className='text-xs'>
              Proportional gross contribution across VenVision business channels.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Multi-segment Progress Bar */}
            <div className='space-y-2'>
              <div className='flex h-3 w-full overflow-hidden rounded-full bg-muted'>
                <div style={{ width: '58%' }} className='bg-primary transition-all' />
                <div style={{ width: '28%' }} className='bg-amber-500 transition-all' />
                <div style={{ width: '14%' }} className='bg-emerald-500 transition-all' />
              </div>
              <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                <span>B2B Wholesale (58%)</span>
                <span>B2C Retail (28%)</span>
                <span>Bespoke (14%)</span>
              </div>
            </div>

            {/* List breakdown */}
            <div className='space-y-3 pt-2'>
              {revenueStreams.map(stream => (
                <div key={stream.name} className='flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs'>
                  <div className='flex items-center gap-2'>
                    <div className={`size-2.5 rounded-full ${stream.color}`} />
                    <span className='font-medium'>{stream.name}</span>
                  </div>
                  <div className='text-right'>
                    <span className='font-bold'>{stream.revenue}</span>
                    <span className='text-muted-foreground text-[10px] ml-1.5'>({stream.share}%)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Gold Benchmark Notice */}
            <div className='rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 flex items-center justify-between text-xs'>
              <div className='flex items-center gap-2'>
                <Coins className='size-4 text-amber-600 dark:text-amber-400' />
                <div>
                  <span className='font-semibold'>24K Fixing: 312.50 SAR/g</span>
                  <p className='text-[10px] text-muted-foreground'>All B2B fixed margins synchronized with SAMA</p>
                </div>
              </div>
              <Button asChild size='sm' variant='outline' className='text-xs h-7 px-2.5'>
                <Link href='/gold-rate'>Adjust Rates</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExecutiveOverview

