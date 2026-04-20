"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Plus,
  Minus,
  ChevronRight,
  MapPin,
  Shield,
  Truck,
  Leaf,
  Heart,
} from "lucide-react";
import ShopNav from "../../../../components/ShopNav";
import { addToCart, getCartCount } from "../../../../utils/cart";

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [cartCount, setCartCount] = useState(0);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setCartCount(getCartCount());
    const update = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", update);

    // 检查是否已收藏
    const favorites = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setIsFavorited(favorites.some(f => f.id === parseInt(id)));

    return () => window.removeEventListener("cart-updated", update);
  }, [id]);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("加载失败");
      return res.json();
    },
  });

  const product = data?.product;
  const traces = data?.traces || [];

  const handleAddCart = () => {
    addToCart(product, qty);
    setToast(`已加入 ${qty} 件到购物车`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    window.location.href = "/cart";
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("user_favorites") || "[]");

    if (isFavorited) {
      const updated = favorites.filter(f => f.id !== product.id);
      localStorage.setItem("user_favorites", JSON.stringify(updated));
      setIsFavorited(false);
      setToast("已取消收藏");
    } else {
      favorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        grade: product.grade,
        origin: product.origin,
      });
      localStorage.setItem("user_favorites", JSON.stringify(favorites));
      setIsFavorited(true);
      setToast("已添加到收藏");
    }

    setTimeout(() => setToast(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ShopNav cartCount={cartCount} />
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-50 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-50 rounded animate-pulse" />
            <div className="h-4 bg-gray-50 rounded w-2/3 animate-pulse" />
            <div className="h-12 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return <div className="p-10 text-center text-gray-500">商品不存在</div>;

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500 flex items-center gap-2">
        <a href="/shop" className="hover:text-gray-900">
          商城
        </a>
        <ChevronRight size={14} />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-10 grid md:grid-cols-2 gap-10">
        {/* 图片 */}
        <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold text-gray-900">
            {product.grade}
          </div>
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              size={20}
              className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}
            />
          </button>
        </div>

        {/* 信息 */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">¥</span>
              <span className="text-4xl font-semibold text-orange-600">
                {product.price}
              </span>
              <span className="text-sm text-gray-400 ml-1">/kg</span>
            </div>
            <div className="flex gap-6 mt-3 text-xs text-gray-500">
              <span>已售 {product.sales_count || 0}+</span>
              <span>库存 {product.stock_kg} kg</span>
              <span>批次 {product.batch_no || "N/A"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-gray-600">{product.origin}</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg">
              <Leaf size={14} className="text-gray-400" />
              <span className="text-gray-600">
                {product.specification || "标准装"}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg">
              <Truck size={14} className="text-gray-400" />
              <span className="text-gray-600">48h 冷链直达</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg">
              <Shield size={14} className="text-gray-400" />
              <span className="text-gray-600">坏果包赔</span>
            </div>
          </div>

          {/* 数量 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">数量</span>
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-l-full"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-r-full"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleAddCart}
              className="flex-1 bg-white border border-gray-900 text-gray-900 py-3.5 rounded-full text-sm font-medium hover:bg-gray-50 inline-flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              加入购物车
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gray-900 text-white py-3.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>

      {/* 溯源时间轴 */}
      {traces.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-100">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium mb-3">
              <Shield size={12} />
              全程可溯源
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">生长履历</h2>
            <p className="text-gray-500 text-sm mt-1">
              批次号 {product.batch_no || traces[0]?.batch_no}
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
            {traces.map((t, i) => (
              <div key={t.id} className="relative">
                <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-500" />
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {t.action_type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(t.action_date).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{t.detail}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    操作员：{t.operator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
