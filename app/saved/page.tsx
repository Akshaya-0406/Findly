"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, ArrowRight, LogIn } from "lucide-react";
import ItemGrid from "@/components/items/ItemGrid";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import Button from "@/components/ui/button";
import { Item } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";

export default function SavedItemsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<Item[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "lost" | "found">("all");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login?redirect=/saved");
      return;
    }

    const fetchSaved = async () => {
      setIsLoading(true);
      try {
        const items = await dbService.getSavedItems(user.id);
        setSavedItems(items);
      } catch (err) {
        console.error("Error fetching saved items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();
  }, [user, authLoading, router]);

  const filteredItems = savedItems.filter((item) => {
    if (filterTab === "all") return true;
    return (item.type || item.status) === filterTab;
  });

  const handleSaveToggle = (itemId: string, isSaved: boolean) => {
    if (!isSaved) {
      setSavedItems((prev) => prev.filter((i) => i.id !== itemId));
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

  if (!user) {
    return null;
  }

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Listings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Saved Items
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl">
            Keep track of items you are monitoring for matches or potential ownership.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200/50">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === "all" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            All Saved ({savedItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("lost")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === "lost" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("found")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === "found" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            Found
          </button>
        </div>

        {/* Grid Display */}
        <ItemGrid
          items={filteredItems}
          emptyTitle="You haven't saved any items yet."
          emptyDescription="Click the bookmark icon on any item listing to keep track of it here."
        />

      </div>
    </div>
  );
}
