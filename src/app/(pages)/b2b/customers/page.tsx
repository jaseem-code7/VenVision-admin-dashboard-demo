'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Building2,
  Phone,
  Mail,
  MoreVertical,
  Eye,
  FileText,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard
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
import { initialB2BBuyers, type B2BBuyer } from '@/data/venvision-data'
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'

export interface B2BCustomerWithOutstanding extends B2BBuyer {
  outstandingSAR: number
  lastOrderDate: string
}

const initialB2BCustomers: B2BCustomerWithOutstanding[] = initialB2BBuyers.map((b, idx) => ({
  ...b,
  outstandingSAR: idx === 1 ? 48500 : idx === 3 ? 12200 : 0,
  lastOrderDate: idx === 0 ? 'Yesterday' : idx === 1 ? '3 days ago' : idx === 2 ? 'Oct 10, 2026' : 'Oct 04, 2026'
}))

export default function B2BCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<B2BCustomerWithOutstanding[]>(initialB2BCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const hasActiveFilters = searchQuery !== '' || tierFilter !== 'All' || statusFilter !== 'All'

  const handleReset = () => {
    setSearchQuery('')
    setTierFilter('All')
    setStatusFilter('All')
    setCurrentPage(1)
    toast.info('B2B customer filters reset')
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.crNumber.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTier = tierFilter === 'All' || c.tier === tierFilter
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter

      return matchesSearch && matchesTier && matchesStatus
    })
  }, [customers, searchQuery, tierFilter, statusFilter])

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1
  const displayedCustomers = filteredCustomers.slice(
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
            <span className="text-foreground">Customers</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            B2B Customers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verified corporate buyers, commercial registries, trade lines and credit reconciliations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Exporting verified wholesale accounts...')}
          className="h-9 px-3 text-xs rounded-xl"
        >
          Export Registry
        </Button>
      </div>

      {/* 2. Main Single Container */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search corporate buyer, commercial register (CR), contact, city..."
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
              <Select value={tierFilter} onValueChange={v => { setTierFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[170px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Tier:</span>
                    <span className="font-medium text-foreground">{tierFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Wholesale Tiers</SelectItem>
                  <SelectItem value="Diamond Wholesale">Diamond Wholesale</SelectItem>
                  <SelectItem value="Gold Retailer">Gold Retailer</SelectItem>
                  <SelectItem value="Workshop Partner">Workshop Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[140px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Status:</span>
                    <span className="font-medium text-foreground">{statusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filters</span>
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-border/80" />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/80">
              <TableRow className="hover:bg-transparent border-b border-border/80">
                <TableHead className="w-[260px] text-xs font-semibold text-foreground py-3.5 pl-5">
                  Business / Buyer
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Total Orders
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Total Purchase
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Outstanding
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Last Order
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
              {displayedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-sm text-muted-foreground">
                    No B2B accounts found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                displayedCustomers.map(c => (
                  <TableRow
                    key={c.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View business account ${c.companyName}`}
                    onClick={event => handleClickableRow(event, () => router.push(`/b2b/customers/${c.id}`))}
                    onKeyDown={event => handleClickableRowKeyDown(event, () => router.push(`/b2b/customers/${c.id}`))}
                    className="hover:bg-muted/20 border-b border-border/50 h-[58px] transition-colors cursor-pointer"
                  >
                    {/* Business / Buyer */}
                    <TableCell className="py-2.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-muted/60 border border-border flex items-center justify-center shrink-0">
                          <Building2 className="size-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/b2b/customers/${c.id}`}
                            className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {c.companyName}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            CR: {c.crNumber} &bull; {c.city}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="py-2.5">
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-foreground">{c.contactPerson}</span>
                        <span className="text-muted-foreground font-mono">{c.phone}</span>
                      </div>
                    </TableCell>

                    {/* Total Orders */}
                    <TableCell className="py-2.5 text-xs font-mono font-medium text-foreground">
                      {c.totalOrders}
                    </TableCell>

                    {/* Total Purchase */}
                    <TableCell className="py-2.5 text-sm font-semibold font-mono text-foreground whitespace-nowrap">
                      SAR {c.totalSpendSAR.toLocaleString('en-US')}
                    </TableCell>

                    {/* Outstanding */}
                    <TableCell className="py-2.5 text-xs font-mono whitespace-nowrap">
                      {c.outstandingSAR > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          SAR {c.outstandingSAR.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">SAR 0.00</span>
                      )}
                    </TableCell>

                    {/* Last Order */}
                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {c.lastOrderDate}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-2.5">
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-2 py-0.5">
                        {c.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-2.5 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link href={`/b2b/customers/${c.id}`} className="flex items-center gap-2 text-xs">
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/b2b/orders" className="flex items-center gap-2 text-xs">
                              <FileText className="size-3.5 text-muted-foreground" />
                              <span>View Orders</span>
                            </Link>
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

        {/* 3-Column Centered Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 border-t border-border/80 text-xs text-muted-foreground">
          <div className="flex items-center justify-center md:justify-start">
            <span>
              Showing 1–{displayedCustomers.length} of {filteredCustomers.length} accounts
            </span>
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
              variant={currentPage === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(1)}
              className={`size-8 p-0 text-xs rounded-lg font-medium ${
                currentPage === 1 ? 'bg-primary text-primary-foreground' : 'border-border/80 bg-background text-foreground'
              }`}
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-1.5">
            <span>Rows per page:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={v => { setRowsPerPage(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-8 w-16 text-xs rounded-lg bg-background border-border/80 text-foreground">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  )
}
