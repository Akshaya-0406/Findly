"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { DBClaim, dbService } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function AdminClaimsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [claims, setClaims] = useState<DBClaim[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getClaimsByUser("all");
        setClaims(data);
      } catch (err) {
        console.error("Error fetching claims:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const filteredClaims = claims.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Claim Management</h1>
            <p className="text-xs text-neutral-400">Review ownership claims submitted by community members.</p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-bold gap-1 w-fit">
          {["all", "pending", "approved", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === st ? "bg-primary-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Claims Table */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading claim records...</div>
        ) : filteredClaims.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No claims found matching this status filter.
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Claim #{claim.id.slice(-6)}</span>
                    <Badge variant={claim.status === "approved" ? "success" : claim.status === "rejected" ? "danger" : "warning"}>
                      {claim.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400">&quot;{claim.description}&quot;</p>
                  <p className="text-[10px] text-neutral-500">Submitted on {formatDate(claim.created_at)}</p>
                </div>

                <Link href={`/item/${claim.item_id}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-neutral-300 border border-neutral-800">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Item
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
