"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ShoppingBag,
  User,
  Thermometer,
  Droplets,
  Sun,
  Box,
  Package,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

const StatCard = ({ label, value, icon: Icon, color = "green", trend }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`w-9 h-9 bg-${color}-50 text-${color}-600 rounded-lg flex items-center justify-center`}
      >
        <Icon size={16} />
      </div>
    </div>
    <div className="text-2xl font-semibold text-gray-900">{value}</div>
    {trend && (
      <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
        <TrendingUp size={10} /> {trend}
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await fetch("/api/analytics")).json(),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders-recent"],
    queryFn: async () => (await fetch("/api/orders")).json(),
  });

  const statusMap = {
    pending: { label: "待支付", color: "bg-orange-500" },
    paid: { label: "已支付", color: "bg-blue-500" },
    shipped: { label: "已发货", color: "bg-purple-500" },
    completed: { label: "已完成", color: "bg-green-500" },
  };

  return (
    <AdminLayout active="overview" breadcrumb="驾驶舱" title="数据驾驶舱">
      <div className="px-4 sm:px-8 pb-10">
        <p className="text-sm text-gray-500 -mt-3 mb-8">实时掌控平台经营全貌</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="今日销售额"
            value={`¥ ${data?.stats?.totalSales?.toLocaleString() || 0}`}
            icon={ArrowUpRight}
            color="green"
            trend="+12.4% 较昨日"
          />
          <StatCard
            label="累计订单"
            value={data?.stats?.totalOrders || 0}
            icon={ShoppingBag}
            color="blue"
            trend="+8 今日新增"
          />
          <StatCard
            label="活跃客户"
            value={data?.stats?.activeUsers || 0}
            icon={User}
            color="orange"
          />
          <StatCard
            label="采摘进度"
            value={`${data?.stats?.harvestProgress || 0}%`}
            icon={Box}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 最近订单 */}
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  最近订单
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">实时成交动态</p>
              </div>
              <a
                href="/admin/orders"
                className="text-xs text-blue-600 hover:underline"
              >
                全部订单 →
              </a>
            </div>
            <div className="space-y-2">
              {ordersData?.orders?.slice(0, 6).map((o) => {
                const s = statusMap[o.status] || statusMap.pending;
                return (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Package size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-mono font-semibold text-gray-900">
                          {o.order_no}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.receiver_name || "匿名"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ¥{o.total_amount}
                      </span>
                      <div className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs inline-flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${s.color}`}
                        />
                        {s.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 果园监控 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                果园环境
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">武鸣1号基地实时</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Thermometer size={16} className="text-orange-600" />
                  <span className="text-sm">温度</span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {data?.sensor?.temperature || "--"}°C
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Droplets size={16} className="text-blue-600" />
                  <span className="text-sm">土壤湿度</span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {data?.sensor?.soil_moisture || "--"}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Sun size={16} className="text-yellow-600" />
                  <span className="text-sm">光照</span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {data?.sensor?.light_intensity || "--"}
                </span>
              </div>
            </div>
            <a
              href="/admin/orchard"
              className="mt-4 block text-center py-2.5 text-xs font-semibold bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              查看完整监控 →
            </a>
          </div>

          {/* 爆款商品 */}
          <div className="xl:col-span-3 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  爆款商品 Top 5
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">按销量排行</p>
              </div>
              <a
                href="/admin/products"
                className="text-xs text-blue-600 hover:underline"
              >
                商品管理 →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {analytics?.topProducts?.map((p, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg">
                  <div className="text-[10px] font-semibold text-orange-500 mb-2">
                    TOP {i + 1}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{p.grade}</div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-lg font-semibold text-orange-600">
                      {p.sales_count}
                    </span>
                    <span className="text-[10px] text-gray-500">已售</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
