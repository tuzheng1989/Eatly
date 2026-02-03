import { Page, Locator } from '@playwright/test'

/**
 * 基础页面类
 * 提供通用方法和属性
 */
export class BasePage {
  readonly page: Page
  readonly header: Locator
  readonly navigation: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('header')
    this.navigation = page.locator('nav')
  }

  /**
   * 导航到指定路径
   */
  async goto(path: string = '') {
    await this.page.goto(path)
  }

  /**
   * 等待页面加载完成
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 获取页面标题
   */
  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  /**
   * 截图
   */
  async screenshot(filename: string) {
    await this.page.screenshot({
      path: `artifacts/${filename}`,
      fullPage: true
    })
  }

  /**
   * 点击导航菜单项
   */
  async clickNavigation(text: string) {
    await this.navigation.getByRole('link', { name: text }).click()
  }
}
