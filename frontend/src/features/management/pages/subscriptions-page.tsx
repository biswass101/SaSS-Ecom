import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn, formatDate } from '@/lib/utils'
import { mockPayments, mockStores, mockSubscriptions } from '@/mocks/data'
import type { Subscription } from '@/types'

const statuses = ['All', 'ACTIVE', 'EXPIRED', 'CANCELLED'] as const

interface SubscriptionRow extends Subscription {
  storeName: string
  packageName: string
  paymentStatus: string
}

export default function SubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const rows: SubscriptionRow[] = mockSubscriptions.map((sub) => {
    const store = mockStores.find((s) => s.id === sub.storeId)
    const latestPayment = mockPayments
      .filter((p) => p.subscriptionId === sub.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    return {
      ...sub,
      storeName: store?.name ?? 'Unknown',
      packageName: sub.package?.name ?? 'Unknown',
      paymentStatus: latestPayment?.status ?? 'N/A',
    }
  })

  const filtered = useMemo(
    () => statusFilter === 'All' ? rows : rows.filter((r) => r.status === statusFilter),
    [rows, statusFilter],
  )

  const columns: ColumnDef<SubscriptionRow>[] = [
    { accessorKey: 'storeName', header: 'Store' },
    { accessorKey: 'packageName', header: 'Package' },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'startDate',
      header: 'Start',
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
      id: 'endDate',
      header: 'End',
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      id: 'payment',
      header: 'Payment',
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    },
  ]

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description={`${mockSubscriptions.length} total subscriptions`}
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              statusFilter === status
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )}
          >
            {status === 'All' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="rounded-xl border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/50">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
