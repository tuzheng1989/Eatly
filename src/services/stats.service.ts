import type { Statistics, Record, PoolType } from '@/types'
import { recordService } from './record.service'
import dayjs from 'dayjs'

class StatsService {
  async calculateOverview(records: Record[]) {
    const totalDays = records.length
    const mealsByGroup = { A: 0, B: 0, C: 0 }

    const dishCount = new Map<string, { count: number; group: PoolType }>()

    records.forEach(record => {
      Object.entries(record.meals).forEach(([group, dish]) => {
        mealsByGroup[group as PoolType]++

        const key = `${group}-${dish}`
        const existing = dishCount.get(key) || { count: 0, group: group as PoolType }
        dishCount.set(key, { count: existing.count + 1, group: existing.group })
      })
    })

    const topDishes = Array.from(dishCount.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([key, data]) => ({
        name: key.split('-')[1],
        group: data.group,
        count: data.count
      }))

    return {
      totalDays,
      totalRecords: totalDays,
      mealsByGroup,
      topDishes
    }
  }

  async calculateFrequency(records: Record[]) {
    const byGroup = { A: 0, B: 0, C: 0 }
    const byDish = new Map<string, { name: string; group: PoolType; count: number }>()

    let total = 0

    records.forEach(record => {
      Object.entries(record.meals).forEach(([group, dish]) => {
        byGroup[group as PoolType]++
        total++

        const existing = byDish.get(dish)
        if (existing) {
          existing.count++
        } else {
          byDish.set(dish, {
            name: dish,
            group: group as PoolType,
            count: 1
          })
        }
      })
    })

    const dishFrequency = Array.from(byDish.values()).map(dish => ({
      ...dish,
      percentage: (dish.count / total) * 100
    }))

    return {
      byGroup,
      byDish: dishFrequency
    }
  }

  async calculateTrends(
    records: Record[],
    granularity: 'day' | 'week' | 'month'
  ) {
    const grouped = new Map<string, Record[]>()

    records.forEach(record => {
      let key: string
      const date = dayjs(record.date)

      switch (granularity) {
        case 'day':
          key = record.date
          break
        case 'week':
          key = date.startOf('week').format('YYYY-MM-DD')
          break
        case 'month':
          key = date.format('YYYY-MM')
          break
      }

      const existing = grouped.get(key) || []
      existing.push(record)
      grouped.set(key, existing)
    })

    const trendData = Array.from(grouped.entries())
      .map(([date, recs]) => {
        const breakdown = { A: 0, B: 0, C: 0 }
        const uniqueDishes = new Set<string>()

        recs.forEach(rec => {
          Object.entries(rec.meals).forEach(([group, dish]) => {
            breakdown[group as PoolType]++
            uniqueDishes.add(`${group}-${dish}`)
          })
        })

        return {
          date,
          totalMeals: recs.length * 3,
          uniqueDishes: uniqueDishes.size,
          breakdown
        }
      })
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      timeGranularity: granularity,
      intakeTrend: trendData,
      diversityTrend: trendData
    }
  }

  async generateStatistics(
    granularity: 'day' | 'week' | 'month' = 'week'
  ): Promise<Statistics> {
    const records = await recordService.getAll()

    const [overview, frequency, trends] = await Promise.all([
      this.calculateOverview(records),
      this.calculateFrequency(records),
      this.calculateTrends(records, granularity)
    ])

    return {
      overview,
      frequency,
      trends
    }
  }
}

export const statsService = new StatsService()
