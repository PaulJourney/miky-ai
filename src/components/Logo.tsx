'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }

  return (
    <div className={cn('font-bold font-inter', sizeClasses[size], className)}>
      <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
        Miky
      </span>
      <span className="text-white">
        .ai
      </span>
    </div>
  )
}

export function FaviconLogo({ className }: { className?: string }) {
  return (
    <div className={cn(
      'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white',
      'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400',
      className
    )}>
      M
    </div>
  )
}
