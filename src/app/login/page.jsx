"use client";
import React, { useState } from "react";
import { User, Lock, Mail, Phone, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    email: "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // 登录逻辑
      if (!formData.phone || !formData.password) {
        setToast("请填写完整信息");
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // 模拟登录成功
      const userData = {
        name: "张三",
        phone: formData.phone,
        email: "zhangsan@example.com",
        address: "广东省广州市天河区XX街道XX号",
        token: "mock_token_" + Date.now(),
      };

      localStorage.setItem("user_token", userData.token);
      localStorage.setItem("user_info", JSON.stringify(userData));

      setToast("登录成功");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } else {
      // 注册逻辑
      if (!formData.phone || !formData.password || !formData.name) {
        setToast("请填写完整信息");
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // 模拟注册成功
      const userData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        address: "",
        token: "mock_token_" + Date.now(),
      };

      localStorage.setItem("user_token", userData.token);
      localStorage.setItem("user_info", JSON.stringify(userData));

      setToast("注册成功");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 font-['Inter'] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          返回首页
        </a>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              沃
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isLogin ? "欢迎回来" : "创建账户"}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin ? "登录沃柑优选商城" : "注册沃柑优选商城账户"}
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的姓名"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱（可选）
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入邮箱"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded" />
                  记住我
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setToast("密码重置链接已发送到您的手机");
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="text-orange-500 hover:text-orange-600"
                >
                  忘记密码？
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {isLogin ? "登录" : "注册"}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "还没有账户？" : "已有账户？"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-500 hover:text-orange-600 font-medium ml-1"
            >
              {isLogin ? "立即注册" : "立即登录"}
            </button>
          </div>

          {/* 第三方登录 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center mb-4">
              或使用第三方账号登录
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                微信
              </button>
              <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                支付宝
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          登录即表示同意
          <a href="#" className="text-orange-500 hover:text-orange-600">
            用户协议
          </a>
          和
          <a href="#" className="text-orange-500 hover:text-orange-600">
            隐私政策
          </a>
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes in {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-in {
          animation: in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
