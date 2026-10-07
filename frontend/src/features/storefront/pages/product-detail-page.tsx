import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Minus, Plus, ShoppingCart, Package, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { cn, formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { storefrontService } from '@/lib/api-services'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { storeSlug = '', productId = '' } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { data: store, isLoading: isStoreLoading } = useQuery({
    queryKey: ['storefront', storeSlug, 'store'],
    queryFn: () => storefrontService.getStore(storeSlug),
    enabled: Boolean(storeSlug),
  })
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['storefront', storeSlug, 'product', productId],
    queryFn: () => storefrontService.getProduct(storeSlug, productId),
    enabled: Boolean(storeSlug && productId),
  })
  const { data: relatedResult } = useQuery({
    queryKey: ['storefront', storeSlug, 'related-products', product?.categoryId],
    queryFn: () => storefrontService.getProducts(storeSlug, { categoryId: product?.categoryId ?? '' }),
    enabled: Boolean(storeSlug && product?.categoryId),
  })

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return (relatedResult?.data ?? [])
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
  }, [product, relatedResult])

  function handleAddToCart() {
    if (!product) return
    useCartStore.getState().addItem(storeSlug, product, quantity)
    toast.success(`${product.title} added to cart`, {
      description: `Quantity: ${quantity}`,
    })
    setQuantity(1)
  }

  function handleRelatedAddToCart(p: Product) {
    useCartStore.getState().addItem(storeSlug, p)
    toast.success(`${p.title} added to cart`)
  }

  if (isStoreLoading || isProductLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Loading product...</div>
  }

  if (!product || !store) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-6">
          <Package className="size-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">
          Product not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This product may have been removed or is no longer available.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to={`/${storeSlug}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Store
          </Link>
        </Button>
      </div>
    )
  }

  const inStock = product.stock > 0
  const lowStock = product.stock > 0 && product.stock <= 10

  return (
    <div className="pb-20 md:pb-0">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/${storeSlug}`}>{store.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/${storeSlug}`}>Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product detail */}
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border">
            <ProductColorImage
              color={product.images[selectedImageIndex] || product.images[0]}
              title={product.title}
              className="aspect-square w-full text-4xl"
            />
          </div>
          {/* Image thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    'overflow-hidden rounded-lg border-2 transition-all',
                    selectedImageIndex === i
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <ProductColorImage
                    color={img}
                    title={product.title}
                    className="size-16 sm:size-20"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <Badge variant="secondary" className="mb-3 w-fit">
              {product.category.title}
            </Badge>
          )}

          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Separator className="my-5" />

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Stock status */}
          <div className="mt-5 flex items-center gap-2">
            <div
              className={cn(
                'size-2.5 rounded-full',
                inStock ? (lowStock ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-destructive',
              )}
            />
            <span
              className={cn(
                'text-sm font-medium',
                inStock
                  ? lowStock
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                  : 'text-destructive',
              )}
            >
              {inStock
                ? lowStock
                  ? `Only ${product.stock} left in stock`
                  : `In Stock (${product.stock} available)`
                : 'Out of Stock'}
            </span>
          </div>

          <Separator className="my-5" />

          {/* Quantity selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex size-10 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex w-12 items-center justify-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="flex size-10 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(product.price * quantity)} total
              </span>
            </div>
          </div>

          {/* Add to cart */}
          <Button
            size="lg"
            className="mt-6 w-full gap-2 md:w-auto md:min-w-[240px]"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart className="size-5" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="group overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
              >
                <Link to={`/${storeSlug}/product/${rp.id}`}>
                  <ProductColorImage
                    color={rp.images[0]}
                    title={rp.title}
                    className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="p-3 sm:p-4">
                  <Link to={`/${storeSlug}/product/${rp.id}`}>
                    <h3 className="line-clamp-2 text-sm font-medium leading-tight transition-colors group-hover:text-primary">
                      {rp.title}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-base font-bold text-primary">
                    {formatCurrency(rp.price)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full gap-1.5"
                    onClick={() => handleRelatedAddToCart(rp)}
                  >
                    <ShoppingCart className="size-3.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
