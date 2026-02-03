# 🎭 E2E 测试快速开始指南

## 📋 当前状态

✅ **测试套件已创建完成** - 26 个测试用例
🟡 **浏览器安装中** - 首次运行需要下载浏览器

---

## ⚡ 快速运行（3 步）

### 1️⃣ 安装浏览器（仅需一次）

```bash
npx playwright install
```

> 💡 这将下载 Chromium (~170MB)、Firefox 和 WebKit 浏览器

### 2️⃣ 运行测试

```bash
# 运行所有测试
npx playwright test

# 或只运行 Chromium 测试（更快）
npx playwright test --project=chromium
```

### 3️⃣ 查看报告

```bash
npx playwright show-report
```

---

## 🧪 测试模式

### 开发模式（推荐）

```bash
# 可以看到浏览器窗口
npx playwright test --headed

# 调试模式，可以逐步执行
npx playwright test --debug
```

### CI 模式

```bash
# 无头模式，快速运行
npx playwright test
```

---

## 📂 测试文件

```
tests/
├── e2e/
│   ├── home.spec.ts         # 首页 (5 tests)
│   ├── recommend.spec.ts    # 推荐 (4 tests)
│   ├── scheme.spec.ts       # 方案 (4 tests)
│   ├── navigation.spec.ts   # 导航 (4 tests)
│   ├── calendar.spec.ts     # 日历 (4 tests)
│   └── statistics.spec.ts   # 统计 (5 tests)
├── pages/                   # Page Object Model
│   ├── BasePage.ts
│   ├── HomePage.ts
│   └── ...
└── helpers/                 # 测试工具
    ├── test-data.ts
    └── visual-utils.ts
```

---

## 🎯 测试覆盖

| 页面 | 测试 | 关键功能 |
|------|------|---------|
| 首页 | 5 | 加载、快速操作、导航 |
| 推荐 | 4 | 生成、重新生成、保存 |
| 方案 | 4 | 创建、列表、删除 |
| 日历 | 4 | 加载、点击日期、切月份 |
| 统计 | 5 | 卡片、图表、时间范围 |
| 导航 | 4 | 导航栏、URL、后退 |

---

## 🐛 常见问题

### Q: 浏览器下载慢？

使用国内镜像：
```bash
$env:PLAYWRIGHT_DOWNLOAD_HOST="https://npmmirror.com/mirrors/playwright/"
npx playwright install
```

### Q: 测试失败？

查看详细报告：
```bash
npx playwright show-report
```

查看截图和视频：
```bash
ls test-results/
ls artifacts/
```

### Q: 只运行某个测试？

```bash
npx playwright test tests/e2e/home.spec.ts
npx playwright test -g "应该正确加载首页"
```

---

## 📊 预期结果

所有测试通过时：

```
✓ 104 passed (45.2s)
```

测试套件已准备就绪！运行 `npx playwright test` 开始测试。

---

**详细文档**:
- [完整报告](E2E_TEST_REPORT.md)
- [使用指南](e2e/README.md)
- [测试总结](SUMMARY.md)
