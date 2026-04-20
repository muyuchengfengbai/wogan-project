"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, Mail, MapPin, Save, Camera } from "lucide-react";
import ShopNav from "../../../components/ShopNav";
import { getCartCount } from "../../../utils/cart";

export default function SettingsPage() {
  const [cartCount, setCartCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [phoneForm, setPhoneForm] = useState({
    newPhone: "",
    verifyCode: "",
  });

  useEffect(() => {
    setCartCount(getCartCount());

    // 检查登录状态
    const token = localStorage.getItem("user_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // 加载用户信息
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          address: userData.address || "",
        });
      } catch (error) {
        console.error("解析用户信息失败", error);
      }
    }

    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 更新 localStorage 中的用户信息
    const currentUserInfo = localStorage.getItem("user_info");
    if (currentUserInfo) {
      try {
        const userData = JSON.parse(currentUserInfo);
        const updatedData = {
          ...userData,
          ...formData,
        };
        localStorage.setItem("user_info", JSON.stringify(updatedData));
        setToast("保存成功");
        setTimeout(() => setToast(null), 2000);
      } catch (error) {
        console.error("保存失败", error);
        setToast("保存失败");
        setTimeout(() => setToast(null), 2000);
      }
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast("两次输入的密码不一致");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setToast("密码长度至少6位");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // 更新密码
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      userData.password = passwordForm.newPassword;
      localStorage.setItem("user_info", JSON.stringify(userData));
      setToast("密码修改成功");
      setTimeout(() => setToast(null), 2000);
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handlePhoneChange = (e) => {
    e.preventDefault();

    if (!/^1[3-9]\d{9}$/.test(phoneForm.newPhone)) {
      setToast("请输入正确的手机号");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // 更新手机号
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      userData.phone = phoneForm.newPhone;
      localStorage.setItem("user_info", JSON.stringify(userData));
      setFormData({ ...formData, phone: phoneForm.newPhone });
      setToast("手机号修改成功");
      setTimeout(() => setToast(null), 2000);
      setShowPhoneModal(false);
      setPhoneForm({ newPhone: "", verifyCode: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter']">
        <ShopNav cartCount={cartCount} />
        <div className="flex items-center justify-center h-screen">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <a
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          返回个人中心
        </a>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">账户设置</h1>

          {/* 头像设置 */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">头像</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <Camera size={16} />
                更换头像
              </button>
            </div>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                手机号
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                邮箱
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                收货地址
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                保存修改
              </button>
              <a
                href="/profile"
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </a>
            </div>
          </form>
        </div>

        {/* 安全设置 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">安全设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">登录密码</div>
                <div className="text-xs text-gray-500 mt-1">定期修改密码保护账户安全</div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                修改
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-gray-900">手机验证</div>
                <div className="text-xs text-gray-500 mt-1">已绑定手机 {formData.phone}</div>
              </div>
              <button
                onClick={() => setShowPhoneModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                更换
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  原密码
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  确认修改
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 更换手机号弹窗 */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">更换手机号</h3>
            <form onSubmit={handlePhoneChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新手机号
                </label>
                <input
                  type="tel"
                  value={phoneForm.newPhone}
                  onChange={(e) => setPhoneForm({ ...phoneForm, newPhone: e.target.value })}
                  placeholder="请输入新手机号"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneForm.verifyCode}
                    onChange={(e) => setPhoneForm({ ...phoneForm, verifyCode: e.target.value })}
                    placeholder="请输入验证码"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                  <button
                    type="button"
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    获取验证码
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  确认更换
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPhoneModal(false);
                    setPhoneForm({ newPhone: "", verifyCode: "" });
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-in { animation: in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
