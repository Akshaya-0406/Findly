import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, EyeOff, Lock, Landmark, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";

export const SafetySection: React.FC = () => {
  const safetyPoints = [
    {
      title: "Meet in public places",
      desc: "Always complete handovers in well-lit, crowded public spaces like library foyers or station entries. Never meet in private residences.",
      icon: MapPin,
    },
    {
      title: "Protect personal information",
      desc: "Do not display phone numbers, personal email addresses, or physical home addresses in public listing descriptions.",
      icon: EyeOff,
    },
    {
      title: "Verify ownership first",
      desc: "Ask the claimant for unique characteristics not listed publicly (e.g., serial numbers, screen locks, specific stickers/scratches).",
      icon: Lock,
    },
    {
      title: "Never send money",
      desc: "Never send payment for shipping or rewards prior to receiving your item. Honest founders will agree to safe, public swaps.",
      icon: Landmark,
    },
    {
      title: "Report suspicious activity",
      desc: "If someone behaves suspiciously, demands ransom payment, or acts aggressively, report their account immediately to administrators.",
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Col: Header */}
            <div className="lg:col-span-4 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-primary-200">
                <ShieldCheck className="h-4 w-4" />
                <span>Safety First</span>
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight">
                Find safely. <br />
                Return safely.
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Our platform was built on the foundation of trust. We encourage users to verify details privately and follow robust personal safety practices when reconnecting.
              </p>
              <div className="pt-2">
                <Link href="/safety">
                  <Button variant="secondary" size="md" className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold border-0 shadow-lg">
                    Read Safety Guidelines
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Col: Grid list */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {safetyPoints.map((point, idx) => {
                const Icon = point.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                    <div className="p-2.5 bg-white/10 rounded-xl text-primary-300 h-fit shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{point.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
