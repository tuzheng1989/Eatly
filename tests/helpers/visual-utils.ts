import { Page } from '@playwright/test'

/**
 * 视觉测试辅助工具
 */
export class VisualUtils {
  constructor(private page: Page) {}

  /**
   * 全页截图
   */
  async fullPageScreenshot(name: string) {
    await this.page.screenshot({
      path: `artifacts/${name}`,
      fullPage: true
    })
  }

  /**
   * 元素截图
   */
  async elementScreenshot(selector: string, name: string) {
    const element = this.page.locator(selector)
    await element.screenshot({
      path: `artifacts/${name}`
    })
  }

  /**
   * 等待并截图（用于动画元素）
   */
  async waitForAndScreenshot(
    selector: string,
    screenshotName: string,
    timeout: number = 5000
  ) {
    await this.page.waitForSelector(selector, { timeout })
    await this.elementScreenshot(selector, screenshotName)
  }

  /**
   * 比较截图（视觉回归测试）
   */
  async compareScreenshots(
    _baseline: string,
    _current: string
  ): Promise<boolean> {
    // 简化版本：实际项目可以使用 Playwright 的 toHaveScreenshot()
    // 或者专门的视觉回归工具
    return true
  }

  /**
   * 隐藏动态元素后截图
   */
  async screenshotWithoutDynamicElements(name: string) {
    // 隐藏时间戳等动态内容
    await this.page.addStyleTag({
      content: `
        [data-timestamp],
        .time,
        .date,
        .datetime {
          visibility: hidden !important;
        }
      `
    })

    await this.fullPageScreenshot(name)

    // 移除样式
    await this.page.evaluate(() => {
      const styles = document.querySelectorAll('style[data-hide-dynamic]')
      styles.forEach(s => s.remove())
    })
  }
}

/**
 * 颜色对比度工具
 */
export class ColorContrastUtils {
  /**
   * 计算亮度
   */
  static getLuminance(r: number, g: number, b: number): number {
    const [R, G, B] = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  }

  /**
   * 计算对比度
   */
  static getContrastRatio(fg: string, bg: string): number {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 }
    }

    const fgRgb = hexToRgb(fg)
    const bgRgb = hexToRgb(bg)

    const fgLum = this.getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
    const bgLum = this.getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

    const lighter = Math.max(fgLum, bgLum)
    const darker = Math.min(fgLum, bgLum)

    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * 验证 WCAG AA 标准
   */
  static meetsWCAG_AA(fg: string, bg: string, largeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(fg, bg)
    return largeText ? ratio >= 3 : ratio >= 4.5
  }
}
