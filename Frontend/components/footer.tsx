import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center gap-4 px-4 md:px-6">
        <p className="text-sm text-muted-foreground text-center">
          © 2025 EyeNet 1.0 – AI Vision Diagnostics. All rights reserved.
        </p>
        <p>
            Built with ❤️ by Richmond & Akugri
        </p>
      </div>
    </footer>
  );
}
