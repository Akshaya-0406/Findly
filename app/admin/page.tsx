"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Package,
  FileCheck,
  Flag,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderTree,
  Activity,
  Settings
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import { AdminStats } from "@/types";
import { dbService } from "@/lib/db";

export default function AdminOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    itemsLost: 0,
    itemsFound: 0,
    itemsReturned: 0,
    pendingClaims: 0,
    pendingReports: 0,
    potentialMatches: 0,
    successfulReturns: 0,
    matchSuccessRate: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-xs font-bold text-primary-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Findly Platform Admin
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Admin Overview
            </h1>
            <p className="text-xs text-neutral-400">
              Monitor real database statistics, active users, match metrics, and moderation queues.
            </p>
          </div>

          <Link href="/admin/analytics">
            <Button variant="primary" className="gap-2 text-xs">
              <BarChart3 className="h-4 w-4" /> Full Analytics
            </Button>
          </Link>
        </div>

        {/* Real Metrics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalUsers}</p>
            <p className="text-[10px] text-neutral-500">{stats.activeUsers} active community members</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Listings</span>
              <Package className="h-5 w-5 text-primary-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalListings}</p>
            <p className="text-[10px] text-neutral-500">{stats.itemsLost} Lost &bull; {stats.itemsFound} Found</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Items Returned</span>
              <TrendingUp className="h-5 w-5 text-success-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.itemsReturned}</p>
            <p className="text-[10px] text-neutral-500">{stats.matchSuccessRate}% return success rate</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
              <Flag className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.pendingReports}</p>
            <p className="text-[10px] text-neutral-500">{stats.pendingClaims} claims requiring review</p>
          </div>
        </div>

        {/* Admin Quick Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/users" className="block">
            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-primary-500/50 rounded-2xl space-y-2 transition-all group">
              <Users className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-sm">User Management</h4>
              <p className="text-xs text-neutral-400">Manage user roles, suspensions, and member history.</p>
            </div>
          </Link>

          <Link href="/admin/items" className="block">
            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-primary-500/50 rounded-2xl space-y-2 transition-all group">
              <Package className="h-6 w-6 text-primary-400 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-sm">Listing Moderation</h4>
              <p className="text-xs text-neutral-400">Inspect active lost and found reports.</p>
            </div>
          </Link>

          <Link href="/admin/categories" className="block">
            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-primary-500/50 rounded-2xl space-y-2 transition-all group">
              <FolderTree className="h-6 w-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-sm">Categories</h4>
              <p className="text-xs text-neutral-400">Configure item categories and active status.</p>
            </div>
          </Link>

          <Link href="/admin/activity" className="block">
            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-primary-500/50 rounded-2xl space-y-2 transition-all group">
              <Activity className="h-6 w-6 text-success-400 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-sm">Activity Audit Log</h4>
              <p className="text-xs text-neutral-400">View logged administrative and moderator actions.</p>
            </div>
          </Link>
        </div>

      </div>
    </AdminLayout>
  );
}
