# 🚀 Vercel 部署步骤

## 第 4 步：部署到 Vercel

### 1️⃣ 登录 Vercel

访问：https://vercel.com
- 点击 `Sign Up` 或 `Log In`
- **选择 "Continue with GitHub"**（使用你的 GitHub 账号登录）

---

### 2️⃣ 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**

2. 在 "Import Git Repository" 页面：
   - 找到你的仓库：`muyuchengfengbai/wogan-project`
   - 点击 **"Import"**

---

### 3️⃣ 配置项目

在 "Configure Project" 页面：

#### ✅ Framework Preset
- 自动检测为：**Vite**（保持默认）

#### ✅ Root Directory
- 点击 **"Edit"**
- 输入：`apps/web`
- 点击 **"Continue"**

#### ✅ Build and Output Settings
保持默认：
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### ✅ Environment Variables（重要！）
点击 **"Environment Variables"**，添加：

**Name**: `DATABASE_URL`  
**Value**: 
```
postgresql://neondb_owner:npg_lhbKNrZLGs27@ep-long-bar-aovy3qu6-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

---

### 4️⃣ 开始部署

1. 点击 **"Deploy"** 按钮
2. 等待部署完成（约 2-3 分钟）
3. 看到 "🎉 Congratulations!" 页面

---

### 5️⃣ 访问你的网站

部署成功后，Vercel 会给你一个域名：
- 格式：`https://wogan-project-xxx.vercel.app`
- 点击 **"Visit"** 按钮访问

---

## ✅ 验证部署

访问以下页面测试：

1. **首页**：`https://你的域名.vercel.app/`
2. **商城**：`https://你的域名.vercel.app/shop`
3. **管理后台**：`https://你的域名.vercel.app/admin`
4. **溯源查询**：`https://你的域名.vercel.app/trace`

---

## 🔧 常见问题

### 问题 1：部署失败
- 检查 Root Directory 是否设置为 `apps/web`
- 检查 Environment Variables 是否正确添加

### 问题 2：页面空白
- 打开浏览器开发者工具（F12）
- 查看 Console 和 Network 标签
- 检查 API 请求是否成功

### 问题 3：数据库连接失败
- 检查 DATABASE_URL 环境变量是否正确
- 确认 Neon 数据库是否正常运行

---

## 📝 部署后操作

### 1. 自定义域名（可选）
在 Vercel 项目设置中：
- Settings → Domains
- 添加你自己的域名

### 2. 查看部署日志
- Deployments 标签
- 点击任意部署查看详细日志

### 3. 重新部署
- 推送代码到 GitHub
- Vercel 会自动重新部署

---

## 🎯 下一步

部署成功后：
1. ✅ 测试所有功能
2. ✅ 记录你的域名
3. ✅ 准备答辩演示

---

**祝部署顺利！🚀**
