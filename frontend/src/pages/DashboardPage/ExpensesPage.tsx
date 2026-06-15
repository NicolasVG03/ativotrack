import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { CategoryIcon } from '../../components/ui/CategoryIcon'
import { CategoryBadge } from '../../components/ui/CategoryBadge'
import { FormInput } from '../../components/ui/FormInput'
import {
  formatCurrency,
  formatDate,
  CATEGORIES,
  type Expense,
} from '../../utils/expenses'

// ── types ─────────────────────────────────────────────────────────────────

interface ExpenseFormData {
  desc: string
  amount: string
  date: string
  category: string
}

interface ExpensesPageProps {
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  showToast: (msg: string) => void
}

// ── EXPENSE FORM MODAL ────────────────────────────────────────────────────

interface ExpenseFormModalProps {
  expense: Expense | null
  onSave: (data: Omit<Expense, 'id'>) => void
  onClose: () => void
}

function ExpenseFormModal({ expense, onSave, onClose }: ExpenseFormModalProps) {
  const editing = !!expense
  const [form, setForm] = useState<ExpenseFormData>({
    desc:     expense?.desc     ?? '',
    amount:   expense?.amount   != null ? String(expense.amount) : '',
    date:     expense?.date     ?? new Date().toISOString().slice(0, 10),
    category: expense?.category ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({})

  const set = (k: keyof ExpenseFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = (): typeof errors => {
    const err: typeof errors = {}
    if (!form.desc.trim())                          err.desc     = 'Descrição obrigatória.'
    if (!form.amount || parseFloat(form.amount) <= 0) err.amount = 'O valor precisa ser maior que R$ 0,01.'
    if (!form.category)                             err.category = 'Selecione uma categoria.'
    return err
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) { setErrors(err); return }
    onSave({ desc: form.desc, amount: parseFloat(form.amount), date: form.date, category: form.category })
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box" style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {editing ? 'Editar despesa' : 'Nova despesa'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(247,248,250,0.4)', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'color .15s' }}
            onMouseOver={e => (e.currentTarget.style.color = '#f7f8fa')}
            onMouseOut={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.4)')}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput label="Descrição" placeholder="Ex: Mercado, Aluguel, Uber…"
            value={form.desc} onChange={set('desc')} autoFocus />
          {errors.desc && <p style={{ fontSize: 12, color: '#f87171', marginTop: -10, marginBottom: 12 }}>{errors.desc}</p>}

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Valor (R$)</label>
            <input
              className="input"
              type="number"
              placeholder="0,00"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={set('amount')}
              style={{ color: parseFloat(form.amount) > 0 ? '#4ade80' : undefined }}
            />
            {errors.amount && <p style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{errors.amount}</p>}
          </div>

          <FormInput label="Data" type="date" value={form.date} onChange={set('date')} />

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Categoria</label>
            <select className="input" value={form.category} onChange={set('category')}>
              <option value="">Selecione…</option>
              {CATEGORIES.map(c => (
                <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
              ))}
            </select>
            {errors.category && <p style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{errors.category}</p>}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 9999 }}>
              {editing ? 'Salvar alterações' : 'Salvar despesa'} 💸
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── DELETE CONFIRM ────────────────────────────────────────────────────────

interface ConfirmDeleteProps {
  expense: Expense
  onConfirm: () => void
  onClose: () => void
}

function ConfirmDelete({ expense, onConfirm, onClose }: ConfirmDeleteProps) {
  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box" style={{ maxWidth: 380, textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Icon name="trash" size={22} color="#f87171" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Excluir despesa?</h2>
        <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.55)', lineHeight: 1.65, marginBottom: 28 }}>
          Esta ação não pode ser desfeita. A despesa{' '}
          <strong style={{ color: '#f7f8fa' }}>"{expense.desc} — {formatCurrency(expense.amount)}"</strong>{' '}
          será removida permanentemente.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-cancel btn-full" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger btn-full" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

// ── FILTER BAR ────────────────────────────────────────────────────────────

interface FilterBarProps {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  dateFrom: string
  setDateFrom: (v: string) => void
  dateTo: string
  setDateTo: (v: string) => void
  onClear: () => void
  hasFilter: boolean
}

function FilterBar({ search, setSearch, category, setCategory, dateFrom, setDateFrom, dateTo, setDateTo, onClear, hasFilter }: FilterBarProps) {
  return (
    <div className="glass" style={{ padding: '14px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <Icon name="search" size={15} color="rgba(247,248,250,0.3)" />
        </span>
        <input
          className="input"
          placeholder="Buscar despesas…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 36, fontSize: 13 }}
        />
      </div>

      <select
        className="input"
        style={{ flex: '1 1 160px', fontSize: 13, maxWidth: 200 }}
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {CATEGORIES.map(c => (
          <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
        ))}
      </select>

      <input
        className="input"
        type="date"
        value={dateFrom}
        onChange={e => setDateFrom(e.target.value)}
        style={{ flex: '1 1 130px', fontSize: 13, maxWidth: 160 }}
      />
      <span style={{ color: 'rgba(247,248,250,0.3)', fontSize: 13 }}>→</span>
      <input
        className="input"
        type="date"
        value={dateTo}
        onChange={e => setDateTo(e.target.value)}
        style={{ flex: '1 1 130px', fontSize: 13, maxWidth: 160 }}
      />

      {hasFilter && (
        <button
          onClick={onClear}
          style={{ background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap', padding: '0 4px' }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}

// ── EXPENSE TABLE (desktop) ───────────────────────────────────────────────

interface ListProps {
  expenses: Expense[]
  onEdit: (exp: Expense) => void
  onDelete: (exp: Expense) => void
}

function ExpenseTable({ expenses, onEdit, onDelete }: ListProps) {
  return (
    <div className="glass expense-table-desktop" style={{ borderRadius: 16, overflow: 'hidden' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th style={{ textAlign: 'right' }}>Valor</th>
            <th style={{ textAlign: 'center', width: 80 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CategoryIcon name={exp.category} size={32} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f7f8fa' }}>{exp.desc}</span>
                </div>
              </td>
              <td><CategoryBadge name={exp.category} /></td>
              <td style={{ fontSize: 13, color: 'rgba(247,248,250,0.45)' }}>{formatDate(exp.date)}</td>
              <td style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#f87171' }}>
                -{formatCurrency(exp.amount)}
              </td>
              <td>
                <div className="row-actions" style={{ justifyContent: 'center' }}>
                  <ActionBtn onClick={() => onEdit(exp)} hoverColor="#C9A84C">
                    <Icon name="edit" size={15} />
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(exp)} hoverColor="#f87171">
                    <Icon name="trash" size={15} />
                  </ActionBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && <EmptyState />}
    </div>
  )
}

// ── EXPENSE CARDS (mobile) ────────────────────────────────────────────────

function ExpenseCardsMobile({ expenses, onEdit, onDelete }: ListProps) {
  return (
    <div className="expense-cards-mobile" style={{ flexDirection: 'column', gap: 8 }}>
      {expenses.map(exp => (
        <div key={exp.id} className="glass" style={{ borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CategoryIcon name={exp.category} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f7f8fa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.desc}</div>
            <div style={{ fontSize: 12, color: 'rgba(247,248,250,0.45)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CategoryBadge name={exp.category} />
              <span>· {formatDate(exp.date)}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f87171' }}>-{formatCurrency(exp.amount)}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6, justifyContent: 'flex-end' }}>
              <ActionBtn onClick={() => onEdit(exp)} hoverColor="#C9A84C" size={14}>
                <Icon name="edit" size={14} />
              </ActionBtn>
              <ActionBtn onClick={() => onDelete(exp)} hoverColor="#f87171" size={14}>
                <Icon name="trash" size={14} />
              </ActionBtn>
            </div>
          </div>
        </div>
      ))}
      {expenses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👛</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f7f8fa', marginBottom: 6 }}>Nenhuma despesa ainda.</div>
          <div style={{ fontSize: 13, color: 'rgba(247,248,250,0.4)' }}>Registre sua primeira despesa.</div>
        </div>
      )}
    </div>
  )
}

// ── HELPERS ───────────────────────────────────────────────────────────────

function ActionBtn({
  onClick, hoverColor, size = 6, children,
}: { onClick: () => void; hoverColor: string; size?: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(247,248,250,0.35)', padding: size, borderRadius: 6, transition: 'color .15s', display: 'flex' }}
      onMouseOver={e => (e.currentTarget.style.color = hoverColor)}
      onMouseOut={e => (e.currentTarget.style.color = 'rgba(247,248,250,0.35)')}
    >
      {children}
    </button>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: '60px 0', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>👛</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#f7f8fa', marginBottom: 8 }}>Nenhuma despesa ainda.</div>
      <div style={{ fontSize: 14, color: 'rgba(247,248,250,0.4)' }}>Registre sua primeira despesa e comece a entender para onde seu dinheiro vai.</div>
    </div>
  )
}

// ── PAGINATION ────────────────────────────────────────────────────────────

const PER_PAGE = 12

interface PaginationProps {
  page: number
  total: number
  onChange: (p: number) => void
}

function Pagination({ page, total, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / PER_PAGE)
  if (totalPages <= 1) return null
  const from = (page - 1) * PER_PAGE + 1
  const to   = Math.min(page * PER_PAGE, total)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 13, color: 'rgba(247,248,250,0.4)' }}>Mostrando {from}–{to} de {total} despesas</span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost btn-sm"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          style={{ opacity: page === 1 ? 0.4 : 1, borderRadius: 8, padding: '6px 12px' }}
        >
          ← Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="btn btn-sm"
            style={{
              borderRadius: 8, padding: '6px 12px',
              background: p === page ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: p === page ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.1)',
              color: p === page ? '#C9A84C' : 'rgba(247,248,250,0.5)',
              fontFamily: 'Inter,sans-serif', cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
        <button
          className="btn btn-ghost btn-sm"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          style={{ opacity: page === totalPages ? 0.4 : 1, borderRadius: 8, padding: '6px 12px' }}
        >
          Próxima →
        </button>
      </div>
    </div>
  )
}

// ── EXPENSES PAGE ─────────────────────────────────────────────────────────

export function ExpensesPage({ expenses, setExpenses, showToast }: ExpensesPageProps) {
  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState<Expense | null>(null)
  const [delTarget,  setDelTarget]  = useState<Expense | null>(null)
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('')
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')
  const [page,       setPage]       = useState(1)

  const hasFilter = !!(search || category || dateFrom || dateTo)

  const filtered = expenses
    .filter(e => {
      if (search   && !e.desc.toLowerCase().includes(search.toLowerCase()) && !e.category.toLowerCase().includes(search.toLowerCase())) return false
      if (category && e.category !== category) return false
      if (dateFrom && e.date < dateFrom) return false
      if (dateTo   && e.date > dateTo)   return false
      return true
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const clearFilters = () => { setSearch(''); setCategory(''); setDateFrom(''); setDateTo(''); setPage(1) }

  const handleSave = (data: Omit<Expense, 'id'>) => {
    if (editTarget) {
      setExpenses(prev => prev.map(e => e.id === editTarget.id ? { ...e, ...data } : e))
      showToast('✅ Despesa atualizada!')
    } else {
      setExpenses(prev => [{ ...data, id: Date.now() }, ...prev])
      showToast('💸 Despesa salva!')
    }
    setShowForm(false)
    setEditTarget(null)
  }

  const handleEdit = (exp: Expense) => { setEditTarget(exp); setShowForm(true) }

  const handleDelete = () => {
    if (!delTarget) return
    setExpenses(prev => prev.filter(e => e.id !== delTarget.id))
    showToast('🗑 Despesa removida.')
    setDelTarget(null)
  }

  const openNew = () => { setEditTarget(null); setShowForm(true) }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="fade-in-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Despesas</h1>
          <p style={{ fontSize: 14, color: 'rgba(247,248,250,0.45)' }}>Gerencie e acompanhe todos os seus registros.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} />
          Nova despesa
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}     setSearch={setSearch}
        category={category} setCategory={setCategory}
        dateFrom={dateFrom} setDateFrom={v => { setDateFrom(v); setPage(1) }}
        dateTo={dateTo}     setDateTo={v => { setDateTo(v); setPage(1) }}
        onClear={clearFilters}
        hasFilter={hasFilter}
      />

      {/* List */}
      <div className="fade-in-up" style={{ animationDelay: '.1s' }}>
        <ExpenseTable     expenses={paginated} onEdit={handleEdit} onDelete={setDelTarget} />
        <ExpenseCardsMobile expenses={paginated} onEdit={handleEdit} onDelete={setDelTarget} />
        <Pagination page={page} total={filtered.length} onChange={p => { setPage(p); window.scrollTo(0, 0) }} />
      </div>

      {/* FAB */}
      <button className="fab" onClick={openNew}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        <span>Nova despesa</span>
      </button>

      {/* Modals */}
      {showForm && (
        <ExpenseFormModal
          expense={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
      {delTarget && (
        <ConfirmDelete
          expense={delTarget}
          onConfirm={handleDelete}
          onClose={() => setDelTarget(null)}
        />
      )}
    </div>
  )
}
