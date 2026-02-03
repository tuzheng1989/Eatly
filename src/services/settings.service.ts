import { storageService } from './storage/storage.service'
import { apiStorageAdapter } from './storage/ApiStorage.adapter'
import type { StorageAdapter } from './storage/StorageAdapter.interface'

/**
 * 应用设置
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
}

/**
 * 设置服务
 * 支持本地存储（LocalStorage）和远程存储（HTTP API）两种模式
 * 通过环境变量 VITE_STORAGE_MODE 控制存储方式
 */
class SettingsService {
  private storage: StorageAdapter

  constructor() {
    // 根据环境变量选择存储适配器
    const storageMode = import.meta.env.VITE_STORAGE_MODE || 'local'
    this.storage = storageMode === 'remote' ? apiStorageAdapter : storageService
  }

  async getSettings(): Promise<AppSettings> {
    return await this.storage.getSettings()
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings()
    const merged = { ...current, ...updates }
    return await this.storage.updateSettings(merged)
  }
}

export const settingsService = new SettingsService()
