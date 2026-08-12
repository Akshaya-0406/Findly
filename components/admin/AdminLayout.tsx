"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  FileCheck,
  Flag,
  FolderTree,
  ShieldAlert,
  Activity,
  Settings,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  LogOut
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "moderator";
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  requiredRole = "moderator",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    const role = user.role || "user";
    if (requiredRole === "admin" && role !== "admin") {
      router.push("/dashboard");
    } else if (requiredRole === "moderator" && role !== "admin" && role !== "moderator") {
      router.push("/dashboard");
    }
  }, [user, loading, requiredRole, pathname, router]);

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, role: "admin" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, role: "admin" },
    { name: "Users", href: "/admin/users", icon: Users, role: "admin" },
    { name: "Listings", href: "/admin/items", icon: Package, role: "admin" },
    { name: "Claims", href: "/admin/claims", icon: FileCheck, role: "admin" },
    { name: "Reports Queue", href: "/admin/reports", icon: Flag, role: "moderator" },
    { name: "Categories", href: "/admin/categories", icon: FolderTree, role: "admin" },
    { name: "Moderator Queue", href: "/moderator", icon: ShieldAlert, role: "moderator" },
    { name: "Activity Logs", href: "/admin/activity", icon: Activity, role: "admin" },
    { name: "Settings", href: "/admin/settings", icon: Settings, role: "admin" },
  ];

  const userRole = user?.role || "user";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white text-sm">
        Verifying security access...
      </div>
    );
  }

  if (!user || (requiredRole === "admin" && userRole !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-950 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary-500" />
          <span className="font-extrabold text-white text-sm">Findly Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-neutral-400 hover:text-white rounded-lg"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-neutral-950 border-r border-neutral-800 shrink-0 flex flex-col justify-between p-4 z-40`}
      >
        <div className="space-y-6">
          
          {/* Header */}
          <div className="space-y-1 pt-2 px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary-500" />
              <span className="font-extrabold text-white text-lg tracking-tight">Findly Admin</span>
            </div>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider pl-1">
              Role: <span className="text-primary-400 font-bold">{userRole.toUpperCase()}</span>
            </p>
          </div>

          {/* Escape Route Button */}
          <Link href="/dashboard" className="block">
            <button className="w-full inline-flex items-center gap-2 py-2 px-3 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Findly Platform
            </button>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.role === "admin" && userRole !== "admin") return null;
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary-600 text-white font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-neutral-500 capitalize">{userRole}</p>
          </div>
        </div>

      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-neutral-900 min-h-screen">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
