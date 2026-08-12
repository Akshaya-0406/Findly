"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";
import Button from "@/components/ui/button";
import ItemGrid from "@/components/items/ItemGrid";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import { Item } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    itemsLost: 0,
    itemsFound: 0,
    itemsReturned: 0,
    potentialMatches: 0,
  });
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const dashboardStats = await dbService.getDashboardStats(user.id);
        setStats(dashboardStats);

        const myItems = await dbService.getUserItems(user.id);
        setRecentItems(myItems.slice(0, 4));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <LoadingGrid count={3} columns={3} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen space-y-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-md">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg">
              Manage your active lost and found reports, view statistics, and monitor recent listings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link href="/report/lost">
              <Button variant="secondary" className="gap-1.5 text-xs">
                <PlusCircle className="h-4 w-4" /> Report Lost
              </Button>
            </Link>
            <Link href="/report/found">
              <Button variant="outline" className="gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20">
                <PlusCircle className="h-4 w-4" /> Report Found
              </Button>
            </Link>
          </div>
        </div>

        {/* Real Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Items Lost</span>
              <ClipboardList className="h-5 w-5 text-danger-500" />
            </div>
            <p className="text-3xl font-extrabold text-neutral-900">{stats.itemsLost}</p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Items Found</span>
              <ClipboardCheck className="h-5 w-5 text-accent-500" />
            </div>
            <p className="text-3xl font-extrabold text-neutral-900">{stats.itemsFound}</p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Items Returned</span>
              <CheckCircle2 className="h-5 w-5 text-success-500" />
            </div>
            <p className="text-3xl font-extrabold text-neutral-900">{stats.itemsReturned}</p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Matches</span>
              <Sparkles className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-3xl font-extrabold text-neutral-900">{stats.potentialMatches}</p>
          </div>
        </div>

        {/* Recent Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-neutral-900">Your Recent Listings</h3>
            <Link href="/my-items" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
              View All My Items <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ItemGrid
            items={recentItems}
            emptyTitle="You haven't posted any items yet."
            emptyDescription="Use the quick actions above to report missing or recovered belongings."
          />
        </div>

      </div>
    </div>
  );
}
