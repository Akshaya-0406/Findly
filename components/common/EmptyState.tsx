import React from "react";
import { Inbox } from "lucide-react";
import Button from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  description = "We couldn't find anything matching your search. Try adjusting your filters.",
  icon = <Inbox className="h-10 w-10 text-neutral-400" />,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white border border-neutral-100 rounded-2xl shadow-xs animate-fade-in max-w-md mx-auto">
      <div className="p-4 bg-neutral-50 rounded-full mb-4 border border-neutral-100/50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
