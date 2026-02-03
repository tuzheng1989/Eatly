import type { Scheme, Record, Recommendation, Settings } from '@/types'

/**
 * 存储适配器接口
 * 定义了所有数据持久化操作的统一接口
 * 支持多种存储实现：IndexedDB (Dexie)、HTTP API、LocalStorage 等
 */
export interface StorageAdapter {
  // ========== Scheme CRUD ==========

  /**
   * 获取所有方案
   */
  getAllSchemes(): Promise<Scheme[]>

  /**
   * 根据 ID 获取方案
   */
  getScheme(id: string): Promise<Scheme | undefined>

  /**
   * 创建新方案
   */
  createScheme(scheme: Omit<Scheme, 'id'>): Promise<Scheme>

  /**
   * 更新方案
   */
  updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme>

  /**
   * 删除方案
   */
  deleteScheme(id: string): Promise<void>

  // ========== Record CRUD ==========

  /**
   * 获取所有记录（按日期倒序）
   */
  getAllRecords(): Promise<Record[]>

  /**
   * 获取日期范围内的记录
   */
  getRecordsByDateRange(start: string, end: string): Promise<Record[]>

  /**
   * 根据日期获取记录
   */
  getRecordByDate(date: string): Promise<Record | undefined>

  /**
   * 创建记录
   */
  createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record>

  /**
   * 更新记录
   */
  updateRecord(id: string, updates: Partial<Record>): Promise<Record>

  /**
   * 删除记录
   */
  deleteRecord(id: string): Promise<void>

  // ========== Recommendation CRUD ==========

  /**
   * 获取指定日期的推荐
   */
  getRecommendationsByDate(date: string): Promise<Recommendation[]>

  /**
   * 创建推荐
   */
  createRecommendation(rec: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation>

  /**
   * 删除推荐
   */
  deleteRecommendation(id: string): Promise<void>

  // ========== Settings ==========

  /**
   * 获取设置
   */
  getSettings(): Promise<Settings>

  /**
   * 更新设置
   */
  updateSettings(updates: Partial<Settings>): Promise<Settings>
}
