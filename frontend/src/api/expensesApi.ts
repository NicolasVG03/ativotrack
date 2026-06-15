import httpClient from './httpClient'

export interface ExpenseDTO {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

export interface ExpenseSummaryDTO {
  total: number
  count: number
  byCategory: Record<string, number>
}

export interface ListExpensesParams {
  category?: string
  from?: string
  to?: string
}

export interface CreateExpenseInput {
  description: string
  amount: number
  date: string
  category: string
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>

export const expensesApi = {
  list: (params?: ListExpensesParams) =>
    httpClient.get<ExpenseDTO[]>('/expenses', { params }).then(r => r.data),

  create: (data: CreateExpenseInput) =>
    httpClient.post<ExpenseDTO>('/expenses', data).then(r => r.data),

  update: (id: string, data: UpdateExpenseInput) =>
    httpClient.put<ExpenseDTO>(`/expenses/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    httpClient.delete(`/expenses/${id}`),

  getSummary: () =>
    httpClient.get<ExpenseSummaryDTO>('/expenses/summary').then(r => r.data),
}
