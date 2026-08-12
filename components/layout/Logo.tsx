import React from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
}) => {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const containerSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 font-bold group select-none ${className}`}>
      {/* Dynamic Logo Icon: Combining MapPin and Magnifying Glass */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 shadow-md shadow-primary-500/20 text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary-500/30 ${containerSizes[size]}`}>
        <div className="relative">
          <MapPin className={`${iconSizes[size]} transition-all duration-300 group-hover:translate-y-[-2px]`} />
          <div className="absolute -bottom-1 -right-1 bg-accent-500 rounded-full p-0.5 border border-white text-white shadow-xs">
            <Search className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[2.5]" />
          </div>
        </div>
      </div>
      
      {!iconOnly && (
        <span className={`font-extrabold tracking-tight text-neutral-900 ${textSizes[size]}`}>
          Find<span className="text-primary-600">ly</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
