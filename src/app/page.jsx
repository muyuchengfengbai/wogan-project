"use client";
import React from "react";
import {
  Store,
  LayoutDashboard,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Truck,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* Top Banner */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              沃
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              沃柑智慧产销一体化平台
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            平台运行正常
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-orange-50/40 via-white to-yellow-50/40">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 font-medium mb-6">
            <Sparkles size={12} className="text-orange-500" />
            2025 毕业设计项目 · 智慧农业数字化
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
            从枝头到舌尖，
            <br />
            <span className="text-orange-500">每一颗沃柑都有故事</span>
          </h1>
          <p className="text-gray-500 text-base mt-6 max-w-xl mx-auto leading-relaxed">
            集生产监控、电商销售、质量溯源、数据分析于一体的智慧产销平台。 基于
            React + Node.js + PostgreSQL 全栈架构打造。
          </p>

          {/* Single Entry - Shop Only */}
          <div className="mt-12 max-w-md mx-auto">
            <a
              href="/shop"
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 text-left hover:border-orange-400 hover:shadow-lg transition-all overflow-hidden block"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-125 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-5">
                  <Store size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  消费者商城
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  浏览商品、下单购买、扫码溯源。体验完整的 C 端购物闭环。
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                  进入商城{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            平台核心模块
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            覆盖沃柑产销全链路的数字化解决方案
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              icon: Leaf,
              title: "智慧果园",
              desc: "IoT 实时监控",
              href: "/admin/orchard",
              color: "green",
            },
            {
              icon: Store,
              title: "电商销售",
              desc: "完整购物闭环",
              href: "/shop",
              color: "orange",
            },
            {
              icon: ShieldCheck,
              title: "质量溯源",
              desc: "一果一码可查",
              href: "/trace",
              color: "blue",
            },
            {
              icon: BarChart3,
              title: "数据分析",
              desc: "经营决策可视化",
              href: "/admin/analytics",
              color: "purple",
            },
          ].map((f, i) => (
            <a
              key={i}
              href={f.href}
              className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`w-11 h-11 bg-${f.color}-50 text-${f.color}-600 rounded-xl flex items-center justify-center mb-4`}
              >
                <f.icon size={20} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">
                技术架构
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                全栈工程化实践
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                项目采用现代化全栈技术栈，前后端分离，数据库规范化设计，
                支持高并发访问和完整的 DevOps 部署流程。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "前端", value: "React + Tailwind" },
                { label: "后端", value: "Node.js Serverless" },
                { label: "数据库", value: "PostgreSQL" },
                { label: "支付", value: "支付宝沙箱" },
                { label: "测试", value: "Pytest + Selenium" },
                { label: "压测", value: "JMeter" },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                >
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    {t.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">
          <span>
            © 2025 沃柑智慧产销一体化平台 · 毕业设计 2025.03 - 2025.06
          </span>
          <div className="flex gap-4">
            <span>Built with ❤️ on Anything</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          margin: 0;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
}
