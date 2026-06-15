import { CATEGORY_COLORS } from '../../utils/expenses'

interface CategoryBadgeProps {
  name: string
}

export function CategoryBadge({ name }: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[name] ?? '#94a3b8'

  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
      padding: '2px 7px',
      borderRadius: 100,
      background: `${color}1a`,
      color,
      border: `1px solid ${color}33`,
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}
