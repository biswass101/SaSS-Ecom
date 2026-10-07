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
import { Check, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { managementService } from '@/lib/api-services'
import type { Subscription, Payment } from '@/types'

interface PaymentVerificationRow {
  id: string
  storeName: string
  storeSlug: string
  packageName: string
  amount: number
  status: string
  createdAt: string
  paymentId: string
  subscription: any
}

export default function PaymentVerificationPage() {
  const queryClient = useQueryClient()
  const [isVerifying, setIsVerifying] = useState(false)

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['management', 'subscriptions'],
    queryFn: managementService.getSubscriptions,
  })

  const rows: PaymentVerificationRow[] = useMemo(() => {
    const payments: PaymentVerificationRow[] = []

    subscriptions.forEach((sub: any) => {
      if (sub.payments && Array.isArray(sub.payments)) {
        sub.payments.forEach((payment: any) => {
          if (payment.status === 'PENDING') {
            payments.push({
              id: `${sub.id}-${payment.id}`,
              storeName: sub.store?.name ?? 'Unknown',
              storeSlug: sub.store?.slug ?? 'unknown',
              packageName: sub.package?.name ?? 'Unknown',
              amount: payment.amount ?? sub.package?.price ?? 0,
              status: payment.status,
              createdAt: payment.createdAt,
              paymentId: payment.id,
              subscription: sub,
            })
          }
        })
      }
    })

    return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [subscriptions])

  async function handleVerifyPayment(paymentId: string) {
    if (isVerifying) return

    try {
      setIsVerifying(true)
      await managementService.verifyPayment(paymentId, 'VERIFIED')
      await queryClient.invalidateQueries({ queryKey: ['management', 'subscriptions'] })
      toast.success('Payment verified and store activated!')
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Failed to verify payment')
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleRejectPayment(paymentId: string) {
    if (isVerifying) return

    try {
      setIsVerifying(true)
      await managementService.verifyPayment(paymentId, 'REJECTED')
      await queryClient.invalidateQueries({ queryKey: ['management', 'subscriptions'] })
      toast.success('Payment rejected')
    } catch (error) {
      console.error('Rejection error:', error)
      toast.error('Failed to reject payment')
    } finally {
      setIsVerifying(false)
    }
  }

  const columns: ColumnDef<PaymentVerificationRow>[] = [
    {
      accessorKey: 'storeName',
      header: 'Store',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.storeName}</span>
          <span className="text-xs text-muted-foreground">{row.original.storeSlug}</span>
        </div>
      ),
    },
    { accessorKey: 'packageName', header: 'Package' },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => `$${row.original.amount.toFixed(2)}/mo`,
    },
    {
      accessorKey: 'createdAt',
      header: 'Payment Date',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => handleVerifyPayment(row.original.paymentId)}
            disabled={isVerifying}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="size-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRejectPayment(row.original.paymentId)}
            disabled={isVerifying}
          >
            <X className="size-4 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Verification & Store Activation"
        description="Review and verify pending payments to activate new stores"
      />

      {rows.length === 0 && !isLoading ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-green-600/50 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No pending payments</p>
          <p className="text-xs text-muted-foreground mt-1">All payments have been verified</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading payments...</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {table.getHeaderGroups()[0]?.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
            <div className="text-xs text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, rows.length)} of{' '}
              {rows.length} payments
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">How it works</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              When you approve a payment, the store is automatically activated and the store admin will have full access to their dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
