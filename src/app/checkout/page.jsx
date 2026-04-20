"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, CreditCard, Check, MapPin, Plus } from "lucide-react";
import ShopNav from "../../components/ShopNav";
import { getCart, clearCart, getCartCount } from "../../utils/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    payment_method: "alipay",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const c = getCart();
    setCart(c);
    setCartCount(getCartCount());
    if (c.length === 0) {
      window.location.href = "/cart";
      return;
    }

    // 加载收货地址
    const savedAddresses = JSON.parse(localStorage.getItem("user_addresses") || "[]");
    setAddresses(savedAddresses);

    // 自动选择默认地址
    const defaultAddr = savedAddresses.find(a => a.isDefault);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
      setForm(prev => ({
        ...prev,
        receiver_name: defaultAddr.name,
        receiver_phone: defaultAddr.phone,
        receiver_address: `${defaultAddr.province} ${defaultAddr.city} ${defaultAddr.district} ${defaultAddr.detail}`,
      }));
    } else if (savedAddresses.length > 0) {
      const firstAddr = savedAddresses[0];
      setSelectedAddressId(firstAddr.id);
      setForm(prev => ({
        ...prev,
        receiver_name: firstAddr.name,
        receiver_phone: firstAddr.phone,
        receiver_address: `${firstAddr.province} ${firstAddr.city} ${firstAddr.district} ${firstAddr.detail}`,
      }));
    } else {
      setShowManualInput(true);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 99 ? 0 : 10;
  const finalTotal = total + shipping;

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setForm({
      ...form,
      receiver_name: addr.name,
      receiver_phone: addr.phone,
      receiver_address: `${addr.province} ${addr.city} ${addr.district} ${addr.detail}`,
    });
    setShowManualInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.receiver_name || !form.receiver_phone || !form.receiver_address) {
      setError("请完整填写收货信息");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("创建订单失败");
      const data = await res.json();
      clearCart();
      // 模拟支付成功
      await fetch(`/api/orders/${data.order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      window.location.href = `/order/success?no=${data.order.order_no}`;
    } catch (err) {
      console.error(err);
      setError(err.message || "下单失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
          <a href="/cart" className="hover:text-gray-900">
            购物车
          </a>
          <ChevronRight size={14} />
          <span className="text-gray-900">确认订单</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-8">
          确认订单
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 收货地址 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900">
                  收货信息
                </h2>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showManualInput ? "选择已保存地址" : "手动输入"}
                  </button>
                )}
              </div>

              {!showManualInput && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-orange-500 bg-orange-50/30"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => handleAddressSelect(addr)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {addr.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {addr.phone}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                              默认
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {addr.province} {addr.city} {addr.district} {addr.detail}
                        </p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <Check size={18} className="text-orange-500 mt-1" />
                      )}
                    </label>
                  ))}
                  <a
                    href="/profile/addresses"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                  >
                    <Plus size={16} />
                    添加新地址
                  </a>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      收货人姓名
                    </label>
                    <input
                      required
                      value={form.receiver_name}
                      onChange={(e) =>
                        setForm({ ...form, receiver_name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="请输入真实姓名"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      联系电话
                    </label>
                    <input
                      required
                      value={form.receiver_phone}
                      onChange={(e) =>
                        setForm({ ...form, receiver_phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="11位手机号"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      详细地址
                    </label>
                    <textarea
                      required
                      value={form.receiver_address}
                      onChange={(e) =>
                        setForm({ ...form, receiver_address: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="省市区街道门牌号"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 商品清单 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-5">
                商品清单
              </h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                  >
                    <img
                      src={item.image_url}
                      className="w-12 h-12 rounded-lg object-cover"
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        x {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 支付方式 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-5">
                支付方式
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "alipay", name: "支付宝沙箱", desc: "毕设模拟环境" },
                  { id: "wechat", name: "微信支付", desc: "扫码支付模拟" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.payment_method === p.id
                        ? "border-orange-500 bg-orange-50/30"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      value={p.id}
                      checked={form.payment_method === p.id}
                      onChange={(e) =>
                        setForm({ ...form, payment_method: e.target.value })
                      }
                      className="hidden"
                    />
                    <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <CreditCard size={14} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-500">{p.desc}</div>
                    </div>
                    {form.payment_method === p.id && (
                      <Check size={16} className="text-orange-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 结算 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-5">
                订单金额
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>商品合计</span>
                  <span>¥{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>运费</span>
                  <span>{shipping === 0 ? "免运费" : `¥${shipping}`}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">应付总额</span>
                  <span className="text-xl font-semibold text-orange-600">
                    ¥{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-gray-900 text-white py-3 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
              >
                {loading ? "提交中..." : `确认支付 ¥${finalTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
