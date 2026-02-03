/**
 * 测试数据辅助工具
 */

export interface TestScheme {
  name: string
  description?: string
  pools: {
    A: string[]
    B: string[]
    C: string[]
  }
}

export interface TestRecord {
  date: string
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  snack?: string[]
}

/**
 * 生成测试用的菜谱方案
 */
export function generateTestScheme(): TestScheme {
  return {
    name: `测试方案_${Date.now()}`,
    description: '自动化测试生成的方案',
    pools: {
      A: ['番茄炒蛋', '青椒肉丝', '土豆丝'],
      B: ['红烧肉', '鱼香肉丝', '宫保鸡丁'],
      C: ['白菜豆腐汤', '紫菜蛋花汤', '冬瓜汤']
    }
  }
}

/**
 * 生成测试用的饮食记录
 */
export function generateTestRecord(date?: string): TestRecord {
  return {
    date: date || new Date().toISOString().split('T')[0],
    breakfast: ['牛奶', '面包', '鸡蛋'],
    lunch: ['米饭', '番茄炒蛋', '青菜'],
    dinner: ['面条', '红烧肉'],
    snack: ['苹果']
  }
}

/**
 * 生成随机日期（最近 30 天内）
 */
export function randomDateWithin(days: number = 30): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * days))
  return date.toISOString().split('T')[0]
}

/**
 * 常用测试数据
 */
export const TEST_DATA = {
  validScheme: {
    name: '健康饮食方案',
    description: '均衡营养的菜谱',
    pools: {
      A: ['西兰花', '胡萝卜', '菠菜'],
      B: ['鸡胸肉', '鱼肉', '豆腐'],
      C: ['南瓜汤', '冬瓜汤', '番茄汤']
    }
  },

  validRecord: {
    date: new Date().toISOString().split('T')[0],
    breakfast: ['燕麦粥', '鸡蛋'],
    lunch: ['糙米饭', '清炒西兰花', '蒸鱼'],
    dinner: ['小米粥', '凉拌黄瓜']
  },

  foodItems: [
    '番茄炒蛋', '青椒肉丝', '土豆丝', '红烧肉',
    '鱼香肉丝', '宫保鸡丁', '白菜豆腐汤',
    '紫菜蛋花汤', '冬瓜汤', '西兰花',
    '胡萝卜', '菠菜', '鸡胸肉', '鱼肉'
  ]
}
