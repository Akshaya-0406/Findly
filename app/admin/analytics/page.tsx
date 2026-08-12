"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  PieChart,
  Users,
  Package,
  CheckCircle2,
  Flag
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import { AnalyticsData } from "@/types";
import { dbService } from "@/lib/db";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getAnalyticsData(period);
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [period]);

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-xs text-neutral-400">
              Real database aggregation for growth, listings, returns, and category performance.
            </p>
          </div>

          {/* Date Filter Selector */}
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-bold gap-1 shrink-0">
            {["7d", "30d", "90d", "1y", "all"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  period === p ? "bg-primary-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                }`}
              >
                {p === "all" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>

        {isLoading || !analytics ? (
          <div className="py-16 text-center text-xs text-neutral-500">Aggregating database statistics...</div>
        ) : (
          <div className="space-y-8">
            
            {/* Chart Grid Row 1: User Growth & Listings Over Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* User Growth SVG Bar Chart */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-400" /> User Registration Growth
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase">{period}</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                  {analytics.userGrowth.map((pt, idx) => {
                    const maxVal = Math.max(...analytics.userGrowth.map((p) => p.value), 1);
                    const heightPct = Math.round((pt.value / maxVal) * 100);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {pt.value}
                        </span>
                        <div className="w-full bg-neutral-900 rounded-t-xl overflow-hidden h-36 flex items-end">
                          <div
                            className="w-full bg-indigo-600 group-hover:bg-indigo-500 transition-all rounded-t-xl"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500 truncate">{pt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Listings Over Time Bar Chart */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary-400" /> Listings Created
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase">{period}</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                  {analytics.listingsOverTime.map((pt, idx) => {
                    const maxVal = Math.max(...analytics.listingsOverTime.map((p) => p.value), 1);
                    const heightPct = Math.round((pt.value / maxVal) * 100);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {pt.value}
                        </span>
                        <div className="w-full bg-neutral-900 rounded-t-xl overflow-hidden h-36 flex items-end">
                          <div
                            className="w-full bg-primary-600 group-hover:bg-primary-500 transition-all rounded-t-xl"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500 truncate">{pt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Chart Grid Row 2: Lost vs Found Distribution & Top Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Lost vs Found Distribution */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-amber-400" /> Lost vs Found Ratio
                </h3>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-danger-400">Lost Reports</span>
                      <span className="text-white">{analytics.lostVsFound.lost}</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-danger-500 h-full rounded-full"
                        style={{
                          width: `${
                            analytics.lostVsFound.lost + analytics.lostVsFound.found > 0
                              ? (analytics.lostVsFound.lost / (analytics.lostVsFound.lost + analytics.lostVsFound.found)) * 100
                              : 50
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-accent-400">Found Reports</span>
                      <span className="text-white">{analytics.lostVsFound.found}</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-accent-500 h-full rounded-full"
                        style={{
                          width: `${
                            analytics.lostVsFound.lost + analytics.lostVsFound.found > 0
                              ? (analytics.lostVsFound.found / (analytics.lostVsFound.lost + analytics.lostVsFound.found)) * 100
                              : 50
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-success-400" /> Top Reported Categories
                </h3>

                <div className="space-y-3 pt-1">
                  {analytics.topCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-neutral-300">{cat.label}</span>
                        <span className="text-neutral-400 font-bold">{cat.value}%</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-success-500 h-full rounded-full"
                          style={{ width: `${cat.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
