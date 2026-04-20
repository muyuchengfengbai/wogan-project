"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, User, X } from "lucide-react";

export default function ShopNav({ cartCount = 0, onSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem("user_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="/shop" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
            沃
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900 hidden sm:block">
            沃柑优选
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="/shop" className="hover:text-gray-900 font-medium">
            全部商品
          </a>
          <a href="/shop?grade=精品果" className="hover:text-gray-900">
            精品果
          </a>
          <a href="/shop?grade=一级果" className="hover:text-gray-900">
            一级果
          </a>
          <a href="/trace" className="hover:text-gray-900">
            扫码溯源
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 hidden sm:block"
          >
            <Search size={18} />
          </button>
          <a
            href="/cart"
            className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <button
            onClick={handleUserClick}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            title={isLoggedIn ? "个人中心" : "登录/注册"}
          >
            <User size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索商品名称、产地..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                搜索
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchValue("");
                  if (onSearch) onSearch("");
                }}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
