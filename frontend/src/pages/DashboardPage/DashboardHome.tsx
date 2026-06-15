import { Icon } from '../../components/ui/Icon'
import { DonutChart } from '../../components/ui/DonutChart'
import { CategoryIcon } from '../../components/ui/CategoryIcon'
import { CategoryBadge } from '../../components/ui/CategoryBadge'
import { formatCurrency, formatDate, computeCategoryTotals, type Expense } from '../../utils/expenses'
import { getDateRange } from '../../utils/dateRange'
import { useExpenses } from '../../hooks/useExpenses'
import type { IconName } from '../../types'

interface KPICardProps {
  icon: IconName
  label: string
  value: string
  sub?: string
  subColor?: string
  delay?: number
}

function KPICard({ icon, label, value, sub, subColor, delay = 0 }: KPICardProps) {
  return (
    <div
      className="glass fade-in-up"
      style={{ animationDelay: `${delay}s`, borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={18} color="#C9A84C" />
        </div>
        <span className="eyebrow" style={{ fontSize: 10 }}>{label}</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, color: '#f7f8fa', lineHeight: 1.1 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: subColor ?? 'rgba(247,248,250,0.45)', marginTop: 4 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

function RecentExpenseRow({ expense }: { expense: Expense }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <CategoryIcon name={expense.category} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f7f8fa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expense.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <CategoryBadge name={expense.category} />
          <span style={{ fontSize: 11, color: 'rgba(247,248,250,0.35)' }}>{formatDate(expense.date)}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#f87171', flexShrink: 0 }}>
        -{formatCurrency(expense.amount)}
      </div>
    </div>
  )
}

interface DashboardHomeProps {
  onNavigate: (view: string) => void
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { from, to, label } = getDateRange('month')
  const { data: expenses = [], isLoading } = useExpenses({ from, to })

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const catTotals = computeCategoryTotals(expenses)
  const topCat = catTotals[0] ?? { name: '—', value: 0 }
  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  if (isLoading) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <span style={{ color: 'rgba(247,248,250,0.4)', fontSize: 14 }}>Carregando…</span>
      </div>
    )
  }

  return (
    <div className="page-content">

      {/* Greeting */}
      <div className="fade-in-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Bom dia, Nicolas. 👋
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.45)' }}>
          Aqui está seu resumo financeiro de {label.toLowerCase()}.
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard delay={0.05} icon="wallet"   label="Total do período" value={formatCurrency(total)} sub={label} />
        <KPICard delay={0.1}  icon="award"    label="Maior categoria"  value={topCat.name} sub={formatCurrency(topCat.value)} subColor="#f87171" />
        <KPICard delay={0.15} icon="fileText" label="Despesas"         value={`${expenses.length} registros`} sub={`em ${label.toLowerCase()}`} />
      </div>

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Donut chart */}
        <div className="glass fade-in-up" style={{ animationDelay: '.2s', borderRadius: 16, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa' }}>Gastos por categoria</div>
            <div style={{ fontSize: 13, color: 'rgba(247,248,250,0.4)', marginTop: 2 }}>{label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              <DonutChart
                data={catTotals.slice(0, 6)}
                size={180}
                centerLabel={formatCurrency(total).replace('R$ ', 'R$')}
                centerSub="total"
              />
            </div>
            <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {catTotals.slice(0, 6).map((cat, i) => {
                const pct = ((cat.value / total) * 100).toFixed(1)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: 'rgba(247,248,250,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cat.name}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(247,248,250,0.4)', flexShrink: 0, marginLeft: 8 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }}>
                        <div style={{ height: '100%', borderRadius: 2, background: cat.color, width: `${pct}%`, transition: 'width .6s ease' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent expenses */}
        <div className="glass fade-in-up" style={{ animationDelay: '.25s', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa' }}>Últimas despesas</div>
            <button
              onClick={() => onNavigate('expenses')}
              style={{ fontSize: 13, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'color .15s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#e0c987')}
              onMouseOut={e => (e.currentTarget.style.color = '#C9A84C')}
            >
              Ver todas →
            </button>
          </div>
          <div>
            {recent.map(exp => <RecentExpenseRow key={exp.id} expense={exp} />)}
          </div>
        </div>

      </div>

      {/* FAB */}
      <button className="fab" onClick={() => onNavigate('expenses')}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        <span>Nova despesa</span>
      </button>
    </div>
  )
}
