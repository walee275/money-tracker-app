import type { Person, SummaryBalances, Transaction } from '../types'
import { DEFAULT_CATEGORIES, DEFAULT_CURRENCY } from '../lib/constants'
import { db } from './database'

export function computeCashBalance(transactions: Transaction[]): number {
  return transactions.reduce((total, tx) => {
    switch (tx.type) {
      case 'income':
        return total + tx.amount
      case 'expense':
      case 'lend':
        return total - tx.amount
      case 'borrow':
        return total + tx.amount
      case 'settle':
        return tx.settleDirection === 'received'
          ? total + tx.amount
          : total - tx.amount
      default:
        return total
    }
  }, 0)
}

export function computePersonBalance(
  personId: string,
  transactions: Transaction[],
): number {
  return transactions
    .filter((tx) => tx.personId === personId)
    .reduce((total, tx) => {
      switch (tx.type) {
        case 'lend':
          return total + tx.amount
        case 'borrow':
          return total - tx.amount
        case 'settle':
          return tx.settleDirection === 'received'
            ? total - tx.amount
            : total + tx.amount
        default:
          return total
      }
    }, 0)
}

export function computeSummaryBalances(
  transactions: Transaction[],
  people: Person[],
): SummaryBalances {
  let owedToMe = 0
  let iOwe = 0

  for (const person of people) {
    const balance = computePersonBalance(person.id, transactions)
    if (balance > 0) owedToMe += balance
    if (balance < 0) iOwe += Math.abs(balance)
  }

  return {
    cash: computeCashBalance(transactions),
    owedToMe,
    iOwe,
  }
}

export async function seedDatabase(): Promise<void> {
  const categoryCount = await db.categories.count()
  if (categoryCount === 0) {
    await db.categories.bulkAdd(
      DEFAULT_CATEGORIES.map((cat) => ({
        id: crypto.randomUUID(),
        name: cat.name,
        color: cat.color,
      })),
    )
  }

  const currency = await db.settings.get('currency')
  if (!currency) {
    await db.settings.put({ key: 'currency', value: DEFAULT_CURRENCY })
  }
}

export async function addTransaction(
  data: Omit<Transaction, 'id' | 'createdAt'>,
): Promise<string> {
  const id = crypto.randomUUID()
  await db.transactions.add({
    ...data,
    id,
    createdAt: new Date().toISOString(),
  })
  return id
}

export async function addPerson(name: string, note?: string): Promise<string> {
  const id = crypto.randomUUID()
  await db.people.add({ id, name, note })
  return id
}

export async function deletePerson(id: string): Promise<void> {
  await db.transaction('rw', db.people, db.transactions, async () => {
    await db.transactions.where('personId').equals(id).delete()
    await db.people.delete(id)
  })
}

export async function getTransactionsForPerson(
  personId: string,
): Promise<Transaction[]> {
  return db.transactions
    .where('personId')
    .equals(personId)
    .reverse()
    .sortBy('date')
}

export async function getRecentTransactions(
  limit = 5,
): Promise<Transaction[]> {
  return db.transactions.orderBy('createdAt').reverse().limit(limit).toArray()
}

export async function getAllTransactionsSorted(): Promise<Transaction[]> {
  return db.transactions.orderBy('date').reverse().toArray()
}
