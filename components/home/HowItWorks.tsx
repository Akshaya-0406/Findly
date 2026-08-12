"use client";

import React from "react";
import { ClipboardList, Search, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Report",
      desc: "Tell us what you lost or found. Add images, location, category, date, and descriptions.",
      icon: ClipboardList,
      color: "text-primary-600 bg-primary-50 border-primary-100",
    },
    {
      num: "02",
      title: "Discover",
      desc: "Browse listings and discover potential matches. Filter by category, location, and date.",
      icon: Search,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      num: "03",
      title: "Verify",
      desc: "Confirm ownership through private verification. Answer security questions to check claims.",
      icon: ShieldCheck,
      color: "text-accent-600 bg-accent-50 border-accent-100",
    },
    {
      num: "04",
      title: "Reunite",
      desc: "Connect safely in public meeting points and return the item to its rightful owner.",
      icon: HeartHandshake,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 80 } },
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Simple Process</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How Findly works
          </h3>
          <p className="text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Four simple steps to safely reconnect lost belongings with their owners, backed by automated match algorithms.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={idx} 
                className="group relative flex flex-col p-6 bg-neutral-50 border border-neutral-100/70 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                variants={cardVariants}
              >
                {/* Step badge */}
                <span className="absolute top-6 right-6 text-3xl font-extrabold text-neutral-200 group-hover:text-primary-200 transition-colors select-none font-mono">
                  {step.num}
                </span>

                {/* Icon wrapper */}
                <div className={`p-3.5 rounded-xl border w-fit mb-6 ${step.color} shadow-inner`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Typography */}
                <h4 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
