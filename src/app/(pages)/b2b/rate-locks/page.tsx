'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Lock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Coins,
  Building2
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { toast } from 'sonner'

export interface RateLockItem {
  id: string
  reference: string
  buyer: string
  metal: string
  purity: string
  weightDisplay: string
  lockedRateSAR: number
  currentRateSAR: number
  lockedAt: string
  expiry: string
  status: 'Active' | 'Used' | 'Expired' | 'Cancelled'
}

const initialRateLocks: RateLockItem[] = [
  {
    id: 'rl-1',
    reference: 'RL-2026-9041',
    buyer: 'Al-Jazirah Fine Gold Trading',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '1,000 g',
    lockedRateSAR: 266.80,
    currentRateSAR: 268.45,
    lockedAt: 'Today, 11:20 AM',
    expiry: 'In 38 mins',
    status: 'Active'
  },
  {
    id: 'rl-2',
    reference: 'RL-2026-9040',
    buyer: 'Dahab Al-Riyadh Jewellery',
    metal: 'Gold',
    purity: '21K',
    weightDisplay: '500 g',
    lockedRateSAR: 233.10,
    currentRateSAR: 234.35,
    lockedAt: 'Today, 09:45 AM',
    expiry: 'In 12 mins',
    status: 'Active'
  },
  {
    id: 'rl-3',
    reference: 'RL-2026-9039',
    buyer: 'Sultanate Bullion Co.',
    metal: 'Gold',
    purity: '24K',
    weightDisplay: '2,500 g',
    lockedRateSAR: 265.50,
    currentRateSAR: 268.45,
    lockedAt: 'Yesterday, 03:15 PM',
    expiry: 'Executed into #VV-B2B-891',
    status: 'Used'
  },
  {
    id: 'rl-4',
    reference: 'RL-2026-9038',
    buyer: 'Al-Safwa Goldsmith Atelier',
    metal: 'Gold',
    purity: '18K',
    weightDisplay: '250 g',
    lockedRateSAR: 200.40,
    currentRateSAR: 201.20,
    lockedAt: 'Oct 11, 2026',
    expiry: 'Expired after 60 mins',
    status: 'Expired'
  },
  {
    id: 'rl-5',
    reference: 'RL-2026-9037',
    buyer: 'Eastern Province Jewellery LLC',
    metal: 'Gold',
    purity: '22K',
    weightDisplay: '800 g',
    lockedRateSAR: 244.20,
    currentRateSAR: 245.50,
    lockedAt: 'Oct 09, 2026',
    expiry: 'Cancelled by Buyer',
    status: 'Cancelled'
  }
]

