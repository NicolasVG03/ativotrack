import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUpView } from '../../utils/motion'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { DashMockup } from './DashMockup'

const ITEMS = [
  'Login com e-mail ou conta Google',
  'Categorias predefinidas + criação personalizada',
  'Gráfico de composição por categoria',
  'Relatório mensal comparativo',
  '100% responsivo — funciona no celular',
]

export function ProductPreview() {
  const navigate = useNavigate()

  return (
    <section id="produto" style={{ background: '#13182b', padding: '96px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

        <motion.div {...fadeUpView(0)}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DashMockup />
          </div>
        </motion.div>

        <motion.div {...fadeUpView(0.1)}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>✦ Produto</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28, lineHeight: 1.2 }}>
            Um painel que você vai querer abrir todo dia.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name="arrowRight" size={16} color="#C9A84C" />
                <span style={{ fontSize: 15, color: 'rgba(247,248,250,0.75)' }}>{item}</span>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate('/register')}>
            Começar agora
          </Button>
        </motion.div>

      </div>
    </section>
  )
}
