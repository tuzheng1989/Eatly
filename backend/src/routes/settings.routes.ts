import { Router } from 'express'
import { pool } from '../app'

const router = Router()

const success = <T,>(data: T) => ({ success: true, data })
const error = (message: string) => ({ success: false, error: message })

// 获取设置（单例）
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings LIMIT 1')

    if (result.rows.length === 0) {
      // 返回默认设置
      return res.json(success({
        theme: 'light',
        language: 'zh-CN',
        recommend_count: 3,
        data: {}
      }))
    }

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 更新设置
router.put('/', async (req, res) => {
  try {
    const { theme, language, recommend_count, data } = req.body

    const updates: string[] = []
    const values: (string | number)[] = []
    let paramIndex = 1

    if (theme !== undefined) {
      updates.push(`theme = $${paramIndex++}`)
      values.push(theme)
    }
    if (language !== undefined) {
      updates.push(`language = $${paramIndex++}`)
      values.push(language)
    }
    if (recommend_count !== undefined) {
      updates.push(`recommend_count = $${paramIndex++}`)
      values.push(recommend_count)
    }
    if (data !== undefined) {
      updates.push(`data = $${paramIndex++}`)
      values.push(JSON.stringify(data))
    }

    if (updates.length === 0) {
      return res.status(400).json(error('没有要更新的字段'))
    }

    // 使用第一条记录的 ID
    const idResult = await pool.query('SELECT id FROM settings LIMIT 1')
    if (idResult.rows.length === 0) {
      return res.status(404).json(error('设置不存在'))
    }

    const id = idResult.rows[0].id
    values.push(id)

    const result = await pool.query(
      `UPDATE settings SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

export default router
