import {
  Activity,
  Clock,
  DollarSign,
  Store,
} from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockPayments, mockStores, mockSubscriptions } from '@/mocks/data'

export default function ManagementDashboard() {
  const activeStores = mockStores.filter((s) => s.status === 'ACTIVE').length
  const totalRevenue = mockSubscriptions.reduce((sum, sub) => {
    const payments = mockPayments.filter(
      (p) => p.subscriptionId === sub.id && p.status === 'VERIFIED',
    )
    return sum + payments.reduce((s, p) => s + p.amount, 0)
  }, 0)
  const pendingPayments = mockPayments.filter((p) => p.status === 'PENDING')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Overview"
        description="Monitor your SaaS platform at a glance"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Stores"
          value={mockStores.length.toString()}
          change="+2 this month"
          trend="up"
          icon={Store}
        />
        <StatCard
          label="Active Stores"
          value={activeStores.toString()}
          icon={Activity}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change="+12%"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments.length.toString()}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="font-semibold">Recent Stores</h3>
            <Link
              to="/management/stores"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {mockStores.map((store) => (
              <div key={store.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                  {store.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{store.name}</p>
                  <p className="text-xs text-muted-foreground">
                    /{store.slug} &middot; {store.owner?.name ?? 'Unknown'}
                  </p>
                </div>
                <StatusBadge status={store.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="font-semibold">Pending Payments</h3>
            <Link
              to="/management/subscriptions"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {pendingPayments.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No pending payments
            </div>
          ) : (
            <div className="divide-y">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      TXN: {payment.transactionId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Account: {payment.accountNo} &middot;{' '}
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(payment.amount)}
                    </p>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
