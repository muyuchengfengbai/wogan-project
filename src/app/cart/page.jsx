"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import ShopNav from "../../components/ShopNav";
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartCount,
} from "../../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCart(getCart());
    setCartCount(getCartCount());
    const update = () => {
      setCart(getCart());
      setCartCount(getCartCount());
    };
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 99 ? 0 : 10;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
          购物车
        </h1>
        <p className="text-sm text-gray-500 mb-8">共 {cartCount} 件商品</p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              购物车是空的
            </h3>
            <p className="text-sm text-gray-500 mb-6">去选购一些美味沃柑吧</p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800"
            >
              开始购物 <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 商品列表 */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
                        {item.grade}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.specification}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-orange-600 mt-2">
                      ¥{item.price}/kg
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-full"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-full"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="hidden sm:block text-right min-w-[70px]">
                    <div className="text-sm font-semibold text-gray-900">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 text-gray-400 hover:text-red-500 flex items-center justify-center rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* 结算 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h2 className="text-base font-semibold text-gray-900 mb-5">
                  订单摘要
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>商品合计</span>
                    <span>¥{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>运费</span>
                    <span>
                      {shipping === 0 ? "免运费" : `¥${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {total < 99 && (
                    <div className="text-xs text-orange-600 bg-orange-50 rounded-lg p-2">
                      再买 ¥{(99 - total).toFixed(2)} 即可免运费
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">
                      应付总额
                    </span>
                    <span className="text-xl font-semibold text-orange-600">
                      ¥{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <a
                  href="/checkout"
                  className="mt-6 block w-full bg-gray-900 text-white text-center py-3 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
                >
                  去结算
                </a>
                <p className="mt-3 text-[10px] text-gray-400 text-center">
                  支持 支付宝沙箱 / 微信模拟支付
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
