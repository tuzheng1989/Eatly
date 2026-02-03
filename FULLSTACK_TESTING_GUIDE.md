# 本地全栈环境测试指南

**创建时间**: 2025-02-04
**环境状态**: ✅ 已配置完成

---

## 🎯 当前环境状态

### 运行中的服务

| 服务 | 地址 | 状态 | 用途 |
|------|------|------|------|
| 前端 (Vite) | http://localhost:3001 | ✅ 运行中 | Vue 3 应用 |
| 后端 (Express) | http://localhost:4000 | ✅ 运行中 | API 服务器 |
| 数据库 (PostgreSQL) | localhost:5432 | ✅ 运行中 | 数据持久化 |

### 数据库数据

- **方案数量**: 2 个
  - 默认方案
  - 素食方案

- **记录数量**: 7 条（最近 7 天的测试数据）

---

## 🧪 前后端联调测试步骤

### 测试 1: 验证后端 API

**测试命令**:
```bash
# 测试方案 API
curl -H "X-API-Key: eatly_dev_key_2024" http://localhost:4000/api/schemes

# 测试记录 API
curl -H "X-API-Key: eatly_dev_key_2024" http://localhost:4000/api/records

# 测试健康检查
curl http://localhost:4000/api/health
```

**预期结果**:
- ✅ 返回 JSON 格式的数据
- ✅ 包含 success: true
- ✅ data 字段包含数据

---

### 测试 2: 前端页面测试

#### 2.1 打开浏览器访问前端

**地址**: http://localhost:3001

**预期结果**:
- ✅ 页面正常加载
- ✅ 显示"欢迎使用 Eatly 🥗"
- ✅ 无控制台错误

#### 2.2 测试方案管理页面

**步骤**:
1. 点击导航栏的"方案"
2. 查看方案列表

**预期结果**:
- ✅ 显示 2 个方案（默认方案、素食方案）
- ✅ 每个方案显示正确的名称和描述
- ✅ 可以通过 API 加载数据

**数据验证**:
```
默认方案应包含:
- A组: 西红柿炒鸡蛋, 青椒肉丝, 红烧茄子, 鱼香肉丝, 宫保鸡丁
- B组: 蒸蛋羹, 紫菜蛋花汤, 冬瓜排骨汤, 番茄鸡蛋汤, 丝瓜汤
- C组: 水果沙拉, 酸奶, 坚果, 苹果, 香蕉
```

#### 2.3 测试记录/日历页面

**步骤**:
1. 点击导航栏的"日历"
2. 查看日历显示

**预期结果**:
- ✅ 显示最近 7 天的记录
- ✅ 每条记录显示正确的菜品
- ✅ 数据来自 PostgreSQL 数据库

---

### 测试 3: 创建新数据

#### 3.1 通过前端创建新方案

**步骤**:
1. 访问 http://localhost:3001/schemes
2. 点击"创建方案"按钮
3. 输入方案信息:
   - 名称: 测试API方案
   - 描述: 通过API创建的测试方案
4. 配置菜品池（选择一些菜品）
5. 点击"保存"

**预期结果**:
- ✅ 方案创建成功
- ✅ 显示成功提示消息
- ✅ 方案出现在列表中

**验证**:
```bash
# 在终端中验证数据已保存到 PostgreSQL
curl -H "X-API-Key: eatly_dev_key_2024" http://localhost:4000/api/schemes | grep "测试API方案"
```

#### 3.2 通过前端创建新记录

**步骤**:
1. 访问 http://localhost:3001/record
2. 选择今天日期
3. 填写 A、B、C 三组菜品
4. 点击"保存记录"

**预期结果**:
- ✅ 记录创建成功
- ✅ 显示成功提示消息
- ✅ 记录保存到 PostgreSQL

**验证**:
```bash
# 查看数据库中的记录
curl -H "X-API-Key: eatly_dev_key_2024" http://localhost:4000/api/records | grep -o "今天\|今日"
```

---

### 测试 4: 数据一致性验证

#### 4.1 检查数据库

**连接数据库**:
```bash
docker exec -it eatly-postgres psql -U postgres -d eatly_dev
```

