# 卸载测试工具指南

## 方法一：完全卸载（推荐）

### 1. 卸载 Playwright 包

```bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web
npm uninstall @playwright/test
```

### 2. 删除测试文件

```bash
# 删除测试目录
rm -rf tests/

# 删除配置文件
rm -f playwright.config.js

# 删除测试结果
rm -rf test-results/

# 删除 Playwright 缓存（可选）
rm -rf ~/.cache/ms-playwright
```

### 3. 清理 package.json

如果 package.json 中有测试脚本，手动删除：
```json
{
  "scripts": {
    "test": "playwright test"  // 删除这行
  }
}
```

## 方法二：保留文件但不使用

如果你想保留测试文件以备将来使用，只需：

```bash
# 卸载 Playwright 包
npm uninstall @playwright/test
```

测试文件会保留在项目中，但不会占用运行时资源。

## 方法三：一键清理脚本

```bash
# 创建清理脚本
cat > /tmp/cleanup-tests.sh << 'EOF'
#!/bin/bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

echo "正在卸载 Playwright..."
npm uninstall @playwright/test

echo "正在删除测试文件..."
rm -rf tests/
rm -f playwright.config.js
rm -rf test-results/

echo "正在清理浏览器缓存..."
rm -rf ~/.cache/ms-playwright

echo "✅ 测试工具已完全卸载！"
EOF

# 执行清理
chmod +x /tmp/cleanup-tests.sh
/tmp/cleanup-tests.sh
```

## 验证卸载

```bash
# 检查 Playwright 是否已卸载
npm list @playwright/test

# 应该显示：(empty) 或 not found

# 检查文件是否已删除
ls tests/
ls playwright.config.js

# 应该显示：No such file or directory
```

## 注意事项

1. **卸载前备份**：如果你修改了测试文件，建议先备份
2. **浏览器缓存**：`~/.cache/ms-playwright` 可能占用几百MB，建议删除
3. **package-lock.json**：卸载后会自动更新，无需手动处理

## 恢复测试工具

如果将来需要重新安装：

```bash
npm install -D @playwright/test
npx playwright install
```

然后恢复之前备份的测试文件即可。
