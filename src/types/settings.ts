export interface Settings {
  defaultRecommendCount: number
  currentSchemeId: string
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY'
  chartGranularity: 'day' | 'week' | 'month'
}
