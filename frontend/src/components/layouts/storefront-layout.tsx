import {
  ChevronRight,
  Heart,
  Home,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Settings,
  Trash2,
  User,
  X,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { useUiStore } from '@/stores/ui-store'
import { storefrontService } from '@/lib/api-services'

export default function StorefrontLayout() {
  const { storeSlug = '' } = useParams()
  const user = useAuthStore((s) => s.user)
  const handleLogout = useLogout()
  const { data: store, isError: isStoreError } = useQuery({
    queryKey: ['storefront', storeSlug, 'store'],
    queryFn: () => storefrontService.getStore(storeSlug),
    enabled: Boolean(storeSlug),
  })
  const { data: categories = [], isError: isCategoriesError } = useQuery({
    queryKey: ['storefront', storeSlug, 'categories'],
    queryFn: () => storefrontService.getCategories(storeSlug),
    enabled: Boolean(storeSlug),
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const isStoreOwner = user?.role === 'STORE_ADMIN'

  const cartDrawerOpen = useUiStore((s) => s.cartDrawerOpen)
  const setCartDrawerOpen = useUiStore((s) => s.setCartDrawerOpen)
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen)
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen)

  const cartItems = useCartStore((s) => s.getItems(storeSlug))
  const cartCount = useCartStore((s) => s.getItemCount(storeSlug))
  const cartSubtotal = useCartStore((s) => s.getSubtotal(storeSlug))
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const hasStoreError = isStoreError || isCategoriesError

  return (
    <div className="min-h-screen">
      {hasStoreError && (
        <div className="border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-center text-xs text-destructive">
          Store data could not be loaded. Check that the API is running and try refreshing.
        </div>
      )}
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-40 hidden border-b bg-background/95 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to={`/${storeSlug}`} className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {store?.name?.charAt(0) ?? 'S'}
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                {store?.name ?? 'Store'}
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                to={`/${storeSlug}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                All Products
              </Link>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${storeSlug}?category=${cat.id}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {cat.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="h-9 w-48 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                aria-label="Search"
              >
                <Search className="size-4" />
              </button>
            )}
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                  title="Profile"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {user.name?.charAt(0) ?? 'U'}
                  </div>
                </button>
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-lg">
                      {isStoreOwner && (
                        <Link
                          to={`/${storeSlug}/admin`}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          <Settings className="size-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout()
                          setProfileDropdownOpen(false)
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
            ) : null}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <Link to={`/${storeSlug}`} className="font-display text-lg font-bold">
          {store?.name ?? 'Store'}
        </Link>
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="relative"
          aria-label="Cart"
        >
          <ShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background p-4 shadow-xl md:hidden">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-bold">
                {store?.name}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="space-y-1">
              <Link
                to={`/${storeSlug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${storeSlug}?category=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {cat.title}
                  <ChevronRight className="size-4" />
                </Link>
              ))}
              {isStoreOwner && (
                <Link
                  to={`/${storeSlug}/admin`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground mt-3 border-t pt-3"
                >
                  Admin Panel
                  <Settings className="size-4" />
                </Link>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setCartDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-display text-lg font-bold">
                Your Cart ({cartCount})
              </h2>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="mb-3 size-12 text-muted-foreground/40" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add some products to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 rounded-lg border p-3"
                    >
                      <ProductColorImage
                        color={item.product.images[0] ?? '#ccc'}
                        title={item.product.title}
                        className="size-16 shrink-0"
                      />
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-medium leading-tight">
                          {item.product.title}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-primary">
                          {formatCurrency(item.product.price)}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  storeSlug,
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="flex size-7 items-center justify-center rounded border hover:bg-muted"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  storeSlug,
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="flex size-7 items-center justify-center rounded border hover:bg-muted"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(storeSlug, item.productId)
                            }
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Link
                    to={`/${storeSlug}/cart`}
                    onClick={() => setCartDrawerOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors hover:bg-muted"
                  >
                    View Cart
                  </Link>
                  <Link
                    to={`/${storeSlug}/checkout`}
                    onClick={() => setCartDrawerOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t bg-background md:hidden">
        <Link
          to={`/${storeSlug}`}
          className="flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="size-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          to={`/${storeSlug}`}
          className="flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-5" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link
          to={`/${storeSlug}`}
          className="flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Heart className="size-5" />
          <span className="text-[10px] font-medium">Wishlist</span>
        </Link>
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <Link
          to={`/${storeSlug}/admin`}
          className="flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <User className="size-5" />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="border-t bg-muted/30 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="font-display text-lg font-bold">
                {store?.name ?? 'Store'}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {store?.description ?? 'Your favorite online store.'}
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/${storeSlug}?category=${cat.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contact Us</li>
                <li>Shipping & Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            Powered by{' '}
            <Link to="/" className="font-medium hover:text-foreground">
              StoreStack
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
