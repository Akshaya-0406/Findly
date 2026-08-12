"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import MatchingSection from "@/components/home/MatchingSection";
import SafetySection from "@/components/home/SafetySection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import ItemGrid from "@/components/items/ItemGrid";
import Button from "@/components/ui/button";
import LoadingGrid from "@/components/common/LoadingSkeleton";
import { dbService } from "@/lib/db";
import { Item } from "@/types";

export default function Home() {
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from database adapter dynamically
  useEffect(() => {
    const loadItems = async () => {
      try {
        const allItems = await dbService.getItems();
        setLostItems(allItems.filter((item) => item.status === "lost").slice(0, 4));
        setFoundItems(allItems.filter((item) => item.status === "found").slice(0, 4));
      } catch (err) {
        console.error("Error loading homepage items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. How Findly Works Section */}
      <HowItWorks />

      {/* 3. Browse Lost Items Section */}
      <section className="py-16 md:py-20 bg-neutral-50/50 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-danger-50 border border-danger-100 rounded-full text-xs font-semibold text-danger-700 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-danger-500"></span>
                <span>Active Searches</span>
              </div>
              <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                Recently Lost Items
              </h3>
              <p className="text-sm text-neutral-500 max-w-xl">
                Help someone find what they've lost. These items were reported missing recently in our community areas.
              </p>
            </div>
            
            <Link href="/lost" className="shrink-0 hidden md:block">
              <Button variant="outline" className="gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border-neutral-200">
                View All Lost Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingGrid count={4} columns={4} />
          ) : (
            <ItemGrid items={lostItems} />
          )}

          <div className="flex justify-center md:hidden pt-2">
            <Link href="/lost" className="w-full">
              <Button variant="outline" className="w-full gap-2 text-sm text-neutral-700 border-neutral-200">
                View All Lost Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Recently Found Items Section */}
      <section className="py-16 md:py-20 bg-white border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 border border-accent-100 rounded-full text-xs font-semibold text-accent-700 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500"></span>
                <span>Recovered Items</span>
              </div>
              <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                Recently Found Items
              </h3>
              <p className="text-sm text-neutral-500 max-w-xl">
                Something you found could mean everything to someone. Check if any of these matching items belong to you.
              </p>
            </div>

            <Link href="/found" className="shrink-0 hidden md:block">
              <Button variant="outline" className="gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border-neutral-200">
                View All Found Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingGrid count={4} columns={4} />
          ) : (
            <ItemGrid items={foundItems} />
          )}

          <div className="flex justify-center md:hidden pt-2">
            <Link href="/found" className="w-full">
              <Button variant="outline" className="w-full gap-2 text-sm text-neutral-700 border-neutral-200">
                View All Found Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Smart Matching Section */}
      <MatchingSection />

      {/* 6. Safety Section */}
      <SafetySection />

      {/* 7. Statistics Section */}
      <StatsSection />

      {/* 8. CTA Section */}
      <CTASection />
    </div>
  );
}
