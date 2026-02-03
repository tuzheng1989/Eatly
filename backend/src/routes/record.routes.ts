import { Router } from 'express'
import { pool } from '../app'

const router = Router()

const success = (data: any) => ({ success: true, data })
const error = (message: string) => ({ success: false, error: message })

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query

    let query = 'SELECT * FROM records'
    const params: any[] = []

    if (start && end) {
      query += ' WHERE date >= $1 AND date <= $2'
      params.push(start, end)
    }

    query += ' ORDER BY date DESC'

    const result = await pool.query(query, params)
    res.json(success(result.rows))
  } catch (err: any) {
    res.status(500).json(error(err.message))
  }
})

// 根据日期获取记录
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params
    const result = await pool.query('SELECT * FROM records WHERE date = $1', [date])

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: any) {
    res.status(500).json(error(err.message))
  }
})

// 创建记录
router.post('/', async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, snack } = req.body

    if (!date) {
      return res.status(400).json(error('缺少日期字段'))
    }

    const result = await pool.query(
      `INSERT INTO records (date, breakfast, lunch, dinner, snack)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (date) DO UPDATE
       SET breakfast = EXCLUDED.breakfast,
           lunch = EXCLUDED.lunch,
           dinner = EXCLUDED.dinner,
           snack = EXCLUDED.snack
       RETURNING *`,
      [date, JSON.stringify(breakfast || []), JSON.stringify(lunch || []), JSON.stringify(dinner || []), JSON.stringify(snack || [])]
    )

    res.status(201).json(success(result.rows[0]))
  } catch (err: any) {
    res.status(500).json(error(err.message))
  }
})

// 更新记录
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { date, breakfast, lunch, dinner, snack } = req.body

    const result = await pool.query(
      `UPDATE records
       SET date = COALESCE($1, date),
           breakfast = COALESCE($2, breakfast),
           lunch = COALESCE($3, lunch),
           dinner = COALESCE($4, dinner),
           snack = COALESCE($5, snack)
       WHERE id = $6
       RETURNING *`,
      [date, JSON.stringify(breakfast), JSON.stringify(lunch), JSON.stringify(dinner), JSON.stringify(snack), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success(result.rows[0]))
  } catch (err: any) {
    res.status(500).json(error(err.message))
  }
})

// 删除记录
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM records WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json(error('记录不存在'))
    }

    res.json(success({ message: '删除成功' }))
  } catch (err: any) {
    res.status(500).json(error(err.message))
  }
})

export default router
