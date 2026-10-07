import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

interface InvoiceTemplateProps {
  order: Order
  storeName?: string
}

export function InvoiceTemplate({ order, storeName = 'Store' }: InvoiceTemplateProps) {
  return (
    <div className="space-y-6 bg-white p-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{storeName}</h1>
          <p className="text-sm text-gray-600">Order Invoice</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Order #{order.orderNumber}</p>
          <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Bill To
          </h3>
          <div className="space-y-1">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Ship To
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {order.shippingAddress}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Description
              </th>
              <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Qty
              </th>
              <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Unit Price
              </th>
              <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-3 text-sm">
                  <p className="font-medium text-gray-900">{item.productTitle}</p>
                </td>
                <td className="py-3 text-right text-sm text-gray-600">
                  {item.quantity}
                </td>
                <td className="py-3 text-right text-sm text-gray-600">
                  {formatCurrency(item.productPrice)}
                </td>
                <td className="py-3 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium text-gray-900">Free</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status & Notes */}
      <div className="grid grid-cols-2 gap-8 border-t pt-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Order Status
          </h3>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-gray-600">Fulfillment</p>
              <p className="font-medium capitalize text-gray-900">
                {order.status.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Payment</p>
              <p className="font-medium capitalize text-gray-900">
                {order.paymentStatus.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        {order.notes && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Notes
            </h3>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-6 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
