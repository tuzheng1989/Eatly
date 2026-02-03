import axios from 'axios'

/**
 * 应用设置
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
}

// 移除未使用的 ApiResponse 类型

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  language: 'zh'
}

/**
 * 设置服务
 * 支持本地存储（LocalStorage）和远程存储（HTTP API）两种模式
 * 通过环境变量 VITE_STORAGE_MODE 控制存储方式
 */
class SettingsService {
  private storageMode: string
  private api: ReturnType<typeof axios.create>

  constructor() {
    this.storageMode = import.meta.env.VITE_STORAGE_MODE || 'local'

    // 初始化 API 客户端
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
      }
    })
  }

  private async request<T>(config: import('axios').AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request(config)
      return response.data.data
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error && (error as any).response?.data?.error
        ? (error as any).response.data.error
        : error instanceof Error
        ? error.message
        : '请求失败'
      throw new Error(message)
    }
  }

  async getSettings(): Promise<AppSettings> {
    if (this.storageMode === 'remote') {
      // 从后端 API 获取
      return this.request<AppSettings>({
        method: 'GET',
        url: '/settings'
      })
    } else {
      // 从 LocalStorage 获取
      const saved = localStorage.getItem('app_settings')
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        } catch (e) {
          console.error('Failed to parse settings:', e)
          return DEFAULT_SETTINGS
        }
      }
      return DEFAULT_SETTINGS
    }
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    if (this.storageMode === 'remote') {
      // 更新后端 API
      return this.request<AppSettings>({
        method: 'PUT',
        url: '/settings',
        data: updates
      })
    } else {
      // 更新 LocalStorage
      const current = await this.getSettings()
      const merged = { ...current, ...updates }
      localStorage.setItem('app_settings', JSON.stringify(merged))
      return merged
    }
  }
}

export const settingsService = new SettingsService()
