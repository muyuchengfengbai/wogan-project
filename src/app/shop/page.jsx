"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Leaf,
  Award,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
  Heart,
} from "lucide-react";
import ShopNav from "../../components/ShopNav";
import { addToCart, getCartCount } from "../../utils/cart";

export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setCartCount(getCartCount());
    const update = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", update);

    // 加载收藏列表
    const savedFavorites = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setFavorites(savedFavorites);

    return () => window.removeEventListener("cart-updated", update);
  }, []);

  useEffect(() => {
    // 从 URL 读取 grade 参数
    const params = new URLSearchParams(window.location.search);
    const grade = params.get("grade");
    if (grade) {
      setFilter(grade);
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["products", filter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("grade", filter);
      if (searchQuery) params.append("search", searchQuery);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("加载失败");
      return res.json();
    },
  });

  const handleAdd = (product) => {
    addToCart(product, 1);
    setToast(`已将 ${product.name} 加入购物车`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleToggleFavorite = (product) => {
    const isFavorited = favorites.some(f => f.id === product.id);
    let newFavorites;

    if (isFavorited) {
      newFavorites = favorites.filter(f => f.id !== product.id);
      setToast(`已取消收藏 ${product.name}`);
    } else {
      newFavorites = [...favorites, { ...product, favorited_at: new Date().toISOString() }];
      setToast(`已收藏 ${product.name}`);
    }

    setFavorites(newFavorites);
    localStorage.setItem("user_favorites", JSON.stringify(newFavorites));
    setTimeout(() => setToast(null), 2000);
  };

  const isFavorited = (productId) => {
    return favorites.some(f => f.id === productId);
  };

  const filters = [
    { id: "all", label: "全部商品" },
    { id: "精品果", label: "精品果" },
    { id: "一级果", label: "一级果" },
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <ShopNav cartCount={cartCount} onSearch={setSearchQuery} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 font-medium w-fit">
              <Sparkles size={12} className="text-orange-500" />
              2025 春季头茬沃柑 · 直采直发
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
              来自广西武鸣的
              <br />
              <span className="text-orange-500">阳光与甜蜜</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              北纬 23°黄金产区，糖度 14 度+，每一颗沃柑都可溯源到枝头。
              从采摘到送达，全程冷链不超过 48 小时。
            </p>
            <div className="flex gap-3">
              <a
                href="#products"
                className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                立即选购 <ArrowRight size={16} />
              </a>
              <a
                href="/trace"
                className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                扫码溯源
              </a>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="w-full h-[420px] bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 rounded-3xl border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Leaf size={64} className="text-orange-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-700">广西武鸣沃柑</div>
                <div className="text-sm text-gray-500 mt-2">新鲜直达 · 品质保证</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf size={18} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">生态认证</div>
                <div className="text-sm font-semibold text-gray-900">
                  有机种植基地
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Award, title: "精选品质", desc: "糖度14度+" },
          { icon: Leaf, title: "产地直采", desc: "武鸣核心产区" },
          { icon: Truck, title: "48h冷链", desc: "全国极速达" },
          { icon: Sparkles, title: "全程溯源", desc: "一果一码" },
        ].map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <f.icon size={18} className="text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {f.title}
              </div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Product Grid */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              精选好柑
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              共 {data?.products?.length || 0} 款商品
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.products?.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all flex flex-col"
              >
                <a
                  href={`/shop/product/${product.id}`}
                  className="block relative aspect-square overflow-hidden bg-gray-50"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-full px-2 py-1 text-[10px] font-semibold text-gray-900">
                    {product.grade}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleFavorite(product);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      size={16}
                      className={isFavorited(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                    />
                  </button>
                </a>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <a href={`/shop/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-orange-500">
                      {product.name}
                    </h3>
                  </a>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {product.origin}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star
                      size={12}
                      className="fill-orange-400 text-orange-400"
                    />
                    <span>已售 {product.sales_count || 0}+</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-2">
                    <div>
                      <span className="text-xs text-gray-400">¥</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {product.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAdd(product)}
                      className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}

      <footer className="mt-20 border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        © 2025 沃柑智慧产销一体化平台 · 毕业设计项目
      </footer>

      <style jsx global>{`
        @keyframes in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-in { animation: in 0.3s ease-out; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
