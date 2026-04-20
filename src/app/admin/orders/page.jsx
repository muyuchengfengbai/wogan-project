"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Truck, Check } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      return res.json();
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const statusMap = {
    pending: {
      label: "待支付",
      color: "bg-orange-500",
      next: "paid",
      nextLabel: "确认收款",
    },
    paid: {
      label: "已支付",
      color: "bg-blue-500",
      next: "shipped",
      nextLabel: "发货",
    },
    shipped: {
      label: "已发货",
      color: "bg-purple-500",
      next: "completed",
      nextLabel: "完成",
    },
    completed: { label: "已完成", color: "bg-green-500", next: null },
  };

  const tabs = [
    { id: "all", label: "全部" },
    { id: "pending", label: "待支付" },
    { id: "paid", label: "已支付" },
    { id: "shipped", label: "已发货" },
    { id: "completed", label: "已完成" },
  ];

  return (
    <AdminLayout active="orders" breadcrumb="订单管理" title="订单管理">
      <div className="px-4 sm:px-8 pb-10">
        <p className="text-sm text-gray-500 -mt-3 mb-6">
          处理订单流转，跟踪配送进度
        </p>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-4 pb-3 text-sm whitespace-nowrap transition-all ${
                statusFilter === t.id
                  ? "text-gray-900 font-semibold border-b-2 border-blue-600 -mb-[1px]"
                  : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  订单号
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  收货人
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  地址
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  支付方式
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((o) => {
                const s = statusMap[o.status] || statusMap.pending;
                return (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3">
                      <div className="font-mono font-semibold text-gray-900">
                        {o.order_no}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(o.created_at).toLocaleString("zh-CN")}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-900">
                      {o.receiver_name || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-xs truncate">
                      {o.receiver_address || "-"}
                    </td>
                    <td className="px-5 py-3 font-semibold text-orange-600">
                      ¥{o.total_amount}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-gray-50 px-2 py-1 rounded">
                        {o.payment_method === "alipay" ? "支付宝" : "微信"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs inline-flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${s.color}`}
                        />
                        {s.label}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {s.next && (
                        <button
                          onClick={() =>
                            statusMutation.mutate({ id: o.id, status: s.next })
                          }
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-100"
                        >
                          {s.nextLabel}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
