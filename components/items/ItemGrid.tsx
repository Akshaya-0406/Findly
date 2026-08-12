import React from "react";
import { Item } from "@/types";
import ItemCard from "./ItemCard";
import EmptyState from "../common/EmptyState";

interface ItemGridProps {
  items: Item[];
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  emptyTitle = "No items found",
  emptyDescription = "No items match your selected filters. Please adjust them and try again.",
  onClearFilters,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={onClearFilters ? "Reset Filters" : undefined}
          onAction={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
