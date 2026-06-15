import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  expensesApi,
  type ListExpensesParams,
  type CreateExpenseInput,
  type UpdateExpenseInput,
} from '../api/expensesApi'

const EXPENSES_KEY = ['expenses'] as const

export function useExpenses(params?: ListExpensesParams) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, params],
    queryFn: () => expensesApi.list(params),
  })
}

export function useExpensesSummary() {
  return useQuery({
    queryKey: [...EXPENSES_KEY, 'summary'],
    queryFn: expensesApi.getSummary,
  })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExpenseInput) => expensesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
    },
  })
}

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseInput }) =>
      expensesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
    },
  })
}

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expensesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
    },
  })
}
