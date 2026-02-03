import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 日历视图页面 Page Object
 */
export class CalendarPage extends BasePage {
  readonly pageTitle: Locator
  readonly calendarGrid: Locator
  readonly calendarDays: Locator
  readonly monthTitle: Locator
  readonly nextMonthButton: Locator
  readonly prevMonthButton: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1').filter({ hasText: /日历视图/i })
    this.calendarGrid = page.locator('.calendar-days')
    this.calendarDays = page.locator('.day-cell')
    this.monthTitle = page.locator('.calendar-header h3')
    this.nextMonthButton = page.locator('.calendar-header button').last()
    this.prevMonthButton = page.locator('.calendar-header button').first()
  }

  /**
   * 验证日历页面已加载
   */
  async isLoaded() {
    await this.page.waitForLoadState('networkidle')
    await this.pageTitle.waitFor()
  }

  /**
   * 获取日历天数
   */
  async getDayCount(): Promise<number> {
    return await this.calendarDays.count()
  }

  /**
   * 点击指定日期
   */
  async clickDate(day: number) {
    await this.calendarDays.nth(day - 1).click()
  }

  /**
   * 切换到下个月
   */
  async nextMonth() {
    await this.nextMonthButton.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * 切换到上个月
   */
  async previousMonth() {
    await this.prevMonthButton.click()
    await this.page.waitForTimeout(500)
  }
}
