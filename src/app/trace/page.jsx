"use client";
import React, { useState } from "react";
import { QrCode, Search, ShieldCheck } from "lucide-react";
import ShopNav from "../../components/ShopNav";

export default function TraceEntryPage() {
  const [batch, setBatch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (batch.trim()) {
      window.location.href = `/trace/${batch.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <ShopNav cartCount={0} />

      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium mb-5">
          <ShieldCheck size={12} />
          区块链级可信溯源
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          扫码溯源查询
        </h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          输入商品包装上的批次号，查看从枝头到舌尖的全链路履历
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 flex gap-3 max-w-md mx-auto"
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="例如 WM2025-A001"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-orange-500"
          >
            查询
          </button>
        </form>

        <div className="mt-10 p-8 bg-gray-50 rounded-3xl">
          <QrCode size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xs text-gray-400">
            或使用手机扫描商品包装上的二维码
          </p>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          试试这些批次：
          <button
            onClick={() => {
              setBatch("WM2025-A001");
            }}
            className="text-orange-500 hover:underline ml-2"
          >
            WM2025-A001
          </button>
        </div>
      </div>
    </div>
  );
}
