import React from "react";
import { Info, Heart, Target, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const points = [
    {
      title: "Our Mission",
      desc: "To make lost and found simple, high-trust, and accessible. We want to reduce stress and help recover valuable belongings through community cooperation.",
      icon: Target,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Community First",
      desc: "Findly was designed to support local spaces like universities, colleges, and local transit networks, giving individuals a unified, high-integrity hub for returns.",
      icon: Heart,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: "Smart Solutions",
      desc: "We replace chaotic Facebook groups, spreadsheets, and physical notice boards with an automated match system, secure descriptors, and public meet safety logs.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "High Trust & Security",
      desc: "Our platform ensures double-blind claims, preventing fraud by asking for hidden identifiers before founders and owners are introduced.",
      icon: ShieldCheck,
      color: "text-accent-600 bg-accent-50 border-accent-100",
    },
  ];

  return (
    <div className="py-8 md:py-16 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
            About Findly
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Designed to bridge the gap between missing belongings and recovery through smart descriptors, verified claims, and public safety.
          </p>
        </div>

        {/* Story Intro */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 leading-relaxed text-sm text-neutral-500 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary-600" />
            Why We Built Findly
          </h3>
          <p>
            Traditional lost and found systems are fragmented. Important items are posted across disconnected group channels, spreadsheets, or physical desks, making search highly inefficient and claim verification chaotic.
          </p>
          <p>
            Findly creates a unified, search-optimized platform. Our algorithm analyzes attributes like location, date range, and categories to suggest matches. By adding secure claims verification, we protect community members from scams and ensure the correct person gets their property back.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-xs space-y-3">
                <div className={`p-2.5 rounded-xl border ${p.color} w-fit`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-base">{p.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Future Vision Section */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-[200px] w-[200px] bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl font-bold">Future Vision</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            In Phase 2, Findly will connect to databases to support active accounts, verified email domains, live message threads, photo scanning matching, and automatic SMS recovery alerts.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="secondary" className="bg-white text-neutral-900 hover:bg-neutral-100 border-0 text-xs font-bold px-6">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