export default function RateLocksPage() {
  const [locks, setLocks] = useState<RateLockItem[]>(initialRateLocks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [purityFilter, setPurityFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const activeCount = locks.filter(l => l.status === 'Active').length
  const usedCount = locks.filter(l => l.status === 'Used').length
  const expiredCount = locks.filter(l => l.status === 'Expired').length

  const filteredLocks = useMemo(() => {
    return locks.filter(item => {
      const matchesSearch =
        item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesPurity = purityFilter === 'All' || item.purity === purityFilter

      return matchesSearch && matchesStatus && matchesPurity
    })
  }, [locks, searchQuery, statusFilter, purityFilter])

  const totalPages = Math.ceil(filteredLocks.length / rowsPerPage) || 1
  const displayedLocks = filteredLocks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2b/dashboard" className="hover:text-foreground transition-colors">
              B2B
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Rate Locks</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Fixed Rate Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Hedging and guaranteed spot-rate locks booked by wholesale jewellery ateliers and bullion buyers.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => toast.success('Rate lock window active: 60-minute guaranteed benchmark')}
          className="h-10 px-5 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-1.5"
        >
          <Lock className="size-4" />
          <span>New Rate Lock</span>
        </Button>
      </div>

      {/* 2. Compact Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Active Rate Locks</span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activeCount} Locks
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs">
            Live Guaranteed
          </Badge>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Converted to Orders</span>
            <div className="text-xl font-bold font-mono text-foreground mt-0.5">
              {usedCount} Orders
            </div>
          </div>
          <Badge variant="outline" className="bg-muted/40 text-xs">
            Executed
          </Badge>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-xs bg-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Expired / Unexercised</span>
            <div className="text-xl font-bold font-mono text-muted-foreground mt-0.5">
              {expiredCount} Expired
            </div>
          </div>
          <Badge variant="outline" className="bg-muted/40 text-xs">
            Released to Vault
          </Badge>
        </Card>
      </div>

      {/* 3. Main Single Container */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, buyer corporate name..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 pl-10 pr-4 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[145px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Status:</span>
                    <span className="font-medium text-foreground">{statusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select value={purityFilter} onValueChange={v => { setPurityFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[140px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Purity:</span>
                    <span className="font-medium text-foreground">{purityFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Purities</SelectItem>
                  <SelectItem value="24K">24K</SelectItem>
                  <SelectItem value="22K">22K</SelectItem>
                  <SelectItem value="21K">21K</SelectItem>
                  <SelectItem value="18K">18K</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t border-border/80" />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/80">
              <TableRow className="hover:bg-transparent border-b border-border/80">
                <TableHead className="w-[140px] text-xs font-semibold text-foreground py-3.5 pl-5">
                  Reference
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Buyer
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Metal &amp; Purity
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Weight
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Locked Rate
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Current Spot
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Locked At
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Expiry / State
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Status
                </TableHead>
                <TableHead className="w-[50px] text-right py-3.5 pr-5">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center text-sm text-muted-foreground">
                    No rate locks found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                displayedLocks.map(item => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/20 border-b border-border/50 h-[58px] transition-colors"
                  >
                    <TableCell className="py-2.5 pl-5 font-mono text-xs font-bold text-primary">
                      {item.reference}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs font-semibold text-foreground">
                      {item.buyer}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-foreground">
                      <Badge variant="outline" className="font-mono text-[11px] px-2 py-0.5">
                        {item.metal} {item.purity}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-2.5 text-xs font-mono font-medium text-foreground">
                      {item.weightDisplay}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs font-mono font-semibold text-foreground">
                      SAR {item.lockedRateSAR.toFixed(2)}/g
                    </TableCell>

                    <TableCell className="py-2.5 text-xs font-mono text-muted-foreground">
                      SAR {item.currentRateSAR.toFixed(2)}/g
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {item.lockedAt}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {item.expiry}
                    </TableCell>

                    <TableCell className="py-2.5">
                      {item.status === 'Active' && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5">
                          Active
                        </Badge>
                      )}
                      {item.status === 'Used' && (
                        <Badge variant="outline" className="bg-muted/50 text-foreground text-xs px-2 py-0.5">
                          Used
                        </Badge>
                      )}
                      {item.status === 'Expired' && (
                        <Badge className="bg-muted/40 text-muted-foreground border border-border text-xs px-2 py-0.5">
                          Expired
                        </Badge>
                      )}
                      {item.status === 'Cancelled' && (
                        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs px-2 py-0.5">
                          Cancelled
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-2.5 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => toast.success(`Executing order for ${item.reference}`)}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                            <span>Execute into Order</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.info(`Lock details for ${item.reference}`)}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                            <span>View Lock Certificate</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 border-t border-border/80 text-xs text-muted-foreground">
          <div className="flex items-center justify-center md:justify-start">
            <span>Showing 1–{displayedLocks.length} of {filteredLocks.length} rate locks</span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="size-8 p-0 text-xs rounded-lg font-medium bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-1.5">
            <span>Rows per page:</span>
            <Select value={String(rowsPerPage)} onValueChange={v => setRowsPerPage(Number(v))}>
              <SelectTrigger className="h-8 w-16 text-xs rounded-lg bg-background border-border/80 text-foreground">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  )
}
