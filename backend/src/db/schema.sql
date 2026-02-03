-- Eatly 数据库表结构
-- PostgreSQL Schema

-- 方案表
CREATE TABLE IF NOT EXISTS schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pools JSONB NOT NULL DEFAULT '{"A": [], "B": [], "C": []}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_schemes_created_at ON schemes(created_at);

-- 饮食记录表
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  breakfast JSONB DEFAULT '[]'::jsonb,
  lunch JSONB DEFAULT '[]'::jsonb,
  dinner JSONB DEFAULT '[]'::jsonb,
  snack JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at);

-- 推荐记录表
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, snack
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_recommendations_date ON recommendations(date);
CREATE INDEX IF NOT EXISTS idx_recommendations_date_meal_type ON recommendations(date, meal_type);

-- 设置表（单例）
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'zh-CN',
  recommend_count INTEGER DEFAULT 3,
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认设置
INSERT INTO settings (theme, language, recommend_count)
VALUES ('light', 'zh-CN', 3)
ON CONFLICT DO NOTHING;

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表添加更新时间触发器
CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE schemes IS '饮食方案表（ABC 三组菜品池）';
COMMENT ON TABLE records IS '每日饮食记录表';
COMMENT ON TABLE recommendations IS '推荐记录表';
COMMENT ON TABLE settings IS '应用设置表';
