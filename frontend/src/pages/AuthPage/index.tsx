import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { Logo } from '../../components/ui/Logo'
import { Icon } from '../../components/ui/Icon'
import { FormInput, FormInputPassword } from '../../components/ui/FormInput'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, opts: object) => void
        }
      }
    }
  }
}

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

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = z.object({
  name:     z.string().min(2, 'Mínimo 2 caracteres'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Senhas não coincidem',
  path: ['confirm'],
})

type LoginFields    = z.infer<typeof loginSchema>
type RegisterFields = z.infer<typeof registerSchema>

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p style={{ fontSize: 12, color: 'var(--cng)', marginTop: -10, marginBottom: 12 }}>{msg}</p>
}

export default function AuthPage({ mode = 'login' }: AuthPageProps) {
  const navigate    = useNavigate()
  const { login }   = useAuth()
  const [tab, setTab] = useState<Tab>(mode)
  const googleRef        = useRef<HTMLDivElement>(null)
  const googleInitialized = useRef(false)

  const loginForm = useForm<LoginFields>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterFields>({ resolver: zodResolver(registerSchema) })

  // Google Identity Services
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleRef.current || googleInitialized.current) return
      googleInitialized.current = true
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
        callback: async ({ credential }) => {
          try {
            const data = await authApi.loginWithGoogle(credential)
            login(data)
            navigate('/dashboard')
          } catch {
            loginForm.setError('root', { message: 'Falha no login com Google' })
          }
        },
      })
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 368,
        text: 'continue_with',
        locale: 'pt-BR',
      })
    }

    if (window.google) {
      initGoogle()
    } else {
      const script = document.querySelector('script[src*="accounts.google.com"]')
      script?.addEventListener('load', initGoogle)
      return () => script?.removeEventListener('load', initGoogle)
    }
  }, [])

  const onLoginSubmit = loginForm.handleSubmit(async (data) => {
    try {
      const res = await authApi.login(data.email, data.password)
      login(res)
      navigate('/dashboard')
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>).response?.data?.message
      loginForm.setError('root', { message: msg ?? 'Credenciais inválidas' })
    }
  })

  const onRegisterSubmit = registerForm.handleSubmit(async (data) => {
    try {
      const res = await authApi.register(data.name, data.email, data.password)
      login(res)
      navigate('/dashboard')
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      const status = axiosErr.response?.status
      const msg = status === 409
        ? 'Este e-mail já está cadastrado.'
        : (axiosErr.response?.data?.message ?? 'Erro ao criar conta')
      registerForm.setError('root', { message: msg })
    }
  })

  const switchTab = (t: Tab) => {
    setTab(t)
    loginForm.reset()
    registerForm.reset()
  }

  const isSubmitting = tab === 'login'
    ? loginForm.formState.isSubmitting
    : registerForm.formState.isSubmitting

  const rootError = tab === 'login'
    ? loginForm.formState.errors.root?.message
    : registerForm.formState.errors.root?.message

  const lf = loginForm.register
  const rf = registerForm.register
  const le = loginForm.formState.errors
  const re = registerForm.formState.errors

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

        <button
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter,sans-serif', color: 'var(--ctxt)' }}
        >
          <Icon name="chevronLeft" size={16} />
          Voltar
        </button>

        <div style={{ width: '100%', maxWidth: 400 }}>

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

          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {tab === 'login' ? 'Bom te ver de volta.' : 'Vamos começar.'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.45)', marginBottom: 28 }}>
            {tab === 'login' ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
          </p>

          {/* Google button rendered by GIS */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div ref={googleRef} />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: 'rgba(247,248,250,0.35)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={onLoginSubmit}>
              <FormInput label="E-mail" type="email" placeholder="seu@email.com" {...lf('email')} />
              <FieldError msg={le.email?.message} />
              <FormInputPassword label="Senha" placeholder="••••••••" {...lf('password')} />
              <FieldError msg={le.password?.message} />

              <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
                <a href="#" style={{ fontSize: 13, color: 'var(--cgold)', textDecoration: 'none' }}>Esqueci a senha</a>
              </div>

              {rootError && (
                <p style={{ fontSize: 13, color: 'var(--cng)', textAlign: 'center', marginBottom: 12 }}>{rootError}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: 4, fontSize: 15, padding: '13px', borderRadius: 10 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={onRegisterSubmit}>
              <FormInput label="Nome completo" placeholder="Seu nome" autoFocus {...rf('name')} />
              <FieldError msg={re.name?.message} />
              <FormInput label="E-mail" type="email" placeholder="seu@email.com" {...rf('email')} />
              <FieldError msg={re.email?.message} />
              <FormInputPassword label="Senha" placeholder="••••••••" {...rf('password')} />
              <FieldError msg={re.password?.message} />
              <FormInputPassword label="Confirmar senha" placeholder="••••••••" {...rf('confirm')} />
              <FieldError msg={re.confirm?.message} />

              {rootError && (
                <p style={{ fontSize: 13, color: 'var(--cng)', textAlign: 'center', marginBottom: 12 }}>
                  {rootError}
                  {rootError === 'Este e-mail já está cadastrado.' && (
                    <>{' '}<button type="button" onClick={() => switchTab('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cgold)', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>Fazer login</button></>
                  )}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: 4, fontSize: 15, padding: '13px', borderRadius: 10 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta grátis'}
              </button>

              <p style={{ fontSize: 12, color: 'rgba(247,248,250,0.3)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                Ao criar sua conta, você concorda com os{' '}
                <a href="#" style={{ color: 'rgba(201,168,76,0.6)', textDecoration: 'none' }}>Termos de Uso</a>{' '}
                e a{' '}
                <a href="#" style={{ color: 'rgba(201,168,76,0.6)', textDecoration: 'none' }}>Política de Privacidade</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
