"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMO_ITEMS } from "@/lib/demo-data";
import ItemGrid from "../items/ItemGrid";
import Button from "@/components/ui/button";

export const RecentItemsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");

  // Get recently reported items (first 4 items of each status)
  const lostItems = DEMO_ITEMS.filter((item) => item.status === "lost").slice(0, 4);
  const foundItems = DEMO_ITEMS.filter((item) => item.status === "found").slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header containing tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-5">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-semibold text-primary-700 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
              <span>Real-time Listings</span>
            </div>
            <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Recently Reported Items
            </h3>
            <p className="text-sm text-neutral-500 max-w-md">
              Browse the latest active reports. Click on a listing to examine details, verify ownership, or contact the poster.
            </p>
          </div>

          {/* Toggle Tab Buttons */}
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-fit border border-neutral-200/50">
            <button
              onClick={() => setActiveTab("lost")}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "lost"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              Recently Lost
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "found"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              Recently Found
            </button>
          </div>
        </div>

        {/* Display Active Grid */}
        <div className="animate-fade-in">
          {activeTab === "lost" ? (
            <div className="space-y-8">
              <ItemGrid items={lostItems} />
              <div className="flex justify-center pt-4">
                <Link href="/lost">
                  <Button variant="outline" className="gap-2 text-neutral-700 hover:text-neutral-900 border-neutral-200">
                    View All Lost Items
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <ItemGrid items={foundItems} />
              <div className="flex justify-center pt-4">
                <Link href="/found">
                  <Button variant="outline" className="gap-2 text-neutral-700 hover:text-neutral-900 border-neutral-200">
                    View All Found Items
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default RecentItemsSection;
