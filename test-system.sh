#!/bin/bash

# 沃柑系统功能验证脚本

echo "=========================================="
echo "沃柑智慧产销一体化平台 - 功能验证"
echo "=========================================="
echo ""

BASE_URL="http://localhost:4000"

# 检查服务器是否运行
echo "1. 检查服务器状态..."
if curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器未运行，请先启动: npm run dev"
    exit 1
fi

echo ""
echo "2. 检查关键页面..."

# 检查登录页面
if curl -s "$BASE_URL/login" | grep -q "忘记密码"; then
    echo "✅ 登录页面正常"
else
    echo "❌ 登录页面异常"
fi

# 检查商城页面
if curl -s "$BASE_URL/shop" | grep -q "精选好柑"; then
    echo "✅ 商城页面正常"
else
    echo "❌ 商城页面异常"
fi

# 检查结算页面
if curl -s "$BASE_URL/checkout" | grep -q "确认订单"; then
    echo "✅ 结算页面正常"
else
    echo "❌ 结算页面异常"
fi

# 检查地址管理页面
if curl -s "$BASE_URL/profile/addresses" | grep -q "收货地址"; then
    echo "✅ 地址管理页面正常"
else
    echo "❌ 地址管理页面异常"
fi

# 检查收藏页面
if curl -s "$BASE_URL/profile/favorites" | grep -q "我的收藏"; then
    echo "✅ 收藏页面正常"
else
    echo "❌ 收藏页面异常"
fi

echo ""
echo "3. 检查 API 接口..."

# 检查商品 API
PRODUCTS=$(curl -s "$BASE_URL/api/products" | jq -r '.products | length' 2>/dev/null)
if [ "$PRODUCTS" -gt 0 ]; then
    echo "✅ 商品 API 正常 (共 $PRODUCTS 个商品)"
else
    echo "❌ 商品 API 异常"
fi

echo ""
echo "=========================================="
echo "功能测试指南"
echo "=========================================="
echo ""
echo "请按照以下步骤手动测试："
echo ""
echo "【测试1：忘记密码功能】"
echo "1. 打开浏览器访问: $BASE_URL/login"
echo "2. 确保在'登录'模式（不是注册）"
echo "3. 按 F12 打开开发者工具"
echo "4. 点击'忘记密码？'按钮"
echo "5. 检查页面底部是否显示提示信息"
echo "6. 检查控制台是否有错误"
echo ""
echo "【测试2：收货地址功能】"
echo "1. 访问: $BASE_URL/profile/addresses"
echo "2. 点击'添加新地址'按钮"
echo "3. 填写地址信息并保存"
echo "4. 按 F12，在控制台输入: localStorage.getItem('user_addresses')"
echo "5. 检查是否有数据"
echo "6. 添加商品到购物车"
echo "7. 访问: $BASE_URL/checkout"
echo "8. 检查地址是否自动加载"
echo ""
echo "【测试3：商品收藏功能】"
echo "1. 访问: $BASE_URL/shop"
echo "2. 按 F12 打开开发者工具"
echo "3. 找到任意商品卡片"
echo "4. 点击商品图片右上角的爱心图标"
echo "5. 检查页面底部是否显示'已收藏'提示"
echo "6. 检查爱心图标是否变成红色"
echo "7. 在控制台输入: localStorage.getItem('user_favorites')"
echo "8. 检查是否有数据"
echo "9. 访问: $BASE_URL/profile/favorites"
echo "10. 检查是否显示收藏的商品"
echo ""
echo "=========================================="
echo "常见问题排查"
echo "=========================================="
echo ""
echo "如果功能不工作，请检查："
echo ""
echo "1. 浏览器缓存问题"
echo "   - 按 Ctrl+Shift+R 强制刷新"
echo "   - 或清除浏览器缓存"
echo ""
echo "2. JavaScript 错误"
echo "   - 按 F12 打开开发者工具"
echo "   - 查看 Console 标签是否有红色错误"
echo "   - 截图错误信息"
echo ""
echo "3. localStorage 被禁用"
echo "   - 在控制台输入: typeof localStorage"
echo "   - 应该返回 'object'"
echo "   - 如果返回 'undefined'，说明被禁用"
echo ""
echo "4. 浏览器扩展干扰"
echo "   - 在无痕模式下测试"
echo "   - 或禁用所有扩展"
echo ""
echo "5. 代码未更新"
echo "   - 重启开发服务器"
echo "   - 检查文件修改时间"
echo ""
echo "=========================================="
echo "快速测试页面"
echo "=========================================="
echo ""
echo "访问测试页面: $BASE_URL/test-features"
echo "这个页面提供一键测试所有功能"
echo ""
