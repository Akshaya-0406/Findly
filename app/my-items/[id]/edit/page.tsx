"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit, AlertCircle, Save } from "lucide-react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { CATEGORIES } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db";
import { Item } from "@/types";

export default function EditItemPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    color: "",
    brand: "",
    model: "",
    identifyingFeatures: "",
    date: "",
    time: "",
    city: "",
    area: "",
    location: "",
    reward: "",
    additionalNotes: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/my-items/${id}/edit`);
      return;
    }

    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const item = await dbService.getItemById(id);
        if (!item) {
          setErrorMessage("Item not found");
          return;
        }

        if (item.reporter.id !== user.id) {
          setErrorMessage("You don't have permission to edit this item.");
          return;
        }

        setFormData({
          title: item.title,
          category: item.category,
          description: item.description,
          color: item.color || "",
          brand: item.brand || "",
          model: item.model || "",
          identifyingFeatures: item.identifyingFeatures || "",
          date: item.date,
          time: item.time || "",
          city: item.city || "",
          area: item.area || "",
          location: item.location || "",
          reward: item.reward ? item.reward.toString() : "",
          additionalNotes: item.additionalNotes || "",
        });
      } catch (err) {
        console.error("Error loading item:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) return;

    setIsSubmitting(true);
    try {
      await dbService.updateItem(
        id,
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          color: formData.color,
          brand: formData.brand,
          model: formData.model,
          identifyingFeatures: formData.identifyingFeatures,
          date: formData.date,
          time: formData.time,
          city: formData.city,
          area: formData.area,
          location: formData.location,
          reward: formData.reward ? parseFloat(formData.reward) : undefined,
          additionalNotes: formData.additionalNotes,
        },
        user.id
      );

      router.push("/my-items");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="py-12 bg-neutral-50 min-h-screen text-center text-sm text-neutral-400">
        Loading listing details...
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <Link href="/my-items" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to My Items
          </Link>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-neutral-900">Edit Listing</h1>
            <p className="text-xs text-neutral-500">Update item details, location, or reward parameters.</p>
          </div>

          {errorMessage && (
            <div className="flex gap-2.5 p-4 bg-danger-50 border border-danger-100 rounded-2xl text-xs text-danger-700 leading-relaxed">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-danger-600" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Item Name *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Select
              label="Category *"
              options={CATEGORIES}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Detailed Description *</label>
              <textarea
                rows={4}
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 focus:border-primary-500 rounded-xl text-sm focus:outline-none focus:ring-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
              <Input
                label="Area *"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
              <Input
                label="Approximate Location *"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              <Input
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <Input
              label="Identifying Features"
              value={formData.identifyingFeatures}
              onChange={(e) => setFormData({ ...formData, identifyingFeatures: e.target.value })}
            />

            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <Link href="/my-items" className="flex-1">
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary" className="flex-1 gap-2" isLoading={isSubmitting}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
