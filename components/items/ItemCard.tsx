"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Laptop,
  Briefcase,
  Key,
  Wallet,
  Watch,
  FileText,
  Gift,
  Shirt,
  Box,
  Eye,
  CheckCircle2,
  MessageSquare,
  Phone
} from "lucide-react";
import { Item } from "@/types";
import Badge from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";

interface ItemCardProps {
  item: Item;
  onSaveToggle?: (itemId: string, isSaved: boolean) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSaveToggle }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSavedOverride, setIsSavedOverride] = useState<boolean | null>(null);
  const isSaved = isSavedOverride !== null ? isSavedOverride : Boolean(item.isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const primaryImage = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0].publicUrl : undefined);
  const itemType = item.type || (item.status === "found" ? "found" : "lost");
  const isReturned = item.status === "returned";

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=/item/${item.id}`);
      return;
    }

    const nextState = !isSaved;
    setIsSavedOverride(nextState);
    setIsSaving(true);

    try {
      if (nextState) {
        await dbService.saveItem(item.id, user.id);
      } else {
        await dbService.unsaveItem(item.id, user.id);
      }
      if (onSaveToggle) {
        onSaveToggle(item.id, nextState);
      }
    } catch (err: unknown) {
      console.error("Save item error:", err);
      setIsSavedOverride(!nextState);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=/item/${item.id}`);
      return;
    }

    setIsStartingChat(true);
    try {
      const conv = await dbService.getOrCreateConversation(item.id, user.id, item.reporter.id);
      router.push(`/messages/${conv.id}`);
    } catch (err: unknown) {
      console.error("Error starting chat:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleWhatsAppChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hi! I saw your ${itemType} item listing for "${item.title}" on Findly.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const getCategoryIcon = (category: string) => {
    const props = { className: "h-8 w-8 text-white/90" };
    switch (category) {
      case "Electronics":
        return <Laptop {...props} />;
      case "Bags & Backpacks":
        return <Briefcase {...props} />;
      case "Keys":
        return <Key {...props} />;
      case "Wallets & Purses":
        return <Wallet {...props} />;
      case "Watches & Jewelry":
        return <Watch {...props} />;
      case "Documents & IDs":
        return <FileText {...props} />;
      case "Accessories":
        return <Gift {...props} />;
      case "Clothing":
        return <Shirt {...props} />;
      default:
        return <Box {...props} />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Electronics":
        return "from-blue-600 to-indigo-500 shadow-blue-500/10";
      case "Bags & Backpacks":
        return "from-violet-600 to-purple-500 shadow-purple-500/10";
      case "Keys":
        return "from-amber-500 to-yellow-400 shadow-yellow-500/10";
      case "Wallets & Purses":
        return "from-emerald-600 to-teal-500 shadow-emerald-500/10";
      case "Watches & Jewelry":
        return "from-rose-600 to-pink-500 shadow-rose-500/10";
      case "Documents & IDs":
        return "from-slate-600 to-neutral-500 shadow-slate-500/10";
      case "Accessories":
        return "from-cyan-600 to-sky-500 shadow-cyan-500/10";
      case "Clothing":
        return "from-orange-500 to-amber-400 shadow-orange-500/10";
      default:
        return "from-neutral-600 to-neutral-400 shadow-neutral-500/10";
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-100/80 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Visual / Image */}
      <div className={`relative h-44 w-full rounded-xl overflow-hidden shadow-inner bg-neutral-100 ${!primaryImage ? `bg-gradient-to-br flex flex-col items-center justify-center ${getCategoryGradient(item.category)}` : ""}`}>
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            {getCategoryIcon(item.category)}
            <span className="text-xs font-semibold text-white/80 mt-2 uppercase tracking-wider">{item.category}</span>
          </>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant={itemType === "lost" ? "lost" : "found"}>
            {itemType === "lost" ? "Lost" : "Found"}
          </Badge>
          {isReturned && (
            <span className="bg-success-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="h-3 w-3" /> Returned
            </span>
          )}
        </div>
        
        {/* Save Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full backdrop-blur-xs shadow-sm transition-transform active:scale-90"
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 fill-primary-600 text-primary-600" />
          ) : (
            <Bookmark className="h-4 w-4 text-neutral-600" />
          )}
        </button>
      </div>

      {/* Card Metadata */}
      <div className="flex flex-col flex-1 mt-3">
        <h4 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {item.title}
        </h4>
        
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 min-h-[2rem]">
          {item.description}
        </p>

        {/* Location & Date */}
        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-neutral-50 text-[11px] text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{item.city ? `${item.city}, ${item.area}` : item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span>{formatDate(item.date)}</span>
          </div>
        </div>

        {/* View & Chat Action Buttons */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          <Link href={`/item/${item.id}`} className="col-span-3">
            <button className="w-full inline-flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold text-neutral-700 hover:text-white bg-neutral-50 hover:bg-primary-600 border border-neutral-200 rounded-xl transition-all duration-200">
              <Eye className="h-3.5 w-3.5" />
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </Link>

          <button
            type="button"
            onClick={handleStartChat}
            disabled={isStartingChat}
            title="Chat in-app"
            className="col-span-1 inline-flex items-center justify-center p-2 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white border border-primary-200 rounded-xl transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleWhatsAppChat}
            title="Connect via WhatsApp"
            className="col-span-1 inline-flex items-center justify-center p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-colors shadow-xs"
          >
            <Phone className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
