#!/bin/bash

# 沃柑项目 - Vercel 部署准备脚本

echo "=========================================="
echo "准备 Vercel 部署"
echo "=========================================="
echo ""

# 1. 配置 npm 使用国内镜像
echo "1. 配置 npm 使用淘宝镜像..."
npm config set registry https://registry.npmmirror.com

# 验证配置
echo "当前 npm 镜像："
npm config get registry

echo ""
echo "2. 安装 Vercel CLI..."
npm install -g vercel

if [ $? -eq 0 ]; then
    echo "✅ Vercel CLI 安装成功"
else
    echo "❌ Vercel CLI 安装失败"
    echo ""
    echo "请尝试以下方法："
    echo "1. 检查网络连接"
    echo "2. 使用代理"
    echo "3. 或者直接在 Vercel 网站上部署（无需 CLI）"
    exit 1
fi

echo ""
echo "3. 创建必要的配置文件..."

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
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

echo "✅ 创建 vercel.json"

# 创建 .env.example
cat > .env.example << 'EOF'
# 数据库连接（部署时需要配置）
DATABASE_URL=postgresql://user:password@host:5432/database

# Node 环境
NODE_ENV=production
EOF

echo "✅ 创建 .env.example"

# 创建 .vercelignore
cat > .vercelignore << 'EOF'
node_modules
.env
.env.local
*.log
.DS_Store
pgdata
test-results
playwright-report
EOF

echo "✅ 创建 .vercelignore"

echo ""
echo "=========================================="
echo "准备完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 访问 https://neon.tech 创建数据库"
echo "2. 访问 https://vercel.com 注册账号"
echo "3. 运行: vercel"
echo ""
