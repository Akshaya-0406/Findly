"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  X,
  AlertTriangle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { User, UserRole } from "@/types";
import { dbService } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { formatDate, getInitials } from "@/lib/utils";

export default function AdminUsersPage() {
  const { user: activeAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modals state
  const [roleTargetUser, setRoleTargetUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [suspendTargetUser, setSuspendTargetUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isUpdatingSuspend, setIsUpdatingSuspend] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error loading admin users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleSubmit = async () => {
    if (!roleTargetUser || !activeAdmin) return;
    setIsUpdatingRole(true);
    try {
      await dbService.updateUserRole(roleTargetUser.id, selectedRole, activeAdmin.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === roleTargetUser.id ? { ...u, role: selectedRole } : u))
      );
      setRoleTargetUser(null);
    } catch (err) {
      console.error("Role update error:", err);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleSuspendSubmit = async () => {
    if (!suspendTargetUser || !activeAdmin) return;
    setIsUpdatingSuspend(true);
    const nextState = !suspendTargetUser.isSuspended;

    try {
      await dbService.setUserSuspension(suspendTargetUser.id, nextState, suspendReason, activeAdmin.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === suspendTargetUser.id ? { ...u, isSuspended: nextState, suspensionReason: suspendReason } : u))
      );
      setSuspendTargetUser(null);
      setSuspendReason("");
    } catch (err) {
      console.error("Suspension toggle error:", err);
    } finally {
      setIsUpdatingSuspend(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchName = u.name.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || (u.role || "user") === roleFilter;
    return matchName && matchRole;
  });

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">User Management</h1>
            <p className="text-xs text-neutral-400">View user accounts, elevate roles, or toggle account suspensions.</p>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl text-xs text-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-bold gap-1">
            {["all", "user", "moderator", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  roleFilter === r ? "bg-primary-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading user records...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No matching user accounts found.
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            {filteredUsers.map((u) => {
              const role = u.role || "user";
              const isSuspended = u.isSuspended || false;

              return (
                <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-300 shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          role === "admin" ? "bg-primary-500/20 text-primary-300" : role === "moderator" ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"
                        }`}>
                          {role}
                        </span>
                        {isSuspended && (
                          <span className="bg-danger-500/20 text-danger-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                            Suspended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">Joined {u.memberSince}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/users/${u.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-neutral-300 border border-neutral-800">
                        <Eye className="h-3.5 w-3.5 mr-1" /> Profile
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-neutral-300 border border-neutral-800"
                      onClick={() => {
                        setRoleTargetUser(u);
                        setSelectedRole(role);
                      }}
                    >
                      <Shield className="h-3.5 w-3.5 mr-1 text-primary-400" /> Change Role
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs border ${
                        isSuspended ? "text-success-400 border-success-900/40 hover:bg-success-900/20" : "text-danger-400 border-danger-900/40 hover:bg-danger-900/20"
                      }`}
                      onClick={() => setSuspendTargetUser(u)}
                    >
                      {isSuspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Role Change Modal */}
      {roleTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Change Role for {roleTargetUser.name}</h3>
              <button onClick={() => setRoleTargetUser(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="user">User (Standard community permissions)</option>
                <option value="moderator">Moderator (Review queue & reports access)</option>
                <option value="admin">Admin (Full system & analytics control)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setRoleTargetUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" isLoading={isUpdatingRole} onClick={handleRoleSubmit}>
                Save Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {suspendTargetUser.isSuspended ? "Unsuspend" : "Suspend"} {suspendTargetUser.name}
              </h3>
              <button onClick={() => setSuspendTargetUser(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!suspendTargetUser.isSuspended && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Suspension Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Violation of community safety guidelines"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setSuspendTargetUser(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className={suspendTargetUser.isSuspended ? "bg-success-600 hover:bg-success-700" : "bg-danger-600 hover:bg-danger-700"}
                isLoading={isUpdatingSuspend}
                onClick={handleSuspendSubmit}
              >
                Confirm {suspendTargetUser.isSuspended ? "Unsuspend" : "Suspend"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
