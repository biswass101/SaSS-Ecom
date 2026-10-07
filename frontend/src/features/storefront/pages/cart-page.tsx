import { Link, useNavigate, useParams } from 'react-router'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

export default function CartPage() {
  const { storeSlug = '' } = useParams()
  const navigate = useNavigate()

  const items = useCartStore((s) => s.getItems(storeSlug))
  const subtotal = useCartStore((s) => s.getSubtotal(storeSlug))
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const shipping = 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pb-20 text-center md:pb-0">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="size-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Looks like you have not added any products to your cart yet.
          Browse our collection and find something you love.
        </p>
        <Button asChild className="mt-6">
          <Link to={`/${storeSlug}`}>
            <ArrowLeft className="mr-2 size-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Shopping Cart
        </h1>
        <span className="text-sm text-muted-foreground">
          {items.reduce((sum, i) => sum + i.quantity, 0)} items
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                {/* Product image */}
                <Link to={`/${storeSlug}/product/${item.productId}`}>
                  <ProductColorImage
                    color={item.product.images[0] ?? '#ccc'}
                    title={item.product.title}
                    className="size-20 shrink-0 sm:size-24"
                  />
                </Link>

                {/* Product info */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/${storeSlug}/product/${item.productId}`}
                        className="font-medium leading-tight transition-colors hover:text-primary"
                      >
                        {item.product.title}
                      </Link>
                      {item.product.category && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.product.category.title}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(storeSlug, item.productId)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            storeSlug,
                            item.productId,
                            item.quantity - 1,
                          )
                        }
                        className="flex size-8 items-center justify-center transition-colors hover:bg-muted"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="flex w-10 items-center justify-center text-sm font-semibold tabular-nums">
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
                        className="flex size-8 items-center justify-center transition-colors hover:bg-muted"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-base font-bold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button asChild variant="ghost" size="sm">
              <Link to={`/${storeSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Free
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(total)}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => navigate(`/${storeSlug}/checkout`)}
            >
              Proceed to Checkout
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
