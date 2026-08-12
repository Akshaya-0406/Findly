"use client";

import React from "react";
import { ClipboardList, Search, Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "File a Detailed Report",
      subtitle: "Report Lost or Found",
      desc: "Fill out our smart form in seconds. Provide categories, key descriptions, date stamps, and approximate areas. For found reports, you can keep key identifying details secret to verify ownership later.",
      icon: ClipboardList,
      color: "from-blue-500 to-indigo-600",
      accent: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      num: "02",
      title: "Discover & Filter Feed",
      subtitle: "Browse Listings",
      desc: "Our responsive browse feed lists items cleanly. Use keyword query searches, category filters, date filters, and specific locations (like Science Hall or Central Library) to inspect relevant items.",
      icon: Search,
      color: "from-indigo-500 to-purple-600",
      accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      num: "03",
      title: "Automated Smart Matching",
      subtitle: "AI Matching Analyzer",
      desc: "Our backend cross-analyzes every submission. When critical factors align—like matching a black phone lost at the Cafeteria with a black phone found nearby on the same day—we flag it with a potential match score (e.g. 87% match).",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      accent: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      num: "04",
      title: "Private Ownership Verification",
      subtitle: "High Trust Claims",
      desc: "Before any contact is made, claimants must submit security proof details. You might ask: &apos;What sticker is on the phone case?&apos; or &apos;What is the lock screen wallpaper?&apos; to ensure ownership before arranging handovers.",
      icon: ShieldCheck,
      color: "from-teal-500 to-emerald-600",
      accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      num: "05",
      title: "Reunite Safely",
      subtitle: "Safe Swap & Recover",
      desc: "Coordinate a meeting point. Always meet in safe, public, high-traffic locations during daylight. Hand over the item and mark the report as resolved to build community trust.",
      icon: HeartHandshake,
      color: "from-rose-500 to-red-600",
      accent: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  return (
    <div className="py-8 md:py-16 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
            How Findly Works
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Findly is designed to make Lost & Found simple, secure, and transparent. Learn how our lifecycle connects reports to reunions safely.
          </p>
        </div>

        {/* Vertical Timeline Step List */}
        <div className="space-y-10 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-neutral-200 before:hidden md:before:block">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={idx}
                className="relative bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:ml-16 transition-all hover:shadow-md"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                {/* Floating circle for Timeline marker on desktop */}
                <div className={`absolute -left-[54px] top-8 h-10 w-10 rounded-full bg-gradient-to-tr ${step.color} border-4 border-white shadow-md hidden md:flex items-center justify-center text-white text-xs font-bold font-mono`}>
                  {step.num}
                </div>

                {/* Left side: Icon and title */}
                <div className="space-y-3 md:w-1/3 shrink-0">
                  <div className={`p-3 rounded-xl border w-fit ${step.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Stage {step.num}</span>
                    <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                  </div>
                </div>

                {/* Right side: Detailed Description */}
                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                  
                  {/* Subtle label showing sub-status */}
                  <div className="text-[11px] font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                    <span>{step.subtitle}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="bg-gradient-to-tr from-primary-600 to-primary-500 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">Ready to recover your item?</h3>
          <p className="text-primary-100 text-sm max-w-md mx-auto leading-relaxed">
            Report what you lost or found now, and our match algorithms will start scanning database listings immediately.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/lost">
              <Button className="bg-white text-neutral-900 hover:bg-neutral-100 border-0 text-xs font-bold px-5">
                Browse Lost
              </Button>
            </Link>
            <Link href="/found">
              <Button className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs font-bold px-5">
                Browse Found
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
