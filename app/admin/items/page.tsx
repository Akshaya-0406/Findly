"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Search, Eye, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Item } from "@/types";
import { dbService } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";

export default function AdminItemsPage() {
  const { user: activeAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getItems({
          searchQuery: "",
          category: "",
          city: "",
          location: "",
          date: "",
          sortBy: "newest",
          status: "all",
        });
        setItems(data);
      } catch (err) {
        console.error("Error loading admin items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !activeAdmin) return;
    setIsDeleting(true);
    try {
      await dbService.deleteItem(deleteTarget.id, activeAdmin.id);
      await dbService.logAdminActivity(activeAdmin.id, "Removed item listing", "item", deleteTarget.id, { title: deleteTarget.title });
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchQuery = item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const itemType = item.type || (item.status === "found" ? "found" : "lost");
    const matchType = typeFilter === "all" || itemType === typeFilter;
    return matchQuery && matchType;
  });

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Listing Management</h1>
            <p className="text-xs text-neutral-400">Search across all active and archived lost & found item reports.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search listings by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl text-xs text-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-bold gap-1">
            {["all", "lost", "found"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3.5 py-1.5 rounded-lg capitalize transition-all ${
                  typeFilter === t ? "bg-primary-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading item listings...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No matching item listings found.
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            {filteredItems.map((item) => {
              const itemType = item.type || (item.status === "found" ? "found" : "lost");
              return (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={itemType === "lost" ? "lost" : "found"}>
                        {itemType === "lost" ? "Lost" : "Found"}
                      </Badge>
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-1">{item.category} &bull; {item.location}</p>
                    <p className="text-[10px] text-neutral-500">Reported by {item.reporter.name} on {formatDate(item.date)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/item/${item.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-neutral-300 border border-neutral-800">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-danger-400 hover:bg-danger-900/30 border border-danger-900/40"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Remove Listing?</h3>
              <button onClick={() => setDeleteTarget(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to remove <strong>"{deleteTarget.title}"</strong>?
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-danger-600 hover:bg-danger-700" isLoading={isDeleting} onClick={handleDeleteConfirm}>
                Remove Listing
              </Button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
