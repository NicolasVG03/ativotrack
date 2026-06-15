import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUp } from '../../utils/motion'
import { Button } from '../../components/ui/Button'
import { DashMockup } from './DashMockup'

const HEX_SHAPES = [
  { left: '8%',  top: '18%', size: 90, delay: 0   },
  { left: '88%', top: '12%', size: 64, delay: 2   },
  { left: '5%',  top: '65%', size: 50, delay: 1   },
  { left: '92%', top: '60%', size: 72, delay: 3   },
  { left: '50%', top: '85%', size: 44, delay: 1.5 },
]

export function Hero() {
  const navigate = useNavigate()

  return (
    <section style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'var(--cdp)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '80px 24px 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial bg glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}/>

      {/* Floating hex wireframes */}
      {HEX_SHAPES.map(({ left, top, size, delay }, i) => (
        <svg
          key={i} width={size} height={size} viewBox="0 0 80 80"
          className="animate-float"
          style={{ position: 'absolute', left, top, opacity: 0.045, pointerEvents: 'none', animationDelay: `${delay}s` }}
        >
          <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
        </svg>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 760, width: '100%' }}>

        {/* Eyebrow */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 20 }}>
          <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✦</span><span>Controle Financeiro Inteligente</span>
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.12)}
          style={{
            fontSize: 'clamp(42px, 6.5vw, 76px)', fontWeight: 800,
            lineHeight: 1.0, textAlign: 'center', letterSpacing: '-0.03em',
            marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Seus gastos<br />sob controle.<br />
          Seu futuro, no seu{' '}
          <span className="text-gold">bolso.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: 18, textAlign: 'center', maxWidth: 520,
            lineHeight: 1.65, marginBottom: 36,
            color: 'rgba(247,248,250,0.6)',
          }}
        >
          Registre, categorize e visualize todas as suas despesas em um painel limpo.
          Menos planilha, mais clareza.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.28)}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}
        >
          <Button size="lg" onClick={() => navigate('/register')}>
            Criar conta grátis
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/dashboard')}>
            Ver demonstração
          </Button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div {...fadeUp(0.38)} style={{ width: '100%', position: 'relative' }}>
          <div style={{ transform: 'perspective(1400px) rotateX(5deg)', transformOrigin: 'center top' }}>
            <DashMockup />
          </div>

          {/* Floating savings card */}
          <div
            className="animate-float-sm"
            style={{
              position: 'absolute', top: -18, right: '8%',
              background: 'rgba(26,37,64,0.95)',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: 14, padding: '12px 16px',
              backdropFilter: 'blur(12px)', minWidth: 220,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>💰</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ctxt)' }}>
                Você economizou R$ 847 este mês.
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(247,248,250,0.5)', paddingLeft: 26 }}>
              Maior que no mês anterior{' '}
              <span style={{ color: 'var(--cok)', fontWeight: 600 }}>↑ 23%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
