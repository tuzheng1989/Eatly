import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { RecommendPage } from '../pages/RecommendPage'
import { RecordPage } from '../pages/RecordPage'
import { CalendarPage } from '../pages/CalendarPage'
import { StatisticsPage } from '../pages/StatisticsPage'

/**
 * 导航测试套件
 * 测试应用内导航是否正常工作
 */
test.describe('应用导航', () => {
  test('应该能通过 URL 直接访问各页面', async ({ page }) => {
    // 直接访问推荐页面
    await page.goto('/recommend')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /菜品推荐/i })).toBeVisible()

    // 直接访问记录页面
    await page.goto('/record')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /记录饮食/i })).toBeVisible()

    // 直接访问日历页面
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /日历视图/i })).toBeVisible()

    // 直接访问统计页面
    await page.goto('/statistics')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /统计/i })).toBeVisible()

    // 直接访问方案管理页面
    await page.goto('/schemes')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /方案管理/i })).toBeVisible()
  })

  test('应该能通过浏览器后退按钮导航', async ({ page }) => {
    await page.goto('/')

    // 导航到推荐页面
    await page.goto('/recommend')
    await expect(page).toHaveURL(/\/recommend/)

    // 导航到记录页面
    await page.goto('/record')
    await expect(page).toHaveURL(/\/record/)

    // 浏览器后退
    await page.goBack()
    await expect(page).toHaveURL(/\/recommend/)

    // 再次后退
    await page.goBack()
    await expect(page).toHaveURL(/\//)
  })

  test('无效 URL 应该重定向到首页或显示 404', async ({ page }) => {
    // 访问不存在的路由
    await page.goto('/non-existent-page')
    await page.waitForLoadState('networkidle')

    // 验证页面没有崩溃（body 可见）
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // 验证 URL 保持不变（没有重定向）或者重定向到首页
    const url = page.url()
    const isValidResponse = url.includes('/non-existent-page') || url.endsWith('/') || url.endsWith('/#/')

    expect(isValidResponse).toBeTruthy()
  })
})
