import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Map,
  BarChart3,
  ShieldCheck,
  Bell,
  Search,
  User,
  Store,
} from "lucide-react";

const NavItem = ({ icon: Icon, label, href, active }) => (
  <a
    href={href}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    <Icon size={18} />
    {label}
  </a>
);

export default function AdminLayout({
  children,
  active = "overview",
  title,
  breadcrumb,
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 w-64 border-r border-gray-200 bg-white z-50 p-6 flex flex-col gap-8 transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <a href="/admin" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            W
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            沃柑智慧平台
          </span>
        </a>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
            运营管理
          </div>
          <NavItem
            icon={LayoutDashboard}
            label="数据驾驶舱"
            href="/admin"
            active={active === "overview"}
          />
          <NavItem
            icon={Package}
            label="商品管理"
            href="/admin/products"
            active={active === "products"}
          />
          <NavItem
            icon={ShoppingBag}
            label="订单管理"
            href="/admin/orders"
            active={active === "orders"}
          />
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">
            智慧产业
          </div>
          <NavItem
            icon={Map}
            label="果园监控"
            href="/admin/orchard"
            active={active === "orchard"}
          />
          <NavItem
            icon={ShieldCheck}
            label="质量溯源"
            href="/admin/trace"
            active={active === "trace"}
          />
          <NavItem
            icon={BarChart3}
            label="经营分析"
            href="/admin/analytics"
            active={active === "analytics"}
          />
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">
            前台
          </div>
          <NavItem icon={Store} label="前往商城" href="/shop" active={false} />
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                管理员
              </span>
              <span className="text-xs text-gray-500 font-medium">
                毕设版 2025
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <a href="/admin" className="hover:text-gray-900">
              控制台
            </a>
            {breadcrumb && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{breadcrumb}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="搜索..."
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="flex-1">
          {title && (
            <div className="px-4 sm:px-8 pt-8 pb-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>

        <footer className="mt-auto px-4 sm:px-8 py-6 border-t border-gray-100 text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">
          © 2025 沃柑智慧产销一体化平台
        </footer>
      </main>

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
