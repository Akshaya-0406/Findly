"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Laptop, Expand } from "lucide-react";
import { ItemImage } from "@/types";

interface ImageGalleryProps {
  images?: ItemImage[];
  fallbackCategory?: string;
  title?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  fallbackCategory = "Electronics",
  title = "Item",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedIndex]?.publicUrl : undefined;

  const handleNext = () => {
    if (!hasImages) return;
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!hasImages) return;
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Primary Image Viewer */}
      <div className="relative aspect-square w-full rounded-2xl bg-neutral-100 border border-neutral-100 overflow-hidden shadow-inner flex items-center justify-center group">
        {hasImages && currentImage ? (
          <>
            <img
              src={currentImage}
              alt={`${title} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-200"
            />

            {/* Navigation Arrows for multiple images */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-neutral-800 hover:bg-white shadow-md transition-all active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-neutral-800 hover:bg-white shadow-md transition-all active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Fullscreen Lightbox Button */}
            <button
              type="button"
              onClick={() => setShowLightbox(true)}
              className="absolute bottom-3 right-3 p-2 bg-neutral-900/60 text-white rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Expand className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary-600 to-indigo-500 w-full h-full text-white">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <Laptop className="h-16 w-16 text-white/90 mb-2" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{fallbackCategory}</span>
            <span className="text-[10px] text-white/60 mt-1">No photo uploaded</span>
          </div>
        )}
      </div>

      {/* Thumbnails Bar (Desktop & Mobile Swipeable) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx ? "border-primary-600 ring-2 ring-primary-500/20" : "border-neutral-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.publicUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      {showLightbox && hasImages && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white text-sm font-bold bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            ✕ Close
          </button>
          <img src={currentImage} alt={title} className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
