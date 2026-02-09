import { storageService } from './storage'
import type { StorageAdapter } from './storage/StorageAdapter.interface'
import type { Record } from '@/types'
import dayjs from 'dayjs'

/**
 * 记录服务
 * 支持本地存储（IndexedDB）和远程存储（HTTP API）两种模式
 * 通过环境变量 VITE_STORAGE_TYPE 自动选择存储方式
 */
class RecordService {
  private storage: StorageAdapter

  constructor() {
    // 直接使用统一的 storageService
    this.storage = storageService
  }

  async getAll(): Promise<Record[]> {
    return await this.storage.getAllRecords()
  }

  async getByDateRange(startDate?: string, endDate?: string): Promise<Record[]> {
    if (!startDate) {
      startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
    }
    if (!endDate) {
      endDate = dayjs().add(1, 'month').format('YYYY-MM-DD')
    }
    return await this.storage.getRecordsByDateRange(startDate, endDate)
  }

  async getByDate(date: string): Promise<Record | undefined> {
    return await this.storage.getRecordByDate(date)
  }

  async create(data: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record> {
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      throw new Error('无效的日期格式')
    }

    const existing = await this.getByDate(data.date)
    if (existing) {
      throw new Error('该日期已有记录')
    }

    return await this.storage.createRecord(data)
  }

  async update(id: string, updates: Partial<Record>): Promise<Record> {
    return await this.storage.updateRecord(id, updates)
  }

  async delete(id: string): Promise<void> {
    await this.storage.deleteRecord(id)
  }

  async getRecent(days: number = 7): Promise<Record[]> {
    const startDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
    const endDate = dayjs().format('YYYY-MM-DD')
    return await this.getByDateRange(startDate, endDate)
  }
}

export const recordService = new RecordService()
