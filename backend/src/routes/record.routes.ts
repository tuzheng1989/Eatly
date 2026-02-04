import { Router } from 'express'
import { pool } from '../app'

const router = Router()

const success = <T,>(data: T) => ({ success: true, data })
const error = (message: string) => ({ success: false, error: message })

// 统一的查询字段，使用 TO_CHAR 避免时区问题，使用 camelCase 匹配前端类型
const RECORD_FIELDS = `
  id,
  TO_CHAR(date, 'YYYY-MM-DD') as date,
  scheme_id as "schemeId",
  scheme_name as "schemeName",
  meals,
  note,
  created_at as "createdAt",
  updated_at as "updatedAt"
`

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query

    let query = `SELECT ${RECORD_FIELDS} FROM records`
    const params: (string | number)[] = []

    if (start && end) {
      query += ' WHERE date >= $1 AND date <= $2'
      params.push(start as string, end as string)
    }

    query += ' ORDER BY date DESC'

    const result = await pool.query(query, params)
    res.json(success(result.rows))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 根据日期获取记录
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params
    const query = `SELECT ${RECORD_FIELDS} FROM records WHERE date = $1`

    const result = await pool.query(query, [date])

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 创建记录
router.post('/', async (req, res) => {
  try {
    const { date, schemeId, schemeName, meals, note } = req.body

    if (!date) {
      return res.status(400).json(error('缺少日期字段'))
    }

    if (!meals || typeof meals !== 'object') {
      return res.status(400).json(error('缺少 meals 字段或格式错误'))
    }

    const result = await pool.query(
      `INSERT INTO records (date, scheme_id, scheme_name, meals, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${RECORD_FIELDS}`,
      [date, schemeId || null, schemeName || '手动记录', JSON.stringify(meals), note || null]
    )

    res.status(201).json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'

    // 处理唯一约束冲突
    if (message.includes('duplicate key')) {
      return res.status(409).json(error('该日期已有记录'))
    }

    res.status(500).json(error(message))
  }
})

// 更新记录
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { date, schemeId, schemeName, meals, note } = req.body

    const updates: string[] = []
    const params: (string | null)[] = []
    let paramIndex = 1

    if (date !== undefined) {
      updates.push(`date = $${paramIndex++}`)
      params.push(date)
    }
    if (schemeId !== undefined) {
      updates.push(`scheme_id = $${paramIndex++}`)
      params.push(schemeId || null)
    }
    if (schemeName !== undefined) {
      updates.push(`scheme_name = $${paramIndex++}`)
      params.push(schemeName || null)
    }
    if (meals !== undefined) {
      updates.push(`meals = $${paramIndex++}`)
      params.push(JSON.stringify(meals))
    }
    if (note !== undefined) {
      updates.push(`note = $${paramIndex++}`)
      params.push(note || null)
    }

    if (updates.length === 0) {
      return res.status(400).json(error('没有要更新的字段'))
    }

    params.push(id)
    const query = `UPDATE records SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING ${RECORD_FIELDS}`

    const result = await pool.query(query, params)

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

// 删除记录
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM records WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success({ message: '删除成功' }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误'
    res.status(500).json(error(message))
  }
})

export default router
