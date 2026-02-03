import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recommendation, MealGroup } from '@/types'
import { recommendService } from '@/services'
import { useSchemeStore } from './scheme'
import { recordService } from '@/services'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendations = ref<Recommendation[]>([])
  const loading = ref(false)

  async function generateRecommendations(
    count: number,
    startDate: string = new Date().toISOString().split('T')[0]
  ): Promise<Recommendation[]> {
    loading.value = true
    try {
      const schemeStore = useSchemeStore()
      const result = await recommendService.generate(
        schemeStore.currentPools,
        count,
        startDate
      )
      recommendations.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function confirmRecommendation(recId: string) {
    const rec = recommendations.value.find(r => r.id === recId)
    if (!rec) return

    const record = await recordService.create({
      date: rec.date,
      schemeId: rec.schemeId,
      schemeName: 'current',
      meals: rec.meals
    })

    const schemeStore = useSchemeStore()
    Object.entries(rec.meals).forEach(([group, dish]) => {
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
    generateRecommendations,
    confirmRecommendation,
    updateRecommendationMeals
  }
})
