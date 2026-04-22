# Vercel 环境变量配置指南

## 🔧 必须在 Vercel 控制台配置的环境变量

代码推送后，需要在 Vercel 项目设置中添加以下环境变量：

### 1. 进入项目设置
1. 打开 https://vercel.com/muyuchengfengbais-projects/wogan-project
2. 点击顶部的 **Settings** 标签
3. 左侧菜单选择 **Environment Variables**

### 2. 添加环境变量

#### DATABASE_URL（必需）
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://neondb_owner:npg_lhbKNrZLGs27@ep-long-bar-aovy3qu6-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
- **Environment**: 勾选 `Production`, `Preview`, `Development`

#### NODE_ENV（可选）
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: 勾选 `Production`

### 3. 重新部署
添加环境变量后，需要触发重新部署：
1. 点击顶部的 **Deployments** 标签
2. 找到最新的部署
3. 点击右侧的 **...** 菜单
4. 选择 **Redeploy**

## ✅ 验证环境变量
部署成功后，可以在 Vercel 的 **Functions** 日志中查看环境变量是否正确加载。

## 🔍 常见问题

### Q: 为什么需要在 Vercel 配置环境变量？
A: `.env.production` 文件不会被上传到 Git（已在 .gitignore 中排除），所以需要在 Vercel 控制台手动配置。

### Q: 如果忘记配置会怎样？
A: 应用会因为无法连接数据库而崩溃，返回 500 错误。

### Q: 可以使用 Vercel CLI 配置吗？
A: 可以，使用命令：
```bash
vercel env add DATABASE_URL production
```
然后粘贴数据库连接字符串。
