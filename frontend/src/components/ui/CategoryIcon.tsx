import { CATEGORY_COLORS, CATEGORY_EMOJI } from '../../utils/expenses'

interface CategoryIconProps {
  name: string
  size?: number
}

export function CategoryIcon({ name, size = 36 }: CategoryIconProps) {
  const color = CATEGORY_COLORS[name] ?? '#94a3b8'
  const emoji = CATEGORY_EMOJI[name] ?? '📦'

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `${color}1a`,
      border: `1px solid ${color}33`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: size * 0.44,
    }}>
      {emoji}
    </div>
  )
}
