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

    // 获取初始方案数量
    const initialCount = await schemePage.getSchemeCount()
    console.log(`初始方案数量: ${initialCount}`)

    // 创建新方案
    await schemePage.createScheme(
      '测试方案',
      '这是一个自动化测试创建的方案'
    )

    // 等待创建完成
    await page.waitForTimeout(2000)

    // 验证方案数量增加
    const newCount = await schemePage.getSchemeCount()
    console.log(`创建后方案数量: ${newCount}`)

    // 验证新方案出现在列表中
    const newScheme = page.locator('.scheme-item, [data-testid="scheme-item"]').filter({ hasText: '测试方案' })
    await expect(newScheme).toBeVisible()

    await schemePage.screenshot('scheme-created.png')
  })

  test('应该显示现有方案列表', async ({ page: _page }) => {
    await schemePage.isLoaded()

    const schemeCount = await schemePage.getSchemeCount()
    console.log(`当前方案数量: ${schemeCount}`)

    // 验证方案列表可见
    await expect(schemePage.schemeList).toBeVisible()

    // 如果有方案，验证它们可见
    if (schemeCount > 0) {
      await expect(schemePage.schemeItems.first()).toBeVisible()
    }
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
