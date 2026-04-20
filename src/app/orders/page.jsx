"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowLeft, ShoppingBag, Filter } from "lucide-react";
import ShopNav from "../../components/ShopNav";
import { getCartCount } from "../../utils/cart";

export default function OrdersPage() {
  const [cartCount, setCartCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setCartCount(getCartCount());
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: async () => {
      const url = statusFilter === "all"
        ? "/api/orders"
        : `/api/orders?status=${statusFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("加载失败");
      return res.json();
    },
  });

  const statusOptions = [
    { value: "all", label: "全部订单" },
    { value: "pending", label: "待支付" },
    { value: "paid", label: "待发货" },
    { value: "shipped", label: "配送中" },
    { value: "completed", label: "已完成" },
    { value: "cancelled", label: "已取消" },
  ];

  const statusColors = {
    pending: "text-orange-600 bg-orange-50",
    paid: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50",
    completed: "text-green-600 bg-green-50",
    cancelled: "text-gray-600 bg-gray-50",
  };

  const statusLabels = {
    pending: "待支付",
    paid: "待发货",
    shipped: "配送中",
    completed: "已完成",
    cancelled: "已取消",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <a
            href="/profile"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            返回个人中心
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <Package size={24} />
              我的订单
            </h1>
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 订单列表 */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">加载中...</p>
            </div>
          ) : data?.orders?.length > 0 ? (
            <div className="space-y-4">
              {data.orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={20} className="text-gray-400" />
                      <div>
                        <div className="text-sm font-mono text-gray-600">
                          {order.order_no}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleString("zh-CN")}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">收货人：</span>
                      <span className="text-gray-900">{order.receiver_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">联系电话：</span>
                      <span className="text-gray-900">{order.receiver_phone}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-500">收货地址：</span>
                      <span className="text-gray-900">{order.receiver_address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      支付方式：{order.payment_method === "wechat" ? "微信支付" : "支付宝"}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">订单金额</div>
                        <div className="text-xl font-semibold text-gray-900">
                          ¥{order.total_amount}
                        </div>
                      </div>
                      <a
                        href={`/order/${order.order_no}`}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                      >
                        查看详情
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
      </div>
    </div>
  );
}
