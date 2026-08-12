"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Flag,
  Package,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Report } from "@/types";
import { dbService } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function ModeratorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadModeratorData = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getReports();
        setReports(data);
        setPendingCount(data.filter((r) => r.status === "pending").length);
      } catch (err) {
        console.error("Error loading moderator reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadModeratorData();
  }, []);

  return (
    <AdminLayout requiredRole="moderator">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" /> Moderator Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Moderator Dashboard
            </h1>
            <p className="text-xs text-neutral-400">
              Review flagged items, resolve reports, and enforce platform safety rules.
            </p>
          </div>

          <Link href="/moderator/reports">
            <Button variant="primary" className="gap-2">
              <Flag className="h-4 w-4" /> Review Queue ({pendingCount})
            </Button>
          </Link>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
              <Flag className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{pendingCount}</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Reported Items</span>
              <Package className="h-5 w-5 text-danger-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {reports.filter((r) => r.itemId).length}
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Reported Users</span>
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {reports.filter((r) => r.reportedUserId).length}
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Resolved Reports</span>
              <CheckCircle2 className="h-5 w-5 text-success-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {reports.filter((r) => r.status === "resolved").length}
            </p>
          </div>
        </div>

        {/* Reports Requiring Attention */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Reports Requiring Attention</h3>
            <Link href="/moderator/reports" className="text-xs font-bold text-primary-400 hover:underline flex items-center gap-1">
              View Full Queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-neutral-500">Loading reports queue...</div>
          ) : reports.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">No active reports found.</div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md">
                        {report.reason}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold uppercase">
                        Target: {report.item ? `Item #${report.item.id.slice(-4)}` : "User"}
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold">
                      {report.item?.title || report.description || "Reported behavior violation"}
                    </p>
                    <p className="text-[10px] text-neutral-500">Reported on {formatDate(report.createdAt)}</p>
                  </div>

                  <Link href="/moderator/reports">
                    <Button variant="outline" size="sm" className="border-neutral-700 text-xs text-neutral-300">
                      Review Report
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
