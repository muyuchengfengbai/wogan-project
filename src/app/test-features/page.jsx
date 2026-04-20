"use client";
import React, { useState, useEffect } from "react";

export default function TestFeaturesPage() {
  const [results, setResults] = useState({});

  useEffect(() => {
    runTests();
  }, []);

  const runTests = () => {
    const testResults = {};

    // 测试1：检查收藏功能
    try {
      const favorites = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      testResults.favorites = {
        status: "✅ 通过",
        data: favorites,
        count: favorites.length
      };
    } catch (e) {
      testResults.favorites = {
        status: "❌ 失败",
        error: e.message
      };
    }

    // 测试2：检查收货地址
    try {
      const addresses = JSON.parse(localStorage.getItem("user_addresses") || "[]");
      testResults.addresses = {
        status: "✅ 通过",
        data: addresses,
        count: addresses.length
      };
    } catch (e) {
      testResults.addresses = {
        status: "❌ 失败",
        error: e.message
      };
    }

    // 测试3：检查用户登录状态
    try {
      const token = localStorage.getItem("user_token");
      const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
      testResults.auth = {
        status: token ? "✅ 已登录" : "⚠️ 未登录",
        token: token ? "存在" : "不存在",
        userInfo
      };
    } catch (e) {
      testResults.auth = {
        status: "❌ 失败",
        error: e.message
      };
    }

    setResults(testResults);
  };

  const addTestFavorite = () => {
    const testProduct = {
      id: 999,
      name: "测试商品",
      price: 99.99,
      image_url: "/placeholder.jpg",
      favorited_at: new Date().toISOString()
    };

    const favorites = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    favorites.push(testProduct);
    localStorage.setItem("user_favorites", JSON.stringify(favorites));

    alert("已添加测试收藏商品");
    runTests();
  };

  const addTestAddress = () => {
    const testAddress = {
      id: "test-" + Date.now(),
      name: "测试用户",
      phone: "13800138000",
      province: "广东省",
      city: "广州市",
      district: "天河区",
      detail: "测试街道123号",
      isDefault: true
    };

    const addresses = JSON.parse(localStorage.getItem("user_addresses") || "[]");
    addresses.push(testAddress);
    localStorage.setItem("user_addresses", JSON.stringify(addresses));

    alert("已添加测试地址");
    runTests();
  };

  const clearAll = () => {
    localStorage.removeItem("user_favorites");
    localStorage.removeItem("user_addresses");
    alert("已清空所有测试数据");
    runTests();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">功能测试页面</h1>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4">操作按钮</h2>
          <div className="flex gap-4">
            <button
              onClick={addTestFavorite}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加测试收藏
            </button>
            <button
              onClick={addTestAddress}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              添加测试地址
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              清空所有数据
            </button>
            <button
              onClick={runTests}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              重新测试
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 收藏功能测试 */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">
              1. 收藏功能测试 {results.favorites?.status}
            </h2>
            <div className="space-y-2 text-sm">
              <p>收藏数量: {results.favorites?.count || 0}</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.favorites?.data, null, 2)}
              </pre>
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <p className="font-bold">测试步骤：</p>
                <ol className="list-decimal ml-5 mt-2">
                  <li>点击"添加测试收藏"按钮</li>
                  <li>访问 <a href="/shop" className="text-blue-600 underline">/shop</a> 页面</li>
                  <li>点击商品卡片右上角的爱心图标</li>
                  <li>访问 <a href="/profile/favorites" className="text-blue-600 underline">/profile/favorites</a> 查看收藏</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 收货地址测试 */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">
              2. 收货地址测试 {results.addresses?.status}
            </h2>
            <div className="space-y-2 text-sm">
              <p>地址数量: {results.addresses?.count || 0}</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.addresses?.data, null, 2)}
              </pre>
              <div className="mt-4 p-4 bg-green-50 rounded">
                <p className="font-bold">测试步骤：</p>
                <ol className="list-decimal ml-5 mt-2">
                  <li>点击"添加测试地址"按钮</li>
                  <li>访问 <a href="/profile/addresses" className="text-blue-600 underline">/profile/addresses</a> 查看地址</li>
                  <li>添加商品到购物车</li>
                  <li>访问 <a href="/checkout" className="text-blue-600 underline">/checkout</a> 结算页面</li>
                  <li>检查地址是否自动加载</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 登录状态测试 */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">
              3. 登录状态测试 {results.auth?.status}
            </h2>
            <div className="space-y-2 text-sm">
              <p>Token: {results.auth?.token}</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.auth?.userInfo, null, 2)}
              </pre>
              <div className="mt-4 p-4 bg-yellow-50 rounded">
                <p className="font-bold">测试步骤：</p>
                <ol className="list-decimal ml-5 mt-2">
                  <li>访问 <a href="/login" className="text-blue-600 underline">/login</a> 页面</li>
                  <li>点击"忘记密码？"按钮</li>
                  <li>检查是否显示提示信息</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="font-bold">⚠️ 重要提示</p>
          <ul className="list-disc ml-5 mt-2 text-sm">
            <li>如果功能不工作，请打开浏览器开发者工具（F12）查看控制台错误</li>
            <li>确保没有浏览器扩展阻止 localStorage</li>
            <li>尝试在无痕模式下测试</li>
            <li>清除浏览器缓存后重试</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <a
            href="/shop"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            前往商城测试
          </a>
          <a
            href="/profile/addresses"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            前往地址管理
          </a>
          <a
            href="/profile/favorites"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            前往我的收藏
          </a>
        </div>
      </div>
    </div>
  );
}
