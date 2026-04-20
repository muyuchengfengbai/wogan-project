"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";

const COLORS = ["#EA580C", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export default function AdminAnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await fetch("/api/analytics")).json(),
  });

  const salesData = (data?.salesByDay || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    }),
    sales: Number(d.sales),
    orders: Number(d.orders),
  }));

  const statusData = (data?.statusCount || []).map((s) => ({
    name:
      {
        pending: "待支付",
        paid: "已支付",
        shipped: "已发货",
        completed: "已完成",
      }[s.status] || s.status,
    value: Number(s.count),
  }));

  const topProducts = (data?.topProducts || []).map((p) => ({
    name: p.name.length > 8 ? p.name.slice(0, 8) + "..." : p.name,
    sales: Number(p.sales_count),
  }));

  return (
    <AdminLayout active="analytics" breadcrumb="经营分析" title="经营分析">
      <div className="px-4 sm:px-8 pb-10">
        <p className="text-sm text-gray-500 -mt-3 mb-8">
          数据驱动的销售洞察与趋势分析
        </p>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "7日销售额",
              value: `¥ ${salesData.reduce((s, d) => s + d.sales, 0).toFixed(0)}`,
              icon: DollarSign,
              color: "green",
            },
            {
              label: "7日订单数",
              value: salesData.reduce((s, d) => s + d.orders, 0),
              icon: ShoppingBag,
              color: "blue",
            },
            {
              label: "客单价",
              value: "¥ 128",
              icon: TrendingUp,
              color: "orange",
            },
            { label: "复购率", value: "32.4%", icon: Users, color: "purple" },
          ].map((k, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {k.label}
                </span>
                <div
                  className={`w-9 h-9 bg-${k.color}-50 text-${k.color}-600 rounded-lg flex items-center justify-center`}
                >
                  <k.icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {k.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              销售趋势
            </h3>
            <p className="text-xs text-gray-500 mb-5">近 7 日</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#EA580C"
                    strokeWidth={2}
                    fill="url(#gradSales)"
                    name="销售额"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Pie */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              订单状态分布
            </h3>
            <p className="text-xs text-gray-500 mb-5">当前所有订单</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            商品销量排行
          </h3>
          <p className="text-xs text-gray-500 mb-5">Top 5 最畅销商品</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sales" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
