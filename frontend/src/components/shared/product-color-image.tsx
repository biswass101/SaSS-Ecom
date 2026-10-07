import { cn, getInitials } from '@/lib/utils'
import { useState } from 'react'

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
  const [imageError, setImageError] = useState(false)

  // Check if it's an image (base64 or URL)
  const isImage = color.startsWith('data:') || color.startsWith('http')

  if (isImage && !imageError) {
    return (
      <div
        className={cn(
          'rounded-lg overflow-hidden bg-muted',
          className,
        )}
      >
        <img
          src={color}
          alt={title}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  // Fallback to color display
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
