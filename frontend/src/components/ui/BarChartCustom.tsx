export interface BarData {
  name: string
  current: number
  previous: number
}

interface BarChartCustomProps {
  data: BarData[]
  height?: number
}

const GOLD  = '#C9A84C'
const BLUE  = 'rgba(96,165,250,0.6)'
const LABEL_COLOR = 'rgba(247,248,250,0.35)'
const GRID_COLOR  = 'rgba(255,255,255,0.05)'

export function BarChartCustom({ data, height = 220 }: BarChartCustomProps) {
  if (!data.length) return null

  const paddingLeft  = 52
  const paddingRight = 16
  const paddingTop   = 12
  const paddingBot   = 44

  const maxVal = Math.max(...data.flatMap(d => [d.current, d.previous]), 1)
  const gridLines = 4

  const chartW = 600
  const chartH = height

  const innerW = chartW - paddingLeft - paddingRight
  const innerH = chartH - paddingTop - paddingBot

  const groupW    = innerW / data.length
  const barW      = Math.min(groupW * 0.28, 28)
  const barGap    = 4
  const groupPad  = (groupW - barW * 2 - barGap) / 2

  const toY = (v: number) => paddingTop + innerH - (v / maxVal) * innerH

  return (
    <svg
      viewBox={`0 0 ${chartW} ${chartH}`}
      width="100%"
      height={height}
      style={{ overflow: 'visible' }}
    >
      {/* Grid lines */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const y = paddingTop + (innerH / gridLines) * i
        const val = maxVal * (1 - i / gridLines)
        return (
          <g key={i}>
            <line
              x1={paddingLeft} y1={y}
              x2={chartW - paddingRight} y2={y}
              stroke={GRID_COLOR} strokeWidth="1"
            />
            <text
              x={paddingLeft - 8} y={y}
              textAnchor="end" dominantBaseline="middle"
              fill={LABEL_COLOR} fontSize="10" fontFamily="Inter,sans-serif"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const gx = paddingLeft + i * groupW + groupPad

        const curH = Math.max((d.current  / maxVal) * innerH, 2)
        const preH = Math.max((d.previous / maxVal) * innerH, 2)

        const curY = paddingTop + innerH - curH
        const preY = paddingTop + innerH - preH

        const labelX = paddingLeft + i * groupW + groupW / 2
        const labelY = chartH - paddingBot + 16

        const shortName = d.name.length > 8 ? d.name.slice(0, 7) + '…' : d.name

        return (
          <g key={d.name}>
            {/* Previous bar */}
            <rect
              x={gx} y={preY}
              width={barW} height={preH}
              fill={BLUE} rx="3"
            />
            {/* Current bar */}
            <rect
              x={gx + barW + barGap} y={curY}
              width={barW} height={curH}
              fill={GOLD} rx="3"
            />
            {/* Category label */}
            <text
              x={labelX} y={labelY}
              textAnchor="middle"
              fill={LABEL_COLOR} fontSize="10" fontFamily="Inter,sans-serif"
            >
              {shortName}
            </text>
          </g>
        )
      })}

      {/* Baseline */}
      <line
        x1={paddingLeft} y1={paddingTop + innerH}
        x2={chartW - paddingRight} y2={paddingTop + innerH}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1"
      />
    </svg>
  )
}
