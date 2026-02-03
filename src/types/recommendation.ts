export interface Recommendation {
  id: string
  date: string
  schemeId: string
  meals: MealGroup
  isConfirmed: boolean
  createdAt: string
}
