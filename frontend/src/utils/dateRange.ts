export type Period = 'month' | 'quarter' | 'year' | 'custom'

export interface DateRange {
  from: string
  to: string
  prevFrom: string
  prevTo: string
  label: string
  prevLabel: string
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function lastDay(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

export function getDateRange(period: Period, now = new Date()): DateRange {
  const y = now.getFullYear()
  const m = now.getMonth()

  if (period === 'month' || period === 'custom') {
    const prevY = m === 0 ? y - 1 : y
    const prevM = m === 0 ? 11 : m - 1
    return {
      from:     toISO(new Date(y, m, 1)),
      to:       toISO(lastDay(y, m)),
      prevFrom: toISO(new Date(prevY, prevM, 1)),
      prevTo:   toISO(lastDay(prevY, prevM)),
      label:     `${MONTHS_PT[m]} ${y}`,
      prevLabel: `${MONTHS_PT[prevM]} ${prevY}`,
    }
  }

  if (period === 'quarter') {
    const q    = Math.floor(m / 3)
    const prevQ = q === 0 ? 3 : q - 1
    const prevY = q === 0 ? y - 1 : y
    return {
      from:     toISO(new Date(y, q * 3, 1)),
      to:       toISO(lastDay(y, q * 3 + 2)),
      prevFrom: toISO(new Date(prevY, prevQ * 3, 1)),
      prevTo:   toISO(lastDay(prevY, prevQ * 3 + 2)),
      label:     `T${q + 1} ${y}`,
      prevLabel: `T${prevQ + 1} ${prevY}`,
    }
  }

  // year
  return {
    from:     toISO(new Date(y, 0, 1)),
    to:       toISO(new Date(y, 11, 31)),
    prevFrom: toISO(new Date(y - 1, 0, 1)),
    prevTo:   toISO(new Date(y - 1, 11, 31)),
    label:     `${y}`,
    prevLabel: `${y - 1}`,
  }
}

export function daysInRange(from: string, to: string): number {
  const diff = new Date(to).getTime() - new Date(from).getTime()
  return Math.round(diff / 86_400_000) + 1
}
