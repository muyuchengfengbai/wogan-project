"use client";
import React, { useState, useEffect } from "react";
import { User, Package, MapPin, Phone, Mail, ShoppingBag, ArrowLeft, LogOut, Settings, Heart, Bell } from "lucide-react";
import ShopNav from "../../components/ShopNav";
import { getCartCount } from "../../utils/cart";

export default function ProfilePage() {
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCartCount(getCartCount());

    // 检查登录状态
    const token = localStorage.getItem("user_token");
    const userInfo = localStorage.getItem("user_info");

    if (!token || !userInfo) {
      // 未登录，跳转到登录页
      window.location.href = "/login";
      return;
    }

    // 已登录，加载用户信息
    try {
      const userData = JSON.parse(userInfo);
      setUser(userData);
    } catch (error) {
      console.error("解析用户信息失败", error);
      window.location.href = "/login";
      return;
    }

    setIsLoading(false);
  }, []);

  const orders = [
    { id: 1, orderNo: "WG1713456789001", amount: 89.9, status: "已完成", date: "2024-04-01" },
    { id: 2, orderNo: "WG1713456789002", amount: 129.8, status: "配送中", date: "2024-04-03" },
    { id: 3, orderNo: "WG1713456789003", amount: 68.5, status: "待发货", date: "2024-04-05" },
  ];

  const statusColors = {
    "已完成": "text-green-600 bg-green-50",
    "配送中": "text-blue-600 bg-blue-50",
    "待发货": "text-orange-600 bg-orange-50",
    "待支付": "text-gray-600 bg-gray-50",
  };

  const handleLogout = () => {
    // 清除用户数据
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_info");

    // 跳转到登录页
    window.location.href = "/login";
  };

  // 加载中状态
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

  // 未登录状态（理论上不会到这里，因为会被重定向）
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <a
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          返回商城
        </a>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 用户信息卡片 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">普通会员</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{user.address}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {orders.length}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">订单数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">0</div>
                    <div className="text-xs text-gray-500 mt-1">优惠券</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">0</div>
                    <div className="text-xs text-gray-500 mt-1">积分</div>
                  </div>
                </div>
              </div>

              {/* 账户操作 */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                <a
                  href="/profile/settings"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings size={18} className="text-gray-400" />
                  账户设置
                </a>
                <a
                  href="/profile/notifications"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell size={18} className="text-gray-400" />
                  消息通知
                </a>
                <a
                  href="/profile/favorites"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Heart size={18} className="text-gray-400" />
                  我的收藏
                </a>
                <a
                  href="/profile/addresses"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MapPin size={18} className="text-gray-400" />
                  收货地址
                </a>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  退出登录
                </button>
              </div>
            </div>
          </div>

          {/* 订单列表 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  我的订单
                </h3>
                <a
                  href="/orders"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  查看全部
                </a>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="text-sm font-mono text-gray-600">
                          {order.orderNo}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">{order.date}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        ¥{order.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无订单</p>
                  <a
                    href="/shop"
                    className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                  >
                    去购物
                  </a>
                </div>
              )}
            </div>

            {/* 快捷功能 */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a
                href="/cart"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag size={18} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    购物车
                  </div>
                  <div className="text-xs text-gray-500">
                    {cartCount} 件商品
                  </div>
                </div>
              </a>
              <a
                href="/trace"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    扫码溯源
                  </div>
                  <div className="text-xs text-gray-500">查看商品履历</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 退出登录确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              确认退出登录？
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              退出后需要重新登录才能访问个人信息
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
