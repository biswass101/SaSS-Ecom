import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  variant?: 'light' | 'dark'
}

export function Logo({ className, iconOnly, variant = 'dark' }: LogoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 font-display font-bold',
        variant === 'light' ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
        <Package className="size-4 text-primary-foreground" />
      </div>
      {!iconOnly && <span className="text-lg tracking-tight">StoreStack</span>}
    </div>
  )
}
