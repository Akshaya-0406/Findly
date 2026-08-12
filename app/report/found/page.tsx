"use client";

import React from "react";
import MultiStepReportForm from "@/components/items/MultiStepReportForm";

export default function ReportFoundPage() {
  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Report a Found Item
          </h1>
          <p className="text-sm text-neutral-500">
            Thank you for helping return an item to its owner. Describe what you found below.
          </p>
        </div>

        <MultiStepReportForm type="found" />
      </div>
    </div>
  );
}
