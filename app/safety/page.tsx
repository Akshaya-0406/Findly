"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Info, Landmark, MapPin, EyeOff, UserCheck, PhoneCall, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function SafetyPage() {
  const sections = [
    {
      title: "Before Contacting Someone",
      icon: PhoneCall,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      rules: [
        "Review the item details carefully to check if description matching makes sense.",
        "Ensure your own report doesn't contain highly specific identifying marks (e.g. engravings or serials) so you can use them to verify ownership later.",
        "Use the platform's private chat system to message founders; do not share your direct WhatsApp, personal cell number, or physical address.",
      ],
    },
    {
      title: "During Verification",
      icon: UserCheck,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      rules: [
        "Ask the claimant to describe unique details not visible in public listing photos (e.g., specific case scratches, stickers, locks, or brand names).",
        "If the item is electronics (laptop, phone, smartwatch), ask for specific features like the lock screen photo or partial serial number matches.",
        "Honest owners will be happy to provide descriptions to verify it's theirs; don't feel awkward asking.",
      ],
    },
    {
      title: "Meeting Safely",
      icon: MapPin,
      color: "text-accent-600 bg-accent-50 border-accent-100",
      rules: [
        "Always meet in public, well-lit, and highly crowded locations (e.g., campus library foyer, busy cafeteria, coffee shops).",
        "Never agree to meet in isolated areas, back alleys, private dorm rooms, or private apartments.",
        "Meet during daylight hours. Tell a friend where you are going or bring them along with you to the swap.",
      ],
    },
    {
      title: "Avoiding Scams",
      icon: Landmark,
      color: "text-warning-600 bg-warning-50 border-warning-100",
      rules: [
        "Never send money or reward deposits to a stranger via wire transfer, Venmo, or gift cards prior to inspect and receive the item.",
        "Be wary of users claiming they are out of state and need you to pay expensive shipping fees up front.",
        "Findly is completely free to use. Beware of anyone pretending to charge platform fees for holding items.",
      ],
    },
    {
      title: "Reporting Suspicious Behavior",
      icon: ShieldAlert,
      color: "text-danger-600 bg-danger-50 border-danger-100",
      rules: [
        "If someone demands exorbitant cash payments or ransom for returning an item, report their listing immediately.",
        "Report users who communicate aggressively, attempt to push you to meet in private, or change meeting locations last minute.",
        "Our moderation team reviews reported accounts and will suspend profiles displaying suspicious behavior.",
      ],
    },
  ];

  return (
    <div className="py-8 md:py-16 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
            Find Safely. Return Safely.
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Our highest priority is keeping our community safe. Please read and follow our core safety protocols when claiming or returning belongings.
          </p>
        </div>

        {/* Info box */}
        <div className="flex gap-3.5 p-5 bg-primary-50 border border-primary-100 rounded-3xl text-sm text-primary-800 leading-relaxed max-w-3xl mx-auto">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary-600 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-neutral-900 text-base">Verified Exchange Protocol</h4>
            <p className="text-xs text-neutral-500">
              Findly is a high-trust platform. All matching transactions are designed with double-blind descriptors to prevent scam attempts and verify ownership objectively.
            </p>
          </div>
        </div>

        {/* Safety sections cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div 
                key={idx}
                className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${sec.color} shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-base">{sec.title}</h3>
                </div>
                
                <ul className="space-y-2.5 pl-1.5">
                  {sec.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex gap-2.5 text-xs text-neutral-500 leading-relaxed">
                      <span className="text-primary-500 font-bold mt-0.5">&bull;</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Return Button */}
        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button variant="primary" className="px-8">
              Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
