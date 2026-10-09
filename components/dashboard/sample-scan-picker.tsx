"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SAMPLE_SCAN_CLASSES,
  SAMPLE_SCANS,
  type SampleScanClass,
} from "@/lib/sample-scans";

export function SampleScanPicker({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (src: string) => void;
}) {
  const [activeClass, setActiveClass] = useState<SampleScanClass>("CNV");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="rounded-3xl bg-card border p-6 max-w-2xl w-full shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg text-foreground">
              Sample OCT Scans
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pick any image to try the model, no upload needed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 bg-muted/60 rounded-full p-1 w-fit">
          {SAMPLE_SCAN_CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveClass(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
                activeClass === c
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto pr-1">
          {SAMPLE_SCANS[activeClass].map((src) => (
            <button
              key={src}
              onClick={() => onSelect(src)}
              className="rounded-xl overflow-hidden border border-border hover:border-primary transition-colors cursor-pointer aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Sample ${activeClass} OCT scan`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
