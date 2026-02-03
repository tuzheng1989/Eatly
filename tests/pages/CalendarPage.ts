import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 日历视图页面 Page Object
 */
export class CalendarPage extends BasePage {
  readonly pageTitle: Locator
  readonly calendarGrid: Locator
  readonly calendarDays: Locator
  readonly todayHighlight: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /日历|日历视图/i })
    this.calendarGrid = page.locator('[data-testid="calendar-grid"], .calendar-grid')
    this.calendarDays = page.locator('[data-testid="calendar-day"], .calendar-day')
    this.todayHighlight = page.locator('[data-testid="today"], .today, .is-today')
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
   * 验证今天高亮
   */
  async hasTodayHighlight(): Promise<boolean> {
    const count = await this.todayHighlight.count()
    return count > 0
  }
}
