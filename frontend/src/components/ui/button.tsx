import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn('rounded-md px-4 py-2 text-sm font-medium', variant === 'primary' ? 'bg-[#20231f] text-white' : 'border border-gray-200 bg-white text-gray-700', className)} {...props} />
}
