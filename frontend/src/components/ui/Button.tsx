import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'ghost-gold'
type Size    = 'default' | 'sm' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  full?: boolean
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const variantClass: Record<Variant, string> = {
  'primary':    'btn-primary',
  'ghost':      'btn-ghost',
  'ghost-gold': 'btn-ghost-gold',
}

const sizeClass: Record<Size, string> = {
  'sm':      'btn-sm',
  'default': '',
  'lg':      'btn-lg',
}

export function Button({
  variant = 'primary',
  size = 'default',
  full = false,
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'btn',
        variantClass[variant],
        sizeClass[size],
        full ? 'btn-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  )
}
