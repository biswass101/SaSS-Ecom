import { Link, useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Printer, Mail, Phone, MapPin, Check, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { adminService } from '@/lib/api-services'
import type { OrderStatus } from '@/types'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STATUS_FLOW: OrderStatus[] = [
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
]

const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'FAILED'] as const
type PaymentStatus = typeof PAYMENT_STATUSES[number]

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current)
  if (idx === -1 && current === 'PENDING') return 'CONFIRMED'
  if (idx >= 0 && idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1]
  return null
}

function statusLabel(status: OrderStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default function OrderDetailPage() {
  const { storeSlug, orderId } = useParams()
  const queryClient = useQueryClient()
  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', storeSlug, 'order', orderId],
    queryFn: () => adminService.getOrder(storeSlug ?? '', orderId ?? ''),
    enabled: Boolean(storeSlug && orderId),
  })

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading order...</div>
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="The order you are looking for does not exist."
        action={
          <Button variant="outline" asChild>
            <Link to={`/${storeSlug}/admin/orders`}>
              <ArrowLeft className="size-4" />
              Back to Orders
            </Link>
          </Button>
        }
      />
    )
  }

  const currentOrder = order
  const nextStatus = getNextStatus(currentOrder.status)
  const paymentStatus: PaymentStatus = (order as any).paymentStatus || 'PENDING'

  async function handleStatusUpdate() {
    if (!nextStatus) return
    try {
      await adminService.updateOrderStatus(storeSlug ?? '', currentOrder.id, nextStatus)
      await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'order', orderId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'orders'] })
      toast.success(`Order marked as ${statusLabel(nextStatus)}`)
    } catch {
      toast.error('Unable to update order status')
    }
  }

  async function handlePaymentStatusUpdate(newStatus: PaymentStatus) {
    try {
      await adminService.updateOrderPaymentStatus(storeSlug ?? '', currentOrder.id, newStatus)
      await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'order', orderId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'orders'] })
      toast.success(`Payment marked as ${newStatus.toLowerCase()}`)
    } catch {
      toast.error('Unable to update payment status')
    }
  }

  function getPaymentStatusIcon(status: PaymentStatus) {
    switch (status) {
      case 'COMPLETED':
        return <Check className="size-4 text-success" />
      case 'FAILED':
        return <XCircle className="size-4 text-destructive" />
      default:
        return <Clock className="size-4 text-warning" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/${storeSlug}/admin/orders`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Order {order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nextStatus && (
            <Button onClick={handleStatusUpdate}>
              Mark as {statusLabel(nextStatus)}
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Printable invoice section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items table & summary */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card shadow-soft">
            <div className="border-b px-6 py-4">
              <h2 className="font-display text-lg font-semibold">
                Order Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Product
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {item.productTitle}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {formatCurrency(item.productPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order summary */}
            <div className="border-t px-6 py-4">
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer details */}
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display font-semibold">
              Customer Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-muted p-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Name</dt>
                  <dd className="font-medium">{order.customerName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-muted p-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="font-medium">{order.customerEmail}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-muted p-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{order.customerPhone}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display font-semibold">
              Shipping Address
            </h3>
            <div className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 rounded-md bg-muted p-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
              </div>
              <p className="leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display font-semibold">
              Payment Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  {getPaymentStatusIcon(paymentStatus)}
                  <span className="text-sm font-medium capitalize">{paymentStatus.toLowerCase()}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handlePaymentStatusUpdate(status)}
                    className={cn(
                      'rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                      paymentStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'border bg-background hover:bg-muted'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border bg-card p-6 shadow-soft">
              <h3 className="mb-3 font-display font-semibold">
                Order Notes
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {order.notes}
              </p>
            </div>
          )}

          {/* Status timeline */}
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display font-semibold">
              Order Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="size-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Created on {formatDate(order.createdAt)}
                </span>
              </div>
              {order.status !== 'PENDING' && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Last updated {formatDate(order.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
