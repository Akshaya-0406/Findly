"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Calendar,
  MapPin
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { Item } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function MyItemsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Action Modals State
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [returnedTarget, setReturnedTarget] = useState<Item | null>(null);
  const [isMarkingReturned, setIsMarkingReturned] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/my-items");
      return;
    }

    const fetchMyItems = async () => {
      setIsLoading(true);
      try {
        const myItems = await dbService.getUserItems(user.id, activeTab);
        setItems(myItems);
      } catch (err) {
        console.error("Error fetching my items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyItems();
  }, [user, authLoading, activeTab, router]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !user) return;
    setIsDeleting(true);
    try {
      await dbService.deleteItem(deleteTarget.id, user.id);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReturnedConfirm = async () => {
    if (!returnedTarget || !user) return;
    setIsMarkingReturned(true);
    try {
      await dbService.markAsReturned(returnedTarget.id, user.id);
      setItems((prev) =>
        prev.map((i) => (i.id === returnedTarget.id ? { ...i, status: "returned" } : i))
      );
      setReturnedTarget(null);
    } catch (err) {
      console.error("Mark returned error:", err);
    } finally {
      setIsMarkingReturned(false);
    }
  };

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
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700">
              <Package className="h-3.5 w-3.5" />
              <span>Item Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              My Reported Items
            </h1>
            <p className="text-sm text-neutral-500 max-w-xl">
              Manage your lost and found listings, update statuses, or mark items as returned.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link href="/report/lost">
              <Button variant="primary" size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" /> Report Lost
              </Button>
            </Link>
            <Link href="/report/found">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" /> Report Found
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200/50 gap-1">
          {["all", "lost", "found", "active", "returned", "closed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                activeTab === tab ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <EmptyState
            title="You haven't reported any items in this category yet."
            description="Create a listing when you lose or find an item."
            actionLabel="Report Lost Item"
            onAction={() => router.push("/report/lost")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const itemType = item.type || (item.status === "found" ? "found" : "lost");
              const isReturned = item.status === "returned";
              const primaryImg = item.imageUrl || (item.images && item.images[0] ? item.images[0].publicUrl : undefined);

              return (
                <div key={item.id} className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-100">
                      {primaryImg ? (
                        <img src={primaryImg} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-500 text-white font-bold text-xs uppercase">
                          {item.category}
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge variant={itemType === "lost" ? "lost" : "found"}>
                          {itemType === "lost" ? "Lost" : "Found"}
                        </Badge>
                        {isReturned && (
                          <span className="bg-success-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Returned
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-neutral-900 text-base line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 border-t border-neutral-50 pt-2 font-medium">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{item.city}, {item.area}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    {!isReturned && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs gap-1 border-success-200 text-success-700 hover:bg-success-50"
                        onClick={() => setReturnedTarget(item)}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Mark as Returned
                      </Button>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <Link href={`/item/${item.id}`}>
                        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                      <Link href={`/my-items/${item.id}/edit`}>
                        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs gap-1 text-danger-600 hover:bg-danger-50"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <h3 className="text-lg font-bold text-neutral-900">Delete Listing?</h3>
              <button onClick={() => setDeleteTarget(null)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="primary" className="bg-danger-600 hover:bg-danger-700" isLoading={isDeleting} onClick={handleDeleteConfirm}>
                Delete Listing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Returned Confirmation Modal */}
      {returnedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <h3 className="text-lg font-bold text-neutral-900">Has this item been returned?</h3>
              <button onClick={() => setReturnedTarget(null)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Marking <strong>"{returnedTarget.title}"</strong> as returned will update its status to Returned and remove it from active search feeds.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setReturnedTarget(null)}>Not Yet</Button>
              <Button variant="primary" className="bg-success-600 hover:bg-success-700" isLoading={isMarkingReturned} onClick={handleReturnedConfirm}>
                Yes, Mark Returned
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