**查询数据**:
```sql
-- 查看方案数量
SELECT COUNT(*) FROM schemes;

-- 查看记录数量
SELECT COUNT(*) FROM records;

-- 查看最新记录
SELECT date, scheme_name, meals FROM records ORDER BY date DESC LIMIT 5;
```

**退出数据库**:
```sql
\q
```

---

## 🔍 故障排查

### 问题 1: 前端无法连接后端

**症状**: 浏览器控制台显示 CORS 错误或网络错误

**解决方案**:
1. 确认后端正在运行: `curl http://localhost:4000/api/health`
2. 检查后端 CORS 配置
3. 确认前端 .env.development 中 VITE_API_URL 正确

### 问题 2: API 请求返回 401 Unauthorized

**症状**: 控制台显示 "无效的 API Key"

**解决方案**:
1. 确认后端 .env 中 API_KEY 配置
2. 确认前端 HTTP 服务发送了正确的 header

### 问题 3: 数据未保存到数据库

**症状**: 前端显示成功，但数据库中没有数据

**排查步骤**:
```bash
# 1. 检查后端日志
# 查看后台进程输出

# 2. 检查数据库连接
docker exec eatly-postgres pg_isready -U postgres

# 3. 直接查询数据库
docker exec -it eatly-postgres psql -U postgres -d eatly_dev -c "SELECT COUNT(*) FROM records;"
```

---

## 📊 性能监控

### 查看后端日志

后端在后台运行，查看日志：
```bash
# 后台进程 ID: bbb3e7f
cat C:/Users/tuzhe/AppData/Local/Temp/claude/c--Users-tuzhe-runspace-eatly/tasks/bbb3e7f.output
```

### 查看前端日志

前端在后台运行，查看日志：
```bash
# 前台进程 ID: ba956ad
cat C:/Users/tuzhe/AppData/Local/Temp/claude/c--Users-tuzhe-runspace-eatly/tasks/ba956ad.output
```

### 查看数据库日志

```bash
docker logs eatly-postgres --tail 50
```

---

## 🛑 停止服务

### 停止所有服务

```bash
# 停止前端
# Ctrl+C 在运行 npm run dev 的终端

# 停止后端
# TaskStop bbb3e7f

# 停止数据库（可选）
docker stop eatly-postgres
```

### 重新启动服务

```bash
# 启动数据库（如果已停止）
docker start eatly-postgres

# 启动后端
cd backend && npm run dev &

# 启动前端
npm run dev &
```

---

## 📝 测试检查清单

### 后端 API 测试

- [ ] `/api/health` - 健康检查正常
- [ ] `/api/schemes` - 获取方案列表
- [ ] `/api/records` - 获取记录列表
- [ ] `/api/settings` - 获取设置

### 前端功能测试

- [ ] 首页加载正常
- [ ] 方案管理页面显示后端数据
- [ ] 日历页面显示后端记录
- [ ] 可以创建新方案
- [ ] 可以创建新记录
- [ ] 数据保存到 PostgreSQL

### 数据一致性验证

- [ ] 前端显示的数据 = 数据库数据
- [ ] 创建的新数据出现在数据库中
- [ ] 删除操作同步到数据库

---

## 🎉 测试成功标准

**所有服务运行正常**:
- ✅ 前端: http://localhost:3001
- ✅ 后端: http://localhost:4000
- ✅ 数据库: PostgreSQL on port 5432

**核心功能正常**:
- ✅ 方案管理 CRUD 正常
- ✅ 记录管理 CRUD 正常
- ✅ 数据持久化到 PostgreSQL
- ✅ 前后端数据一致

**测试完成后即可部署到生产环境！**

---

## 📦 下一步：生产环境部署

完成本地测试后，部署到 Ubuntu 服务器 (101.200.122.190) 的步骤：

1. **构建前端**: `npm run build`
2. **配置环境变量**: 修改 `.env.production`
3. **部署后端**: 将 `backend/` 上传到服务器
4. **部署数据库**: 使用 docker-compose.prod.yml
5. **配置 Nginx**: 反向代理配置

详细部署指南请参考之前创建的 Docker 配置文件。

---

**文档版本**: v1.0
**最后更新**: 2025-02-04
