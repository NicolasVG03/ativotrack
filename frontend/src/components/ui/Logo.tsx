type LogoSize = 'sm' | 'md' | 'lg'

const cfg: Record<LogoSize, { svg: number; font: number; gap: number }> = {
  sm: { svg: 28, font: 15, gap: 8  },
  md: { svg: 34, font: 18, gap: 10 },
  lg: { svg: 44, font: 23, gap: 12 },
}

interface LogoProps {
  size?: LogoSize
  showText?: boolean
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const { svg: s, font: fs, gap } = cfg[size]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexShrink: 0 }}>
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          stroke="#C9A84C" strokeWidth="2" fill="rgba(201,168,76,0.1)"
        />
        <polyline
          points="11,27 16.5,19.5 21.5,22.5 29,13"
          stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
        <circle cx="29" cy="13" r="2.5" fill="#C9A84C" />
      </svg>
      {showText && (
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: fs,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          <span style={{ color: '#C9A84C' }}>Ativo</span>
          <span style={{ color: '#f7f8fa' }}>Track</span>
        </span>
      )}
    </div>
  )
}
