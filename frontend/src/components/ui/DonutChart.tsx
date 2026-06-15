import type { CategoryTotal } from '../../utils/expenses'

interface DonutChartProps {
  data: CategoryTotal[]
  size?: number
  centerLabel?: string
  centerSub?: string
}

export function DonutChart({ data, size = 180, centerLabel, centerSub }: DonutChartProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  const strokeWidth = size * 0.13
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)

  type Slice = CategoryTotal & { arcLen: number; startAngle: number }
  const { slices } = data.reduce<{ slices: Slice[]; cumDeg: number }>(
    ({ slices, cumDeg }, d) => {
      const pct = total > 0 ? d.value / total : 0
      return {
        slices: [...slices, { ...d, arcLen: pct * circ, startAngle: cumDeg }],
        cumDeg: cumDeg + pct * 360,
      }
    },
    { slices: [], cumDeg: -90 },
  )

  const innerR = r - strokeWidth / 2 - size * 0.015

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${s.arcLen} ${circ}`}
          transform={`rotate(${s.startAngle} ${cx} ${cy})`}
          opacity={0.92}
        />
      ))}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--cdp)" />
      {centerLabel && (
        <text
          x={cx} y={cy - size * 0.04}
          textAnchor="middle" dominantBaseline="middle"
          fill="#f7f8fa" fontSize={size * 0.085} fontWeight="700"
          fontFamily="'Plus Jakarta Sans',sans-serif"
        >
          {centerLabel}
        </text>
      )}
      {centerSub && (
        <text
          x={cx} y={cy + size * 0.1}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(247,248,250,0.38)" fontSize={size * 0.065}
          fontFamily="Inter,sans-serif"
        >
          {centerSub}
        </text>
      )}
    </svg>
  )
}
