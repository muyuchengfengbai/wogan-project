# Vercel + Neon 部署教程 - 分步指南

## 📋 部署清单

- [ ] 步骤 1：解决网络问题
- [ ] 步骤 2：准备代码
- [ ] 步骤 3：创建 GitHub 仓库
- [ ] 步骤 4：创建 Neon 数据库
- [ ] 步骤 5：部署到 Vercel
- [ ] 步骤 6：配置环境变量
- [ ] 步骤 7：测试访问

预计时间：15-20 分钟

---

## 步骤 1：解决网络问题 ✅

### 1.1 配置 npm 使用国内镜像

```bash
# 切换到项目目录
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

# 配置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
# 应该显示：https://registry.npmmirror.com/
```

### 1.2 测试网络

```bash
# 测试是否能访问 npm
npm ping

# 如果成功，会显示：Ping success
```

---

## 步骤 2：准备代码 📝

### 2.1 修改数据库配置

编辑 `src/app/api/utils/sql.js`：

```bash
nano src/app/api/utils/sql.js
```

修改为：

```javascript
import { Pool } from 'pg';

// 使用环境变量连接数据库
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
```

保存：`Ctrl + O`，回车，退出：`Ctrl + X`

### 2.2 创建 Vercel 配置文件

```bash
# 创建 vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
EOF

echo "✅ vercel.json 创建成功"
```

### 2.3 创建 .vercelignore

```bash
cat > .vercelignore << 'EOF'
node_modules
.env
.env.local
*.log
.DS_Store
pgdata
test-results
playwright-report
.git
EOF

echo "✅ .vercelignore 创建成功"
```

### 2.4 创建 .env.example

```bash
cat > .env.example << 'EOF'
# 数据库连接（部署时需要配置）
DATABASE_URL=postgresql://user:password@host:5432/database

# Node 环境
NODE_ENV=production
EOF

echo "✅ .env.example 创建成功"
```

---

## 步骤 3：创建 GitHub 仓库 🐙

### 3.1 初始化 Git（如果还没有）

```bash
# 检查是否已经是 Git 仓库
git status

# 如果提示 "not a git repository"，则初始化
git init

# 添加所有文件
git add .

# 提交
git commit -m "Prepare for Vercel deployment"
```

### 3.2 在 GitHub 创建仓库

1. **打开浏览器**，访问：https://github.com/new

2. **填写信息**：
   - Repository name: `wogan-project`
   - Description: `沃柑智慧产销一体化平台`
   - 选择：`Public`（公开）
   - **不要**勾选 "Add a README file"
   - **不要**勾选 "Add .gitignore"
   - **不要**勾选 "Choose a license"

3. **点击**：`Create repository`

### 3.3 推送代码到 GitHub

```bash
# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/wogan-project.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

**如果推送失败**，可能需要配置 GitHub 认证：

```bash
# 方法 1：使用 Personal Access Token
# 1. 访问 https://github.com/settings/tokens
# 2. 点击 "Generate new token (classic)"
# 3. 勾选 "repo" 权限
# 4. 生成 token 并复制
# 5. 推送时使用 token 作为密码

# 方法 2：使用 SSH（推荐）
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按回车使用默认路径

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 访问 https://github.com/settings/keys
# 点击 "New SSH key"
# 粘贴公钥，保存

# 修改远程仓库地址
git remote set-url origin git@github.com:YOUR_USERNAME/wogan-project.git

# 重新推送
git push -u origin main
```

---

## 步骤 4：创建 Neon 数据库 🐘

### 4.1 注册 Neon 账号

1. **打开浏览器**，访问：https://neon.tech

2. **点击**：`Sign Up`

3. **选择**：`Continue with GitHub`（用 GitHub 账号登录）

4. **授权** Neon 访问你的 GitHub

### 4.2 创建数据库项目

1. **登录后**，点击：`Create a project`

2. **填写信息**：
   - Project name: `wogan-db`
   - Region: 选择 `Asia Pacific (Singapore)` 或 `US East (Ohio)`
   - PostgreSQL version: 选择最新版（默认即可）

3. **点击**：`Create project`

4. **等待创建**（约 10-20 秒）

### 4.3 获取数据库连接字符串

1. **在项目页面**，找到 `Connection string`

2. **复制连接字符串**，类似：
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **保存这个字符串**（稍后会用到）

### 4.4 初始化数据库

**方法 1：使用 Neon SQL Editor（推荐）**

1. 在 Neon 控制台，点击 `SQL Editor`

2. 打开你的 `init_database.sql` 文件：
   ```bash
   cat init_database.sql
   ```

3. 复制所有内容

4. 粘贴到 Neon SQL Editor

5. 点击 `Run` 执行

6. 检查是否成功（应该显示 "Success"）

**方法 2：使用命令行**

```bash
# 安装 PostgreSQL 客户端（如果还没有）
sudo apt-get install postgresql-client

