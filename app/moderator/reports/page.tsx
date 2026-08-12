"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flag,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  Eye,
  AlertTriangle,
  X,
  UserCheck
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Report } from "@/types";
import { dbService } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";

export default function ModerationQueuePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [statusTab, setStatusTab] = useState<string>("pending");

  // Action Modals State
  const [actionTarget, setActionTarget] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"keep" | "remove" | "suspend" | "dismiss" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getReports(statusTab);
        setReports(data);
      } catch (err) {
        console.error("Error fetching moderation reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [statusTab]);

  const handleActionConfirm = async () => {
    if (!actionTarget || !actionType || !user) return;
    setIsProcessing(true);

    try {
      if (actionType === "remove" && actionTarget.itemId) {
        await dbService.deleteItem(actionTarget.itemId, actionTarget.reporterId);
        await dbService.updateReportStatus(actionTarget.id, "resolved", user.id);
        await dbService.logAdminActivity(user.id, "Removed reported item", "item", actionTarget.itemId);
      } else if (actionType === "suspend" && actionTarget.reportedUserId) {
        await dbService.setUserSuspension(actionTarget.reportedUserId, true, actionTarget.reason, user.id);
        await dbService.updateReportStatus(actionTarget.id, "resolved", user.id);
      } else if (actionType === "dismiss") {
        await dbService.updateReportStatus(actionTarget.id, "dismissed", user.id);
        await dbService.logAdminActivity(user.id, "Dismissed report", "report", actionTarget.id);
      } else if (actionType === "keep") {
        await dbService.updateReportStatus(actionTarget.id, "resolved", user.id);
      }

      setReports((prev) => prev.filter((r) => r.id !== actionTarget.id));
      setActionTarget(null);
      setActionType(null);
    } catch (err) {
      console.error("Error processing moderation action:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout requiredRole="moderator">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Moderation Queue</h1>
            <p className="text-xs text-neutral-400">Review reported items and users requiring moderation attention.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-950 p-1 rounded-xl w-fit border border-neutral-800 gap-1">
          {["pending", "under_review", "resolved", "dismissed", "all"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                statusTab === tab ? "bg-primary-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Queue Table */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading moderation queue...</div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No reports found in this status queue.
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            {reports.map((report) => (
              <div key={report.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      Reason: {report.reason}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-semibold uppercase">
                      Status: {report.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate">
                    {report.item ? `Listing: "${report.item.title}"` : "User Account Report"}
                  </h4>

                  {report.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2">{report.description}</p>
                  )}

                  <div className="text-[10px] text-neutral-500 font-medium">
                    Reported on {formatDate(report.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {report.item && (
                    <Link href={`/item/${report.item.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-neutral-300 border border-neutral-800">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Listing
                      </Button>
                    </Link>
                  )}

                  {report.status === "pending" && (
                    <>
                      {report.itemId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-danger-400 hover:bg-danger-900/30 border border-danger-900/40"
                          onClick={() => {
                            setActionTarget(report);
                            setActionType("remove");
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Item
                        </Button>
                      )}

                      {report.reportedUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-danger-400 hover:bg-danger-900/30 border border-danger-900/40"
                          onClick={() => {
                            setActionTarget(report);
                            setActionType("suspend");
                          }}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" /> Suspend User
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-neutral-400 hover:text-white border border-neutral-800"
                        onClick={() => {
                          setActionTarget(report);
                          setActionType("dismiss");
                        }}
                      >
                        Dismiss Report
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {actionTarget && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white capitalize">{actionType} Action</h3>
              <button onClick={() => setActionTarget(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to <strong>{actionType}</strong> this reported {actionTarget.itemId ? "item listing" : "user report"}?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setActionTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-danger-600 hover:bg-danger-700"
                isLoading={isProcessing}
                onClick={handleActionConfirm}
              >
                Confirm Action
              </Button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
