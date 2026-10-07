import { cn } from '@/lib/utils'

type StatusVariant = 'success' | 'warning' | 'destructive' | 'default' | 'muted'

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const variantMap: Record<string, StatusVariant> = {
  ACTIVE: 'success',
  VERIFIED: 'success',
  DELIVERED: 'success',
  CONFIRMED: 'success',
  PROCESSING: 'warning',
  SHIPPED: 'warning',
  PENDING: 'default',
  INACTIVE: 'muted',
  EXPIRED: 'muted',
  CANCELLED: 'destructive',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
}

const variantClasses: Record<StatusVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  default: 'bg-primary/10 text-primary border-primary/20',
  muted: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolved = variant ?? variantMap[status] ?? 'default'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        variantClasses[resolved],
        className,
      )}
    >
      {status.toLowerCase().replace(/_/g, ' ')}
    </span>
  )
}
