import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 推荐页面 Page Object
 */
export class RecommendPage extends BasePage {
  readonly pageTitle: Locator
  readonly generateButton: Locator
  readonly resultsContainer: Locator
  readonly recommendationItems: Locator
  readonly confirmButton: Locator
  readonly regenerateButton: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /推荐菜品/i })
    this.generateButton = page.locator('button').filter({ hasText: /生成推荐|推荐/i })
    this.resultsContainer = page.locator('[data-testid="recommendation-results"], .recommendation-results')
    this.recommendationItems = page.locator('[data-testid="recommendation-item"], .recommendation-item')
    this.confirmButton = page.locator('button').filter({ hasText: /确认|保存/i })
    this.regenerateButton = page.locator('button').filter({ hasText: /重新生成|换一批/i })
  }

  /**
   * 验证推荐页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await expect(this.pageTitle).toBeVisible()
  }

  /**
   * 点击生成推荐按钮
   */
  async generateRecommendations() {
    await this.generateButton.click()
    // 等待推荐结果加载
    await this.page.waitForTimeout(1000)
  }

  /**
   * 获取推荐项目数量
   */
  async getRecommendationCount(): Promise<number> {
    return await this.recommendationItems.count()
  }

  /**
   * 确认推荐
   */
  async confirmRecommendations() {
    await this.confirmButton.click()
  }

  /**
   * 重新生成推荐
   */
  async regenerate() {
    await this.regenerateButton.click()
    await this.page.waitForTimeout(1000)
  }

  /**
   * 验证推荐结果显示
   */
  async hasResults(): Promise<boolean> {
    const count = await this.getRecommendationCount()
    return count > 0
  }
}
