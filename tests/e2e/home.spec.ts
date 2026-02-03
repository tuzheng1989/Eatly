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

  test('应该正确加载首页', async ({ page: _page }) => {
    // 验证页面标题
    const title = await homePage.getTitle()
    expect(title).toMatch(/Eatly|饮食/)

    // 验证欢迎标题可见
    await expect(homePage.welcomeTitle).toBeVisible()

    // 截图
    await homePage.screenshot('home-page.png')
  })

  test('应该显示快速操作入口', async ({ page: _page }) => {
    await homePage.isLoaded()

    // 获取快速操作数量
    const actionCount = await homePage.actionCards.count()

    // 应该有 4 个快速操作（推荐、记录、历史、统计）
    expect(actionCount).toBe(4)

    console.log(`找到 ${actionCount} 个快速操作入口`)
  })

  test('可以通过快速操作导航到推荐页面', async ({ page }) => {
    await homePage.isLoaded()

    // 点击第一个快速操作卡片（获取推荐）
    await homePage.clickActionCard(0)

    // 等待导航完成 - 使用 waitForURL 替代 waitForTimeout
    await page.waitForURL(/\/recommend/, { timeout: 3000 })

    // 验证导航到推荐页面
    await expect(page).toHaveURL(/\/recommend/)
  })

  test('可以通过快速操作导航到记录页面', async ({ page }) => {
    await homePage.isLoaded()

    // 点击第二个快速操作卡片（记录饮食）
    await homePage.clickActionCard(1)

    // 等待导航完成 - 使用 waitForURL 替代 waitForTimeout
    await page.waitForURL(/\/record/, { timeout: 3000 })

    // 验证导航到记录页面
    await expect(page).toHaveURL(/\/record/)
  })

  test('快速操作卡片应该显示正确的标题', async ({ page: _page }) => {
    await homePage.isLoaded()

    // 验证所有快速操作卡片可见
    await expect(homePage.actionCards.first()).toBeVisible()
    await expect(homePage.actionCards.nth(1)).toBeVisible()
    await expect(homePage.actionCards.nth(2)).toBeVisible()
    await expect(homePage.actionCards.nth(3)).toBeVisible()

    // 验证第一个卡片包含"获取推荐"文本
    const firstCard = homePage.actionCards.first()
    await expect(firstCard).toContainText(/获取推荐/)
  })
})
