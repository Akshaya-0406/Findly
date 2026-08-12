"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  ChevronRight,
  ShieldCheck,
  Clock,
  Laptop,
  CheckCheck
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { Conversation } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";
import { formatDate, getInitials } from "@/lib/utils";

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/messages");
      return;
    }

    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getConversations(user.id);
        setConversations(data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user, authLoading, router]);

  const filteredConversations = conversations.filter((conv) => {
    const partnerName = conv.otherParticipant?.name || "";
    const itemTitle = conv.item?.title || "";
    const q = searchQuery.toLowerCase();
    return partnerName.toLowerCase().includes(q) || itemTitle.toLowerCase().includes(q);
  });

  if (authLoading || isLoading) {
    return (
      <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <LoadingGrid count={3} columns={1} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>In-App Messaging</span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Conversations
            </h1>
            <p className="text-sm text-neutral-500">
              Communicate securely with item owners and finders without revealing private contact details.
            </p>
          </div>
        </div>

        {/* Safety Tip Banner */}
        <div className="flex items-center justify-between p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              <strong>Safety Reminder:</strong> Never share passwords, OTPs, or financial info. Always meet in public locations for item handovers.
            </span>
          </div>
          <Link href="/safety" className="text-amber-800 font-bold hover:underline shrink-0 ml-2">
            Safety Tips &rarr;
          </Link>
        </div>

        {/* Conversations Container */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Search Box */}
          {conversations.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations by user or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 focus:border-primary-500 rounded-xl text-sm focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            </div>
          )}

          {/* List of Conversations */}
          {filteredConversations.length === 0 ? (
            <EmptyState
              title="No messages yet."
              description="Introduce yourself when inquiring about a lost or found item listing."
              actionLabel="Browse Listings"
              onAction={() => router.push("/lost")}
            />
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredConversations.map((conv) => {
                const partner = conv.otherParticipant || { id: "unknown", name: "User", memberSince: "Member" };
                const primaryImg = conv.item?.imageUrl || (conv.item?.images?.[0]?.publicUrl);

                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}`}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Avatar / Item Thumbnail */}
                      <div className="relative h-12 w-12 rounded-2xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700">
                        {primaryImg ? (
                          <img src={primaryImg} alt="Item" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(partner.name)
                        )}
                        {conv.unreadCount && conv.unreadCount > 0 ? (
                          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                            {conv.unreadCount}
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                            {partner.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                            {formatDate(conv.lastMessageAt || conv.createdAt)}
                          </span>
                        </div>

                        {conv.item && (
                          <p className="text-xs font-semibold text-neutral-700 truncate">
                            Re: {conv.item.title} ({conv.item.category})
                          </p>
                        )}

                        <p className={`text-xs truncate ${conv.unreadCount ? "font-bold text-neutral-900" : "text-neutral-500"}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-800 transition-colors ml-3 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
