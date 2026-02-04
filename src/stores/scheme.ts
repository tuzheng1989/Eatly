import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Scheme, PoolType } from '@/types'
import { schemeService } from '@/services'

export const useSchemeStore = defineStore('scheme', () => {
  const schemes = ref<Scheme[]>([])
  const currentSchemeId = ref<string>('')
  const currentPools = ref<Record<PoolType, string[]>>({
    A: [],
    B: [],
    C: []
  })

  const currentScheme = computed(() =>
    schemes.value.find(s => s.id === currentSchemeId.value)
  )

  const poolStatus = computed(() => ({
    A: currentPools.value.A.length,
    B: currentPools.value.B.length,
    C: currentPools.value.C.length
  }))

  /**
   * 初始化方案管理
   * 1. 加载所有方案
   * 2. 从 localStorage 恢复当前方案ID
   * 3. 如果没有缓存，使用默认方案或第一个方案
   */
  async function initializeScheme() {
    await loadSchemes()

    // 1. 尝试从 localStorage 恢复当前方案ID
    const cachedSchemeId = localStorage.getItem('currentSchemeId')

    if (cachedSchemeId) {
      // 验证缓存的方案ID是否仍然有效
      const schemeExists = schemes.value.some(s => s.id === cachedSchemeId)
      if (schemeExists) {
        currentSchemeId.value = cachedSchemeId
        loadCurrentPools()
        return
      }
    }

    // 2. 没有缓存或缓存无效，查找默认方案
    const defaultScheme = schemes.value.find(s => s.isDefault)

    if (defaultScheme) {
      setCurrentScheme(defaultScheme.id)
      return
    }

    // 3. 没有默认方案，使用第一个可用方案
    if (schemes.value.length > 0) {
      setCurrentScheme(schemes.value[0].id)
    }
  }

  async function loadSchemes() {
    schemes.value = await schemeService.getAll()
  }

  async function createScheme(scheme: Omit<Scheme, 'id' | 'createdAt' | 'updatedAt'>) {
    const newScheme = await schemeService.create(scheme)
    schemes.value.push(newScheme)
    return newScheme
  }

  async function updateScheme(id: string, updates: Partial<Scheme>) {
    const updated = await schemeService.update(id, updates)
    const index = schemes.value.findIndex(s => s.id === id)
    if (index !== -1) {
      schemes.value[index] = updated
    }
  }

  async function deleteScheme(id: string) {
    await schemeService.delete(id)
    schemes.value = schemes.value.filter(s => s.id !== id)
  }

  function setCurrentScheme(id: string) {
    currentSchemeId.value = id
    localStorage.setItem('currentSchemeId', id)
    loadCurrentPools()
  }

  function loadCurrentPools() {
    const cached = localStorage.getItem('currentPools')
    if (cached) {
      currentPools.value = JSON.parse(cached)
    } else if (currentScheme.value) {
      currentPools.value = { ...currentScheme.value.pools }
    }
  }

  function updateCurrentPool(type: PoolType, dishes: string[]) {
    currentPools.value[type] = dishes
    localStorage.setItem('currentPools', JSON.stringify(currentPools.value))
  }

  function resetPool(type: PoolType) {
    if (currentScheme.value) {
      currentPools.value[type] = [...currentScheme.value.originalPools[type]]
      localStorage.setItem('currentPools', JSON.stringify(currentPools.value))
    }
  }

  return {
    schemes,
    currentSchemeId,
    currentPools,
    currentScheme,
    poolStatus,
    initializeScheme,
    loadSchemes,
    createScheme,
    updateScheme,
    deleteScheme,
    setCurrentScheme,
    loadCurrentPools,
    updateCurrentPool,
    resetPool
  }
})
