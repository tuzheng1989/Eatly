import { Router, type Request, type Response } from 'express'
import { pool } from '../app'

const router = Router()

// 统一响应格式
const success = <T,>(data: T) => ({ success: true, data })
const error = (message: string) => ({ success: false, error: message })

// 获取所有方案
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schemes ORDER BY created_at DESC')
    res.json(success(result.rows))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 获取单个方案
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM schemes WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json(error('方案不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 创建方案
router.post('/', async (req, res) => {
  try {
    const { name, description, pools } = req.body

    if (!name || !pools) {
      return res.status(400).json(error('缺少必要字段'))
    }

    const result = await pool.query(
      'INSERT INTO schemes (name, description, pools) VALUES ($1, $2, $3) RETURNING *',
      [name, description, JSON.stringify(pools)]
    )

    res.status(201).json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 更新方案
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, pools } = req.body

    const updates: string[] = []
    const values: (string | number)[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (pools !== undefined) {
      updates.push(`pools = $${paramIndex++}`)
      values.push(JSON.stringify(pools))
    }

    if (updates.length === 0) {
      return res.status(400).json(error('没有要更新的字段'))
    }

    values.push(id)

    const result = await pool.query(
      `UPDATE schemes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json(error('方案不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 删除方案
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM schemes WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json(error('方案不存在'))
    }

    res.json(success({ message: '删除成功' }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

export default router
