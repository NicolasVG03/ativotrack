import { motion } from 'framer-motion'
import { fadeUpView } from '../../utils/motion'
import { Icon } from '../../components/ui/Icon'
import type { FeatureCard, IconName } from '../../types'

const FEATURES: FeatureCard[] = [
  { icon: 'dashboard', wide: true,  title: 'Visão total, de relance.',         body: 'Seus KPIs, gráfico de categorias e últimas transações em uma tela só. Dashboard limpo, sem scroll infinito.' },
  { icon: 'plus',                    title: 'Registre em 3 campos.',            body: 'Descrição, valor, categoria. Rápido como anotar no papel — mas organizado.' },
  { icon: 'pieChart',                title: 'Gráficos que falam.',             body: 'Donut, barras, comparativos. Veja para onde o dinheiro vai antes que ele vá embora.' },
  { icon: 'filter',                  title: 'Filtros precisos.',               body: 'Período, categoria, busca. Encontre qualquer despesa em menos de 3 segundos.' },
  { icon: 'reports', wide: true,     title: 'Relatórios mensais comparativos.', body: 'Compare este mês com o anterior. Veja seus top 5 maiores gastos. Entenda seus padrões de consumo com análises automáticas.' },
]

function Card({ icon, title, body, wide = false, delay = 0 }: FeatureCard & { delay?: number }) {
  return (
    <motion.div {...fadeUpView(delay)} style={{ gridColumn: wide ? '1/-1' : undefined }}>
      <div
        className="glass"
        style={{
          padding: '28px', borderRadius: 20, height: '100%',
          display: 'flex', flexDirection: wide ? 'row' : 'column',
          gap: 20, alignItems: wide ? 'center' : 'flex-start',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon as IconName} size={20} color="var(--cgold)" />
        </div>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--ctxt)' }}>{title}</h3>
          <p style={{ fontSize: 14, color: 'var(--ctxt2)', lineHeight: 1.65 }}>{body}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="recursos" style={{ background: 'var(--cdp)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <motion.div {...fadeUpView(0)}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>✦ Recursos</div>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-0.02em', maxWidth: 560, margin: '0 auto', lineHeight: 1.15 }}>
              Tudo que você precisa.<br />
              <span className="text-gold">Nada do que você não quer.</span>
            </h2>
          </div>
        </motion.div>

        <div className="landing-features-grid">
          {FEATURES.map((feat, i) => (
            <Card key={i} {...feat} delay={i * 0.05 + 0.05} />
          ))}
        </div>
      </div>
    </section>
  )
}
