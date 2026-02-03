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

  test('应该显示当前月份的日历', async ({ page: _page }) => {
    await calendarPage.isLoaded()

    // 获取日历天数
    const dayCount = await calendarPage.getDayCount()
    console.log(`日历显示 ${dayCount} 天`)

    // 一个月应该有 28-31 天
    expect(dayCount).toBeGreaterThanOrEqual(28)
    expect(dayCount).toBeLessThanOrEqual(31)

    // 验证今天高亮显示
    const hasToday = await calendarPage.hasTodayHighlight()
    if (hasToday) {
      await expect(calendarPage.todayHighlight).toBeVisible()
      console.log('今天已高亮显示')
    }
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
    const monthTitle = page.locator('[data-testid="current-month"], .current-month')

    // 点击下个月按钮
    const nextButton = page.locator('button').filter({ hasText: /下月|>/i })
    if (await nextButton.count() > 0) {
      const currentMonth = await monthTitle.textContent()
      await nextButton.click()
      await page.waitForTimeout(500)

      const newMonth = await monthTitle.textContent()
      expect(newMonth).not.toBe(currentMonth)

      await calendarPage.screenshot('calendar-next-month.png')
    }

    // 点击上个月按钮
    const prevButton = page.locator('button').filter({ hasText: /上月|</i })
    if (await prevButton.count() > 0) {
      await prevButton.click()
      await page.waitForTimeout(500)

      await calendarPage.screenshot('calendar-prev-month.png')
    }
  })
})
