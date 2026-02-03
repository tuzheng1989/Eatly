import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 首页 Page Object
 */
export class HomePage extends BasePage {
  readonly welcomeTitle: Locator
  readonly quickActions: Locator
  readonly todayRecordCard: Locator

  constructor(page: Page) {
    super(page)
    this.welcomeTitle = page.locator('h1, h2').filter({ hasText: /Eatly|饮食|欢迎/i })
    this.quickActions = page.locator('[data-testid="quick-actions"] a, .quick-actions a')
    this.todayRecordCard = page.locator('[data-testid="today-record"], .today-record')
  }

  /**
   * 验证首页已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await this.welcomeTitle.waitFor()
  }

  /**
   * 获取快速操作数量
   */
  async getQuickActionCount(): Promise<number> {
    return await this.quickActions.count()
  }

  /**
   * 点击快速操作
   */
  async clickQuickAction(name: string) {
    await this.quickActions.filter({ hasText: name }).click()
  }
}
