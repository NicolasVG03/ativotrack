import { useState } from 'react'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../components/ui/Icon'
import { DashboardHome } from './DashboardHome'
import { ExpensesPage } from './ExpensesPage'
import { ReportsPage } from './ReportsPage'
import { MOCK_EXPENSES, type Expense } from '../../utils/expenses'
import type { IconName } from '../../types'

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

export default function DashboardPage() {
  const [view,     setView]     = useState<DashView>('home')
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [toast,    setToast]    = useState<string | null>(null)
  const { user, logout } = useAuth()

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--cdp)', overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 216,
        background: 'var(--cmid)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        flexShrink: 0,
      }}>
        <div style={{ paddingLeft: 8, marginBottom: 36 }}>
          <Logo size="sm" />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(247,248,250,0.3)', fontWeight: 500 }}>
            {NAV_ITEMS.find(n => n.id === view)?.label ?? 'Dashboard'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(247,248,250,0.6)' }}>{user?.name ?? ''}</span>
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
            <DashboardHome
              expenses={expenses}
              onNavigate={v => setView(v as DashView)}
            />
          )}
          {view === 'expenses' && (
            <ExpensesPage
              expenses={expenses}
              setExpenses={setExpenses}
              showToast={showToast}
            />
          )}
          {view === 'reports' && <ReportsPage expenses={expenses} />}
        </main>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            background: '#13182b', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '12px 20px',
            fontSize: 14, fontWeight: 600, color: '#f7f8fa',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 300, whiteSpace: 'nowrap',
            animation: 'fadeInUp .2s ease both',
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
