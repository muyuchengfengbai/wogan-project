"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    grade: "精品果",
    price: "",
    stock_kg: "",
    origin: "",
    description: "",
    image_url: "",
    specification: "",
    batch_no: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search],
    queryFn: async () => {
      const res = await fetch(`/api/products?search=${search}`);
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const url = editing ? `/api/products/${editing.id}` : `/api/products`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowModal(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      grade: "精品果",
      price: "",
      stock_kg: "",
      origin: "",
      description: "",
      image_url: "",
      specification: "",
      batch_no: "",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      grade: p.grade || "精品果",
      price: p.price || "",
      stock_kg: p.stock_kg || "",
      origin: p.origin || "",
      description: p.description || "",
      image_url: p.image_url || "",
      specification: p.specification || "",
      batch_no: p.batch_no || "",
    });
    setShowModal(true);
  };

  const submit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      price: parseFloat(form.price) || 0,
      stock_kg: parseInt(form.stock_kg) || 0,
    });
  };

  return (
    <AdminLayout active="products" breadcrumb="商品管理" title="商品管理">
      <div className="px-4 sm:px-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-gray-500">管理平台所有沃柑商品</p>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索商品..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
              />
            </div>
            <button
              onClick={openNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={14} /> 新建商品
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  商品
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  等级
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  库存
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  销量
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  批次
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                        alt=""
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500">{p.origin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs font-medium">
                      {p.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-orange-600">
                    ¥{p.price}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.stock_kg} kg</td>
                  <td className="px-5 py-3 text-gray-600">
                    {p.sales_count || 0}
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">
                    {p.batch_no || "-"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`删除 ${p.name}？`))
                          deleteMutation.mutate(p.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && data?.products?.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-10 text-center text-gray-400 text-sm"
                  >
                    暂无商品
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? "编辑商品" : "新建商品"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-50 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1.5">
                    商品名称
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    等级
                  </label>
                  <select
                    value={form.grade}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>精品果</option>
                    <option>一级果</option>
                    <option>普通果</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    价格 (元/kg)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    库存 (kg)
                  </label>
                  <input
                    type="number"
                    value={form.stock_kg}
                    onChange={(e) =>
                      setForm({ ...form, stock_kg: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    产地
                  </label>
                  <input
                    value={form.origin}
                    onChange={(e) =>
                      setForm({ ...form, origin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    规格
                  </label>
                  <input
                    value={form.specification}
                    onChange={(e) =>
                      setForm({ ...form, specification: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    批次号
                  </label>
                  <input
                    value={form.batch_no}
                    onChange={(e) =>
                      setForm({ ...form, batch_no: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1.5">
                    商品图片
                  </label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.url) {
                            setForm({ ...form, image_url: data.url });
                          }
                        } catch (err) {
                          alert("上传失败");
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {form.image_url && (
                      <img
                        src={form.image_url}
                        alt="预览"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="或直接输入图片 URL"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1.5">
                    描述
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saveMutation.isPending ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
