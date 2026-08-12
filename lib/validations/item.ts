import { z } from "zod";

// Allowed MIME types & file limits
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_COUNT = 5;

export const lostItemSchema = z.object({
  title: z
    .string()
    .min(3, "Item name must be at least 3 characters")
    .max(100, "Item name cannot exceed 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),
  color: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  identifyingFeatures: z.string().optional(),
  date: z.string().min(1, "Please select the date lost"),
  time: z.string().optional(),
  city: z.string().min(1, "Please enter or select the city"),
  area: z.string().min(1, "Please enter the area/neighborhood"),
  location: z.string().min(1, "Please describe the approximate location"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reward: z
    .union([z.number().min(0, "Reward must be a positive number"), z.nan(), z.undefined()])
    .optional(),
  additionalNotes: z.string().optional(),
});

export const foundItemSchema = z.object({
  title: z
    .string()
    .min(3, "Item name must be at least 3 characters")
    .max(100, "Item name cannot exceed 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),
  color: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  identifyingFeatures: z.string().optional(),
  date: z.string().min(1, "Please select the date found"),
  time: z.string().optional(),
  city: z.string().min(1, "Please enter or select the city"),
  area: z.string().min(1, "Please enter the area/neighborhood"),
  location: z.string().min(1, "Please describe the approximate location"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  additionalNotes: z.string().optional(),
});

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WEBP images are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be less than 5MB.";
  }
  return null;
};

export type LostItemFormData = z.infer<typeof lostItemSchema>;
export type FoundItemFormData = z.infer<typeof foundItemSchema>;
