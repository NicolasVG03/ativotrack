import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUpView } from '../../utils/motion'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import type { PricingPlan } from '../../types'

const PLANS: PricingPlan[] = [
  {
    label: 'Plano Gratuito', price: 'R$ 0', period: '/mês',
    features: ['Até 50 despesas/mês', '5 categorias', 'Dashboard básico', 'Gráficos essenciais'],
    cta: 'Criar conta grátis', isPro: false,
  },
  {
    tag: '⭐ Mais completo', label: 'Plano Pro', price: 'R$ 19,90', period: '/mês',
    features: ['Despesas ilimitadas', 'Categorias ilimitadas', 'Relatórios mensais', 'Exportação CSV', 'Gráficos avançados'],
    cta: 'Assinar Pro', isPro: true,
  },
]

export function Pricing() {
  const navigate = useNavigate()

  return (
    <section id="precos" style={{ background: '#13182b', padding: '96px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div {...fadeUpView(0)}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>✦ Planos e Preços</div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Comece de graça. Escale quando quiser.
            </h2>
          </div>
        </motion.div>

        <div className="landing-pricing-grid">
          {PLANS.map((plan, i) => (
            <motion.div key={i} {...fadeUpView(i * 0.1)}>
              <div style={{
                background: plan.isPro ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.05)',
                border: plan.isPro ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '32px 28px',
                display: 'flex', flexDirection: 'column', position: 'relative',
                boxShadow: plan.isPro ? '0 0 48px rgba(201,168,76,0.08)' : 'none',
                height: '100%',
              }}>
                {plan.tag && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#C9A84C', color: '#0a0e1a', fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 14px', whiteSpace: 'nowrap' }}>
                    {plan.tag}
                  </div>
                )}

                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(247,248,250,0.6)', marginBottom: 12 }}>{plan.label}</div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 40, fontWeight: 800, color: plan.isPro ? '#C9A84C' : '#f7f8fa', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: 'rgba(247,248,250,0.4)', paddingBottom: 6 }}>{plan.period}</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon name="check" size={15} color={plan.isPro ? '#C9A84C' : '#4ade80'} />
                      <span style={{ fontSize: 14, color: 'rgba(247,248,250,0.7)' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.isPro ? 'primary' : 'ghost'}
                  full
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
