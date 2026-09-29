'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  MoreVertical,
  Eye,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw
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
import { initialB2CCustomers, type B2CCustomer } from '@/data/venvision-data'

export default function B2CCustomersPage() {
  const [customers, setCustomers] = useState<B2CCustomer[]>(initialB2CCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [nafathFilter, setNafathFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || statusFilter !== 'All' || nafathFilter !== 'All'
  }, [searchQuery, statusFilter, nafathFilter])

  const handleReset = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setNafathFilter('All')
    setCurrentPage(1)
    toast.info('Customer filters reset')
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? c.totalOrders > 0 : c.totalOrders === 0)
      const matchesNafath =
        nafathFilter === 'All' ||
        (nafathFilter === 'Verified' && c.nafathVerified) ||
        (nafathFilter === 'Pending' && !c.nafathVerified)

      return matchesSearch && matchesStatus && matchesNafath
    })
  }, [customers, searchQuery, statusFilter, nafathFilter])

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
            <Link href="/b2c/dashboard" className="hover:text-foreground transition-colors">
              B2C
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Customers</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            B2C Customers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registered retail clientele, Nafath verification status and lifetime purchase analytics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Exporting customer records...')}
          className="h-9 px-3 text-xs rounded-xl"
        >
          Export CSV
        </Button>
      </div>

      {/* 2. Single Main Container */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search customer by name, email, phone, city..."
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
                  <SelectItem value="Active">Active (&ge;1 order)</SelectItem>
                  <SelectItem value="Inactive">Inactive (0 orders)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select value={nafathFilter} onValueChange={v => { setNafathFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[155px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Nafath:</span>
                    <span className="font-medium text-foreground">{nafathFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Identities</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
                <TableHead className="w-[240px] text-xs font-semibold text-foreground py-3.5 pl-5">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Email / Phone
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Orders
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Total Spend
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Last Order
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Joined
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
                    No customers found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                displayedCustomers.map(c => (
                  <TableRow
                    key={c.id}
                    className="hover:bg-muted/20 border-b border-border/50 h-[58px] transition-colors"
                  >
                    {/* Customer */}
                    <TableCell className="py-2.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/b2c/customers/${c.id}`}
                            className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {c.name}
                          </Link>
                          {c.nafathVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <ShieldCheck className="size-3" />
                              Nafath Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email / Phone */}
                    <TableCell className="py-2.5">
                      <div className="flex flex-col text-xs">
                        <span className="text-foreground">{c.email}</span>
                        <span className="text-muted-foreground font-mono">{c.phone}</span>
                      </div>
                    </TableCell>

                    {/* Orders */}
                    <TableCell className="py-2.5 text-xs font-mono font-medium text-foreground">
                      {c.totalOrders}
                    </TableCell>

                    {/* Total Spend */}
                    <TableCell className="py-2.5 text-sm font-semibold font-mono text-foreground whitespace-nowrap">
                      SAR {c.totalSpentSAR.toLocaleString('en-US')}
                    </TableCell>

                    {/* Last Order */}
                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {c.lastOrderDate}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-2.5">
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-2 py-0.5">
                        Active
                      </Badge>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {c.registeredDate}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-2.5 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link href={`/b2c/customers/${c.id}`} className="flex items-center gap-2 text-xs">
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/b2c/orders" className="flex items-center gap-2 text-xs">
                              <ShoppingBag className="size-3.5 text-muted-foreground" />
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
              Showing 1–{displayedCustomers.length} of {filteredCustomers.length} customers
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
