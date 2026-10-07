import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus, ListOrdered } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getStoreBySlug, getProductsByStore, getOrdersByStore, mockSalesReport } from '@/mocks/data'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { storeSlug } = useParams()
  const store = getStoreBySlug(storeSlug ?? '')
  const products = store ? getProductsByStore(store.id) : []
  const orders = store ? getOrdersByStore(store.id) : []

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue,
    }
  }, [products, orders])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [orders])

  const chartData = useMemo(() => {
    return mockSalesReport.dailyRevenue.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
  }, [])

  if (!store) {
    return (
      <EmptyState
        title="Store not found"
        description="The store you are looking for does not exist."
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Overview for ${store.name}`}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts.toString()}
          change="+3 this month"
          trend="up"
          icon={Package}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toString()}
          change="+12% from last month"
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change="+8.2% from last month"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Avg. Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          change="-2.1% from last month"
          trend="down"
          icon={TrendingUp}
        />
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold">Revenue Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.36 0.07 160)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.36 0.07 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                }}
                formatter={(value: unknown) => [formatCurrency(value as number), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.36 0.07 160)"
                fill="url(#revenueGradient)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
            <Link
              to={`/${storeSlug}/admin/orders`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Orders will appear here once customers start purchasing."
              icon={ShoppingCart}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-3 text-sm font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-3 text-sm">{order.customerName}</td>
                      <td className="px-6 py-3 text-sm font-medium">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-3 text-sm">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to={`/${storeSlug}/admin/products`}>
                <Plus className="size-4" />
                Add Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to={`/${storeSlug}/admin/orders`}>
                <ListOrdered className="size-4" />
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
