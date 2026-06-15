import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUpView } from '../../utils/motion'
import { Button } from '../../components/ui/Button'

export function CTAFinal() {
  const navigate = useNavigate()

  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--cdp) 0%, var(--cmid) 100%)',
      padding: '96px 40px',
      borderTop: '1px solid rgba(201,168,76,0.2)',
    }}>
      <motion.div {...fadeUpView(0)}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.15 }}>
            Comece a controlar seus<br />
            <span className="text-gold">ativos hoje.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(247,248,250,0.5)', marginBottom: 36 }}>
            Crie sua conta em menos de 1 minuto.
          </p>
          <Button size="lg" className="animate-pulse-gold" onClick={() => navigate('/register')}>
            Criar conta grátis
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
