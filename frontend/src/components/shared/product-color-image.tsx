import { cn, getInitials } from '@/lib/utils'

interface ProductColorImageProps {
  color: string
  title: string
  className?: string
}

export function ProductColorImage({
  color,
  title,
  className,
}: ProductColorImageProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg',
        className,
      )}
      style={{ backgroundColor: color }}
    >
      <span className="text-lg font-bold text-white/80 drop-shadow-sm">
        {getInitials(title)}
      </span>
    </div>
  )
}
