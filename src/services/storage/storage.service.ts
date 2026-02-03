import { db } from './db'
import type { Scheme, Record, Recommendation, Settings } from '@/types'
import { generateUUID } from '@/utils/uuid'
import type { StorageAdapter } from './StorageAdapter.interface'

/**
 * 本地存储服务实现（基于 IndexedDB/Dexie）
 * 实现了 StorageAdapter 接口，提供本地数据持久化能力
 */
class StorageService implements StorageAdapter {
  // Scheme CRUD
  async getAllSchemes(): Promise<Scheme[]> {
    return await db.schemes.toArray()
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    return await db.schemes.get(id)
  }

  async createScheme(scheme: Omit<Scheme, 'id'>): Promise<Scheme> {
    const id = generateUUID()
    const now = new Date().toISOString()
    const newScheme: Scheme = {
      id,
      ...scheme,
      createdAt: now,
      updatedAt: now
    }
    await db.schemes.add(newScheme)
    return newScheme
  }

  async updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    await db.schemes.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
    return (await db.schemes.get(id))!
  }

  async deleteScheme(id: string): Promise<void> {
    await db.schemes.delete(id)
  }

  // Record CRUD
  async getAllRecords(): Promise<Record[]> {
    return await db.records.orderBy('date').reverse().toArray()
  }

  async getRecordsByDateRange(start: string, end: string): Promise<Record[]> {
    return await db.records
      .where('date')
      .between(start, end, true, true)
      .toArray()
  }

  async getRecordByDate(date: string): Promise<Record | undefined> {
    return await db.records.where('date').equals(date).first()
  }

  async createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record> {
    const id = generateUUID()
    const now = new Date().toISOString()
    const newRecord: Record = {
      id,
      ...record,
      createdAt: now,
      updatedAt: now
    }
    await db.records.add(newRecord)
    return newRecord
  }

  async updateRecord(id: string, updates: Partial<Record>): Promise<Record> {
    await db.records.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
    return (await db.records.get(id))!
  }

  async deleteRecord(id: string): Promise<void> {
    await db.records.delete(id)
  }

  // Recommendation CRUD
  async getRecommendationsByDate(date: string): Promise<Recommendation[]> {
    return await db.recommendations.where('date').equals(date).toArray()
  }

  async createRecommendation(rec: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    const id = generateUUID()
    const newRec: Recommendation = {
      id,
      ...rec,
      createdAt: new Date().toISOString()
    }
    await db.recommendations.add(newRec)
    return newRec
  }

  async deleteRecommendation(id: string): Promise<void> {
    await db.recommendations.delete(id)
  }

  // Settings
  async getSettings(): Promise<Settings> {
    const settings = await db.settings.toCollection().first()
    return settings || {
      defaultRecommendCount: 1,
      currentSchemeId: '',
      theme: 'auto',
      language: 'zh-CN',
      dateFormat: 'YYYY-MM-DD',
      chartGranularity: 'week'
    }
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const current = await this.getSettings()
    const updated = { ...current, ...updates }
    await db.settings.put(updated, 'settings')
    return updated
  }

  // 数据导出/导入
  async exportData(): Promise<string> {
    const schemes = await this.getAllSchemes()
    const records = await this.getAllRecords()
    const settings = await this.getSettings()

    return JSON.stringify({ schemes, records, settings }, null, 2)
  }

  async importData(jsonString: string): Promise<void> {
    const data = JSON.parse(jsonString)

    await db.transaction('rw', db.schemes, db.records, db.settings, async () => {
      await db.schemes.clear()
      await db.records.clear()
      await db.settings.clear()

      if (data.schemes) await db.schemes.bulkAdd(data.schemes)
      if (data.records) await db.records.bulkAdd(data.records)
      if (data.settings) await db.settings.put(data.settings, 'settings')
    })
  }
}

export const storageService = new StorageService()
