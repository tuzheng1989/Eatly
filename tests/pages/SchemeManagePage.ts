import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 方案管理页面 Page Object
 */
export class SchemeManagePage extends BasePage {
  readonly pageTitle: Locator
  readonly createSchemeButton: Locator
  readonly schemeItems: Locator
  readonly deleteButton: Locator
  readonly schemeNameInput: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1').filter({ hasText: /方案管理/i })
    this.createSchemeButton = page.locator('button').filter({ hasText: '创建方案' })
    this.schemeItems = page.locator('.scheme-item')
    this.deleteButton = page.locator('button').filter({ hasText: '删除' })
    this.schemeNameInput = page.locator('input[placeholder*="方案名称"]')
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
    // 填写方案名称
    await this.schemeNameInput.fill(name)

    // 填写描述（可选）
    if (description) {
      await this.page.locator('textarea[placeholder*="描述"]').fill(description)
    }

    // 点击创建按钮
    await this.createSchemeButton.click()

    // 等待创建完成
    await this.page.waitForTimeout(2000)
  }

  /**
   * 删除第一个方案
   */
  async deleteFirstScheme() {
    const schemeCount = await this.getSchemeCount()
    if (schemeCount === 0) return

    const firstDeleteBtn = this.deleteButton.first()
    await firstDeleteBtn.click()

    // 等待可能的确认对话框
    await this.page.waitForTimeout(1000)

    // 检查是否有确认按钮
    const confirmButton = this.page.locator('button').filter({ hasText: /确认|确定/i })
    if (await confirmButton.count() > 0) {
      await confirmButton.click()
    }
  }
}
