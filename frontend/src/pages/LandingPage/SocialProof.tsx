import { motion } from 'framer-motion'
import { fadeUpView } from '../../utils/motion'

const STATS = [
  { value: '+2.400',  label: 'despesas categorizadas hoje' },
  { value: 'R$ 3.200', label: 'economizados em média/mês' },
  { value: '5 cat.',   label: 'organizadas automaticamente' },
]

export function SocialProof() {
  return (
    <section style={{
      background: 'var(--cmid)', padding: '56px 40px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="landing-stats-grid" style={{ maxWidth: 960, margin: '0 auto' }}>
        {STATS.map(({ value, label }, i) => (
          <motion.div key={i} {...fadeUpView(i * 0.08)}>
            <div style={{
              textAlign: 'center', padding: '0 32px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
                color: 'var(--cgold)', lineHeight: 1.1, marginBottom: 8,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,248,250,0.5)' }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
