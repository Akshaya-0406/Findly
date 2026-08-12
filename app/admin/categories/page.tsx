"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, CheckCircle2, XCircle, Edit2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/button";
import { Category } from "@/types";
import { dbService } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

export default function AdminCategoriesPage() {
  const { user: activeAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getCategories(true);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !activeAdmin) return;
    setIsSubmitting(true);
    try {
      const created = await dbService.createCategory(newCatName.trim(), undefined, activeAdmin.id);
      setCategories((prev) => [...prev, created]);
      setNewCatName("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Error creating category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    if (!activeAdmin) return;
    const nextState = !cat.isActive;
    try {
      await dbService.updateCategory(cat.id, { isActive: nextState }, activeAdmin.id);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: nextState } : c))
      );
    } catch (err) {
      console.error("Error updating category active status:", err);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim() || !activeAdmin) return;
    setIsSubmitting(true);
    try {
      await dbService.updateCategory(editTarget.id, { name: editName.trim() }, activeAdmin.id);
      setCategories((prev) =>
        prev.map((c) => (c.id === editTarget.id ? { ...c, name: editName.trim() } : c))
      );
      setEditTarget(null);
    } catch (err) {
      console.error("Error editing category name:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Category Management</h1>
            <p className="text-xs text-neutral-400">Configure item categories available in lost & found report wizards.</p>
          </div>

          <Button variant="primary" className="gap-1.5 text-xs" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No categories defined yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      cat.isActive ? "bg-success-500/20 text-success-400" : "bg-neutral-800 text-neutral-500"
                    }`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditTarget(cat);
                      setEditName(cat.name);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs border ${
                      cat.isActive
                        ? "text-neutral-400 border-neutral-800 hover:bg-neutral-900"
                        : "text-success-400 border-success-900/40 hover:bg-success-900/20"
                    }`}
                    onClick={() => handleToggleActive(cat)}
                  >
                    {cat.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateCategory} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Category</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sports Equipment"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button type="button" variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Save Category
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs p-4">
          <form onSubmit={handleEditCategory} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Category</h3>
              <button type="button" onClick={() => setEditTarget(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Category Name *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button type="button" variant="outline" className="border-neutral-800 text-neutral-300" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Update Name
              </Button>
            </div>
          </form>
        </div>
      )}

    </AdminLayout>
  );
}
