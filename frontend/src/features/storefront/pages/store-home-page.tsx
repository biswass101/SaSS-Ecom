import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { cn, formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import {
  getStoreBySlug,
  getProductsByStore,
  getCategoriesByStore,
} from '@/mocks/data'
import type { Product } from '@/types'

export default function StoreHomePage() {
  const { storeSlug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategoryId = searchParams.get('category')

  const store = getStoreBySlug(storeSlug)
  const products = store ? getProductsByStore(store.id) : []
  const categories = store ? getCategoriesByStore(store.id) : []

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((p) => p.categoryId === activeCategoryId)
  }, [products, activeCategoryId])

  function handleCategoryClick(categoryId: string | null) {
    if (categoryId) {
      setSearchParams({ category: categoryId })
    } else {
      setSearchParams({})
    }
  }

  function handleAddToCart(product: Product) {
    useCartStore.getState().addItem(storeSlug, product)
    toast.success(`${product.title} added to cart`)
  }

  if (!store) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-6">
          <ShoppingCart className="size-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">
          Store not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The store you are looking for does not exist or may have been removed.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-10">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {store.name}
        </h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          {store.description ?? 'Explore our curated collection of products.'}
        </p>
      </div>

      {/* Category filter bar */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategoryClick(null)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all',
            !activeCategoryId
              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
          )}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryClick(cat.id)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all',
              activeCategoryId === cat.id
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Product count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredProducts.length}{' '}
        {filteredProducts.length === 1 ? 'product' : 'products'}
        {activeCategoryId && (
          <>
            {' '}
            in{' '}
            <span className="font-medium text-foreground">
              {categories.find((c) => c.id === activeCategoryId)?.title}
            </span>
          </>
        )}
      </p>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try selecting a different category.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => handleCategoryClick(null)}
          >
            View All Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
            >
              <Link to={`/${storeSlug}/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <ProductColorImage
                    color={product.images[0]}
                    title={product.title}
                    className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.category && (
                    <Badge
                      variant="secondary"
                      className="absolute left-2 top-2 shadow-sm"
                    >
                      {product.category.title}
                    </Badge>
                  )}
                  {product.stock <= 10 && product.stock > 0 && (
                    <Badge
                      variant="warning"
                      className="absolute right-2 top-2 shadow-sm"
                    >
                      Low Stock
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute right-2 top-2 shadow-sm"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="p-3 sm:p-4">
                <Link to={`/${storeSlug}/product/${product.id}`}>
                  <h3 className="line-clamp-2 text-sm font-medium leading-tight transition-colors group-hover:text-primary">
                    {product.title}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-primary sm:text-lg">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="mt-3 w-full gap-1.5"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="size-3.5" />
                  <span className="text-xs sm:text-sm">Add to Cart</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
