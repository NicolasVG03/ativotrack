export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: '#C9A84C',
  Moradia:     '#60a5fa',
  Saúde:       '#a78bfa',
  Transporte:  '#34d399',
  Lazer:       '#fb923c',
  Outros:      '#94a3b8',
}

export const CATEGORY_EMOJI: Record<string, string> = {
  Alimentação: '🍔',
  Moradia:     '🏠',
  Saúde:       '❤️',
  Transporte:  '🚗',
  Lazer:       '🎮',
  Outros:      '📦',
}

export interface Category {
  name: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { name: 'Alimentação', emoji: '🍔' },
  { name: 'Moradia',     emoji: '🏠' },
  { name: 'Saúde',       emoji: '❤️'  },
  { name: 'Transporte',  emoji: '🚗' },
  { name: 'Lazer',       emoji: '🎮' },
  { name: 'Outros',      emoji: '📦' },
]

export interface Expense {
  id: number
  desc: string
  category: string
  amount: number
  date: string
}

export interface CategoryTotal {
  name: string
  value: number
  color: string
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function computeCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const map: Record<string, number> = {}
  for (const e of expenses) {
    map[e.category] = (map[e.category] ?? 0) + e.amount
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] ?? '#94a3b8' }))
    .sort((a, b) => b.value - a.value)
}

export const MOCK_EXPENSES: Expense[] = [
  { id: 1,  desc: 'Aluguel',            category: 'Moradia',     amount: 1000,  date: '2026-06-01' },
  { id: 2,  desc: 'Supermercado',        category: 'Alimentação', amount: 312,   date: '2026-06-03' },
  { id: 3,  desc: 'Manutenção do carro', category: 'Transporte',  amount: 280,   date: '2026-06-05' },
  { id: 4,  desc: 'Dentista',            category: 'Saúde',       amount: 180,   date: '2026-06-07' },
  { id: 5,  desc: 'Academia',            category: 'Saúde',       amount: 120,   date: '2026-06-10' },
  { id: 6,  desc: 'Restaurante',         category: 'Alimentação', amount: 89,    date: '2026-06-11' },
  { id: 7,  desc: 'Uber',               category: 'Transporte',  amount: 45,    date: '2026-06-12' },
  { id: 8,  desc: 'Netflix',             category: 'Lazer',       amount: 39.90, date: '2026-06-12' },
  { id: 9,  desc: 'Padaria',             category: 'Alimentação', amount: 32,    date: '2026-06-13' },
  { id: 10, desc: 'Farmácia',            category: 'Saúde',       amount: 67,    date: '2026-06-13' },
]
