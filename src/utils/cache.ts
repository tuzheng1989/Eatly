import type { PoolType } from '@/types'

const CACHE_KEYS = {
  CURRENT_SCHEME_ID: 'currentSchemeId',
  CURRENT_POOLS: 'currentPools',
  SETTINGS: 'settings'
}

export function loadCurrentSchemeId(): string | null {
  return localStorage.getItem(CACHE_KEYS.CURRENT_SCHEME_ID)
}

export function saveCurrentSchemeId(id: string): void {
  localStorage.setItem(CACHE_KEYS.CURRENT_SCHEME_ID, id)
}

export function loadCurrentPools(): Record<PoolType, string[]> | null {
  const cached = localStorage.getItem(CACHE_KEYS.CURRENT_POOLS)
  return cached ? JSON.parse(cached) : null
}

export function saveCurrentPools(pools: Record<PoolType, string[]>): void {
  localStorage.setItem(CACHE_KEYS.CURRENT_POOLS, JSON.stringify(pools))
}

export function clearCache(): void {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
