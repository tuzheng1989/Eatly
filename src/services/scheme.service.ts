import { storageService } from './storage/storage.service'
import { apiStorageAdapter } from './storage/ApiStorage.adapter'
import type { StorageAdapter } from './storage/StorageAdapter.interface'
import type { Scheme, PoolType, PoolGroup } from '@/types'
import { DEFAULT_SCHEME } from '@/constants/default-scheme'

/**
 * 方案服务
 * 支持本地存储（IndexedDB）和远程存储（HTTP API）两种模式
 * 通过环境变量 VITE_STORAGE_MODE 控制存储方式
 */
class SchemeService {
  private storage: StorageAdapter

  constructor() {
    // 根据环境变量选择存储适配器
    const storageMode = import.meta.env.VITE_STORAGE_MODE || 'local'
    this.storage = storageMode === 'remote' ? apiStorageAdapter : storageService
  }

  async getAll(): Promise<Scheme[]> {
    return await this.storage.getAllSchemes()
  }

  async getById(id: string): Promise<Scheme | undefined> {
    return await this.storage.getScheme(id)
  }

  async create(data: Omit<Scheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scheme> {
    return await this.storage.createScheme(data)
  }

  async update(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    return await this.storage.updateScheme(id, updates)
  }

  async delete(id: string): Promise<void> {
    // 先验证，无论使用哪种存储
    const scheme = await this.getById(id)
    if (!scheme) throw new Error('方案不存在')

    if (scheme.isDefault) {
      throw new Error('默认方案不能删除')
    }

    await this.storage.deleteScheme(id)
  }

  async initializeDefaultScheme(): Promise<Scheme> {
    const existing = await this.getAll()
    if (existing.length === 0) {
      return await this.create(DEFAULT_SCHEME)
    }
    return existing[0]
  }

  resetPools(scheme: Scheme): PoolGroup {
    return JSON.parse(JSON.stringify(scheme.originalPools))
  }

  validatePool(pools: PoolGroup): boolean {
    return pools.A.length > 0 && pools.B.length > 0 && pools.C.length > 0
  }
}

export const schemeService = new SchemeService()
