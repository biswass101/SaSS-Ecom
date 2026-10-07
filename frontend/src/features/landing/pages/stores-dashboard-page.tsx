import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { Store, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { storefrontService } from '@/lib/api-services'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/shared/empty-state'

export default function StoresDashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  // Redirect if not authenticated or not a store owner
  if (!user || user.role !== 'STORE_ADMIN') {
    navigate('/')
    return null
  }

  // Since we don't have a dedicated stores API endpoint for current user,
  // we'll display a simple dashboard with quick actions
  const { data: stores = [] } = useQuery({
    queryKey: ['user-stores'],
    queryFn: async () => {
      // In a real app, this would fetch stores for the current user
      // For now, we return empty array as placeholder
      return []
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary p-2">
              <Store className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Stores</h1>
              <p className="text-muted-foreground mt-1">Manage and view all your stores</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          <Link
            to="/create-store"
            className="group rounded-xl border border-dashed border-primary/30 p-6 transition-all hover:border-primary hover:bg-primary/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Create New Store</h3>
                <p className="text-sm text-muted-foreground">Launch a new online store</p>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <div className="rounded-xl border border-dashed border-muted-foreground/20 p-6 bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Total Stores</h3>
                <p className="text-2xl font-bold mt-2 text-primary">{stores.length}</p>
              </div>
              <Store className="size-8 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        {/* Stores List */}
        {stores.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No stores yet"
            description="Create your first store to start selling online. You can manage multiple stores from here."
            action={
              <Button asChild>
                <Link to="/create-store">
                  <Plus className="size-4 mr-2" />
                  Create First Store
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Store Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store: any) => (
                    <tr key={store.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <span className="font-medium">{store.name}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{store.slug}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(store.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/${store.slug}`}>View Store</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/${store.slug}/admin`}>Manage</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 border">
          <h3 className="font-semibold mb-2">Need help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your stores, products, orders, and payments all in one place. Each store has its own admin dashboard.
          </p>
          <Button variant="outline" size="sm">Learn More</Button>
        </div>
      </div>
    </div>
  )
}
