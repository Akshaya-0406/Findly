"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User as UserIcon, X } from "lucide-react";
import Button from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Report", href: "#", icon: Plus, isAction: true },
    { name: "Saved", href: "/saved", icon: MessageSquare, isSaved: true },
    { name: "Profile", href: "/profile", icon: UserIcon, isProfile: true },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.isAction) {
      setShowTypeSelector(true);
    } else if (item.isProfile) {
      if (!user) {
        router.push("/login?redirect=/profile");
      } else {
        router.push("/profile");
      }
    } else if (item.isSaved) {
      if (!user) {
        router.push("/login?redirect=/saved");
      } else {
        router.push("/saved");
      }
    }
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 md:hidden flex justify-around items-center h-16 shadow-lg px-2 pb-safe">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.isAction || item.isProfile || item.isSaved) {
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-neutral-500 hover:text-primary-600 transition-colors focus:outline-none"
              >
                {item.isAction ? (
                  <div className="flex items-center justify-center h-10 w-10 bg-primary-600 rounded-full text-white shadow-md shadow-primary-500/20 active:scale-95 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                ) : (
                  <>
                    <Icon className={`h-5 w-5 ${active ? "text-primary-600 stroke-[2.5]" : ""}`} />
                    <span className={`text-[10px] font-medium mt-1 ${active ? "text-primary-600" : ""}`}>{item.name}</span>
                  </>
                )}
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                active ? "text-primary-600" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Report Type Selector Sheet */}
      {showTypeSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4 shadow-xl border-t border-neutral-100 animate-slide-up max-w-md">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <h3 className="text-lg font-bold text-neutral-900">What would you like to report?</h3>
              <button onClick={() => setShowTypeSelector(false)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/report/lost" onClick={() => setShowTypeSelector(false)}>
                <div className="flex flex-col items-center gap-3 p-5 border border-danger-100 bg-danger-50/20 hover:bg-danger-50/40 rounded-2xl transition-all">
                  <div className="p-3 bg-danger-50 rounded-full text-danger-600">
                    <Plus className="h-6 w-6 rotate-45" />
                  </div>
                  <span className="font-semibold text-neutral-800 text-sm">Lost Item</span>
                </div>
              </Link>
              <Link href="/report/found" onClick={() => setShowTypeSelector(false)}>
                <div className="flex flex-col items-center gap-3 p-5 border border-accent-100 bg-accent-50/20 hover:bg-accent-50/40 rounded-2xl transition-all">
                  <div className="p-3 bg-accent-50 rounded-full text-accent-600">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-neutral-800 text-sm">Found Item</span>
                </div>
              </Link>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setShowTypeSelector(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
