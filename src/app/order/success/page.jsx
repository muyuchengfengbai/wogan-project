"use client";
import React from "react";
import { Check, Package, ArrowRight, QrCode } from "lucide-react";
import ShopNav from "../../../components/ShopNav";

export default function OrderSuccessPage() {
  const [orderNo, setOrderNo] = React.useState("");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNo(params.get("no") || "");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={0} />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full mx-auto flex items-center justify-center mb-6">
            <Check size={32} className="text-green-600" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            支付成功
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            您的沃柑正从武鸣果园发往您家
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">订单编号</span>
              <span className="font-mono font-semibold text-gray-900">
                {orderNo}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">预计到达</span>
              <span className="text-gray-900">48 小时内</span>
            </div>
          </div>

          {/* 溯源提示 */}
          <div className="mt-6 p-5 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/30 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
              <QrCode size={28} className="text-orange-500" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-gray-900">
                扫码溯源，吃得放心
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                商品包装内附带专属溯源码，可查看完整生长履历
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/shop"
              className="block w-full py-3 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              继续购物
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
