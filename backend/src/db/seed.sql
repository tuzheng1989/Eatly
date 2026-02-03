-- Eatly 测试数据
-- 为本地开发和测试提供初始数据

-- 插入测试方案
INSERT INTO schemes (name, description, pools)
VALUES
  (
    '默认方案',
    '默认的饮食推荐方案',
    '{"A": ["西红柿炒鸡蛋", "青椒肉丝", "红烧茄子", "鱼香肉丝", "宫保鸡丁"], "B": ["蒸蛋羹", "紫菜蛋花汤", "冬瓜排骨汤", "番茄鸡蛋汤", "丝瓜汤"], "C": ["水果沙拉", "酸奶", "坚果", "苹果", "香蕉"]}'::jsonb
  ),
  (
    '素食方案',
    '适合素食者的饮食方案',
    '{"A": ["麻婆豆腐", "素炒青菜", "素炒豆芽", "红烧冬瓜", "凉拌黄瓜"], "B": ["豆腐汤", "紫菜汤", "冬瓜汤", "丝瓜汤", "萝卜汤"], "C": ["水果拼盘", "坚果", "葡萄干", "橘子", "梨"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- 插入测试记录（最近7天）
INSERT INTO records (date, scheme_id, scheme_name, meals, note)
SELECT
  date::DATE,
  (SELECT id FROM schemes ORDER BY created_at LIMIT 1),
  (SELECT name FROM schemes ORDER BY created_at LIMIT 1),
  '{"A": "西红柿炒鸡蛋", "B": "紫菜蛋花汤", "C": "苹果"}'::jsonb,
  '测试记录'
FROM (
  SELECT CURRENT_DATE - INTERVAL '1 day' * generate_series AS date
  FROM generate_series(0, 6)
) dates
ON CONFLICT (date, scheme_id) DO NOTHING;

-- 输出插入结果
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '测试数据插入完成！';
  RAISE NOTICE '方案数量: %', (SELECT COUNT(*) FROM schemes);
  RAISE NOTICE '记录数量: %', (SELECT COUNT(*) FROM records);
  RAISE NOTICE '========================================';
END $$;
