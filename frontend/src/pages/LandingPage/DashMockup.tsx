export function DashMockup() {
  return (
    <div style={{
      width: '100%', maxWidth: 720, aspectRatio: '16/10',
      background: 'var(--cdp)', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden', display: 'flex',
      boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      position: 'relative', margin: '0 auto',
    }}>
      {/* Sidebar */}
      <div style={{ width: 52, background: 'var(--cmid)', borderRight: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 6 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <svg width={20} height={20} viewBox="0 0 40 40" fill="none">
            <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#C9A84C" strokeWidth="2" fill="rgba(201,168,76,0.1)"/>
            <polyline points="11,27 16.5,19.5 21.5,22.5 29,13" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <circle cx="29" cy="13" r="2.5" fill="#C9A84C"/>
          </svg>
        </div>
        {[true, false, false].map((active, i) => (
          <div key={i} style={{ width: 36, height: 30, borderRadius: 6, background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${active ? '#C9A84C' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 2.5, borderRadius: 2, background: active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}/>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 11, color: 'rgba(247,248,250,0.35)' }}>Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(247,248,250,0.65)' }}>Nicolas</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cgold),var(--cgoldl))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--cdp)', fontWeight: 700 }}>N</div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['TOTAL', 'R$ 4.837,20'], ['CATEGORIA', 'Alimentação'], ['DESPESAS', '37 registros']].map(([label, value], i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 10px', minWidth: 0 }}>
              <div style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--cgold)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: i === 0 ? 13 : 11, fontWeight: 700, color: 'var(--ctxt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ display: 'flex', gap: 8, flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Donut chart */}
          <div style={{ flex: 1.3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(247,248,250,0.65)', marginBottom: 8 }}>Gastos por categoria</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg viewBox="0 0 80 80" width={68} height={68} style={{ flexShrink: 0 }}>
                {[
                  { p: 26.5, c: '#C9A84C', o: 0 },
                  { p: 20.7, c: '#60a5fa', o: 95.5 },
                  { p: 17.4, c: '#a78bfa', o: 170.8 },
                  { p: 10.5, c: '#34d399', o: 234.6 },
                  { p: 9.3,  c: '#fb923c', o: 272.5 },
                ].map((s, i) => {
                  const circ = 2 * Math.PI * 28
                  return <circle key={i} cx="40" cy="40" r="28" fill="none" stroke={s.c} strokeWidth="12" strokeDasharray={`${(s.p / 100) * circ} ${circ}`} strokeDashoffset={-s.o} transform="rotate(-90 40 40)" opacity="0.92"/>
                })}
                <circle cx="40" cy="40" r="20" fill="#0a0e1a"/>
                <text x="40" y="38" textAnchor="middle" fill="#f7f8fa" fontSize="7" fontWeight="700">R$4.837</text>
                <text x="40" y="47" textAnchor="middle" fill="rgba(247,248,250,0.38)" fontSize="6">total</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[['#C9A84C', 'Alimentação 27%'], ['#60a5fa', 'Moradia 21%'], ['#a78bfa', 'Saúde 17%'], ['#34d399', 'Transporte 11%']].map(([color, name]) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 9, color: 'rgba(247,248,250,0.5)', lineHeight: 1 }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent expenses */}
          <div style={{ flex: 0.9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(247,248,250,0.65)', marginBottom: 8 }}>Últimas despesas</div>
            {[['🏠', 'Aluguel', 'R$ 1.000'], ['🍔', 'Supermercado', 'R$ 312'], ['🚗', 'Manutenção', 'R$ 280'], ['❤️', 'Dentista', 'R$ 180']].map(([icon, name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 11, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 9, color: 'rgba(247,248,250,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                </div>
                <span style={{ fontSize: 9, color: 'var(--cng)', fontWeight: 600, flexShrink: 0 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
