import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "lost" | "found" | "match" | "success" | "warning" | "danger" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-150 shadow-xs";

  const variants = {
    default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    lost: "bg-danger-50 text-danger-600 border border-danger-100",
    found: "bg-accent-50 text-accent-600 border border-accent-100",
    match: "bg-primary-50 text-primary-600 border border-primary-100",
    success: "bg-success-50 text-success-600 border border-success-100",
    warning: "bg-warning-50 text-warning-600 border border-warning-100",
    danger: "bg-danger-50 text-danger-600 border border-danger-100",
    outline: "border border-neutral-300 text-neutral-600 bg-transparent",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
