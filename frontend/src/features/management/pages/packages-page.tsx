import { zodResolver } from '@hookform/resolvers/zod'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Check, Edit, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency } from '@/lib/utils'
import { managementService } from '@/lib/api-services'
import type { Package } from '@/types'

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  billingCycle: z.enum(['monthly', 'yearly']),
  maxProducts: z.coerce.number().int(),
  maxOrders: z.coerce.number().int(),
  features: z.string().min(1, 'At least one feature is required'),
  isActive: z.boolean(),
})
type PackageFormValues = z.infer<typeof packageSchema>

export default function PackagesPage() {
  const queryClient = useQueryClient()
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['management', 'packages'],
    queryFn: managementService.getPackages,
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as never,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      maxProducts: 50,
      maxOrders: 200,
      features: '',
      isActive: true,
    },
  })

  function openCreate() {
    setEditingId(null)
    form.reset({
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      maxProducts: 50,
      maxOrders: 200,
      features: '',
      isActive: true,
    })
    setDialogOpen(true)
  }

  function openEdit(pkg: Package) {
    setEditingId(pkg.id)
    form.reset({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      billingCycle: pkg.billingCycle,
      maxProducts: pkg.maxProducts,
      maxOrders: pkg.maxOrders,
      features: pkg.features.join(', '),
      isActive: pkg.isActive,
    })
    setDialogOpen(true)
  }

  async function handleDelete(id: string) {
    try {
      await managementService.deletePackage(id)
      await queryClient.invalidateQueries({ queryKey: ['management', 'packages'] })
      toast.success('Package deleted')
    } catch {
      toast.error('Unable to delete package')
    }
  }

  async function onSubmit(values: PackageFormValues) {
    const features = values.features.split(',').map((f) => f.trim()).filter(Boolean)
    try {
      if (editingId) {
        await managementService.updatePackage(editingId, { ...values, features })
        toast.success('Package updated')
      } else {
        await managementService.createPackage({ ...values, features })
        toast.success('Package created')
      }
      await queryClient.invalidateQueries({ queryKey: ['management', 'packages'] })
      setDialogOpen(false)
    } catch {
      toast.error('Unable to save package')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Packages"
        description="Manage subscription packages for your platform"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Package
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading packages...</p> : packages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col rounded-xl border bg-card shadow-soft transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between p-5">
              <div>
                <h3 className="font-display text-lg font-bold">{pkg.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pkg.description}
                </p>
              </div>
              <StatusBadge status={pkg.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </div>
            <div className="border-t px-5 py-4">
              <div className="mb-3">
                <span className="text-3xl font-bold">
                  {formatCurrency(pkg.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{pkg.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
                <span>
                  {pkg.maxProducts === -1 ? 'Unlimited' : pkg.maxProducts}{' '}
                  products
                </span>
                <span>
                  {pkg.maxOrders === -1 ? 'Unlimited' : pkg.maxOrders}{' '}
                  orders/mo
                </span>
              </div>
              <ul className="space-y-1.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-3.5 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex gap-2 border-t p-3">
              <button
                type="button"
                onClick={() => openEdit(pkg)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium hover:bg-muted"
              >
                <Edit className="size-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pkg.id)}
                className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <DialogPrimitive.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-lg">
            <DialogPrimitive.Title className="text-lg font-semibold">
              {editingId ? 'Edit Package' : 'Add Package'}
            </DialogPrimitive.Title>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <input {...form.register('name')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
                {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea {...form.register('description')} rows={2} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Price ($)</label>
                  <input type="number" step="0.01" {...form.register('price')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Billing Cycle</label>
                  <select {...form.register('billingCycle')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Max Products (-1 = unlimited)</label>
                  <input type="number" {...form.register('maxProducts')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Max Orders/mo (-1 = unlimited)</label>
                  <input type="number" {...form.register('maxOrders')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Features (comma-separated)</label>
                <textarea {...form.register('features')} rows={2} placeholder="Feature 1, Feature 2, Feature 3" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pkgActive" {...form.register('isActive')} className="size-4 rounded border" />
                <label htmlFor="pkgActive" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              <X className="size-4" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
