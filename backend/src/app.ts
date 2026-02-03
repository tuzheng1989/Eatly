import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import schemeRoutes from './routes/scheme.routes'
import recordRoutes from './routes/record.routes'
import recommendationRoutes from './routes/recommendation.routes'
import settingsRoutes from './routes/settings.routes'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// 数据库连接池
export const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eatly',
  user: process.env.DB_USER || 'eatly',
  password: process.env.DB_PASSWORD || 'eatly_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// 测试数据库连接
pool.on('connect', () => {
  console.log('✅ 数据库连接成功')
})

pool.on('error', (err) => {
  console.error('❌ 数据库连接错误:', err)
})

// 中间件
app.use(helmet()) // 安全头
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Key 验证中间件
const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key']
  const validApiKey = process.env.API_KEY

  if (!validApiKey) {
    // 开发环境跳过验证
    return next()
  }

  if (apiKey !== validApiKey) {
    return res.status(401).json({ success: false, error: '无效的 API Key' })
  }

  next()
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Eatly API 运行正常' })
})

// 路由
app.use('/api/schemes', apiKeyMiddleware, schemeRoutes)
app.use('/api/records', apiKeyMiddleware, recordRoutes)
app.use('/api/recommendations', apiKeyMiddleware, recommendationRoutes)
app.use('/api/settings', apiKeyMiddleware, settingsRoutes)

// 404 处理
app.use((req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' })
})

// 错误处理
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error('服务器错误:', err)
  const message = err instanceof Error ? err.message : '未知错误'
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : message
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Eatly API 服务运行在端口 ${PORT}`)
  console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`)
})
