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
    this.statsCards = page.locator('[data-testid="stat-card"], .stat-card')
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
    return await this.statsCards.count()
  }
}
