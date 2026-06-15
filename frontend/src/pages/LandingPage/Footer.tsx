import { Logo } from '../../components/ui/Logo'

const LINKS = ['Política de Privacidade', 'Termos de Uso']

export function Footer() {
  return (
    <footer style={{ background: '#0a0e1a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '36px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <Logo size="sm" />
          <div style={{ fontSize: 12, color: 'rgba(247,248,250,0.3)', marginTop: 8 }}>Seus ativos financeiros, sob controle.</div>
          <div style={{ fontSize: 12, color: 'rgba(247,248,250,0.2)', marginTop: 4 }}>© 2026 AtivoTrack</div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {LINKS.map(label => (
            <a
              key={label} href="#"
              style={{ fontSize: 13, color: 'rgba(247,248,250,0.35)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseOver={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.7)')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.35)')}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'rgba(247,248,250,0.25)' }}>
          Um produto do ecossistema{' '}
          <span style={{ color: 'rgba(201,168,76,0.5)', fontWeight: 600 }}>Grupo Ativos</span>
        </div>
      </div>
    </footer>
  )
}
