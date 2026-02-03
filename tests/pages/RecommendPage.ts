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
    this.pageTitle = page.locator('h1').filter({ hasText: /菜品推荐/i })
    this.generateButton = page.locator('button').filter({ hasText: '生成推荐' })
    this.resultsContainer = page.locator('.recommendations')
    this.recommendationItems = this.resultsContainer.locator('> *')
    this.confirmButton = page.locator('button').filter({ hasText: '确认' })
    this.regenerateButton = this.generateButton // 同一个按钮用于重新生成
  }

  /**
   * 验证推荐页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await this.pageTitle.waitFor()
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
