"use client";

import React, { useState } from "react";
import { X, CheckCircle, Flag } from "lucide-react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";

interface ReportModalProps {
  type?: "item" | "user" | "lost" | "found";
  targetId?: string;
  targetTitle?: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  type = "item",
  targetId = "general",
  targetTitle = "Listing",
  onClose,
}) => {
  const { user } = useAuth();

  const initialReportType = type === "user" ? "user" : "item";
  const [reportType, setReportType] = useState<"item" | "user">(initialReportType);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemReasons = [
    { value: "Fake listing", label: "Fake listing" },
    { value: "Spam", label: "Spam / Duplicate" },
    { value: "Incorrect information", label: "Incorrect information" },
    { value: "Suspicious activity", label: "Suspicious activity" },
    { value: "Inappropriate content", label: "Inappropriate content" },
    { value: "Scam", label: "Scam" },
    { value: "Other", label: "Other" },
  ];

  const userReasons = [
    { value: "Suspicious behavior", label: "Suspicious behavior" },
    { value: "Harassment", label: "Harassment" },
    { value: "Scam", label: "Scam / Fraud" },
    { value: "Fake identity", label: "Fake identity" },
    { value: "Inappropriate behavior", label: "Inappropriate behavior" },
    { value: "Other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage("You must be logged in to submit a report.");
      return;
    }

    if (!reason) {
      setErrorMessage("Please select a reason for reporting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dbService.createReport(user.id, reportType, targetId, reason, description);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit report. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-danger-50 text-danger-600 rounded-xl">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Submit Safety Report
              </h2>
              <p className="text-xs text-neutral-500">
                Help keep Findly safe for the community.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Target Type Selector */}
            <div className="flex bg-neutral-100 p-1 rounded-xl w-full border border-neutral-200/50">
              <button
                type="button"
                onClick={() => {
                  setReportType("item");
                  setReason("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  reportType === "item" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Report Listing
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportType("user");
                  setReason("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  reportType === "user" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Report User
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-danger-50 border border-danger-100 rounded-xl text-xs text-danger-700 font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-700">Reporting target:</span>
              <p className="text-xs text-neutral-500 font-medium truncate bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                {targetTitle} ({reportType === "item" ? "Item Listing" : "User Account"})
              </p>
            </div>

            <Select
              label="Select Reason *"
              placeholder="Select reason"
              options={reportType === "item" ? itemReasons : userReasons}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">Additional Details (Optional)</label>
              <textarea
                rows={3}
                placeholder="Provide details to assist moderation review..."
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 focus:border-primary-500 rounded-xl text-xs focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-danger-600 hover:bg-danger-700"
                isLoading={isSubmitting}
              >
                Submit Report
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center space-y-4 animate-scale-in">
            <div className="p-4 bg-success-50 rounded-full text-success-600 border border-success-100">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-neutral-900">Report Submitted</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Thank you for notifying us. Our moderation team will review this report promptly.
              </p>
            </div>
            <Button variant="primary" className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportModal;
