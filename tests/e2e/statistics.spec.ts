import { test, expect } from '@playwright/test'
import { StatisticsPage } from '../pages/StatisticsPage'

/**
 * 统计分析测试套件
 */
test.describe('统计分析', () => {
  let statisticsPage: StatisticsPage

  test.beforeEach(async ({ page }) => {
    statisticsPage = new StatisticsPage(page)
    await statisticsPage.goto('/statistics')
  })

  test('应该正确加载统计页面', async ({ page: _page }) => {
    await statisticsPage.isLoaded()

    // 验证页面标题
    const title = await statisticsPage.getTitle()
    expect(title).toMatch(/统计|分析/)

    await statisticsPage.screenshot('statistics-page.png')
  })

  test('应该显示统计卡片', async ({ page }) => {
    await statisticsPage.isLoaded()

    // 等待页面内容加载
    await page.waitForTimeout(1000)

    // 检查统计页面是否有概览标题（使用文本过滤）
    const overviewHeading = page.locator('h2, h3, h4').filter({ hasText: '概览' })
    await expect(overviewHeading).toBeVisible()

    // 检查是否有热门菜品标题
    const topDishesHeading = page.locator('h2, h3, h4').filter({ hasText: '热门菜品' })
    await expect(topDishesHeading).toBeVisible()

    console.log('统计卡片验证通过：概览卡片 + 热门菜品卡片')
  })

  test('应该显示数据图表', async ({ page: _page }) => {
    await statisticsPage.isLoaded()

    // 等待图表渲染
    const chartCount = await statisticsPage.getChartCount()
    console.log(`图表数量: ${chartCount}`)

    // 至少应该有 1 个图表
    expect(chartCount).toBeGreaterThan(0)

    await statisticsPage.screenshot('statistics-charts.png')
  })

  test('图表应该正确渲染', async ({ page }) => {
    await statisticsPage.isLoaded()

    // 等待 ECharts 完全渲染
    await page.waitForTimeout(3000)

    // 检查 canvas 元素
    const canvases = page.locator('canvas')
    const canvasCount = await canvases.count()

    if (canvasCount > 0) {
      // 验证至少有一个 canvas 可见
      await expect(canvases.first()).toBeVisible()

      // 获取 canvas 尺寸（验证图表已渲染）
      const box = await canvases.first().boundingBox()
      expect(box?.width).toBeGreaterThan(0)
      expect(box?.height).toBeGreaterThan(0)

      console.log(`图表尺寸: ${box?.width}x${box?.height}`)
    }
  })

  test('应该能切换时间范围', async ({ page }) => {
    await statisticsPage.isLoaded()

    // 查找时间范围选择器
    const timeRangeSelector = page.locator('select, [data-testid="time-range"]')

    if (await timeRangeSelector.count() > 0) {
      // 切换到周视图
      await timeRangeSelector.selectOption({ label: /周/i })
      await page.waitForTimeout(1000)
      await statisticsPage.screenshot('statistics-week.png')

      // 切换到月视图
      await timeRangeSelector.selectOption({ label: /月/i })
      await page.waitForTimeout(1000)
      await statisticsPage.screenshot('statistics-month.png')

      // 切换到年视图
      await timeRangeSelector.selectOption({ label: /年/i })
      await page.waitForTimeout(1000)
      await statisticsPage.screenshot('statistics-year.png')
    }
  })
})
