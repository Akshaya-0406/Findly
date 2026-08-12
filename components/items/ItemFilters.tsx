"use client";

import React from "react";
import { Search, X } from "lucide-react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { CATEGORIES, LOCATIONS } from "@/lib/demo-data";
import { FilterState } from "@/types";

interface ItemFiltersProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onClear: () => void;
}

export const ItemFilters: React.FC<ItemFiltersProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  // Check if any filter is active
  const hasActiveFilters =
    filters.searchQuery ||
    filters.category ||
    filters.location ||
    filters.date ||
    filters.sortBy !== "newest";

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
      {/* Row 1: Search Query */}
      <div className="relative">
        <Input
          placeholder="Search by keywords (e.g. AirPods, keys, wallet)..."
          value={filters.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
          leftIcon={<Search className="h-5 w-5 text-neutral-400" />}
          className="bg-neutral-50/50 border-neutral-200/80 focus:bg-white"
        />
      </div>

      {/* Row 2: Select Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="flex flex-col">
          <Select
            placeholder="All Categories"
            options={CATEGORIES}
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="bg-neutral-50/50"
          />
        </div>

        {/* Location Filter */}
        <div className="flex flex-col">
          <Select
            placeholder="All Locations"
            options={LOCATIONS}
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="bg-neutral-50/50"
          />
        </div>

        {/* Date Filter */}
        <div className="flex flex-col">
          <Input
            type="date"
            placeholder="Filter by date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="bg-neutral-50/50 h-[46px] text-sm py-2" // aligning height with standard select
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col">
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            className="bg-neutral-50/50"
          />
        </div>
      </div>

      {/* Row 3: Filter indicators & Clear action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-50">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <span>Active filters:</span>
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-full">
                &quot;{filters.searchQuery}&quot;
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-full">
                Location: {filters.location}
              </span>
            )}
            {filters.date && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-full">
                Date: {filters.date}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs font-semibold text-danger-600 hover:bg-danger-50 hover:text-danger-700 gap-1 rounded-lg px-2.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemFilters;
