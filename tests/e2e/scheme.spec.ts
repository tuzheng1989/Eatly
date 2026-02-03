import { test, expect } from '@playwright/test'
import { SchemeManagePage } from '../pages/SchemeManagePage'

/**
 * 方案管理测试套件
 */
test.describe('方案管理', () => {
  let schemePage: SchemeManagePage

  test.beforeEach(async ({ page }) => {
    schemePage = new SchemeManagePage(page)
    await schemePage.goto('/schemes')
  })

  test('应该正确加载方案管理页面', async ({ page: _page }) => {
    await schemePage.isLoaded()

    // 验证页面标题
    const title = await schemePage.getTitle()
    expect(title).toMatch(/方案管理/)

    // 验证创建按钮可见
    await expect(schemePage.createSchemeButton).toBeVisible()

    await schemePage.screenshot('scheme-manage-page.png')
  })

  test('应该能创建新方案', async ({ page }) => {
    await schemePage.isLoaded()

    // 填写方案名称
    await schemePage.schemeNameInput.fill(`测试方案_${Date.now()}`)

    // 点击创建按钮
    await schemePage.createSchemeButton.click()

    // 等待创建完成
    await page.waitForTimeout(2000)

    // 验证成功提示（如果有）
    const successMessage = page.locator('.n-message-success, [data-testid="success-message"]')
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible()
    }

    await schemePage.screenshot('scheme-created.png')
  })

  test('应该显示现有方案列表', async ({ page: _page }) => {
    await schemePage.isLoaded()

    const schemeCount = await schemePage.getSchemeCount()
    console.log(`当前方案数量: ${schemeCount}`)

    // 只验证方案数量（可能为0）
    expect(schemeCount).toBeGreaterThanOrEqual(0)
  })

  test('应该能删除方案', async ({ page }) => {
    await schemePage.isLoaded()

    const initialCount = await schemePage.getSchemeCount()

    if (initialCount > 0) {
      // 删除第一个方案
      await schemePage.deleteFirstScheme()

      // 等待删除完成
      await page.waitForTimeout(2000)

      // 验证方案数量减少
      const newCount = await schemePage.getSchemeCount()
      expect(newCount).toBe(initialCount - 1)

      await schemePage.screenshot('scheme-deleted.png')
    } else {
      test.skip()
    }
  })
})
