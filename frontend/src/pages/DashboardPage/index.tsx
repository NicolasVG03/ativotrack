import { useState, useEffect } from 'react'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../components/ui/Icon'
import { DashboardHome } from './DashboardHome'
import { ExpensesPage } from './ExpensesPage'
import { ReportsPage } from './ReportsPage'
import type { IconName } from '../../types'
import { useInactivityTimeout } from '../../hooks/useInactivityTimeout'

type DashView = 'home' | 'expenses' | 'reports'

interface NavItem {
  id: DashView
  icon: IconName
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     icon: 'dashboard', label: 'Dashboard'  },
  { id: 'expenses', icon: 'expenses',  label: 'Despesas'   },
  { id: 'reports',  icon: 'reports',   label: 'Relatórios' },
]

const TOAST_DURATION = 2800

type ToastType = 'success' | 'error'
interface ToastState { msg: string; type: ToastType }

export default function DashboardPage() {
  const [view,        setView]        = useState<DashView>('home')
  const [toast,       setToast]       = useState<ToastState | null>(null)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 768)
  const { user, logout } = useAuth()

  useInactivityTimeout(30 * 60 * 1000, logout)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setDrawerOpen(false)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const navigate = (v: DashView) => {
    setView(v)
    if (isMobile) setDrawerOpen(false)
  }

  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed', top: 0, left: drawerOpen ? 0 : -216, height: '100vh',
        width: 216, zIndex: 50, transition: 'left .25s ease',
        background: 'var(--cmid)', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', padding: '24px 12px', flexShrink: 0,
      }
    : {
        width: 216, background: 'var(--cmid)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', padding: '24px 12px', flexShrink: 0,
      }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--cdp)', overflow: 'hidden' }}>

      {/* ── OVERLAY (mobile) ── */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40 }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={sidebarStyle}>
        <div style={{ paddingLeft: 8, marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size="sm" />
          {isMobile && (
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(247,248,250,0.4)', fontSize: 18, cursor: 'pointer', padding: 4, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: 'none',
                  borderLeft: `2px solid ${active ? '#C9A84C' : 'transparent'}`,
                  background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                  color: active ? '#C9A84C' : 'rgba(247,248,250,0.45)',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'Inter,sans-serif',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .15s',
                  width: '100%',
                }}
                onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon name={item.icon} size={16} color={active ? '#C9A84C' : 'rgba(247,248,250,0.45)'} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 9,
            border: 'none',
            background: 'transparent',
            color: 'rgba(247,248,250,0.3)',
            fontSize: 14,
            fontFamily: 'Inter,sans-serif',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color .15s',
            width: '100%',
          }}
          onMouseOver={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.6)')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.3)')}
        >
          <Icon name="logout" size={16} color="currentColor" />
          Sair
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setDrawerOpen(true)}
                style={{ background: 'none', border: 'none', color: 'rgba(247,248,250,0.6)', fontSize: 20, cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center', lineHeight: 1 }}
              >
                ☰
              </button>
            )}
            <span style={{ fontSize: 13, color: 'rgba(247,248,250,0.3)', fontWeight: 500 }}>
              {NAV_ITEMS.find(n => n.id === view)?.label ?? 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(247,248,250,0.6)', display: isMobile ? 'none' : undefined }}>{user?.name ?? ''}</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C, #e0c987)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--cdp)', flexShrink: 0,
            }}>
              {(user?.name?.[0] ?? '').toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {view === 'home' && (
            <DashboardHome onNavigate={v => navigate(v as DashView)} />
          )}
          {view === 'expenses' && (
            <ExpensesPage showToast={(msg, type) => showToast(msg, type)} />
          )}
          {view === 'reports' && <ReportsPage />}
        </main>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            background: toast.type === 'error' ? 'rgba(30,10,10,0.98)' : '#13182b',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 12, padding: '12px 20px',
            fontSize: 14, fontWeight: 600,
            color: toast.type === 'error' ? '#f87171' : '#f7f8fa',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 300, whiteSpace: 'nowrap',
            animation: 'fadeInUp .2s ease both',
          }}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}
