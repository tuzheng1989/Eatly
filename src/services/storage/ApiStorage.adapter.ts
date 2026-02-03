import axios from 'axios'
import type { StorageAdapter } from './StorageAdapter.interface'
import type { Scheme, Record, Recommendation, Settings } from '@/types'

/**
 * API 存储适配器
 * 通过 HTTP API 与后端服务器通信，实现数据持久化到 PostgreSQL
 * 用于云端部署场景，支持多设备访问
 */
class ApiStorageAdapter implements StorageAdapter {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_API_KEY || ''
    }
  })

  /**
   * 统一响应处理
   */
  private async request<T>(config: any): Promise<T> {
    try {
      const response = await this.api.request(config)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || '请求失败'
      throw new Error(message)
    }
  }

  // ========== Scheme CRUD ==========

  async getAllSchemes(): Promise<Scheme[]> {
    return this.request<Scheme[]>({
      method: 'GET',
      url: '/schemes'
    })
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    try {
      return this.request<Scheme>({
        method: 'GET',
        url: `/schemes/${id}`
      })
    } catch {
      return undefined
    }
  }

  async createScheme(scheme: Omit<Scheme, 'id'>): Promise<Scheme> {
    return this.request<Scheme>({
      method: 'POST',
      url: '/schemes',
      data: scheme
    })
  }

  async updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    return this.request<Scheme>({
      method: 'PUT',
      url: `/schemes/${id}`,
      data: updates
    })
  }

  async deleteScheme(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/schemes/${id}`
    })
  }

  // ========== Record CRUD ==========

  async getAllRecords(): Promise<Record[]> {
    return this.request<Record[]>({
      method: 'GET',
      url: '/records'
    })
  }

  async getRecordsByDateRange(start: string, end: string): Promise<Record[]> {
    return this.request<Record[]>({
      method: 'GET',
      url: '/records',
      params: { start, end }
    })
  }

  async getRecordByDate(date: string): Promise<Record | undefined> {
    try {
      return this.request<Record>({
        method: 'GET',
        url: `/records/date/${date}`
      })
    } catch {
      return undefined
    }
  }

  async createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record> {
    return this.request<Record>({
      method: 'POST',
      url: '/records',
      data: record
    })
  }

  async updateRecord(id: string, updates: Partial<Record>): Promise<Record> {
    return this.request<Record>({
      method: 'PUT',
      url: `/records/${id}`,
      data: updates
    })
  }

  async deleteRecord(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/records/${id}`
    })
  }

  // ========== Recommendation CRUD ==========

  async getRecommendationsByDate(date: string): Promise<Recommendation[]> {
    return this.request<Recommendation[]>({
      method: 'GET',
      url: '/recommendations',
      params: { date }
    })
  }

  async createRecommendation(rec: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    return this.request<Recommendation>({
      method: 'POST',
      url: '/recommendations',
      data: rec
    })
  }

  async deleteRecommendation(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/recommendations/${id}`
    })
  }

  // ========== Settings ==========

  async getSettings(): Promise<Settings> {
    return this.request<Settings>({
      method: 'GET',
      url: '/settings'
    })
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    return this.request<Settings>({
      method: 'PUT',
      url: '/settings',
      data: updates
    })
  }
}

/**
 * API 存储适配器实例
 * 用于云端部署，通过 HTTP API 与后端服务器通信
 */
export const apiStorageAdapter = new ApiStorageAdapter()
