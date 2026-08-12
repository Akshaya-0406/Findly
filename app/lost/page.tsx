"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList, PlusCircle, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import ItemFilters from "@/components/items/ItemFilters";
import ItemGrid from "@/components/items/ItemGrid";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import Button from "@/components/ui/button";
import { FilterState, Item } from "@/types";
import { dbService } from "@/lib/db";

function LostItemsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 12;

  // Initialize filters from URL search params
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    location: searchParams.get("location") || "",
    color: searchParams.get("color") || "",
    brand: searchParams.get("brand") || "",
    date: searchParams.get("date") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    type: "lost",
    status: "active",
  });

  // Sync URL search params when filters alter
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set("q", filters.searchQuery);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.color) params.set("color", filters.color);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.date) params.set("date", filters.date);
    if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    router.replace(queryString ? `/lost?${queryString}` : `/lost`, { scroll: false });
  }, [filters, page, router]);

  // Fetch items from Database Service
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const results = await dbService.getItems({
          ...filters,
          type: "lost",
          status: "active",
          page,
          limit,
        });
        setItems(results);
      } catch (err) {
        console.error("Error fetching lost items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [filters, page]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      category: "",
      city: "",
      location: "",
      color: "",
      brand: "",
      date: "",
      sortBy: "newest",
      type: "lost",
      status: "active",
    });
    setPage(1);
  };

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-danger-50 border border-danger-100 rounded-full text-xs font-semibold text-danger-700">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Search Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Lost Items
            </h1>
            <p className="text-sm text-neutral-500 max-w-xl">
              Help someone find what they&apos;ve lost. Browse active reports, check matching details, and reconnect owners.
            </p>
          </div>

          <Link href="/report/lost">
            <Button variant="primary" className="gap-2 shrink-0">
              <PlusCircle className="h-4 w-4" />
              Report Lost Item
            </Button>
          </Link>
        </div>

        {/* Filter component */}
        <ItemFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Items Listing Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase tracking-wider pl-1">
            <span>Listings ({items.length})</span>
            {isLoading && <span>Refreshing feed...</span>}
          </div>
          
          {isLoading ? (
            <LoadingGrid count={4} columns={4} />
          ) : (
            <ItemGrid
              items={items}
              emptyTitle="Nothing lost has been reported here yet."
              emptyDescription="We couldn't find any lost items matching your active filter criteria."
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Pagination Controls */}
          {items.length >= limit && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-neutral-100">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-xs font-bold text-neutral-700 px-2">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={items.length < limit}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function LostPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-neutral-400">Loading lost items...</div>}>
      <LostItemsContent />
    </Suspense>
  );
}
