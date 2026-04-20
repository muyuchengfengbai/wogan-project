"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowLeft, MapPin, Phone, User, Calendar, CreditCard } from "lucide-react";
import ShopNav from "../../../components/ShopNav";
import { getCartCount } from "../../../utils/cart";

export default function OrderDetailPage() {
  const { orderNo } = useParams();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderNo],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderNo}`);
      if (!res.ok) throw new Error("加载失败");
      return res.json();
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter']">
        <ShopNav cartCount={cartCount} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter']">
        <ShopNav cartCount={cartCount} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">订单不存在</p>
            <a
              href="/orders"
              className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              返回订单列表
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <a
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            返回订单列表
          </a>
        </div>

        {/* 订单状态 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                订单详情
              </h1>
              <div className="text-sm font-mono text-gray-600">
                订单号：{order.order_no}
              </div>
            </div>
            <span
              className={`text-sm font-medium px-4 py-2 rounded-full ${
                statusColors[order.status]
              }`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        {/* 收货信息 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            收货信息
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-500">收货人：</span>
              <span className="text-gray-900">{order.receiver_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-500">联系电话：</span>
              <span className="text-gray-900">{order.receiver_phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5" />
              <span className="text-gray-500">收货地址：</span>
              <span className="text-gray-900 flex-1">{order.receiver_address}</span>
            </div>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            商品信息
          </h2>
          <div className="space-y-4">
            {data?.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={32} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.product_name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {item.specification} × {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ¥{item.price}
                  </div>
                  <div className="text-xs text-gray-500">
                    小计：¥{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 订单信息 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-500">下单时间：</span>
              <span className="text-gray-900">
                {new Date(order.created_at).toLocaleString("zh-CN")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-gray-500">支付方式：</span>
              <span className="text-gray-900">
                {order.payment_method === "wechat" ? "微信支付" : "支付宝"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-gray-900 font-medium">订单总额</span>
              <span className="text-2xl font-semibold text-gray-900">
                ¥{order.total_amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
