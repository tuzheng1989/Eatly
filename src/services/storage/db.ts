import Dexie, { Table } from 'dexie'
import type { Scheme, Record, Recommendation, Settings } from '@/types'

export class EatlyDatabase extends Dexie {
  schemes!: Table<Scheme>
  records!: Table<Record>
  recommendations!: Table<Recommendation>
  settings!: Table<Settings>

  constructor() {
    super('EatlyDB')

    this.version(1).stores({
      schemes: 'id, name, createdAt, isDefault',
      records: 'id, date, schemeId, createdAt',
      recommendations: 'id, date, schemeId, isConfirmed, createdAt',
      settings: '--id'
    })

    this.version(2).stores({
      schemes: 'id, name, createdAt, isDefault',
      records: 'id, date, schemeId, createdAt, [schemeId+date]',
      recommendations: 'id, date, schemeId, isConfirmed, createdAt',
      settings: '--id'
    })
  }
}

export const db = new EatlyDatabase()
