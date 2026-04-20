"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebugPage() {
  const [results, setResults] = useState({});
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    addLog("开始系统诊断...", "info");

    // 测试1：localStorage 可用性
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      setResults(prev => ({ ...prev, localStorage: true }));
      addLog("✅ localStorage 可用", "success");
    } catch (e) {
      setResults(prev => ({ ...prev, localStorage: false }));
      addLog("❌ localStorage 不可用: " + e.message, "error");
    }

    // 测试2：检查现有数据
    const addresses = localStorage.getItem("user_addresses");
    const favorites = localStorage.getItem("user_favorites");

    addLog(`地址数据: ${addresses ? JSON.parse(addresses).length + " 条" : "无"}`, "info");
    addLog(`收藏数据: ${favorites ? JSON.parse(favorites).length + " 条" : "无"}`, "info");

    // 测试3：API 连接
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setResults(prev => ({ ...prev, api: true, productCount: data.products?.length || 0 }));
      addLog(`✅ API 正常，商品数: ${data.products?.length || 0}`, "success");
    } catch (e) {
      setResults(prev => ({ ...prev, api: false }));
      addLog("❌ API 连接失败: " + e.message, "error");
    }
  };

  const testForgetPassword = () => {
    addLog("测试忘记密码功能...", "info");
    try {
      const toast = document.createElement("div");
      toast.textContent = "密码重置链接已发送到您的手机";
      toast.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:9999";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
      addLog("✅ 忘记密码提示显示成功", "success");
    } catch (e) {
      addLog("❌ 忘记密码功能错误: " + e.message, "error");
    }
  };

  const testAddAddress = () => {
    addLog("测试添加地址...", "info");
    try {
      const testAddress = {
        id: Date.now(),
        name: "测试用户",
        phone: "13800138000",
        province: "广东省",
        city: "广州市",
        district: "天河区",
        detail: "测试地址",
        isDefault: false
      };

      const existing = JSON.parse(localStorage.getItem("user_addresses") || "[]");
      existing.push(testAddress);
      localStorage.setItem("user_addresses", JSON.stringify(existing));

      addLog(`✅ 地址添加成功，当前共 ${existing.length} 条`, "success");
    } catch (e) {
      addLog("❌ 添加地址失败: " + e.message, "error");
    }
  };

  const testAddFavorite = () => {
    addLog("测试添加收藏...", "info");
    try {
      const testProduct = {
        id: 1,
        name: "测试商品",
        price: 99,
        image: "/placeholder.jpg"
      };

      const existing = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      if (!existing.some(f => f.id === testProduct.id)) {
        existing.push(testProduct);
        localStorage.setItem("user_favorites", JSON.stringify(existing));
        addLog(`✅ 收藏添加成功，当前共 ${existing.length} 条`, "success");
      } else {
        addLog("ℹ️ 该商品已在收藏中", "info");
      }
    } catch (e) {
      addLog("❌ 添加收藏失败: " + e.message, "error");
    }
  };

  const clearAllData = () => {
    if (confirm("确定要清除所有测试数据吗？")) {
      localStorage.removeItem("user_addresses");
      localStorage.removeItem("user_favorites");
      localStorage.removeItem("cart");
      addLog("🗑️ 所有数据已清除", "info");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">系统诊断工具</h1>
          <p className="text-gray-600 mb-6">检测系统功能是否正常工作</p>

          {/* 系统状态 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {results.localStorage ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className="font-semibold">本地存储</span>
              </div>
              <p className="text-sm text-gray-600">
                {results.localStorage ? "正常" : "不可用"}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {results.api ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className="font-semibold">API 连接</span>
              </div>
              <p className="text-sm text-gray-600">
                {results.api ? `${results.productCount} 个商品` : "连接失败"}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-blue-500" size={20} />
                <span className="font-semibold">浏览器</span>
              </div>
              <p className="text-sm text-gray-600">{navigator.userAgent.split(" ").pop()}</p>
            </div>
          </div>

          {/* 功能测试按钮 */}
          <div className="space-y-3 mb-8">
            <h2 className="text-xl font-semibold mb-4">功能测试</h2>

            <button
              onClick={testForgetPassword}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              测试忘记密码提示
            </button>

            <button
              onClick={testAddAddress}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              测试添加收货地址
            </button>

            <button
              onClick={testAddFavorite}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              测试添加收藏
            </button>

            <button
              onClick={clearAllData}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              清除所有测试数据
            </button>
          </div>

          {/* 日志输出 */}
          <div className="border rounded-lg p-4 bg-gray-900 text-gray-100 font-mono text-sm max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">诊断日志</span>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-gray-400 hover:text-white"
              >
                清除
              </button>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-gray-500">[{log.time}]</span>{" "}
                <span className={
                  log.type === "error" ? "text-red-400" :
                  log.type === "success" ? "text-green-400" :
                  "text-gray-300"
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 快速链接 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">快速导航</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/login" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              登录页面
            </a>
            <a href="/shop" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              商城
            </a>
            <a href="/profile/addresses" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              地址管理
            </a>
            <a href="/profile/favorites" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              我的收藏
            </a>
            <a href="/checkout" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              结算页面
            </a>
            <a href="/test-features" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              功能测试
            </a>
            <a href="/admin" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              管理后台
            </a>
            <a href="/" className="border rounded-lg p-3 hover:bg-gray-50 text-center">
              首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
