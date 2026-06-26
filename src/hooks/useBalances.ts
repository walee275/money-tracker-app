import { useLiveQuery } from 'dexie-react-hooks'
import { computePersonBalance, computeSummaryBalances } from '../db/balances'
import { db } from '../db/database'
import type { PersonBalance } from '../types'
import { DEFAULT_CURRENCY } from '../lib/constants'

export function useCurrency(): string {
  const setting = useLiveQuery(() => db.settings.get('currency'))
  return setting?.value ?? DEFAULT_CURRENCY
}

export function useBalances() {
  const transactions = useLiveQuery(() => db.transactions.toArray()) ?? []
  const people = useLiveQuery(() => db.people.toArray()) ?? []

  return computeSummaryBalances(transactions, people)
}

export function usePersonBalances(): PersonBalance[] {
  const transactions = useLiveQuery(() => db.transactions.toArray()) ?? []
  const people = useLiveQuery(() => db.people.toArray()) ?? []

  return people
    .map((person) => ({
      person,
      balance: computePersonBalance(person.id, transactions),
    }))
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
}

export function usePersonBalance(personId: string): number {
  const transactions = useLiveQuery(() => db.transactions.toArray()) ?? []
  return computePersonBalance(personId, transactions)
}

export function useCategories() {
  return useLiveQuery(() => db.categories.toArray()) ?? []
}

export function usePeople() {
  return useLiveQuery(() => db.people.toArray()) ?? []
}

export function usePerson(personId: string) {
  return useLiveQuery(() => db.people.get(personId))
}

export function usePersonTransactions(personId: string) {
  return (
    useLiveQuery(async () => {
      const txs = await db.transactions
        .where('personId')
        .equals(personId)
        .toArray()
      return txs.sort((a, b) => b.date.localeCompare(a.date))
    }) ?? []
  )
}

export function useRecentTransactions(limit = 5) {
  return (
    useLiveQuery(() =>
      db.transactions.orderBy('createdAt').reverse().limit(limit).toArray(),
    ) ?? []
  )
}

export function useAllTransactions() {
  return (
    useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray()) ??
    []
  )
}
