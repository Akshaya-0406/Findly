"use client";

import React from "react";
import { ClipboardList, Sparkles, CheckCircle, Users } from "lucide-react";
import { DEMO_STATS } from "@/lib/demo-data";

export const StatsSection: React.FC = () => {
  // Format statistics numbers
  const formatStat = (num: number) => {
    return num.toLocaleString() + "+";
  };

  const stats = [
    {
      label: "Items reported",
      value: formatStat(DEMO_STATS.reported),
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Potential matches",
      value: formatStat(DEMO_STATS.matches),
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Items reunited",
      value: formatStat(DEMO_STATS.reunited),
      icon: CheckCircle,
      color: "text-accent-600 bg-accent-50 border-accent-100",
    },
    {
      label: "Community members",
      value: formatStat(DEMO_STATS.members),
      icon: Users,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-neutral-50 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-neutral-100/70 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center gap-3 transition-all hover:shadow-md"
              >
                <div className={`p-3 rounded-xl border ${stat.color} h-fit shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
