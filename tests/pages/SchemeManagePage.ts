import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 方案管理页面 Page Object
 */
export class SchemeManagePage extends BasePage {
  readonly pageTitle: Locator
  readonly createSchemeButton: Locator
  readonly schemeList: Locator
  readonly schemeItems: Locator
  readonly deleteButton: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /方案管理/i })
    this.createSchemeButton = page.locator('button').filter({ hasText: /创建方案|新建方案/i })
    this.schemeList = page.locator('[data-testid="scheme-list"], .scheme-list')
    this.schemeItems = page.locator('[data-testid="scheme-item"], .scheme-item')
    this.deleteButton = page.locator('button').filter({ hasText: /删除/i })
  }

  /**
   * 验证方案管理页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await this.pageTitle.waitFor()
  }

  /**
   * 获取方案数量
   */
  async getSchemeCount(): Promise<number> {
    return await this.schemeItems.count()
  }

  /**
   * 创建新方案
   */
  async createScheme(name: string, description?: string) {
    await this.createSchemeButton.click()

    // 填写方案名称
    await this.page.locator('input[name="name"], [data-testid="scheme-name"]').fill(name)

    // 填写描述（可选）
    if (description) {
      await this.page.locator('textarea[name="description"], [data-testid="scheme-description"]').fill(description)
    }

    // 提交
    await this.page.locator('button[type="submit"]').filter({ hasText: /创建|保存/i }).click()
  }

  /**
   * 删除第一个方案
   */
  async deleteFirstScheme() {
    const firstScheme = this.schemeItems.first()
    await firstScheme.hover()
    await this.deleteButton.first().click()

    // 确认删除
    const confirmButton = this.page.locator('button').filter({ hasText: /确认/i })
    await confirmButton.click()
  }
}
