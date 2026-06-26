import Dexie, { type EntityTable } from 'dexie'
import type { Category, Person, Transaction } from '../types'

export interface SettingRecord {
  key: string
  value: string
}

export class MoneyTrackerDB extends Dexie {
  transactions!: EntityTable<Transaction, 'id'>
  people!: EntityTable<Person, 'id'>
  categories!: EntityTable<Category, 'id'>
  settings!: EntityTable<SettingRecord, 'key'>

  constructor() {
    super('MoneyTrackerDB')
    this.version(1).stores({
      transactions: 'id, date, type, personId, categoryId, createdAt',
      people: 'id, name',
      categories: 'id, name',
      settings: 'key',
    })
  }
}

export const db = new MoneyTrackerDB()
