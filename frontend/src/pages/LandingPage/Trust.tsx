import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUpView } from '../../utils/motion'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'

const TRUST_ITEMS = [
  { icon: 'shield' as const, title: 'Login com Google', body: 'Um clique. Sem senha nova para lembrar.' },
  { icon: 'user'   as const, title: 'Dados privados',   body: 'Suas despesas são suas. Só você acessa.' },
  { icon: 'zap'    as const, title: 'Grátis para começar', body: 'Sem cartão. Sem pegadinha.' },
]

export function Trust() {
  const navigate = useNavigate()

  return (
    <section style={{ background: 'var(--cdp)', padding: '80px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <motion.div {...fadeUpView(0)}>
          <div className="glass-gold" style={{ borderRadius: 24, padding: '40px 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.02em' }}>
              Simples de entrar.<br />
              <span className="text-gold">Seguro para ficar.</span>
            </h2>

            <div className="landing-trust-grid" style={{ marginBottom: 36 }}>
              {TRUST_ITEMS.map(({ icon, title, body }, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={icon} size={20} color="var(--cgold)" />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ctxt)' }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(247,248,250,0.5)', lineHeight: 1.5 }}>{body}</div>
                </div>
              ))}
            </div>

            <Button onClick={() => navigate('/register')}>
              Criar conta grátis
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
