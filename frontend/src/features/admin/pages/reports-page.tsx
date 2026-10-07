import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockSalesReport } from '@/mocks/data'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'

export default function ReportsPage() {
  const report = mockSalesReport

  const chartData = useMemo(
    () =>
      report.dailyRevenue.map((d) => ({
        ...d,
        label: new Date(d.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      })),
    [report.dailyRevenue],
  )

  const tooltipStyle = {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales Reports"
        description={`${report.period} overview`}
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(report.totalRevenue)}
          change="+18.2% from last period"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={report.totalOrders.toString()}
          change="+12.4% from last period"
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          label="Avg. Order Value"
          value={formatCurrency(report.averageOrderValue)}
          change="+4.1% from last period"
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          label="Top Product"
          value={
            report.topProducts[0]?.title.split('(')[0].trim() ?? '-'
          }
          change={formatCurrency(report.topProducts[0]?.revenue ?? 0)}
          icon={BarChart3}
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue bar chart */}
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-display text-lg font-semibold">
            Daily Revenue
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown) => [
                    formatCurrency(value as number),
                    'Revenue',
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="oklch(0.36 0.07 160)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders trend line chart */}
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-display text-lg font-semibold">
            Orders Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown) => [value as number, 'Orders']}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="oklch(0.66 0.15 45)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'oklch(0.66 0.15 45)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="border-b px-6 py-4">
          <h3 className="font-display text-lg font-semibold">
            Top Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
