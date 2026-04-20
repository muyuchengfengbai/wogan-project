"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Check } from "lucide-react";
import ShopNav from "../../../components/ShopNav";
import { getCartCount } from "../../../utils/cart";

export default function AddressesPage() {
  const [cartCount, setCartCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: "",
    isDefault: false,
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCartCount(getCartCount());
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    const saved = localStorage.getItem("user_addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    } else {
      // 初始化一个默认地址
      const defaultAddress = [
        {
          id: 1,
          name: "张三",
          phone: "13800138888",
          province: "广东省",
          city: "广州市",
          district: "天河区",
          detail: "XX街道XX号",
          isDefault: true,
        },
      ];
      setAddresses(defaultAddress);
      localStorage.setItem("user_addresses", JSON.stringify(defaultAddress));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // 编辑地址
      const updated = addresses.map((addr) =>
        addr.id === editingId ? { ...formData, id: editingId } : addr
      );

      // 如果设置为默认，取消其他默认地址
      if (formData.isDefault) {
        updated.forEach((addr) => {
          if (addr.id !== editingId) addr.isDefault = false;
        });
      }

      setAddresses(updated);
      localStorage.setItem("user_addresses", JSON.stringify(updated));
      setToast("地址已更新");
    } else {
      // 新增地址
      const newAddress = {
        ...formData,
        id: Date.now(),
      };

      let updated = [...addresses, newAddress];

      // 如果设置为默认，取消其他默认地址
      if (formData.isDefault) {
        updated = updated.map((addr) =>
          addr.id === newAddress.id ? addr : { ...addr, isDefault: false }
        );
      }

      setAddresses(updated);
      localStorage.setItem("user_addresses", JSON.stringify(updated));
      setToast("地址已添加");
    }

    resetForm();
    setTimeout(() => setToast(null), 2000);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("确定要删除这个地址吗？")) {
      const updated = addresses.filter((addr) => addr.id !== id);
      setAddresses(updated);
      localStorage.setItem("user_addresses", JSON.stringify(updated));
      setToast("地址已删除");
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem("user_addresses", JSON.stringify(updated));
    setToast("已设为默认地址");
    setTimeout(() => setToast(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

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

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={24} />
              收货地址
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              新增地址
            </button>
          </div>

          {/* 地址列表 */}
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-xl p-5 transition-all ${
                    address.isDefault
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-base font-semibold text-gray-900">
                          {address.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {address.phone}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            默认
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {address.province} {address.city} {address.district}{" "}
                        {address.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1"
                      >
                        <Check size={14} />
                        设为默认
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">暂无收货地址</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
                添加地址
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 地址表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingId ? "编辑地址" : "新增地址"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    收货人
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入姓名"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入手机号"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    省份
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="省份"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    城市
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="城市"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    区县
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="区县"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细地址
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="街道、门牌号等详细信息"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  设为默认地址
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingId ? "保存修改" : "添加地址"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes in {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-in {
          animation: in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
