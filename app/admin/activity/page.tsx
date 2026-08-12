"use client";

import React, { useState, useEffect } from "react";
import { Activity, Search, Shield, Clock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminActivityLog } from "@/types";
import { dbService } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function AdminActivityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getAdminActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching activity logs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return l.action.toLowerCase().includes(q) || l.targetType.toLowerCase().includes(q);
  });

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Admin Activity Audit Logs</h1>
            <p className="text-xs text-neutral-400">Immutable audit log of administrative actions, user suspensions, and moderation decisions.</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search activity logs by action or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl text-xs text-white focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
        </div>

        {/* Logs Table */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No activity log entries recorded yet.
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary-500/20 text-primary-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {log.targetType}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{log.action}</h4>
                  </div>
                  <p className="text-[11px] text-neutral-400">Target ID: {log.targetId}</p>
                  <p className="text-[10px] text-neutral-500">
                    Logged on {formatDate(log.createdAt)} {log.admin ? `by ${log.admin.name}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
