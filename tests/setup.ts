import { FullConfig } from '@playwright/test'

/**
 * 全局测试钩子
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 开始 E2E 测试')
  console.log(`📁 测试目录: ${config.projects.map(p => p.testDir).join(', ')}`)
}

async function globalTeardown(config: FullConfig) {
  console.log('✅ E2E 测试完成')
}

export { globalSetup, globalTeardown }
