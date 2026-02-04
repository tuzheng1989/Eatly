"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app_1 = require("../app");
async function migrate() {
    const client = await app_1.pool.connect();
    try {
        console.log('🔄 开始数据库迁移...');
        // 读取 schema.sql
        const schemaPath = path_1.default.join(__dirname, 'schema.sql');
        const schema = fs_1.default.readFileSync(schemaPath, 'utf-8');
        // 执行 SQL
        await client.query(schema);
        console.log('✅ 数据库迁移完成');
    }
    catch (error) {
        console.error('❌ 数据库迁移失败:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
// 如果直接运行此文件
if (require.main === module) {
    migrate()
        .then(() => {
        console.log('🎉 迁移成功');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 迁移失败:', error);
        process.exit(1);
    });
}
