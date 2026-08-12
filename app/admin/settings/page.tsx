"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("Findly");
  const [supportEmail, setSupportEmail] = useState("support@findly.com");
  const [maxImageCount, setMaxImageCount] = useState(5);
  const [maxImageMb, setMaxImageMb] = useState(5);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6 max-w-3xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Platform Settings</h1>
            <p className="text-xs text-neutral-400">Configure global application parameters and operational boundaries.</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-4 bg-success-950/60 border border-success-800 rounded-2xl text-xs text-success-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success-400 shrink-0" />
            <span>Platform settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white">Platform Application Name</label>
            <input
              type="text"
              required
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white">Community Support Email</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Max Images Per Item</label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxImageCount}
                onChange={(e) => setMaxImageCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Max Image File Size (MB)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={maxImageMb}
                onChange={(e) => setMaxImageMb(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={isSaving} className="gap-2">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
