'use client'

import * as React from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export const schema = z.object({
  id: z.union([z.number(), z.string()]),
  orderId: z.string(),
  customer: z.string(),
  orderType: z.string(),
  amount: z.string(),
  status: z.string(),
  orderDate: z.string(),
})

export type B2BOrder = z.infer<typeof schema>

const columnHelper = createColumnHelper<B2BOrder>()

// Status color configurations based on user specifications:
// Pending → Orange
// Confirmed → Blue
// Processing → Purple
// Delivered → Green
// Cancelled → Red
const statusConfig: Record<string, { badge: string; dot: string }> = {
  Pending: {
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    badge: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  Processing: {
    badge: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
  },
  Delivered: {
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
}

const columns = [
  columnHelper.accessor('orderId', {
    header: 'Order ID',
    cell: ({ row }) => (
      <span className="font-semibold text-foreground tracking-tight font-mono text-xs sm:text-sm">
        {row.original.orderId}
      </span>
    ),
  }),
  columnHelper.accessor('customer', {
    header: 'Business Customer',
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.customer}
      </span>
    ),
  }),
  columnHelper.accessor('orderType', {
    header: 'Order Type',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="px-2 py-0.5 font-normal text-muted-foreground border-border/60 rounded-md text-xs"
      >
        {row.original.orderType}
      </Badge>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.original.amount}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const config = statusConfig[status] || {
        badge: 'border-muted bg-muted text-muted-foreground',
        dot: 'bg-muted-foreground',
      }

      return (
        <Badge
          variant="outline"
          className={cn(
            'px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 w-fit rounded-md',
            config.badge
          )}
        >
          <span className={cn('size-1.5 rounded-full shrink-0', config.dot)} />
          {status}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('orderDate', {
    header: 'Order Date',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs sm:text-sm">
        {row.original.orderDate}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted hover:text-foreground"
                size="icon"
                aria-label="Open menu"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Download invoice</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Cancel order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
]

export function DataTable({
  data: initialData,
}: {
  data: B2BOrder[]
}) {
  const [data] = React.useState<B2BOrder[]>(() => initialData)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full flex flex-col gap-4 px-4 lg:px-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Recent B2B Orders
          </h3>
          <p className="text-xs text-muted-foreground">
            Latest wholesale orders, bullion purchases, and fulfillment status
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="font-semibold text-xs text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} orders
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground mr-1">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount() || 1}
          </div>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex items-center justify-center p-0"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 flex items-center justify-center p-0"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Previous page</span>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 flex items-center justify-center p-0"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Next page</span>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex items-center justify-center p-0"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
