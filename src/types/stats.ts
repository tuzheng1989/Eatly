export interface Statistics {
  overview: OverviewStats
  frequency: FrequencyStats
  trends: TrendStats
}

export interface OverviewStats {
  totalDays: number
  totalRecords: number
  mealsByGroup: {
    A: number
    B: number
    C: number
  }
  topDishes: TopDishItem[]
}

export interface TopDishItem {
  name: string
  group: PoolType
  count: number
}

export interface FrequencyStats {
  byGroup: GroupFrequency
  byDish: DishFrequency[]
}

export interface GroupFrequency {
  A: number
  B: number
  C: number
}

export interface DishFrequency {
  name: string
  group: PoolType
  count: number
  percentage: number
}

export interface TrendStats {
  timeGranularity: 'day' | 'week' | 'month'
  intakeTrend: TrendDataPoint[]
  diversityTrend: TrendDataPoint[]
}

export interface TrendDataPoint {
  date: string
  totalMeals: number
  uniqueDishes: number
  breakdown: {
    A: number
    B: number
    C: number
  }
}
