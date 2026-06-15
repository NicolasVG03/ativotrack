import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUpView } from '../../utils/motion'
import { Icon } from '../../components/ui/Icon'
import type { FAQItem } from '../../types'

const FAQS: FAQItem[] = [
  { question: 'O AtivoTrack é realmente gratuito?',    answer: 'Sim! O plano gratuito inclui até 50 despesas por mês, 5 categorias e acesso ao dashboard básico. Sem cartão de crédito, sem prazo de expiração.' },
  { question: 'Meus dados financeiros são seguros?',   answer: 'Absolutamente. Seus dados ficam associados à sua conta e só você tem acesso. Não compartilhamos com terceiros nem usamos para publicidade.' },
  { question: 'Preciso instalar algum aplicativo?',    answer: 'Não! O AtivoTrack é 100% web. Funciona direto no navegador do celular ou do computador, sem download nenhum.' },
  { question: 'Posso exportar minhas despesas?',       answer: 'No plano Pro você pode exportar seus dados em CSV para usar em planilhas ou outros sistemas.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ background: '#0a0e1a', padding: '96px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <motion.div {...fadeUpView(0)}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Ficou com dúvida?
            </h2>
          </div>
        </motion.div>

        <motion.div {...fadeUpView(0.05)}>
          {FAQS.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                className="faq-trigger"
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 0', background: 'none', border: 'none',
                  fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span>{item.question}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flexShrink: 0 }}
                >
                  <Icon name="chevronDown" size={18} color="#C9A84C" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="accordion-content" style={{ paddingBottom: 20 }}>
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
