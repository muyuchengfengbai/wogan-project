# 沃柑平台前后端分离部署指南

## 🎯 双站独立部署方案

本项目采用**前后端分离 + 双站独立部署**架构，支持两个独立域名访问：

### 架构图
```
┌─────────────────────────┐
│  shop.your-domain.com   │  ← 消费者商城（C端）
│  /shop, /cart, /trace   │
└───────────┬─────────────┘
            │
            ├─────► /api/*  ← 共享 API 层
            │
┌───────────┴─────────────┐
│ admin.your-domain.com   │  ← 管理后台（B端）
│ /admin/*, /admin/orders │
└─────────────────────────┘
            │
            └─────► PostgreSQL  ← 共享数据库
```

---

## 📦 方案一：单项目双域名（推荐）

### 1. 在 Anything 平台发布
点击右上角 **Publish** 按钮，发布到主域名：
```
https://wogan-platform.created.app
```

### 2. 配置自定义域名
如果你有自己的域名（如 `yourdomain.com`），在 Anything 的项目设置中添加：

#### 商城子域名（C端）
```
shop.yourdomain.com  →  /shop
```

#### 管理后台子域名（B端）
```
admin.yourdomain.com  →  /admin
```

### 3. 智能路由自动跳转
项目首页（`/`）已内置智能识别：
- 访问 `shop.yourdomain.com` → 自动跳转到 `/shop`
- 访问 `admin.yourdomain.com` → 自动跳转到 `/admin`
- 访问 `www.yourdomain.com` → 显示双入口选择页

---

## 📦 方案二：完全独立部署

如果你需要将商城和管理后台部署到**完全不同的服务器/平台**：

### 步骤：
1. **商城独立项目**
   - 只保留 `/apps/web/src/app/shop/**` 和相关组件
   - 部署到 Vercel/Netlify，域名 `shop.yourdomain.com`

2. **管理后台独立项目**
   - 只保留 `/apps/web/src/app/admin/**` 和相关组件
   - 部署到内网或云服务器，域名 `admin.yourdomain.com`

3. **API 后端独立部署**
   - 将 `/apps/web/src/app/api/**` 单独部署
   - 配置 CORS 允许商城和管理后台域名访问
   - 两个前端都调用同一个 API 域名

### 数据库共享
两个前端系统共享同一个 PostgreSQL 数据库连接字符串：
```env
DATABASE_URL=postgresql://user:password@host:5432/wogan_db
```

---

## 🚀 推荐部署流程（毕业答辩用）

### 快速方案：单项目双入口
1. ✅ 点击 Anything 右上角 **Publish** 发布
2. ✅ 获得主域名：`https://your-project.created.app`
3. ✅ 演示时分别访问：
   - 商城：`https://your-project.created.app/shop`
   - 管理后台：`https://your-project.created.app/admin`

### 进阶方案：自定义域名
1. 购买域名（如 `wogan-platform.com`）
2. 在 Anything 项目设置绑定：
   - `shop.wogan-platform.com`
   - `admin.wogan-platform.com`
3. 配置 DNS 记录指向 Anything 提供的服务器

---

## 🔐 安全性说明

### C端商城（对外公开）
- ✅ 任何用户都可访问 `/shop`, `/cart`, `/trace`
- ✅ 不包含任何管理功能入口
- ✅ 导航栏已移除后台链接

### B端管理后台（内部使用）
- ⚠️ 当前版本未加权限验证（可后续扩展登录系统）
- ✅ 完全独立的导航和页面，消费者不知道后台地址
- ✅ 建议部署到内网或添加 IP 白名单

---

## 📊 技术架构优势

| 特性 | 传统单体应用 | 本项目架构 |
|------|------------|-----------|
| 前端分离 | ❌ | ✅ 完全独立路由 |
| API 复用 | ❌ | ✅ 统一 REST API |
| 数据库 | 重复建表 | ✅ 共享 PostgreSQL |
| 独立部署 | 困难 | ✅ 支持双域名 |
| 运维成本 | 高 | ✅ 一次部署两端可用 |

---

## 📝 答辩演示建议

### 开场白示例：
> "本项目采用前后端分离架构，实现了消费者商城和管理后台的**物理隔离**。  
> 商城前端部署在 `shop.domain.com`，管理后台部署在 `admin.domain.com`。  
> 两个子系统通过统一的 REST API 层共享数据，确保业务一致性的同时保证了系统安全性。"

### 演示路径：
1. **展示商城**：浏览商品 → 加购 → 下单（C端完整流程）
2. **切换后台**：订单管理 → 状态流转 → 果园监控（B端管理功能）
3. **说明架构**：打开开发者工具 → Network 标签 → 展示所有请求都指向同一 `/api/*`

---

## 🛠️ 未来扩展方向

- [ ] 添加管理员登录系统（`/admin/login`）
- [ ] 配置 IP 白名单限制后台访问
- [ ] 使用 Nginx 反向代理实现更复杂的路由策略
- [ ] 增加 CDN 加速商城静态资源
- [ ] 配置 Redis 缓存提升 API 性能

---

**部署完成后，你将拥有两个完全独立的网站，共享同一套数据和 API！**
