"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, SlidersHorizontal, Tag, MapPin } from "lucide-react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import ItemGrid from "@/components/items/ItemGrid";
import { CATEGORIES, LOCATIONS } from "@/lib/demo-data";
import { FilterState, Item } from "@/types";
import { dbService } from "@/lib/db";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    (searchParams.get("type") as "all" | "lost" | "found") || "all"
  );
  
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    color: searchParams.get("color") || "",
    brand: searchParams.get("brand") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  });

  // Debounced search query state
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(filters.query);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.query]);

  // Sync URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (statusFilter !== "all") params.set("type", statusFilter);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.color) params.set("color", filters.color);
    if (filters.brand) params.set("brand", filters.brand);

    const queryString = params.toString();
    router.replace(queryString ? `/search?${queryString}` : `/search`, { scroll: false });
  }, [debouncedQuery, statusFilter, filters.category, filters.city, filters.color, filters.brand, router]);

  // Query PostgreSQL Database
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const payload: FilterState = {
          searchQuery: debouncedQuery,
          type: statusFilter,
          category: filters.category,
          city: filters.city,
          color: filters.color,
          brand: filters.brand,
          location: "",
          date: "",
          sortBy: filters.sortBy,
          status: "active",
        };

        const results = await dbService.getItems(payload);
        setItems(results);
      } catch (err) {
        console.error("Error searching database items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, statusFilter, filters.category, filters.city, filters.color, filters.brand, filters.sortBy]);

  const handleClearFilters = () => {
    setStatusFilter("all");
    setFilters({
      query: "",
      category: "",
      city: "",
      color: "",
      brand: "",
      sortBy: "newest",
    });
  };

  const hasActiveFilters =
    debouncedQuery || filters.category || filters.city || filters.color || filters.brand || statusFilter !== "all";

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Search Findly
          </h1>
          <p className="text-sm text-neutral-500">
            Search across all reported lost and found items in your area.
          </p>
        </div>

        {/* Search Container */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 md:p-6 shadow-md space-y-5">
          <div className="relative">
            <Input
              label="What are you looking for?"
              placeholder="e.g. AirPods Pro, Leather Wallet, Keys, Watch..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              leftIcon={<Search className="h-5 w-5 text-neutral-400" />}
              className="bg-neutral-50/50 focus:bg-white text-lg py-3"
            />
          </div>

          {/* Filter Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-50 pt-4">
              
              {/* Status Tabs */}
              <div className="flex bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200/50">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === "all" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("lost")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === "lost" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("found")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === "found" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  Found
                </button>
              </div>

              {/* Reset Filters shortcut */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-neutral-500 hover:text-danger-600 text-xs font-bold h-8"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Reset Search
                </Button>
              )}
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Select
                placeholder="Category"
                options={CATEGORIES}
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="bg-neutral-50/50"
              />
              <Input
                placeholder="City (e.g. Chennai)"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="bg-neutral-50/50 h-[46px] text-sm"
              />
              <Input
                placeholder="Brand (e.g. Apple)"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="bg-neutral-50/50 h-[46px] text-sm"
              />
              <Input
                placeholder="Color (e.g. Black)"
                value={filters.color}
                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                className="bg-neutral-50/50 h-[46px] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase tracking-wider pl-1">
            <span>
              {isLoading ? "Searching database..." : `${items.length} ${items.length === 1 ? "result" : "results"}`}
            </span>
          </div>

          {isLoading ? (
            <LoadingGrid count={3} columns={3} />
          ) : (
            <ItemGrid
              items={items}
              emptyTitle="No matching items found."
              emptyDescription="Try broader search terms, check spelling, or clear filters."
              onClearFilters={handleClearFilters}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-neutral-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
