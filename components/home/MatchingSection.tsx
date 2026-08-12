"use client";

import React from "react";
import { Sparkles, Check, CheckCircle2, Laptop } from "lucide-react";
import { motion } from "framer-motion";

export const MatchingSection: React.FC = () => {
  const factors = [
    { name: "Category Match", desc: "Verifies items are the same type.", matched: true },
    { name: "Location Analysis", desc: "Cross-checks loss area vs. recovery site.", matched: true },
    { name: "Date Correlation", desc: "Flags items reported within the same timeline.", matched: true },
    { name: "Color & Sub-features", desc: "Matches physical descriptors like color & brand.", matched: true },
    { name: "Semantic Similarity", desc: "Uses NLP to analyze matching description details.", matched: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50 border-y border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 border border-accent-100 rounded-full text-xs font-semibold text-accent-700">
              <Sparkles className="h-3.5 w-3.5 text-accent-600" />
              <span>Proprietary Search</span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Findly helps connect <br />
              <span className="text-primary-600">the right items.</span>
            </h3>
            
            <p className="text-base text-neutral-500 leading-relaxed">
              When an item is reported, our system instantly runs semantic matching across thousands of entries, checking multiple dimensions to present highly accurate possibilities.
            </p>

            {/* List of factors */}
            <div className="space-y-3.5 pt-2">
              {factors.map((factor, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${factor.matched ? "bg-accent-100 text-accent-700" : "bg-neutral-100 text-neutral-400"}`}>
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-neutral-900">{factor.name}</h5>
                    <p className="text-xs text-neutral-500">{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Matching Component */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              className="relative w-full max-w-md bg-white border border-neutral-100 rounded-3xl p-6 shadow-xl space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Header inside visual card */}
              <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Smart Match Analysis</span>
                </div>
                <span className="text-xs bg-primary-50 text-primary-600 font-bold px-2 py-0.5 rounded-md">87% Potential Match</span>
              </div>

              {/* Match Side-by-side Visual */}
              <div className="space-y-4">
                {/* Lost Card */}
                <div className="bg-neutral-50 border border-neutral-100/70 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 bg-danger-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Laptop className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-danger-600 uppercase tracking-wide">Reported Lost</div>
                    <h4 className="text-xs font-bold text-neutral-800 truncate">&quot;Black wireless earbuds&quot;</h4>
                    <span className="text-[9px] text-neutral-400">Lost near Campus Quad</span>
                  </div>
                </div>

                {/* Match indicator */}
                <div className="flex items-center justify-center gap-2 text-neutral-400 font-medium text-xs font-mono py-1">
                  <span className="h-px bg-neutral-200 flex-1"></span>
                  <span>CROSS ANALYSIS</span>
                  <span className="h-px bg-neutral-200 flex-1"></span>
                </div>

                {/* Found Card */}
                <div className="bg-neutral-50 border border-neutral-100/70 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 bg-accent-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Laptop className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-accent-600 uppercase tracking-wide">Reported Found</div>
                    <h4 className="text-xs font-bold text-neutral-800 truncate">&quot;Black earbuds found near campus&quot;</h4>
                    <span className="text-[9px] text-neutral-400">Found near Main Street Bus Stop</span>
                  </div>
                </div>
              </div>

              {/* Verified Dimensions Indicator */}
              <div className="space-y-2 border-t border-neutral-50 pt-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Matching dimensions:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                    <CheckCircle2 className="h-4 w-4 text-accent-600" />
                    <span>Category</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                    <CheckCircle2 className="h-4 w-4 text-accent-600" />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                    <CheckCircle2 className="h-4 w-4 text-accent-600" />
                    <span>Date Range</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                    <CheckCircle2 className="h-4 w-4 text-accent-600" />
                    <span>Color (Black)</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MatchingSection;
