import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, PackageOpen, Image as ImageIcon, X as XIcon, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useRef } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { adminService } from '@/lib/api-services'
import type { Product } from '@/types'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { SearchInput } from '@/components/shared/search-input'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  price: z.coerce.number().positive('Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function ProductsPage() {
  const { storeSlug } = useParams()
  const queryClient = useQueryClient()
  const { data: productResult, isLoading: productsLoading } = useQuery({
    queryKey: ['admin', storeSlug, 'products'],
    queryFn: () => adminService.getProducts(storeSlug ?? ''),
    enabled: Boolean(storeSlug),
  })
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin', storeSlug, 'categories'],
    queryFn: () => adminService.getCategories(storeSlug ?? ''),
    enabled: Boolean(storeSlug),
  })
  const products = productResult?.data ?? []

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [productImages, setProductImages] = useState<string[]>(['oklch(0.7 0.15 45)'])
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: {
      isActive: true,
      stock: 0,
    },
  })

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter((p) => p.title.toLowerCase().includes(q))
  }, [products, search])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are supported')
        continue
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setProductImages((prev) => [...prev, base64])
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleAddImageUrl = useCallback(() => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      new URL(imageUrl)
      setProductImages((prev) => [...prev, imageUrl])
      setImageUrl('')
      toast.success('Image URL added')
    } catch {
      toast.error('Please enter a valid image URL')
    }
  }, [imageUrl])

  const handleRemoveImage = useCallback((index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const openCreateDialog = useCallback(() => {
    setEditingProduct(null)
    setProductImages(['oklch(0.7 0.15 45)'])
    setImageUrl('')
    reset({
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      isActive: true,
    })
    setDialogOpen(true)
  }, [reset])

  const openEditDialog = useCallback(
    (product: Product) => {
      setEditingProduct(product)
      setProductImages(product.images && product.images.length > 0 ? product.images : ['oklch(0.7 0.15 45)'])
      setImageUrl('')
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        stock: product.stock,
        isActive: product.isActive,
      })
      setDialogOpen(true)
    },
    [reset],
  )

  const onSubmit = useCallback(
    async (data: ProductFormData) => {
      if (productImages.length === 0) {
        toast.error('Please add at least one image')
        return
      }

      try {
        const payload = { ...data, images: productImages }
        if (editingProduct) {
          await adminService.updateProduct(storeSlug ?? '', editingProduct.id, payload)
          toast.success('Product updated successfully')
        } else {
          await adminService.createProduct(storeSlug ?? '', payload)
          toast.success('Product created successfully')
        }
        await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'products'] })
        setDialogOpen(false)
      } catch {
        toast.error('Unable to save product')
      }
    },
    [editingProduct, queryClient, storeSlug, productImages],
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await adminService.deleteProduct(storeSlug ?? '', deleteTarget.id)
      await queryClient.invalidateQueries({ queryKey: ['admin', storeSlug, 'products'] })
      toast.success('Product deleted successfully')
      setDeleteTarget(null)
    } catch {
      toast.error('Unable to delete product')
    }
  }, [deleteTarget, queryClient, storeSlug])

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'image',
        header: '',
        cell: ({ row }) => (
          <ProductColorImage
            color={row.original.images[0] ?? 'oklch(0.5 0.1 200)'}
            title={row.original.title}
            className="size-10"
          />
        ),
        size: 56,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.category?.title ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <span className="font-medium">{formatCurrency(row.original.price)}</span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
          const stock = row.original.stock
          return (
            <span
              className={
                stock <= 10 ? 'font-medium text-destructive' : 'text-muted-foreground'
              }
            >
              {stock}
            </span>
          )
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge status={row.original.isActive ? 'ACTIVE' : 'INACTIVE'} />
        ),
      },
      {
        id: 'created',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => openEditDialog(row.original)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row.original)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [openEditDialog],
  )

  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${products.length} ${products.length === 1 ? 'product' : 'products'}`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
              className="w-64"
            />
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Add Product
            </Button>
          </div>
        }
      />

      {productsLoading || categoriesLoading ? <div className="py-12 text-center text-sm text-muted-foreground">Loading products...</div> : filteredProducts.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={search ? 'No products found' : 'No products yet'}
          description={
            search
              ? `No products match "${search}". Try a different search term.`
              : 'Create your first product to start selling.'
          }
          action={
            !search ? (
              <Button onClick={openCreateDialog}>
                <Plus className="size-4" />
                Add Product
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b bg-muted/50">
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the product details below.'
                : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-title">Title</Label>
              <Input
                id="product-title"
                placeholder="e.g., Organic Avocados"
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                placeholder="Describe the product..."
                rows={3}
                aria-invalid={!!errors.description}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price ($)</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  aria-invalid={!!errors.price}
                  {...register('price')}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  placeholder="0"
                  aria-invalid={!!errors.stock}
                  {...register('stock')}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!errors.categoryId}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="product-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Make this product visible in the store
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="product-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Image Management */}
            <div className="space-y-3 rounded-lg border p-4">
              <Label>Product Images</Label>

              {/* Image List */}
              {productImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                      {img.startsWith('data:') || img.startsWith('http') ? (
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div
                          className="size-full"
                          style={{ backgroundColor: img }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 hidden items-center justify-center bg-black/50 transition-all group-hover:flex"
                      >
                        <XIcon className="size-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload File */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Upload className="size-4" />
                  Upload from device
                </button>
              </div>

              {/* Add Image URL */}
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddImageUrl()}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
