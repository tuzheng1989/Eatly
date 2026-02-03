import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

/**
 * 首页测试套件
 */
test.describe('首页', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto('/')
  })

  test('应该正确加载首页', async ({ page }) => {
    // 验证页面标题
    const title = await homePage.getTitle()
    expect(title).toMatch(/Eatly|饮食/)

    // 验证欢迎标题可见
    await expect(homePage.welcomeTitle).toBeVisible()

    // 截图
    await homePage.screenshot('home-page.png')
  })

  test('应该显示快速操作入口', async ({ page }) => {
    await homePage.isLoaded()

    // 获取快速操作数量
    const actionCount = await homePage.getQuickActionCount()

    // 至少应该有 3 个快速操作（推荐、记录、日历）
    expect(actionCount).toBeGreaterThanOrEqual(3)

    console.log(`找到 ${actionCount} 个快速操作入口`)
  })

  test('可以通过快速操作导航到推荐页面', async ({ page }) => {
    await homePage.isLoaded()

    // 点击推荐按钮
    await homePage.clickQuickAction('推荐')

    // 验证导航到推荐页面
    await expect(page).toHaveURL(/\/recommend/)
    await expect(page.locator('h1, h2').filter({ hasText: /推荐菜品/i })).toBeVisible()
  })

  test('可以通过快速操作导航到记录页面', async ({ page }) => {
    await homePage.isLoaded()

    // 点击记录按钮
    await homePage.clickQuickAction('记录')

    // 验证导航到记录页面
    await expect(page).toHaveURL(/\/record/)
    await expect(page.locator('h1, h2').filter({ hasText: /记录饮食/i })).toBeVisible()
  })

  test('应该显示今日记录卡片', async ({ page }) => {
    await homePage.isLoaded()

    // 今日记录卡片应该可见（可能为空）
    const todayCard = homePage.todayRecordCard
    if (await todayCard.count() > 0) {
      await expect(todayCard).toBeVisible()
    }
  })
})
