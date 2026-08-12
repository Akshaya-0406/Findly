"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Calendar, MapPin, Database, LogOut, Package, CheckCircle2, ClipboardList, ClipboardCheck } from "lucide-react";
import Button from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isSupabase, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    lostReports: 0,
    foundReports: 0,
    returnedItems: 0,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/profile");
      return;
    }

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const userStats = await dbService.getUserStats(user.id);
        setStats(userStats);
      } catch (err) {
        console.error("Error loading user profile stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="py-12 bg-neutral-50 min-h-screen text-center text-sm text-neutral-400">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center font-bold text-primary-700 text-2xl shrink-0 shadow-inner">
            {getInitials(user.name)}
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900">{user.name}</h1>
              <p className="text-xs text-neutral-400 font-medium">Findly Community Member</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-neutral-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <span>Joined {user.memberSince}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <span>Chennai, India</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-full text-[11px] font-bold text-neutral-500">
              <Database className="h-3.5 w-3.5" />
              <span>Database Mode: {isSupabase ? "Supabase Live" : "Demo Storage"}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-danger-200 text-danger-600 hover:bg-danger-50 hover:text-danger-700 gap-2 font-semibold"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Profile Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-neutral-900">Your Activity Statistics</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold uppercase tracking-wider">Lost Reports</span>
                <ClipboardList className="h-5 w-5 text-danger-500" />
              </div>
              <p className="text-3xl font-extrabold text-neutral-900">{stats.lostReports}</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold uppercase tracking-wider">Found Reports</span>
                <ClipboardCheck className="h-5 w-5 text-accent-500" />
              </div>
              <p className="text-3xl font-extrabold text-neutral-900">{stats.foundReports}</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold uppercase tracking-wider">Returned Items</span>
                <CheckCircle2 className="h-5 w-5 text-success-500" />
              </div>
              <p className="text-3xl font-extrabold text-neutral-900">{stats.returnedItems}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
