export interface Record {
  id: string
  date: string
  schemeId: string
  schemeName: string
  meals: MealGroup
  note?: string
  createdAt: string
  updatedAt: string
}

export interface MealGroup {
  A: string
  B: string
  C: string
}
