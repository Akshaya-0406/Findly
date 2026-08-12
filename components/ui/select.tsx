import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, placeholder, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-neutral-700 select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-base shadow-xs appearance-none",
              "transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10",
              "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:pointer-events-none",
              error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt, i) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lbl = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={i} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          {/* Custom Chevron icon */}
          <div className="absolute right-3.5 pointer-events-none text-neutral-400 flex items-center justify-center">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <span className="text-xs font-medium text-danger-600">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-neutral-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
