"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import ShopNav from "../../../components/ShopNav";
import { getCartCount, addToCart } from "../../../utils/cart";

export default function FavoritesPage() {
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCartCount(getCartCount());
    // 从 localStorage 加载收藏
    const saved = localStorage.getItem("user_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const handleRemove = (id) => {
    const newFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem("user_favorites", JSON.stringify(newFavorites));
    setToast("已取消收藏");
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setCartCount(getCartCount());
    setToast(`已将 ${product.name} 加入购物车`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <ShopNav cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-6 py-8">
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
              <Heart size={24} className="text-red-500" />
              我的收藏
            </h1>
            <div className="text-sm text-gray-500">
              共 {favorites.length} 件商品
            </div>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all"
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
                        handleRemove(product.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Heart size={16} className="text-red-500 fill-red-500" />
                    </button>
                  </a>

                  <div className="p-4">
                    <a href={`/shop/product/${product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 hover:text-orange-500">
                        {product.name}
                      </h3>
                    </a>
                    <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
                    {product.favorited_at && (
                      <div className="text-xs text-gray-400 mb-3">
                        收藏于 {new Date(product.favorited_at).toLocaleDateString('zh-CN')}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400">¥</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {product.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-orange-500 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart size={14} />
                        加入购物车
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">暂无收藏商品</p>
              <a
                href="/shop"
                className="inline-block px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
              >
                去逛逛
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-in { animation: in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
