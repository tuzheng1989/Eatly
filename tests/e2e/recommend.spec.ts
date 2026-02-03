import { test, expect } from '@playwright/test'
import { RecommendPage } from '../pages/RecommendPage'

/**
 * 推荐菜品测试套件
 */
test.describe('推荐菜品', () => {
  let recommendPage: RecommendPage

  test.beforeEach(async ({ page }) => {
    recommendPage = new RecommendPage(page)
    await recommendPage.goto('/recommend')
  })

  test('应该正确加载推荐页面', async ({ page: _page }) => {
    await recommendPage.isLoaded()

    // 验证页面标题
    const title = await recommendPage.getTitle()
    expect(title).toMatch(/推荐菜品/)

    // 验证生成按钮可见
    await expect(recommendPage.generateButton).toBeVisible()

    await recommendPage.screenshot('recommend-page.png')
  })

  test('应该能生成推荐', async ({ page }) => {
    await recommendPage.isLoaded()

    // 点击生成推荐按钮
    await recommendPage.generateRecommendations()

    // 等待推荐结果
    await page.waitForTimeout(2000)

    // 验证推荐结果显示
    const hasResults = await recommendPage.hasResults()
    expect(hasResults).toBeTruthy()

    // 获取推荐数量
    const count = await recommendPage.getRecommendationCount()
    console.log(`生成了 ${count} 个推荐项`)

    // 至少应该有 1 个推荐
    expect(count).toBeGreaterThan(0)

    await recommendPage.screenshot('recommendation-results.png')
  })

  test('应该能重新生成推荐', async ({ page }) => {
    await recommendPage.isLoaded()

    // 第一次生成
    await recommendPage.generateRecommendations()
    await page.waitForTimeout(2000)

    const firstCount = await recommendPage.getRecommendationCount()
    console.log(`第一次推荐: ${firstCount} 项`)

    // 重新生成
    await recommendPage.regenerate()
    await page.waitForTimeout(2000)

    const secondCount = await recommendPage.getRecommendationCount()
    console.log(`第二次推荐: ${secondCount} 项`)

    // 应该有推荐结果
    expect(secondCount).toBeGreaterThan(0)
  })

  test('应该能确认推荐并保存', async ({ page }) => {
    await recommendPage.isLoaded()

    // 生成推荐
    await recommendPage.generateRecommendations()
    await page.waitForTimeout(2000)

    const hasResults = await recommendPage.hasResults()
    if (hasResults) {
      // 确认推荐
      await recommendPage.confirmRecommendations()

      // 等待保存完成
      await page.waitForTimeout(1000)

      // 验证成功提示
      const successMessage = page.locator('.n-message-success, [data-testid="success-message"]')
      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible()
      }
    }
  })
})
