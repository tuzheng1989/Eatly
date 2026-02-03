import type { PoolGroup, MealGroup, Recommendation, PoolType } from '@/types'
import { generateUUID } from '@/utils/uuid'
import dayjs from 'dayjs'

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

class RecommendService {
  async generate(
    pools: PoolGroup,
    count: number,
    startDate: string = dayjs().format('YYYY-MM-DD')
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    let workingPools: PoolGroup = JSON.parse(JSON.stringify(pools))

    for (let i = 0; i < count; i++) {
      const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD')

      // 检查池子是否为空，为空则重置
      ;(['A', 'B', 'C'] as PoolType[]).forEach(type => {
        if (workingPools[type].length === 0) {
          workingPools[type] = [...pools[type]]
        }
      })

      // 随机选择菜品
      const meals: MealGroup = {
        A: randomItem(workingPools.A),
        B: randomItem(workingPools.B),
        C: randomItem(workingPools.C)
      }

      // 从池子移除已选菜品
      workingPools.A.splice(workingPools.A.indexOf(meals.A), 1)
      workingPools.B.splice(workingPools.B.indexOf(meals.B), 1)
      workingPools.C.splice(workingPools.C.indexOf(meals.C), 1)

      recommendations.push({
        id: generateUUID(),
        date,
        schemeId: '',
        meals,
        isConfirmed: false,
        createdAt: new Date().toISOString()
      })
    }

    return recommendations
  }

  validateRecommendation(rec: Recommendation): boolean {
    return (
      rec.date &&
      rec.meals.A &&
      rec.meals.B &&
      rec.meals.C &&
      /^\d{4}-\d{2}-\d{2}$/.test(rec.date)
    )
  }
}

export const recommendService = new RecommendService()
