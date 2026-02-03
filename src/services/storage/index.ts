/**
 * 存储服务配置
 * 根据环境变量选择使用 IndexedDB（本地）或 API（后端）
 */

import { storageService as localDbService } from './storage.service'
import { apiStorageService } from './ApiStorageService'
import type { StorageAdapter } from './StorageAdapter.interface'

// 从环境变量读取存储类型
// development: 可通过 VITE_STORAGE_TYPE=api 或 localStorage 切换
// production: 默认使用 api
const storageType = import.meta.env.VITE_STORAGE_TYPE || 'api'

/**
 * 当前使用的存储服务
 */
export const storageService: StorageAdapter = storageType === 'api' ? apiStorageService : localDbService

/**
 * 当前存储类型
 */
export const currentStorageType = storageType

/**
 * 存储服务信息
 */
console.log(`🗄️  当前存储类型: ${storageType === 'api' ? 'API (后端)' : 'IndexedDB (本地)'}`)
