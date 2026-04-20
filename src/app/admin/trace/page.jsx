"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Search, QrCode, Calendar, User } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";

export default function AdminTracePage() {
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["admin-products-trace"],
    queryFn: async () => (await fetch("/api/products")).json(),
  });

  const products = (data?.products || []).filter(
    (p) => !search || p.batch_no?.includes(search) || p.name?.includes(search),
  );

  return (
    <AdminLayout active="trace" breadcrumb="质量溯源" title="质量溯源管理">
      <div className="px-4 sm:px-8 pb-10">
        <p className="text-sm text-gray-500 -mt-3 mb-6">
          全链路质量追溯，一果一码可查
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              已认证批次
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {products.length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              本月扫码量
            </div>
            <div className="text-2xl font-semibold text-gray-900">1,284</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              平均履历节点
            </div>
            <div className="text-2xl font-semibold text-gray-900">6.2</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-green-600" />
              <span className="text-xs font-medium text-green-700 uppercase tracking-wider">
                认证率
              </span>
            </div>
            <div className="text-2xl font-semibold text-green-600">100%</div>
          </div>
        </div>

        <div className="relative max-w-md mb-6">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索批次号或商品名..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition"
            >
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={p.image_url}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-50"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.origin}</div>
                  <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-2 py-0.5 text-[10px] font-medium mt-2">
                    <ShieldCheck size={10} />
                    已认证
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  批次号
                </div>
                <div className="text-sm font-mono font-semibold text-gray-900">
                  {p.batch_no || "未设置"}
                </div>
              </div>

              <a
                href={p.batch_no ? `/trace/${p.batch_no}` : "#"}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-orange-500 transition"
              >
                <QrCode size={12} />
                查看溯源详情
              </a>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