# 连接到 Neon 数据库（替换为你的连接字符串）
psql "postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# 在 psql 中执行
\i init_database.sql

# 验证表是否创建成功
\dt

# 查看商品数据
SELECT * FROM products;

# 退出
\q
```

---

## 步骤 5：部署到 Vercel 🚀

### 5.1 注册 Vercel 账号

1. **打开浏览器**，访问：https://vercel.com

2. **点击**：`Sign Up`

3. **选择**：`Continue with GitHub`（用 GitHub 账号登录）

4. **授权** Vercel 访问你的 GitHub

### 5.2 导入项目

1. **登录后**，点击：`Add New...`

2. **选择**：`Project`

3. **找到你的仓库**：`wogan-project`

4. **点击**：`Import`

### 5.3 配置项目

1. **Project Name**: `wogan-project`（默认即可）

2. **Framework Preset**: 选择 `Other`

3. **Root Directory**: `./`（默认即可）

4. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build/client`
   - Install Command: `npm install`

5. **暂时不要点击 Deploy**，先配置环境变量

---

## 步骤 6：配置环境变量 🔐

### 6.1 添加数据库连接

1. **在 Vercel 配置页面**，找到 `Environment Variables`

2. **添加第一个变量**：
   - Name: `DATABASE_URL`
   - Value: （粘贴你的 Neon 连接字符串）
   - 选择：`Production`, `Preview`, `Development`（全选）

3. **添加第二个变量**：
   - Name: `NODE_ENV`
   - Value: `production`
   - 选择：`Production`

4. **点击**：`Add`

### 6.2 开始部署

1. **点击**：`Deploy`

2. **等待部署**（约 2-5 分钟）

3. **查看部署日志**（可以看到构建过程）

---

## 步骤 7：测试访问 ✅

### 7.1 获取域名

部署完成后，Vercel 会显示：

```
🎉 Congratulations!
Your project is live at:
https://wogan-project.vercel.app
```

### 7.2 测试功能

1. **访问首页**：
   ```
   https://wogan-project.vercel.app
   ```

2. **测试商城**：
   ```
   https://wogan-project.vercel.app/shop
   ```

3. **测试管理后台**：
   ```
   https://wogan-project.vercel.app/admin
   ```

4. **测试 API**：
   ```
   https://wogan-project.vercel.app/api/products
   ```

### 7.3 检查数据库连接

如果页面显示正常，说明数据库连接成功！

如果出现错误，检查：
1. 环境变量是否正确配置
2. 数据库连接字符串是否正确
3. 数据库是否初始化成功

---

## 🎉 完成！

你现在有了：

1. ✅ **云端部署的网站**
2. ✅ **可访问的域名**：`https://wogan-project.vercel.app`
3. ✅ **自动 HTTPS**
4. ✅ **全球 CDN 加速**
5. ✅ **自动 CI/CD**（推送代码自动部署）

---

## 📝 后续操作

### 更新代码

```bash
# 修改代码后
git add .
git commit -m "Update features"
git push

# Vercel 会自动检测并重新部署
```

### 查看部署日志

1. 访问 Vercel 控制台
2. 选择你的项目
3. 点击 `Deployments`
4. 查看每次部署的详细日志

### 绑定自定义域名（可选）

1. 在 Vercel 项目设置中
2. 点击 `Domains`
3. 输入你的域名
4. 按照提示配置 DNS

---

## ❓ 常见问题

### Q1：部署失败怎么办？

**A**：查看部署日志，常见原因：
- 构建命令错误
- 依赖安装失败
- 环境变量未配置

### Q2：页面空白怎么办？

**A**：检查：
- 浏览器控制台是否有错误
- Vercel 部署日志
- 环境变量是否正确

### Q3：数据库连接失败？

**A**：检查：
- DATABASE_URL 是否正确
- Neon 数据库是否正常运行
- 数据库是否初始化

### Q4：如何查看错误日志？

**A**：
```bash
# 在 Vercel 控制台
1. 选择项目
2. 点击 Deployments
3. 点击最新的部署
4. 查看 Build Logs 和 Function Logs
```

---

## 🆘 需要帮助？

如果遇到问题，告诉我：
1. 在哪一步遇到问题
2. 错误信息是什么
3. 截图（如果有）

我会帮你解决！
