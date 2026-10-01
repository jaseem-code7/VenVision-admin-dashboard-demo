'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Warehouse,
  Search,
  Filter,
  MoreVertical,
  Plus,
  RotateCcw,
  Edit2,
  History,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Package
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { handleClickableRow, handleClickableRowKeyDown } from '@/lib/clickable-row'

export interface InventoryItem {
  id: string
  name: string
  sku: string
  channel: 'B2C' | 'B2B'
  category: string
  material: string
  availableStock: number
  reservedStock: number
  lowStockLevel: number
  unit: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  updatedAt: string
}

export const initialInventoryData: InventoryItem[] = [
  {
    id: 'inv-1',
    name: '100g 999.9 Fine Gold Cast Bar',
    sku: 'VV-BAR-999-100G',
    channel: 'B2B',
    category: 'Gold Bar',
    material: '24K Gold',
    availableStock: 45,
    reservedStock: 10,
    lowStockLevel: 5,
    unit: 'bars',
    status: 'In Stock',
    updatedAt: '15 mins ago'
  },
  {
    id: 'inv-2',
    name: 'Royale Solitaire Diamond Ring (1.0ct)',
    sku: 'VV-RG-18K-001',
    channel: 'B2C',
    category: 'Rings',
    material: 'Diamond',
    availableStock: 14,
    reservedStock: 2,
    lowStockLevel: 3,
    unit: 'pcs',
    status: 'In Stock',
    updatedAt: '1 hour ago'
  },
  {
    id: 'inv-3',
    name: '18K White Gold Solitaire Mounts (Lot of 10)',
    sku: 'VV-LOT-18K-SL10',
    channel: 'B2B',
    category: 'Findings',
    material: '18K Gold',
    availableStock: 3,
    reservedStock: 1,
    lowStockLevel: 5,
    unit: 'lots',
    status: 'Low Stock',
    updatedAt: '3 hours ago'
  },
  {
    id: 'inv-4',
    name: 'Najd Heritage Choker Necklace',
    sku: 'VV-NK-21K-002',
    channel: 'B2C',
    category: 'Necklaces',
    material: '21K Gold',
    availableStock: 8,
    reservedStock: 0,
    lowStockLevel: 2,
    unit: 'pcs',
    status: 'In Stock',
    updatedAt: 'Yesterday'
  },
  {
    id: 'inv-5',
    name: '22K Handcrafted Filigree Bangles',
    sku: 'VV-BNG-22K-BNDL',
    channel: 'B2B',
    category: 'Gold Jewellery',
    material: '22K Gold',
    availableStock: 0,
    reservedStock: 0,
    lowStockLevel: 4,
    unit: 'sets',
    status: 'Out of Stock',
    updatedAt: '2 days ago'
  },
  {
    id: 'inv-6',
    name: 'Fine Foundry 999.9 Gold Grain Pellets',
    sku: 'VV-GRN-999-500G',
    channel: 'B2B',
    category: 'Bullion',
    material: '24K Gold',
    availableStock: 3200,
    reservedStock: 500,
    lowStockLevel: 500,
    unit: 'grams',
    status: 'In Stock',
    updatedAt: '3 days ago'
  }
]

