import { db } from '../db/database'
import type { ExportData } from '../types'
import { DEFAULT_CURRENCY } from './constants'

export async function exportData(): Promise<ExportData> {
  const [people, categories, transactions, currency] = await Promise.all([
    db.people.toArray(),
    db.categories.toArray(),
    db.transactions.toArray(),
    db.settings.get('currency'),
  ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: { currency: currency?.value ?? DEFAULT_CURRENCY },
    people,
    categories,
    transactions,
  }
}

export async function downloadExport(): Promise<void> {
  const data = await exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `money-tracker-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function importData(data: ExportData): Promise<void> {
  if (data.version !== 1) {
    throw new Error('Unsupported backup file version')
  }

  await db.transaction('rw', db.people, db.categories, db.transactions, db.settings, async () => {
    await db.people.clear()
    await db.categories.clear()
    await db.transactions.clear()

    await db.people.bulkAdd(data.people)
    await db.categories.bulkAdd(data.categories)
    await db.transactions.bulkAdd(data.transactions)
    await db.settings.put({ key: 'currency', value: data.settings.currency })
  })
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.people, db.categories, db.transactions, async () => {
    await db.people.clear()
    await db.categories.clear()
    await db.transactions.clear()
  })
}
