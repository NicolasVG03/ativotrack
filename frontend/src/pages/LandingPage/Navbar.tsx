import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { useScrolled } from '../../hooks/useScrolled'

const NAV_LINKS = [
  { label: 'Recursos',       href: '#recursos'   },
  { label: 'Como funciona',  href: '#produto'     },
  { label: 'Preços',         href: '#precos'      },
]

export function Navbar() {
  const navigate = useNavigate()
  const scrolled = useScrolled(80)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,14,26,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all .35s ease',
      }}>
        <Logo size="md" />

        <div className="hidden md:flex" style={{ gap: 32 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="nav-link" onClick={e => { e.preventDefault(); handleNavClick(href) }}>
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="ghost-gold" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button size="sm" onClick={() => navigate('/register')}>
            Começar grátis
          </Button>
          <button
            className="md:hidden flex"
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ctxt)', padding: 4 }}
            aria-label="Menu"
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 199,
          background: 'rgba(10,14,26,0.97)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="nav-link"
              onClick={e => { e.preventDefault(); handleNavClick(href) }}
              style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'block' }}
            >
              {label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <Button variant="ghost-gold" full onClick={() => { setMobileOpen(false); navigate('/login') }}>
              Entrar
            </Button>
            <Button full onClick={() => { setMobileOpen(false); navigate('/register') }}>
              Começar grátis
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