export default function InventoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryData)
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [materialFilter, setMaterialFilter] = useState('All')
  const [stockStatusFilter, setStockStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Stock Adjustment Modal state
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add')
  const [adjustQty, setAdjustQty] = useState<number>(1)
  const [adjustReason, setAdjustReason] = useState('Vault Delivery Restock')

  const hasActiveFilters =
    searchQuery !== '' ||
    channelFilter !== 'All' ||
    categoryFilter !== 'All' ||
    materialFilter !== 'All' ||
    stockStatusFilter !== 'All'

  const handleReset = () => {
    setSearchQuery('')
    setChannelFilter('All')
    setCategoryFilter('All')
    setMaterialFilter('All')
    setStockStatusFilter('All')
    setCurrentPage(1)
    toast.info('Inventory filters reset')
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesChannel = channelFilter === 'All' || item.channel === channelFilter
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesMaterial = materialFilter === 'All' || item.material === materialFilter
      const matchesStock = stockStatusFilter === 'All' || item.status === stockStatusFilter

      return matchesSearch && matchesChannel && matchesCategory && matchesMaterial && matchesStock
    })
  }, [items, searchQuery, channelFilter, categoryFilter, materialFilter, stockStatusFilter])

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage) || 1
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustQty(1)
    setAdjustmentType('add')
    setAdjustModalOpen(true)
  }

  const handleSaveAdjustment = () => {
    if (!selectedItem) return
    const diff = adjustmentType === 'add' ? adjustQty : -adjustQty
    const newStock = Math.max(0, selectedItem.availableStock + diff)
    const newStatus: InventoryItem['status'] =
      newStock === 0 ? 'Out of Stock' : newStock <= selectedItem.lowStockLevel ? 'Low Stock' : 'In Stock'

    setItems(prev =>
      prev.map(it =>
        it.id === selectedItem.id
          ? { ...it, availableStock: newStock, status: newStatus, updatedAt: 'Just now' }
          : it
      )
    )
    setAdjustModalOpen(false)
    toast.success(`Inventory updated for ${selectedItem.sku}`, {
      description: `New balance: ${newStock} ${selectedItem.unit} (${adjustReason})`
    })
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <span>Management</span>
            <span>&gt;</span>
            <span className="text-foreground">Inventory</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centralized stock monitoring, vault allocations, low stock alerts and multi-channel audit controls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Exporting full vault ledger...')}
          className="h-9 px-3 text-xs rounded-xl"
        >
          Export Vault Ledger
        </Button>
      </div>

      {/* Main Single Container */}
      <Card className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name, SKU..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 pl-10 pr-4 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Channel Filter */}
            <div className="w-full sm:w-auto">
              <Select value={channelFilter} onValueChange={v => { setChannelFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[145px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Channel:</span>
                    <span className="font-medium text-foreground">{channelFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Channels</SelectItem>
                  <SelectItem value="B2C">B2C Retail</SelectItem>
                  <SelectItem value="B2B">B2B Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[155px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Category:</span>
                    <span className="font-medium text-foreground">{categoryFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Gold Bar">Gold Bar</SelectItem>
                  <SelectItem value="Bullion">Bullion</SelectItem>
                  <SelectItem value="Rings">Rings</SelectItem>
                  <SelectItem value="Necklaces">Necklaces</SelectItem>
                  <SelectItem value="Findings">Findings</SelectItem>
                  <SelectItem value="Gold Jewellery">Gold Jewellery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Material Filter */}
            <div className="w-full sm:w-auto">
              <Select value={materialFilter} onValueChange={v => { setMaterialFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[145px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Material:</span>
                    <span className="font-medium text-foreground">{materialFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Materials</SelectItem>
                  <SelectItem value="24K Gold">24K Gold</SelectItem>
                  <SelectItem value="22K Gold">22K Gold</SelectItem>
                  <SelectItem value="21K Gold">21K Gold</SelectItem>
                  <SelectItem value="18K Gold">18K Gold</SelectItem>
                  <SelectItem value="Diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Status Filter */}
            <div className="w-full sm:w-auto">
              <Select value={stockStatusFilter} onValueChange={v => { setStockStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-lg text-xs bg-background border-border">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-1">Status:</span>
                    <span className="font-medium text-foreground">{stockStatusFilter}</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Stock Levels</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
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
                  Product
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  SKU
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Channel
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Available Stock
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Reserved
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Low Stock Level
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3.5">
                  Updated
                </TableHead>
                <TableHead className="w-[50px] text-right py-3.5 pr-5">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center text-sm text-muted-foreground">
                    No items found in vault inventory.
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map(item => (
                  <TableRow
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View inventory details for ${item.name}`}
                    onClick={event => handleClickableRow(event, () => router.push(`/inventory/${item.id}`))}
                    onKeyDown={event => handleClickableRowKeyDown(event, () => router.push(`/inventory/${item.id}`))}
                    className="hover:bg-muted/20 border-b border-border/50 h-[58px] transition-colors cursor-pointer"
                  >
                    <TableCell className="py-2.5 pl-5">
                      <div className="font-medium text-sm text-foreground truncate max-w-[220px]">
                        {item.name}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{item.material}</span>
                    </TableCell>

                    <TableCell className="py-2.5 font-mono text-xs text-muted-foreground">
                      {item.sku}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${
                        item.channel === 'B2B' ? 'border-primary/40 text-primary dark:text-primary-foreground bg-secondary/50 font-medium' : 'text-muted-foreground'
                      }`}>
                        {item.channel}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-foreground">
                      {item.category}
                    </TableCell>

                    <TableCell className="py-2.5 font-mono font-bold text-sm text-foreground">
                      {item.availableStock.toLocaleString()} {item.unit}
                    </TableCell>

                    <TableCell className="py-2.5 font-mono text-xs text-muted-foreground">
                      {item.reservedStock} {item.unit}
                    </TableCell>

                    <TableCell className="py-2.5 font-mono text-xs text-muted-foreground">
                      &le; {item.lowStockLevel} {item.unit}
                    </TableCell>

                    <TableCell className="py-2.5">
                      {item.status === 'In Stock' && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5">
                          In Stock
                        </Badge>
                      )}
                      {item.status === 'Low Stock' && (
                        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5">
                          Low Stock
                        </Badge>
                      )}
                      {item.status === 'Out of Stock' && (
                        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs px-2 py-0.5">
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {item.updatedAt}
                    </TableCell>

                    <TableCell className="py-2.5 pr-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleOpenAdjust(item)}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                            <span>Adjust Stock</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.info(`Viewing stock movement audit for ${item.sku}`)}
                            className="flex items-center gap-2 text-xs cursor-pointer"
                          >
                            <History className="size-3.5 text-muted-foreground" />
                            <span>View History</span>
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
              Showing 1–{displayedItems.length} of {filteredItems.length} inventory lines
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
              variant="default"
              size="sm"
              className="size-8 p-0 text-xs rounded-lg font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
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
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Adjust Stock Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Adjust Vault Stock</DialogTitle>
            <DialogDescription>
              {selectedItem?.name} ({selectedItem?.sku})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="flex justify-between items-center rounded-lg bg-muted/30 p-3 border border-border/60">
              <span className="text-muted-foreground">Current Available Balance:</span>
              <span className="font-mono font-bold text-sm text-foreground">
                {selectedItem?.availableStock} {selectedItem?.unit}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Adjustment Action</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'add' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdjustmentType('add')}
                  className={adjustmentType === 'add' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs' : ''}
                >
                  + Add Stock (Restock)
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdjustmentType('remove')}
                  className={adjustmentType === 'remove' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs' : ''}
                >
                  - Deduct Stock (Audit)
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Quantity to {adjustmentType === 'add' ? 'Add' : 'Deduct'} ({selectedItem?.unit})</Label>
              <Input
                type="number"
                min="1"
                value={adjustQty}
                onChange={e => setAdjustQty(parseInt(e.target.value) || 1)}
                className="h-10 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Reason for Audit Log</Label>
              <Select value={adjustReason} onValueChange={setAdjustReason}>
                <SelectTrigger className="h-10 text-xs rounded-lg">
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Vault Delivery Restock">Vault Delivery Restock</SelectItem>
                  <SelectItem value="Customer Return Restock">Customer Return Restock</SelectItem>
                  <SelectItem value="Quarterly Physical Audit Adjustment">Quarterly Physical Audit</SelectItem>
                  <SelectItem value="Foundry Remelt Reallocation">Foundry Remelt Reallocation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAdjustment}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
