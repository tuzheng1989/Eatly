export interface Scheme {
  id: string
  name: string
  description?: string
  pools: PoolGroup
  originalPools: PoolGroup
  createdAt: string
  updatedAt: string
  isDefault?: boolean
}

export interface PoolGroup {
  A: string[]
  B: string[]
  C: string[]
}

export type PoolType = 'A' | 'B' | 'C'
