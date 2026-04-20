"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import ShopNav from "../../../components/ShopNav";

export default function TraceDetailPage({ params }) {
  const { batch } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ["trace", batch],
    queryFn: async () => {
      const res = await fetch(`/api/trace/${batch}`);
      if (!res.ok) throw new Error("未找到该批次");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={0} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
          <a href="/trace" className="hover:text-gray-900">
            溯源查询
          </a>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-mono">{batch}</span>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-400">
            查询中...
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="text-gray-500">未找到该批次 {batch}</p>
            <a
              href="/trace"
              className="text-orange-500 text-sm mt-3 inline-block"
            >
              返回重新查询
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
              <div className="flex items-center gap-5">
                <img
                  src={data.product.image_url}
                  className="w-24 h-24 rounded-2xl object-cover bg-gray-50"
                  alt=""
                />
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 rounded-full px-2.5 py-1 text-xs font-medium mb-2">
                    <ShieldCheck size={12} />
                    已认证
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {data.product.product_name}
                  </h1>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} />
                    {data.product.origin}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    批次 {batch}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-6">
                全链路履历
              </h2>
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-5">
                {data.traces.map((t, i) => (
                  <div key={t.id} className="relative">
                    <div
                      className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-white border-2 ${
                        i === data.traces.length - 1
                          ? "border-orange-500 ring-4 ring-orange-100"
                          : "border-gray-300"
                      }`}
                    />
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {t.action_type}
                        </span>
                        <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(t.action_date).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {t.detail}
                      </p>
                      <div className="text-xs text-gray-400 mt-2 inline-flex items-center gap-1">
                        <User size={10} />
                        {t.operator}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
