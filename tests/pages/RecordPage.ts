import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 记录饮食页面 Page Object
 */
export class RecordPage extends BasePage {
  readonly pageTitle: Locator
  readonly datePicker: Locator
  readonly mealSections: Locator
  readonly breakfastSection: Locator
  readonly lunchSection: Locator
  readonly dinnerSection: Locator
  readonly addButton: Locator
  readonly saveButton: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /记录饮食/i })
    this.datePicker = page.locator('[data-testid="date-picker"], .date-picker input')
    this.mealSections = page.locator('[data-testid="meal-section"], .meal-section')
    this.breakfastSection = page.locator('[data-testid="breakfast"], .breakfast')
    this.lunchSection = page.locator('[data-testid="lunch"], .lunch')
    this.dinnerSection = page.locator('[data-testid="dinner"], .dinner')
    this.addButton = page.locator('button').filter({ hasText: /添加|+/i })
    this.saveButton = page.locator('button').filter({ hasText: /保存|提交/i })
  }

  /**
   * 验证记录页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await expect(this.pageTitle).toBeVisible()
  }

  /**
   * 选择日期
   */
  async selectDate(date: string) {
    await this.datePicker.fill(date)
  }

  /**
   * 添加食物项
   */
  async addFoodItem(meal: 'breakfast' | 'lunch' | 'dinner', foodName: string) {
    const section = meal === 'breakfast' ? this.breakfastSection
      : meal === 'lunch' ? this.lunchSection
      : this.dinnerSection

    await section.locator(this.addButton).click()
    await this.page.locator('input[placeholder*="食物"], input[placeholder*="菜品"]').fill(foodName)
  }

  /**
   * 保存记录
   */
  async saveRecord() {
    await this.saveButton.click()
  }
}
