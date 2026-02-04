"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_1 = require("../app");
const router = (0, express_1.Router)();
const success = (data) => ({ success: true, data });
const error = (message) => ({ success: false, error: message });
// 根据日期获取推荐
router.get('/', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json(error('缺少日期参数'));
        }
        const result = await app_1.pool.query('SELECT * FROM recommendations WHERE date = $1 ORDER BY meal_type', [date]);
        res.json(success(result.rows));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : '未知错误';
        res.status(500).json(error(message));
    }
});
// 创建推荐
router.post('/', async (req, res) => {
    try {
        const { date, meal_type, items } = req.body;
        if (!date || !meal_type || !items) {
            return res.status(400).json(error('缺少必要字段'));
        }
        const result = await app_1.pool.query('INSERT INTO recommendations (date, meal_type, items) VALUES ($1, $2, $3) RETURNING *', [date, meal_type, JSON.stringify(items)]);
        res.status(201).json(success(result.rows[0]));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : '未知错误';
        res.status(500).json(error(message));
    }
});
// 删除推荐
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await app_1.pool.query('DELETE FROM recommendations WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json(error('推荐不存在'));
        }
        res.json(success({ message: '删除成功' }));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : '未知错误';
        res.status(500).json(error(message));
    }
});
exports.default = router;
