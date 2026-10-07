import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({ amount, className, size = 'md' }: PriceDisplayProps) {
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-2xl',
        className,
      )}
    >
      {formatCurrency(amount)}
    </span>
  )
}
