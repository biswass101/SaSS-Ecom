import { zodResolver } from '@hookform/resolvers/zod'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'
import { mockPaymentChannels } from '@/mocks/data'
import type { PaymentChannel } from '@/types'

const channelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['bank_transfer', 'mobile_banking']),
  accountNumber: z.string().min(1, 'Account number is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  isActive: z.boolean(),
})
type ChannelFormValues = z.infer<typeof channelSchema>

export default function PaymentChannelsPage() {
  const [channels, setChannels] = useState<PaymentChannel[]>([...mockPaymentChannels])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: '',
      type: 'bank_transfer',
      accountNumber: '',
      instructions: '',
      isActive: true,
    },
  })

  function openCreate() {
    setEditingId(null)
    form.reset({ name: '', type: 'bank_transfer', accountNumber: '', instructions: '', isActive: true })
    setDialogOpen(true)
  }

  function openEdit(ch: PaymentChannel) {
    setEditingId(ch.id)
    form.reset({
      name: ch.name,
      type: ch.type as 'bank_transfer' | 'mobile_banking',
      accountNumber: ch.accountNumber,
      instructions: ch.instructions,
      isActive: ch.isActive,
    })
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setChannels((prev) => prev.filter((c) => c.id !== id))
    toast.success('Payment channel deleted')
  }

  function toggleActive(id: string) {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c,
      ),
    )
  }

  function onSubmit(values: ChannelFormValues) {
    if (editingId) {
      setChannels((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...values } : c)),
      )
      toast.success('Channel updated')
    } else {
      const newChannel: PaymentChannel = {
        id: 'ch_' + Date.now(),
        ...values,
        createdAt: new Date().toISOString(),
      }
      setChannels((prev) => [...prev, newChannel])
      toast.success('Channel created')
    }
    setDialogOpen(false)
  }

  const columns: ColumnDef<PaymentChannel>[] = [
    { accessorKey: 'name', header: 'Channel' },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) =>
        row.original.type === 'bank_transfer' ? 'Bank Transfer' : 'Mobile Banking',
    },
    { accessorKey: 'accountNumber', header: 'Account Number' },
    {
      id: 'active',
      header: 'Status',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => toggleActive(row.original.id)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            row.original.isActive
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEdit(row.original)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Edit className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.original.id)}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: channels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Channels"
        description="Manage payment methods available for manual payments"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Channel
          </button>
        }
      />

      <div className="rounded-xl border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/50">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No payment channels
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DialogPrimitive.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-lg">
            <DialogPrimitive.Title className="text-lg font-semibold">
              {editingId ? 'Edit Channel' : 'Add Channel'}
            </DialogPrimitive.Title>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <input {...form.register('name')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
                {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select {...form.register('type')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_banking">Mobile Banking</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Account Number</label>
                <input {...form.register('accountNumber')} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Instructions</label>
                <textarea {...form.register('instructions')} rows={3} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="chActive" {...form.register('isActive')} className="size-4 rounded border" />
                <label htmlFor="chActive" className="text-sm font-medium">Active</label>
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
