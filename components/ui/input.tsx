import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-neutral-700 select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-base shadow-xs placeholder-neutral-400",
              "transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10",
              "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:pointer-events-none",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-neutral-400 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <span className="text-xs font-medium text-danger-600 animate-slide-up">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-neutral-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
