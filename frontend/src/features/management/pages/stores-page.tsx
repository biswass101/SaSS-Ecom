import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/page-header'
import { SearchInput } from '@/components/shared/search-input'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn, formatDate } from '@/lib/utils'
import { managementService } from '@/lib/api-services'
import type { Store, StoreStatus } from '@/types'

export default function StoresPage() {
  const queryClient = useQueryClient()
  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['management', 'stores'],
    queryFn: managementService.getStores,
  })
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      stores.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [stores, search],
  )

  async function toggleStatus(store: Store) {
    const next: StoreStatus = store.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await managementService.updateStoreStatus(store.id, next)
      await queryClient.invalidateQueries({ queryKey: ['management', 'stores'] })
      toast.success(`Store marked as ${next.toLowerCase()}`)
    } catch {
      toast.error('Unable to update store status')
    }
  }

  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: 'name',
      header: 'Store',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {row.original.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => row.original.owner?.name ?? '—',
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'created',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStatus(row.original)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              row.original.status === 'ACTIVE'
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'bg-success/10 text-success hover:bg-success/20',
            )}
          >
            {row.original.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>
          <Link
            to={`/${row.original.slug}`}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <ExternalLink className="size-3" /> View
          </Link>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stores"
        description={`${stores.length} registered stores`}
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search stores..."
            className="w-64"
          />
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
            {isLoading ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">Loading stores...</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No stores found
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
    </div>
  )
}
