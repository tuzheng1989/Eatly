"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const scheme_routes_1 = __importDefault(require("./routes/scheme.routes"));
const record_routes_1 = __importDefault(require("./routes/record.routes"));
const recommendation_routes_1 = __importDefault(require("./routes/recommendation.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
// 加载环境变量
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// 数据库连接池
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'eatly',
    user: process.env.DB_USER || 'eatly',
    password: process.env.DB_PASSWORD || 'eatly_password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// 测试数据库连接
exports.pool.on('connect', () => {
    console.log('✅ 数据库连接成功');
});
exports.pool.on('error', (err) => {
    console.error('❌ 数据库连接错误:', err);
});
// 中间件
app.use((0, helmet_1.default)()); // 安全头
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Key 验证中间件
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;
    if (!validApiKey) {
        // 开发环境跳过验证
        return next();
    }
    if (apiKey !== validApiKey) {
        return res.status(401).json({ success: false, error: '无效的 API Key' });
    }
    next();
};
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Eatly API 运行正常' });
});
// 路由
app.use('/api/schemes', apiKeyMiddleware, scheme_routes_1.default);
app.use('/api/records', apiKeyMiddleware, record_routes_1.default);
app.use('/api/recommendations', apiKeyMiddleware, recommendation_routes_1.default);
app.use('/api/settings', apiKeyMiddleware, settings_routes_1.default);
// 404 处理
app.use((req, res) => {
    res.status(404).json({ success: false, error: '接口不存在' });
});
// 错误处理
app.use((err, req, res, _next) => {
    console.error('服务器错误:', err);
    const message = err instanceof Error ? err.message : '未知错误';
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : message
    });
});
// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Eatly API 服务运行在端口 ${PORT}`);
    console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);
});
