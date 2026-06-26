export type TransactionType =
  | 'expense'
  | 'income'
  | 'lend'
  | 'borrow'
  | 'settle'

export type SettleDirection = 'received' | 'paid'

export interface Person {
  id: string
  name: string
  note?: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  note?: string
  personId?: string
  categoryId?: string
  settleDirection?: SettleDirection
  createdAt: string
}

export interface AppSettings {
  currency: string
}

export interface ExportData {
  version: 1
  exportedAt: string
  settings: AppSettings
  people: Person[]
  categories: Category[]
  transactions: Transaction[]
}

export interface SummaryBalances {
  cash: number
  owedToMe: number
  iOwe: number
}

export interface PersonBalance {
  person: Person
  balance: number
}
