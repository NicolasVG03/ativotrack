import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { DonutChart } from '../../components/ui/DonutChart'
import { CategoryIcon } from '../../components/ui/CategoryIcon'
import { CategoryBadge } from '../../components/ui/CategoryBadge'
import { BarChartCustom } from '../../components/ui/BarChartCustom'
import { formatCurrency, formatDate, computeCategoryTotals } from '../../utils/expenses'
import { getDateRange, daysInRange, type Period } from '../../utils/dateRange'
import { useExpenses } from '../../hooks/useExpenses'

// ── PERIOD SELECTOR ──────────────────────────────────────────────────────────

const PERIOD_OPTS: Array<{ id: Period; label: string }> = [
  { id: 'month',   label: 'Mês atual'        },
  { id: 'quarter', label: 'Último trimestre' },
  { id: 'year',    label: 'Este ano'         },
]

function PeriodSelector({ period, setPeriod }: { period: Period; setPeriod: (p: Period) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {PERIOD_OPTS.map(o => (
        <button
          key={o.id}
          className={`period-pill${period === o.id ? ' active' : ''}`}
          onClick={() => setPeriod(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── MINI KPI ─────────────────────────────────────────────────────────────────

interface MiniKPIProps {
  label: string
  value: string
  trend?: string
  trendColor?: string
  trendIcon?: 'trendUp' | 'trendDown'
  sub?: string
  delay?: number
}

function MiniKPI({ label, value, trend, trendColor, trendIcon, sub, delay = 0 }: MiniKPIProps) {
  return (
    <div
      className="glass fade-in-up"
      style={{ animationDelay: delay + 's', borderRadius: 14, padding: '18px 20px', flex: 1, minWidth: 0 }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(247,248,250,0.4)', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color: '#f7f8fa', marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: trendColor ?? 'rgba(247,248,250,0.4)' }}>
        {trendIcon && <Icon name={trendIcon} size={13} color={trendColor} />}
        <span>{trend ?? sub}</span>
      </div>
    </div>
  )
}

// ── REPORTS PAGE ─────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [period, setPeriod] = useState<Period>('month')

  const { from, to, prevFrom, prevTo, label, prevLabel } = getDateRange(period)

  const { data: expenses     = [] } = useExpenses({ from, to })
  const { data: prevExpenses = [] } = useExpenses({ from: prevFrom, to: prevTo })

  const total     = expenses.reduce((s, e) => s + e.amount, 0)
  const prevTotal = prevExpenses.reduce((s, e) => s + e.amount, 0)

  const hasPrev   = prevTotal > 0
  const diffPct   = hasPrev ? (((total - prevTotal) / prevTotal) * 100).toFixed(1) : null
  const diffPos   = total > prevTotal

  const catTotals  = computeCategoryTotals(expenses)
  const prevCatMap = prevExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount
    return acc
  }, {})

  const top5       = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)
  const days       = daysInRange(from, to)
  const avgDaily   = total / days
  const daysActive = new Set(expenses.map(e => e.date)).size

  const barData = catTotals.slice(0, 7).map(cat => ({
    name:     cat.name,
    current:  cat.value,
    previous: prevCatMap[cat.name] ?? 0,
  }))

  return (
    <div className="page-content">

      {/* Header */}
      <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Relatórios</h1>
          <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.45)' }}>Análise e comparativos dos seus gastos.</p>
        </div>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>

      {/* Mini KPIs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <MiniKPI
          delay={0.05}
          label="Total do período"
          value={formatCurrency(total)}
          trend={diffPct !== null
            ? `${diffPos ? '↑ +' : '↓ '}${Math.abs(parseFloat(diffPct))}% vs ${prevLabel}`
            : undefined}
          trendColor={diffPct !== null ? (diffPos ? '#f87171' : '#4ade80') : undefined}
          trendIcon={diffPct !== null ? (diffPos ? 'trendUp' : 'trendDown') : undefined}
          sub={diffPct === null ? `${expenses.length} despesas registradas` : undefined}
        />
        <MiniKPI
          delay={0.1}
          label="Média diária"
          value={formatCurrency(avgDaily)}
          sub={`em ${days} dias`}
        />
        <MiniKPI
          delay={0.15}
          label="Maior gasto único"
          value={formatCurrency(top5[0]?.amount ?? 0)}
          sub={top5[0] ? `${top5[0].description} · ${formatDate(top5[0].date)}` : '—'}
        />
        <MiniKPI
          delay={0.2}
          label="Dias com despesas"
          value={`${daysActive} de ${days}`}
          sub="dias com ao menos 1 gasto"
        />
      </div>

      {/* Bar chart */}
      <div className="glass fade-in-up" style={{ animationDelay: '.25s', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa' }}>Comparativo por categoria</div>
            <div style={{ fontSize: 13, color: 'rgba(247,248,250,0.4)', marginTop: 2 }}>{label} vs {prevLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {([['#C9A84C', label], ['rgba(96,165,250,0.6)', prevLabel]] as const).map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 12, color: 'rgba(247,248,250,0.55)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <BarChartCustom data={barData} height={220} />
      </div>

      {/* Donut + Top 5 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Donut */}
        <div className="glass fade-in-up" style={{ animationDelay: '.3s', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa', marginBottom: 20 }}>Participação por categoria</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <DonutChart
              data={catTotals.slice(0, 6)}
              size={160}
              centerLabel={formatCurrency(total).replace('R$ ', 'R$')}
              centerSub="total"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {catTotals.slice(0, 6).map((cat, i) => {
                const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : '0.0'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'rgba(247,248,250,0.65)', minWidth: 90 }}>{cat.name}</span>
                    <span style={{ fontSize: 12, color: 'rgba(247,248,250,0.4)' }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top 5 */}
        <div className="glass fade-in-up" style={{ animationDelay: '.35s', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa', marginBottom: 20 }}>Top 5 maiores despesas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {top5.length === 0 ? (
              <div style={{ fontSize: 14, color: 'rgba(247,248,250,0.35)', padding: '20px 0' }}>
                Nenhuma despesa no período.
              </div>
            ) : top5.map((exp, i) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 0',
                  borderBottom: i < top5.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, color: 'rgba(201,168,76,0.35)', width: 28, flexShrink: 0 }}>
                  #{i + 1}
                </span>
                <CategoryIcon name={exp.category} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f7f8fa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {exp.description}
                  </div>
                  <CategoryBadge name={exp.category} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f87171', flexShrink: 0 }}>
                  -{formatCurrency(exp.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis summary */}
      <div className="glass fade-in-up" style={{ animationDelay: '.4s', borderRadius: 16, padding: 28, border: '1px solid rgba(201,168,76,0.18)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="reports" size={20} color="#C9A84C" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa', marginBottom: 12 }}>📊 Análise do período</div>
            <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.7)', lineHeight: 1.8 }}>
              {expenses.length === 0 ? (
                'Nenhuma despesa registrada no período. Adicione despesas para ver a análise.'
              ) : (
                <>
                  Você gastou{' '}
                  <strong style={{ color: '#f7f8fa' }}>{formatCurrency(total)}</strong> em {label},{' '}
                  {diffPct !== null && (
                    <>
                      <strong style={{ color: diffPos ? '#f87171' : '#4ade80' }}>
                        {diffPos ? `+${Math.abs(parseFloat(diffPct))}% a mais` : `${Math.abs(parseFloat(diffPct))}% a menos`}
                      </strong>{' '}
                      que em {prevLabel} ({formatCurrency(prevTotal)}).{' '}
                    </>
                  )}
                  {catTotals[0] && (
                    <>
                      Sua categoria dominante foi{' '}
                      <strong style={{ color: '#f7f8fa' }}>{catTotals[0].name}</strong>{' '}
                      ({((catTotals[0].value / total) * 100).toFixed(1)}%),{' '}
                    </>
                  )}
                  {catTotals[1] && (
                    <>
                      seguida de{' '}
                      <strong style={{ color: '#f7f8fa' }}>{catTotals[1].name}</strong>{' '}
                      ({((catTotals[1].value / total) * 100).toFixed(1)}%).{' '}
                    </>
                  )}
                  Sua média diária foi de{' '}
                  <strong style={{ color: '#f7f8fa' }}>{formatCurrency(avgDaily)}</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
