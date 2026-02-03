import { storageService } from './storage/storage.service'
import type { Scheme, PoolType, PoolGroup } from '@/types'
import { DEFAULT_SCHEME } from '@/constants/default-scheme'

class SchemeService {
  async getAll(): Promise<Scheme[]> {
    return await storageService.getAllSchemes()
  }

  async getById(id: string): Promise<Scheme | undefined> {
    return await storageService.getScheme(id)
  }

  async create(data: Omit<Scheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scheme> {
    return await storageService.createScheme(data)
  }

  async update(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    return await storageService.updateScheme(id, updates)
  }

  async delete(id: string): Promise<void> {
    const scheme = await this.getById(id)
    if (!scheme) throw new Error('方案不存在')

    if (scheme.isDefault) {
      throw new Error('默认方案不能删除')
    }

    await storageService.deleteScheme(id)
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
