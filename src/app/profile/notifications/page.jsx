"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell, BellOff, Check } from "lucide-react";
import ShopNav from "../../../components/ShopNav";
import { getCartCount } from "../../../utils/cart";

export default function NotificationsPage() {
  const [cartCount, setCartCount] = useState(0);
  const [settings, setSettings] = useState({
    orderUpdate: true,
    promotion: true,
    systemNotice: false,
    emailNotify: true,
    smsNotify: false,
  });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCartCount(getCartCount());

    // 检查登录状态
    const token = localStorage.getItem("user_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // 从 localStorage 加载设置
    const saved = localStorage.getItem("notification_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    setIsLoading(false);
  }, []);

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    localStorage.setItem("notification_settings", JSON.stringify(newSettings));
    setToast("设置已保存");
    setTimeout(() => setToast(null), 2000);
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

  const notifications = [
    {
      id: 1,
      title: "订单已发货",
      content: "您的订单 WG1713456789002 已发货，预计2天内送达",
      time: "2小时前",
      read: false,
    },
    {
      id: 2,
      title: "优惠活动",
      content: "春季特惠！精品沃柑限时8折，快来抢购",
      time: "1天前",
      read: true,
    },
    {
      id: 3,
      title: "订单完成",
      content: "订单 WG1713456789001 已完成，期待您的评价",
      time: "3天前",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <a
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          返回个人中心
        </a>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 通知设置 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={20} />
                通知设置
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-900">订单通知</div>
                    <div className="text-xs text-gray-500 mt-1">订单状态更新提醒</div>
                  </div>
                  <button
                    onClick={() => handleToggle("orderUpdate")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.orderUpdate ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.orderUpdate ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-900">促销活动</div>
                    <div className="text-xs text-gray-500 mt-1">优惠信息推送</div>
                  </div>
                  <button
                    onClick={() => handleToggle("promotion")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.promotion ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.promotion ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-900">系统公告</div>
                    <div className="text-xs text-gray-500 mt-1">平台重要通知</div>
                  </div>
                  <button
                    onClick={() => handleToggle("systemNotice")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.systemNotice ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.systemNotice ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-900">邮件通知</div>
                    <div className="text-xs text-gray-500 mt-1">发送到邮箱</div>
                  </div>
                  <button
                    onClick={() => handleToggle("emailNotify")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.emailNotify ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.emailNotify ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">短信通知</div>
                    <div className="text-xs text-gray-500 mt-1">发送到手机</div>
                  </div>
                  <button
                    onClick={() => handleToggle("smsNotify")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.smsNotify ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.smsNotify ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">消息中心</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  全部已读
                </button>
              </div>

              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      notif.read
                        ? "border-gray-100 bg-white"
                        : "border-orange-200 bg-orange-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                        <h3 className="text-sm font-semibold text-gray-900">
                          {notif.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500">{notif.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-4">{notif.content}</p>
                  </div>
                ))}
              </div>

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <BellOff size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无消息</p>
                </div>
              )}
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
