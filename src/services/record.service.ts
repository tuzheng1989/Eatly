import { storageService } from './storage/storage.service'
import type { Record } from '@/types'
import dayjs from 'dayjs'

class RecordService {
  async getAll(): Promise<Record[]> {
    return await storageService.getAllRecords()
  }

  async getByDateRange(startDate?: string, endDate?: string): Promise<Record[]> {
    if (!startDate) {
      startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
    }
    if (!endDate) {
      endDate = dayjs().format('YYYY-MM-DD')
    }
    return await storageService.getRecordsByDateRange(startDate, endDate)
  }

  async getByDate(date: string): Promise<Record | undefined> {
    return await storageService.getRecordByDate(date)
  }

  async create(data: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record> {
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      throw new Error('无效的日期格式')
    }

    const existing = await this.getByDate(data.date)
    if (existing) {
      throw new Error('该日期已有记录')
    }

    return await storageService.createRecord(data)
  }

  async update(id: string, updates: Partial<Record>): Promise<Record> {
    return await storageService.updateRecord(id, updates)
  }

  async delete(id: string): Promise<void> {
    await storageService.deleteRecord(id)
  }

  async getRecent(days: number = 7): Promise<Record[]> {
    const startDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
    const endDate = dayjs().format('YYYY-MM-DD')
    return await this.getByDateRange(startDate, endDate)
  }
}

export const recordService = new RecordService()
