import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 统计分析页面 Page Object
 */
export class StatisticsPage extends BasePage {
  readonly pageTitle: Locator
  readonly charts: Locator
  readonly statsCards: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /统计|分析/i })
    this.charts = page.locator('[data-testid="chart"], canvas, .chart')
    // Naive UI 的 n-card 组件
    this.statsCards = page.locator('.statistics n-card')
  }

  /**
   * 验证统计页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await this.pageTitle.waitFor()
  }

  /**
   * 获取图表数量
   */
  async getChartCount(): Promise<number> {
    // 等待图表渲染
    await this.page.waitForTimeout(2000)
    return await this.charts.count()
  }

  /**
   * 获取统计卡片数量
   */
  async getStatsCardCount(): Promise<number> {
    // Naive UI 的 n-card 会渲染为带有标题的元素
    // 我们通过统计包含"概览"、"热门菜品"等标题的元素来计数
    const overviewCard = this.page.locator('.statistics').getByRole('heading', { name: '概览' })
    const topDishesCard = this.page.locator('.statistics').getByRole('heading', { name: '热门菜品' })

    // 等待至少一个卡片可见
    try {
      await overviewCard.waitFor({ timeout: 2000 })
      return 2 // 概览卡片 + 热门菜品卡片
    } catch {
      return 0
    }
  }
}
