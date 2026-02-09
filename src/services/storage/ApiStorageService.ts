import { httpService } from '../http/http.service'
import type { StorageAdapter } from './StorageAdapter.interface'
import type { Scheme, Record, Recommendation, Settings } from '@/types'

/**
 * API 存储服务实现（基于后端 API）
 * 实现了 StorageAdapter 接口，提供服务器端数据持久化能力
 */
class ApiStorageService implements StorageAdapter {
  // Scheme CRUD
  async getAllSchemes(): Promise<Scheme[]> {
    const response = await httpService.get<{ success: boolean; data: Scheme[] }>('/schemes')
    return response.data
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    const response = await httpService.get<{ success: boolean; data: Scheme }>(`/schemes/${id}`)
    return response.data
  }

  async createScheme(scheme: Omit<Scheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scheme> {
    const response = await httpService.post<{ success: boolean; data: Scheme }>('/schemes', scheme)
    return response.data
  }

  async updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    const response = await httpService.put<{ success: boolean; data: Scheme }>(`/schemes/${id}`, updates)
    return response.data
  }

  async deleteScheme(id: string): Promise<void> {
    await httpService.delete(`/schemes/${id}`)
  }

  // Record CRUD
  async getAllRecords(): Promise<Record[]> {
    const response = await httpService.get<{ success: boolean; data: Record[] }>('/records')
    return response.data
  }

  async getRecordsByDateRange(start: string, end: string): Promise<Record[]> {
    const response = await httpService.get<{ success: boolean; data: Record[] }>(
      `/records?start=${start}&end=${end}`
    )
    return response.data
  }

  async getRecordByDate(date: string): Promise<Record | undefined> {
    const response = await httpService.get<{ success: boolean; data: Record | null }>(`/records/date/${date}`)
    return response.data ?? undefined
  }

  async createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record> {
    const response = await httpService.post<{ success: boolean; data: Record }>('/records', record)
    return response.data
  }

  async updateRecord(id: string, updates: Partial<Record>): Promise<Record> {
    const response = await httpService.put<{ success: boolean; data: Record }>(`/records/${id}`, updates)
    return response.data
  }

  async deleteRecord(id: string): Promise<void> {
    await httpService.delete(`/records/${id}`)
  }

  // Recommendation CRUD
  async getRecommendationsByDate(date: string): Promise<Recommendation[]> {
    const response = await httpService.get<{ success: boolean; data: Recommendation[] }>(
      `/recommendations?date=${date}`
    )
    return response.data
  }

  async createRecommendation(rec: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    const response = await httpService.post<{ success: boolean; data: Recommendation }>('/recommendations', rec)
    return response.data
  }

  async deleteRecommendation(id: string): Promise<void> {
    await httpService.delete(`/recommendations/${id}`)
  }

  // Settings
  async getSettings(): Promise<Settings> {
    const response = await httpService.get<{ success: boolean; data: Settings }>('/settings')
    return response.data
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const response = await httpService.put<{ success: boolean; data: Settings }>('/settings', updates)
    return response.data
  }

  // 数据导出/导入
  async exportData(): Promise<string> {
    const response = await httpService.get<{ success: boolean; data: any }>('/export')
    return JSON.stringify(response.data, null, 2)
  }

  async importData(jsonString: string): Promise<void> {
    const data = JSON.parse(jsonString)
    await httpService.post('/import', data)
  }
}

export const apiStorageService = new ApiStorageService()
