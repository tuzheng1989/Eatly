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
