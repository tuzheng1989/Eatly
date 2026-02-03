# E2E 测试文档

## 概述

这是 Eatly 项目的端到端（E2E）测试套件，使用 [Playwright](https://playwright.dev/) 编写。

## 测试覆盖

### 已实现的测试

| 测试套件 | 文件 | 覆盖功能 |
|---------|------|---------|
| 首页测试 | `home.spec.ts` | 页面加载、快速操作、导航 |
| 推荐菜品 | `recommend.spec.ts` | 生成推荐、重新生成、确认保存 |
| 方案管理 | `scheme.spec.ts` | 创建方案、查看方案、删除方案 |
| 应用导航 | `navigation.spec.ts` | 导航栏、URL 直接访问、浏览器后退 |
| 日历视图 | `calendar.spec.ts` | 日历加载、点击日期、切换月份 |
| 统计分析 | `statistics.spec.ts` | 统计卡片、图表渲染、时间范围切换 |

## Page Object Model

测试使用 Page Object Model 模式，所有页面类位于 `tests/pages/` 目录：

- `BasePage` - 基础页面类，提供通用方法
- `HomePage` - 首页
- `RecommendPage` - 推荐菜品页面
- `SchemeManagePage` - 方案管理页面
- `RecordPage` - 记录饮食页面
- `CalendarPage` - 日历视图页面
- `StatisticsPage` - 统计分析页面

## 运行测试

### 安装依赖

```bash
npm install -D @playwright/test
npx playwright install
```

### 运行所有测试

```bash
npx playwright test
```

### 运行特定测试文件

```bash
npx playwright test tests/e2e/home.spec.ts
```

### 运行特定测试

```bash
npx playwright test -g "应该正确加载首页"
```

### 以 headed 模式运行（可以看到浏览器）

```bash
npx playwright test --headed
```

### 调试测试

```bash
npx playwright test --debug
```

### 查看测试报告

```bash
npx playwright show-report
```

## 测试配置

配置文件：`playwright.config.ts`

### 浏览器支持

- ✅ Chromium（Chrome）
- ✅ Firefox
- ✅ WebKit（Safari）
- ✅ Mobile Chrome（Pixel 5）

### 配置选项

- `baseURL`: `http://localhost:3000`
- `trace`: 失败时记录追踪
- `screenshot`: 失败时截图
- `video`: 失败时录制视频

## 编写测试

### 基本测试模板

```typescript
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('测试套件名称', () => {
  test('测试用例名称', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto('/')

    // 执行测试步骤
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

### 最佳实践

1. **使用 Page Object Model**
   - 所有页面选择器应该在 Page 类中定义
   - 复杂操作应该封装为方法

2. **使用 data-testid 属性**
   - 避免使用容易变化的 CSS 类名
   - 推荐使用 `data-testid` 属性作为选择器

3. **等待策略**
   - 使用 `waitForLoadState('networkidle')` 等待页面加载
   - 使用 `waitForSelector` 等待特定元素
   - 避免使用固定的 `waitForTimeout`

4. **断言**
   - 每个测试应该有明确的断言
   - 使用 `expect().toBeVisible()` 等语义化断言

5. **截图**
   - 关键步骤应该截图
   - 失败时自动截图

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 测试数据

测试辅助工具位于 `tests/helpers/`：

- `test-data.ts` - 测试数据生成器
- `visual-utils.ts` - 视觉测试工具

### 使用测试数据

```typescript
import { TEST_DATA, generateTestScheme } from '../helpers/test-data'

test('创建方案', async ({ page }) => {
  const scheme = generateTestScheme()
  // 使用 scheme...
})
```

## 故障排查

### 测试超时

如果测试超时，可以增加超时时间：

```typescript
test.setTimeout(60000) // 60 秒
```

### 元素找不到

1. 检查元素选择器是否正确
2. 增加等待时间
3. 检查元素是否在 iframe 中

### 测试不稳定

1. 使用 `test.retry()` 配置重试次数
2. 检查是否有网络请求延迟
3. 使用 `waitForLoadState` 等待网络空闲

## 贡献指南

添加新测试时：

1. 在 `tests/pages/` 创建或更新 Page 类
2. 在 `tests/e2e/` 创建测试文件
3. 使用清晰的测试描述
4. 添加必要的断言
5. 关键步骤添加截图

## 参考资料

- [Playwright 文档](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [最佳实践](https://playwright.dev/docs/best-practices)
