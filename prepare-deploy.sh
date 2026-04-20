#!/bin/bash

echo "=========================================="
echo "步骤 2：准备代码配置"
echo "=========================================="
echo ""

# 创建 vercel.json
echo "1. 创建 vercel.json..."
cat > vercel.json << 'VERCEL_EOF'
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
VERCEL_EOF
echo "✅ vercel.json 创建成功"

# 创建 .vercelignore
echo ""
echo "2. 创建 .vercelignore..."
cat > .vercelignore << 'IGNORE_EOF'
node_modules
.env
.env.local
*.log
.DS_Store
pgdata
test-results
playwright-report
.git
