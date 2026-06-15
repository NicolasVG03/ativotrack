import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'
import { Icon } from '../../components/ui/Icon'
import { FormInput, FormInputPassword } from '../../components/ui/FormInput'

type Tab = 'login' | 'register'

interface AuthPageProps {
  mode?: Tab
}

const FEATURES = [
  { icon: 'dashboard' as const, label: 'Dashboard de gastos em tempo real' },
  { icon: 'pieChart'  as const, label: 'Gráficos por categoria e período'  },
  { icon: 'reports'   as const, label: 'Relatórios mensais comparativos'    },
]

const HEX_DECO = [
  { x: '10%', y: '15%', s: 80 },
  { x: '80%', y: '10%', s: 56 },
  { x: '5%',  y: '75%', s: 48 },
  { x: '85%', y: '70%', s: 68 },
]

export default function AuthPage({ mode = 'login' }: AuthPageProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>(mode)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const err: Record<string, string> = {}
    if (tab === 'register' && !form.name.trim()) err.name = 'Nome obrigatório.'
    if (!form.email.includes('@')) err.email = 'E-mail inválido.'
    if (form.password.length < 6) err.password = 'Mínimo 6 caracteres.'
    if (tab === 'register' && form.password !== form.confirm) err.confirm = 'Senhas não coincidem.'
    return err
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) { setErrors(err); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 900)
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setErrors({})
    setForm({ name: '', email: '', password: '', confirm: '' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cdp)' }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{ flex: 1, background: 'var(--cdp)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {HEX_DECO.map(({ x, y, s }, i) => (
          <svg key={i} width={s} height={s} viewBox="0 0 80 80" style={{ position: 'absolute', left: x, top: y, opacity: 0.04, pointerEvents: 'none' }}>
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
          </svg>
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380, width: '100%' }}>
          <div style={{ marginBottom: 40 }}>
            <Logo size="lg" />
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28, lineHeight: 1.2, color: 'var(--ctxt)' }}>
            Controle financeiro que você vai gostar de usar.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {FEATURES.map(({ icon, label }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={icon} size={16} color="#C9A84C" />
                </div>
                <span style={{ fontSize: 15, color: 'rgba(247,248,250,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(247,248,250,0.2)', lineHeight: 1.6 }}>
            Uma iniciativa do Grupo Ativos — São José do Rio Preto, SP
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, background: 'var(--cmid)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>

        {/* back arrow */}
        <button
          className="back-btn"
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter,sans-serif' }}
        >
          <Icon name="chevronLeft" size={16} />
          Voltar
        </button>

        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo mobile */}
          <div className="block lg:hidden" style={{ marginBottom: 32 }}>
            <Logo size="md" />
          </div>

          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', transition: 'all .2s',
                  background: tab === t ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color:      tab === t ? 'var(--cgold)'          : 'rgba(247,248,250,0.45)',
                }}
              >
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {tab === 'login' ? 'Bom te ver de volta.' : 'Vamos começar.'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.45)', marginBottom: 28 }}>
            {tab === 'login' ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
          </p>

          {/* Google */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, color: 'var(--ctxt)', fontSize: 14, fontWeight: 500, fontFamily: 'Inter,sans-serif', cursor: 'pointer', marginBottom: 20, transition: 'background .2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.11)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: 'var(--ctxt3)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div>
                <FormInput label="Nome completo" placeholder="Seu nome" value={form.name} onChange={set('name')} autoFocus />
                {errors.name && <p style={{ fontSize: 12, color: 'var(--cng)', marginTop: -10, marginBottom: 12 }}>{errors.name}</p>}
              </div>
            )}
            <div>
              <FormInput label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} />
              {errors.email && <p style={{ fontSize: 12, color: 'var(--cng)', marginTop: -10, marginBottom: 12 }}>{errors.email}</p>}
            </div>
            <div>
              <FormInputPassword label="Senha" placeholder="••••••••" value={form.password} onChange={set('password')} />
              {errors.password && <p style={{ fontSize: 12, color: 'var(--cng)', marginTop: -10, marginBottom: 12 }}>{errors.password}</p>}
            </div>
            {tab === 'register' && (
              <div>
                <FormInputPassword label="Confirmar senha" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
                {errors.confirm && <p style={{ fontSize: 12, color: 'var(--cng)', marginTop: -10, marginBottom: 12 }}>{errors.confirm}</p>}
              </div>
            )}

            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
                <a href="#" style={{ fontSize: 13, color: 'var(--cgold)', textDecoration: 'none' }}>Esqueci a senha</a>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: 4, fontSize: 15, padding: '13px', borderRadius: 10 }}
              disabled={loading}
            >
              {loading ? 'Aguarde...' : (tab === 'login' ? 'Entrar' : 'Criar conta grátis')}
            </button>
          </form>

          {tab === 'register' && (
            <p style={{ fontSize: 12, color: 'var(--ctxt3)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Ao criar sua conta, você concorda com os{' '}
              <a href="#" style={{ color: 'rgba(201,168,76,0.6)', textDecoration: 'none' }}>Termos de Uso</a>{' '}
              e a{' '}
              <a href="#" style={{ color: 'rgba(201,168,76,0.6)', textDecoration: 'none' }}>Política de Privacidade</a>{' '}
              do AtivoTrack.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
