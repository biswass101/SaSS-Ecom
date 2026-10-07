import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {change && (
          <div className="mt-1 flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUpRight className="size-3.5 text-success" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="size-3.5 text-destructive" />
            ) : null}
            <span
              className={cn(
                'text-xs font-medium',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                !trend && 'text-muted-foreground',
              )}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
