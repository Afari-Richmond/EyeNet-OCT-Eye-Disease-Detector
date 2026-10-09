"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function PreUploadWarningModal({
  isOpen,
  onProceed,
  onCancel,
}: {
  isOpen: boolean;
  onProceed: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="rounded-3xl bg-card border p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="font-semibold text-lg text-foreground mt-4">
          Before you proceed
        </h2>
        <p className="text-sm text-muted-foreground mt-3">
          If the image you selected is not an OCT scan, the model will still
          squeeze it into one of its four trained classes (CNV, DME, DRUSEN,
          or NORMAL). It has no way to recognize or reject a non-OCT image.
          Only proceed if you&apos;re confident this is a genuine OCT scan.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={onProceed} className="rounded-full cursor-pointer">
            Proceed
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
