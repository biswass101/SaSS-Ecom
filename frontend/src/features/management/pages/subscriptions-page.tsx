import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn, formatDate } from '@/lib/utils'
import { managementService } from '@/lib/api-services'
import type { Subscription, Payment } from '@/types'

const statuses = ['All', 'ACTIVE', 'EXPIRED', 'CANCELLED'] as const

interface SubscriptionRow extends Subscription {
  storeName: string
  packageName: string
  paymentStatus: string
  latestPayment?: Payment
}

export default function SubscriptionsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [isVerifying, setIsVerifying] = useState(false)
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['management', 'subscriptions'],
    queryFn: managementService.getSubscriptions,
  })

  const rows: SubscriptionRow[] = useMemo(() => {
    return subscriptions.map((sub) => {
      const latestPayment = [...(sub.payments ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      return {
        ...sub,
        storeName: sub.store?.name ?? 'Unknown',
        packageName: sub.package?.name ?? 'Unknown',
        paymentStatus: latestPayment?.status ?? 'N/A',
        latestPayment,
      }
    })
  }, [subscriptions])

  async function handlePaymentVerify(paymentId: string, action: 'VERIFIED' | 'REJECTED') {
    if (isVerifying) return

    try {
      setIsVerifying(true)
      console.log('Verifying payment:', paymentId, action)
      await managementService.verifyPayment(paymentId, action)
      await queryClient.invalidateQueries({ queryKey: ['management', 'subscriptions'] })
      toast.success(`Payment ${action.toLowerCase()}`)
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Unable to update payment status')
    } finally {
      setIsVerifying(false)
    }
  }

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
      header: 'Payment Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.original.paymentStatus} />
          {row.original.latestPayment && row.original.paymentStatus === 'PENDING' && (
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isVerifying}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePaymentVerify(row.original.latestPayment!.id, 'VERIFIED')
                }}
                className="rounded p-1 text-success hover:bg-success/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Verify payment"
              >
                <Check className="size-4" />
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePaymentVerify(row.original.latestPayment!.id, 'REJECTED')
                }}
                className="rounded p-1 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reject payment"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>
      ),
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
        description={`${subscriptions.length} total subscriptions`}
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            disabled={isLoading || isVerifying}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
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
            {isLoading ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">Loading subscriptions...</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
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
