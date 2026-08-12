"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Send,
  ShieldCheck,
  Ban,
  Flag,
  Info,
  CheckCheck,
  Clock,
  Laptop,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Conversation, Message, Item } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";
import { formatDate, getInitials } from "@/lib/utils";

export default function SingleConversationPage() {
  const { id: conversationId } = useParams() as { id: string };
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Participant & Item Context
  const [itemContext, setItemContext] = useState<Item | null>(null);
  const [partnerName, setPartnerName] = useState("Member");
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // Safety & Blocking Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages and subscribe to Realtime updates
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/messages/${conversationId}`);
      return;
    }

    const loadChat = async () => {
      setIsLoading(true);
      try {
        const msgs = await dbService.getMessages(conversationId, user.id);
        setMessages(msgs);

        // Fetch conversation details to populate item & partner info
        const convs = await dbService.getConversations(user.id);
        const currentConv = convs.find((c) => c.id === conversationId);

        if (currentConv) {
          setItemContext(currentConv.item || null);
          const p = currentConv.otherParticipant || (currentConv.participant1.id === user.id ? currentConv.participant2 : currentConv.participant1);
          setPartnerName(p.name);
          setPartnerId(p.id);
        }
      } catch (err: any) {
        console.error("Error loading chat:", err);
        setErrorMessage(err.message || "Failed to load conversation.");
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    loadChat();

    // Subscribe to Realtime messages channel
    const unsubscribe = dbService.subscribeToRealtimeMessages(conversationId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId, user, authLoading, router]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmed = newMessageText.trim();
    if (!trimmed || !user) return;

    setIsSending(true);
    setNewMessageText("");

    try {
      const createdMsg = await dbService.sendMessage(conversationId, user.id, trimmed);
      setMessages((prev) => {
        if (prev.some((m) => m.id === createdMsg.id)) return prev;
        return [...prev, createdMsg];
      });
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send message.");
      setNewMessageText(trimmed); // Restore text on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBlockUser = async () => {
    if (!partnerId || !user) return;
    setIsBlocking(true);
    try {
      await dbService.blockUser(user.id, partnerId);
      setShowBlockModal(false);
      router.push("/messages");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to block user.");
    } finally {
      setIsBlocking(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="py-12 bg-neutral-50 min-h-screen text-center text-sm text-neutral-400">
        Loading chat conversation...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-6 md:py-8 bg-neutral-50 min-h-screen flex flex-col justify-between">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 w-full flex-1 flex flex-col">
        
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <Link
            href="/messages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Messages
          </Link>

          <div className="flex items-center gap-2">
            {partnerId && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-danger-600 hover:bg-danger-50 gap-1 h-8"
                onClick={() => setShowBlockModal(true)}
              >
                <Ban className="h-3.5 w-3.5" /> Block User
              </Button>
            )}
          </div>
        </div>

        {/* Item Context Header Card */}
        {itemContext && (
          <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs">
                {itemContext.imageUrl ? (
                  <img src={itemContext.imageUrl} alt={itemContext.title} className="w-full h-full object-cover" />
                ) : (
                  <Laptop className="h-5 w-5 text-neutral-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={itemContext.type === "lost" ? "lost" : "found"}>
                    {itemContext.type === "lost" ? "Lost Item" : "Found Item"}
                  </Badge>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                    {itemContext.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 truncate mt-0.5">{itemContext.title}</h3>
                <p className="text-[11px] text-neutral-500 truncate">{itemContext.location}</p>
              </div>
            </div>

            <Link href={`/item/${itemContext.id}`}>
              <Button variant="outline" size="sm" className="text-xs shrink-0">
                View Item
              </Button>
            </Link>
          </div>
        )}

        {/* Safety Warning Banner */}
        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            Never share passwords, OTPs, or bank info. Read our <Link href="/safety" className="font-bold underline">Safety Tips</Link>.
          </span>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="p-3 bg-danger-50 border border-danger-100 rounded-xl text-xs text-danger-700 font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-danger-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Chat Messages Feed Container */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-4 sm:p-6 shadow-sm flex-1 min-h-[400px] max-h-[600px] overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
              <p className="text-sm font-bold text-neutral-700">No messages yet.</p>
              <p className="text-xs text-neutral-400 max-w-xs">
                Introduce yourself and ask questions about the item details or safe meeting location.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium px-1">
                    <span>{isMine ? "You" : partnerName}</span>
                    <span>&bull;</span>
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>

                  <div
                    className={`max-w-[80%] md:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isMine
                        ? "bg-primary-600 text-white rounded-br-none"
                        : "bg-neutral-100 text-neutral-900 rounded-bl-none border border-neutral-200/50"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Composer */}
        <form onSubmit={handleSendMessage} className="bg-white border border-neutral-100 rounded-2xl p-2 sm:p-3 shadow-sm flex items-center gap-2">
          <textarea
            rows={1}
            placeholder={`Message ${partnerName}... (Press Enter to send)`}
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 px-3 py-2 text-sm focus:outline-none resize-none max-h-24"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={!newMessageText.trim() || isSending}
            isLoading={isSending}
            className="rounded-xl px-4 py-2 text-xs font-semibold gap-1.5 shrink-0"
          >
            <Send className="h-3.5 w-3.5" /> Send
          </Button>
        </form>

      </div>

      {/* Block User Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in text-center">
            <div className="p-3 bg-danger-50 text-danger-600 rounded-full w-fit mx-auto border border-danger-100">
              <Ban className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Block {partnerName}?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Blocking will prevent this user from contacting you about listings. Historical conversation records will be archived.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowBlockModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-danger-600 hover:bg-danger-700"
                isLoading={isBlocking}
                onClick={handleBlockUser}
              >
                Block User
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
