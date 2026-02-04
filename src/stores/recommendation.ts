import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recommendation, MealGroup, PoolGroup, PoolType } from '@/types'
import { recommendService } from '@/services'
import { useSchemeStore } from './scheme'
import { recordService } from '@/services'
import dayjs from 'dayjs'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendations = ref<Recommendation[]>([])
  const loading = ref(false)
  const remainingPools = ref<PoolGroup>({ A: [], B: [], C: [] })

  /**
   * 计算剩余池子（方案池子 - 已记录菜品）
   * 只移除属于当前方案的菜品
   * 排除"其他"菜品（不参与池子维护）
   */
  function calculateRemainingPools(
    originalPools: PoolGroup,
    records: Array<{ meals: MealGroup; schemeId: string }>
  ): PoolGroup {
    const remainingPools: PoolGroup = {
      A: [...originalPools.A],
      B: [...originalPools.B],
      C: [...originalPools.C]
    }

    const schemeStore = useSchemeStore()
    const currentSchemeId = schemeStore.currentSchemeId

    // 只移除属于当前方案的记录中的菜品
    // 排除"其他"菜品（不参与池子维护）
    records
      .filter(record => record.schemeId === currentSchemeId)
      .forEach(record => {
        const poolTypes: PoolType[] = ['A', 'B', 'C']
        poolTypes.forEach(type => {
          const dish = record.meals[type]
          // 跳过"其他"菜品
          if (dish === '其他' || dish.startsWith('其他:')) {
            return
          }
          const pool = remainingPools[type]
          const index = pool.indexOf(dish)
          if (index !== -1) {
            pool.splice(index, 1)
          }
        })
      })

    return remainingPools
  }

  /**
   * 查找下一个可用的推荐起始日期
   * 如果当天已有记录，则从次日开始
   */
  async function findNextAvailableDate(startDate: string): Promise<string> {
    let checkDate = dayjs(startDate)
    const maxDaysToCheck = 30 // 最多检查30天
    let daysChecked = 0

    while (daysChecked < maxDaysToCheck) {
      const dateStr = checkDate.format('YYYY-MM-DD')
      const existing = await recordService.getByDate(dateStr)

      if (!existing) {
        return dateStr
      }

      checkDate = checkDate.add(1, 'day')
      daysChecked++
    }

    // 如果30天都有记录，从第31天开始
    return checkDate.format('YYYY-MM-DD')
  }

  async function generateRecommendations(
    count: number,
    startDate?: string
  ): Promise<Recommendation[]> {
    loading.value = true
    try {
      const schemeStore = useSchemeStore()

      // 1. 确定推荐起始日期（如果当天已有记录，从次日开始）
      const start = startDate || dayjs().format('YYYY-MM-DD')
      const adjustedStartDate = await findNextAvailableDate(start)

      // 2. 获取所有已记录的记录，用于计算剩余池子
      const allRecords = await recordService.getAll()

      // 3. 计算剩余池子（方案池子 - 已记录菜品）
      const calculatedRemainingPools = calculateRemainingPools(
        schemeStore.currentPools,
        allRecords
      )

      // 4. 使用剩余池子生成推荐
      const result = await recommendService.generate(
        calculatedRemainingPools,
        schemeStore.currentScheme?.originalPools || schemeStore.currentPools,
        count,
        adjustedStartDate
      )

      // 5. 保存剩余池子供编辑使用
      remainingPools.value = calculatedRemainingPools

      recommendations.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function confirmRecommendation(recId: string) {
    const rec = recommendations.value.find(r => r.id === recId)
    if (!rec) return

    // 检查是否已有记录
    const existing = await recordService.getByDate(rec.date)

    let record
    if (existing) {
      // 更新现有记录
      record = await recordService.update(existing.id, {
        meals: rec.meals,
        schemeId: rec.schemeId,
        schemeName: 'current'
      })
    } else {
      // 创建新记录
      record = await recordService.create({
        date: rec.date,
        schemeId: rec.schemeId,
        schemeName: 'current',
        meals: rec.meals
      })
    }

    const schemeStore = useSchemeStore()
    Object.entries(rec.meals).forEach(([group, dish]) => {
      // 跳过"其他"菜品，不参与池子维护
      if (dish === '其他' || dish.startsWith('其他:')) {
        return
      }
      const pool = schemeStore.currentPools[group as keyof typeof rec.meals]
      const index = pool.indexOf(dish)
      if (index !== -1) {
        pool.splice(index, 1)
      }
    })

    Object.keys(schemeStore.currentPools).forEach(group => {
      if (schemeStore.currentPools[group as keyof typeof rec.meals].length === 0) {
        schemeStore.resetPool(group as keyof typeof rec.meals)
      }
    })

    rec.isConfirmed = true

    return record
  }

  function updateRecommendationMeals(recId: string, meals: MealGroup) {
    const rec = recommendations.value.find(r => r.id === recId)
    if (rec) {
      rec.meals = meals
    }
  }

  return {
    recommendations,
    loading,
    remainingPools,
    generateRecommendations,
    confirmRecommendation,
    updateRecommendationMeals
  }
})
