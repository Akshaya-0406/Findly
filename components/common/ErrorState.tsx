import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-danger-50/30 border border-danger-100 rounded-2xl max-w-md mx-auto">
      <div className="p-3 bg-danger-50 rounded-full mb-4 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-danger-600" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 mb-6">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
