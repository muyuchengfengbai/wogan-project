#!/bin/bash

echo "=========================================="
echo "沃柑项目 - 一键部署准备"
echo "=========================================="
echo ""

# 步骤 1：配置 npm
echo "步骤 1/3：配置 npm 镜像..."
npm config set registry https://registry.npmmirror.com
echo "✅ npm 镜像配置完成"
echo ""

# 步骤 2：创建配置文件
echo "步骤 2/3：创建配置文件..."

cat > vercel.json << 'VERCEL'
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
VERCEL

cat > .vercelignore << 'IGNORE'
node_modules
.env
.env.local
*.log
pgdata
test-results
IGNORE

cat > .env.example << 'ENVEX'
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
ENVEX

echo "✅ 配置文件创建完成"
echo ""

# 步骤 3：初始化 Git
echo "步骤 3/3：初始化 Git..."
if [ -d .git ]; then
    echo "⚠️  Git 仓库已存在，跳过初始化"
else
    git init
    echo "✅ Git 仓库初始化完成"
fi

git add .
git commit -m "Prepare for Vercel deployment" 2>/dev/null || echo "⚠️  没有新的更改需要提交"

echo ""
echo "=========================================="
echo "✅ 准备工作完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo ""
echo "1. 创建 GitHub 仓库"
echo "   访问：https://github.com/new"
echo "   仓库名：wogan-project"
echo "   选择：Public"
echo ""
echo "2. 推送代码（替换 YOUR_USERNAME）"
echo "   git remote add origin https://github.com/YOUR_USERNAME/wogan-project.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 创建 Neon 数据库"
echo "   访问：https://neon.tech"
echo "   创建项目：wogan-db"
echo ""
echo "4. 部署到 Vercel"
echo "   访问：https://vercel.com"
echo "   导入 GitHub 仓库"
echo ""
