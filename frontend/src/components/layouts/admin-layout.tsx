import {
  BarChart3,
  ChevronDown,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  X,
  BarChart2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router'
import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useIsMobile } from '@/hooks/use-media-query'

function getNavLinks(slug: string) {
  return [
    { href: `/${slug}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${slug}/admin/categories`, label: 'Categories', icon: FolderTree },
    { href: `/${slug}/admin/products`, label: 'Products', icon: Package },
    { href: `/${slug}/admin/orders`, label: 'Orders', icon: ShoppingCart },
    { href: `/${slug}/admin/reports`, label: 'Reports', icon: BarChart3 },
  ]
}

export default function AdminLayout() {
  const { storeSlug = '' } = useParams()
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const handleLogout = useLogout()
  const isMobile = useIsMobile()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navLinks = getNavLinks(storeSlug)

  const isActive = (href: string) => {
    if (href === `/${storeSlug}/admin`) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <Logo variant="light" iconOnly />
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            Store Admin
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">
            {storeSlug}
          </p>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(link.href)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to={`/${storeSlug}`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <Package className="size-4" />
          View Store
        </Link>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile ? (
        sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50">{sidebar}</div>
          </>
        )
      ) : (
        <div className="shrink-0">{sidebar}</div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-4" />
            </button>
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Store Admin / </span>
              <span className="font-medium text-foreground">
                {navLinks.find((l) => isActive(l.href))?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-lg">
                    {user?.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/management"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <BarChart2 className="size-4" />
                        Management
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout()
                        setDropdownOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
