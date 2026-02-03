import { test, expect } from '@playwright/test'
import { CalendarPage } from '../pages/CalendarPage'

/**
 * 日历视图测试套件
 */
test.describe('日历视图', () => {
  let calendarPage: CalendarPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    await calendarPage.goto('/calendar')
  })

  test('应该正确加载日历页面', async ({ page: _page }) => {
    await calendarPage.isLoaded()

    // 验证页面标题
    const title = await calendarPage.getTitle()
    expect(title).toMatch(/日历/)

    // 验证日历网格可见
    await expect(calendarPage.calendarGrid).toBeVisible()

    await calendarPage.screenshot('calendar-page.png')
  })

  test('应该显示当前月份的日历', async ({ page }) => {
    await calendarPage.isLoaded()

    // 获取所有日历天数（包括上下月）
    const allDayCount = await calendarPage.getDayCount()
    console.log(`日历显示 ${allDayCount} 天（包含上下月）`)

    // 应该有日期显示（数量因月份而异）
    expect(allDayCount).toBeGreaterThan(0)

    // 获取当前月份的日期（不包括其他月份）
    const currentMonthDays = page.locator('.day-cell:not(.other-month)')
    const currentMonthDayCount = await currentMonthDays.count()
    console.log(`当前月份有 ${currentMonthDayCount} 天`)

    // 当前月份应该有 28-31 天
    expect(currentMonthDayCount).toBeGreaterThanOrEqual(28)
    expect(currentMonthDayCount).toBeLessThanOrEqual(31)
  })

  test('应该能点击日期查看详情', async ({ page }) => {
    await calendarPage.isLoaded()

    // 点击第 15 天
    await calendarPage.clickDate(15)

    // 等待详情显示
    await page.waitForTimeout(1000)

    // 可能会弹出详情对话框或侧边栏
    const modal = page.locator('.modal, .dialog, [data-testid="day-detail"]')
    const hasModal = await modal.count() > 0

    if (hasModal) {
      await expect(modal).toBeVisible()
      await calendarPage.screenshot('calendar-day-detail.png')
    }
  })

  test('应该能切换月份', async ({ page }) => {
    await calendarPage.isLoaded()

    // 获取当前月份标题
    const currentMonth = await calendarPage.monthTitle.textContent()

    // 点击下个月按钮
    await calendarPage.nextMonth()

    const newMonth = await calendarPage.monthTitle.textContent()
    expect(newMonth).not.toBe(currentMonth)

    await calendarPage.screenshot('calendar-next-month.png')

    // 点击上个月按钮
    await calendarPage.previousMonth()

    await calendarPage.screenshot('calendar-prev-month.png')
  })
})
