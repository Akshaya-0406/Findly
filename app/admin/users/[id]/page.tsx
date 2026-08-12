"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User as UserIcon, Shield, Ban, Calendar, MapPin, Package, CheckCircle2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import { User, Item } from "@/types";
import { dbService } from "@/lib/db";
import { formatDate, getInitials } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const users = await dbService.getAdminUsers();
        const found = users.find((u) => u.id === id);
        if (found) {
          setTargetUser(found);
          const items = await dbService.getUserItems(id);
          setUserItems(items);
        }
      } catch (err) {
        console.error("Error loading user detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="py-12 text-center text-xs text-neutral-500">Loading user profile...</div>
      </AdminLayout>
    );
  }

  if (!targetUser) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="py-12 text-center text-xs text-neutral-500">User profile not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6 max-w-4xl">
        
        <div>
          <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to Users List
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center font-bold text-xl text-neutral-200 shrink-0">
            {getInitials(targetUser.name)}
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-white">{targetUser.name}</h1>
                <span className="text-xs bg-primary-500/20 text-primary-300 font-bold px-2.5 py-0.5 rounded-md uppercase">
                  {targetUser.role || "user"}
                </span>
                {targetUser.isSuspended && (
                  <span className="bg-danger-500/20 text-danger-400 text-xs font-bold px-2 py-0.5 rounded-md uppercase">
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">User ID: {targetUser.id}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-400 font-semibold">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-neutral-500" /> Joined {targetUser.memberSince}
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-neutral-500" /> {userItems.length} Reported Listings
              </div>
            </div>
          </div>
        </div>

        {/* User Items History */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white">Reported Items ({userItems.length})</h3>

          {userItems.length === 0 ? (
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl text-center text-xs text-neutral-500">
              No items reported by this user.
            </div>
          ) : (
            <div className="space-y-3">
              {userItems.map((item) => (
                <div key={item.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-neutral-400">{item.category} &bull; {item.location}</p>
                  </div>
                  <Link href={`/item/${item.id}`}>
                    <Button variant="outline" size="sm" className="border-neutral-800 text-xs text-neutral-300">
                      View Item
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
