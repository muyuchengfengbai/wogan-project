"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Thermometer, Droplets, Sun, Wind, Activity, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminLayout from "../../../components/AdminLayout";

const SensorCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
  status = "正常",
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-lg flex items-center justify-center`}
      >
        <Icon size={18} />
      </div>
      <div className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs inline-flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {status}
      </div>
    </div>
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </div>
    <div className="text-3xl font-semibold text-gray-900">
      {value}
      <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>
    </div>
  </div>
);

export default function AdminOrchardPage() {
  const { data } = useQuery({
    queryKey: ["orchard"],
    queryFn: async () => (await fetch("/api/orchard")).json(),
  });

  const sensor = data?.sensors?.[0];
  const history = data?.history || [];

  return (
    <AdminLayout
      active="orchard"
      breadcrumb="果园监控"
      title="智慧果园监控中心"
    >
      <div className="px-4 sm:px-8 pb-10">
        <p className="text-sm text-gray-500 -mt-3 mb-6">
          实时采集 IoT 传感器数据，智能决策精准灌溉
        </p>

        {/* Sensors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SensorCard
            icon={Thermometer}
            label="空气温度"
            value={sensor?.temperature || "--"}
            unit="°C"
            color="orange"
          />
          <SensorCard
            icon={Droplets}
            label="土壤湿度"
            value={sensor?.soil_moisture || "--"}
            unit="%"
            color="blue"
          />
          <SensorCard
            icon={Sun}
            label="光照强度"
            value={sensor?.light_intensity || "--"}
            unit="Lux"
            color="yellow"
          />
          <SensorCard
            icon={Wind}
            label="空气湿度"
            value={sensor?.humidity || "--"}
            unit="%"
            color="cyan"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  24小时环境趋势
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  温度 / 湿度 / 土壤含水率
                </p>
              </div>
              <Activity size={16} className="text-gray-400" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#EA580C"
                    strokeWidth={2}
                    dot={false}
                    name="温度°C"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="湿度%"
                  />
                  <Line
                    type="monotone"
                    dataKey="soil"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="土壤湿度%"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                AI 智能建议
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              当前决策推荐
            </h3>
            <div className="bg-white/60 rounded-xl p-4 mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                光照充足，土壤湿度低于最佳值 3%，建议启动{" "}
                <strong>2号喷灌区</strong> 进行 20 分钟精准补水。
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                预测未来 6 小时内有阵雨，可暂缓 1 号区域灌溉计划。
              </p>
            </div>
            <button className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-orange-500 transition-colors">
              执行智能方案
            </button>
          </div>
        </div>

        {/* 基地地图占位 */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            基地分布
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "武鸣1号生态园",
                area: "320亩",
                status: "正常",
                color: "bg-green-500",
              },
              {
                name: "武鸣2号基地",
                area: "180亩",
                status: "正常",
                color: "bg-green-500",
              },
              {
                name: "上林有机园",
                area: "120亩",
                status: "采摘中",
                color: "bg-orange-500",
              },
              {
                name: "南宁示范区",
                area: "240亩",
                status: "正常",
                color: "bg-green-500",
              },
            ].map((b, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                  <span className="text-xs text-gray-500">{b.status}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {b.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{b.area}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
