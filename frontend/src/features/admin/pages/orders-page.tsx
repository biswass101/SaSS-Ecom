import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, ShoppingBag } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { getStoreBySlug, getOrdersByStore } from '@/mocks/data'
import type { Order } from '@/types'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'

const STATUS_TABS = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const

export default function OrdersPage() {
  const { storeSlug } = useParams()
  const navigate = useNavigate()
  const store = getStoreBySlug(storeSlug ?? '')
  const allOrders = useMemo(
    () => (store ? getOrdersByStore(store.id) : []),
    [store],
  )

  const [activeTab, setActiveTab] = useState<string>('All')

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return allOrders
    return allOrders.filter((o) => o.status === activeTab.toUpperCase())
  }, [allOrders, activeTab])

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Order',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.orderNumber}</span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.customerName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.customerEmail}
            </p>
          </div>
        ),
      },
      {
        id: 'items',
        header: 'Items',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.items.length}{' '}
            {row.original.items.length === 1 ? 'item' : 'items'}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.original.total)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link
              to={`/${storeSlug}/admin/orders/${row.original.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="size-4" />
              View
            </Link>
          </Button>
        ),
      },
    ],
    [storeSlug],
  )

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${allOrders.length} total ${allOrders.length === 1 ? 'order' : 'orders'}`}
      />

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All'
              ? allOrders.length
              : allOrders.filter((o) => o.status === tab.toUpperCase()).length
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab}
              {count > 0 && (
                <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={
            activeTab === 'All'
              ? 'Orders will appear here once customers start purchasing.'
              : `No ${activeTab.toLowerCase()} orders at the moment.`
          }
        />
      ) : (
        <>
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b bg-muted/50">
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {flexRender(
                          h.column.columnDef.header,
                          h.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() =>
                      navigate(
                        `/${storeSlug}/admin/orders/${row.original.id}`,
                      )
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
