import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GatedCard({ feature }: { feature: string }) {
  return (
    <div className="rounded-3xl border bg-card p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
        <Lock className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="font-semibold text-foreground mt-4">
        Sign in to unlock {feature}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Guests can run predictions, but {feature.toLowerCase()} is saved to a real account only.
      </p>
      <Button asChild className="mt-5 rounded-full cursor-pointer">
        <Link href="/login">Sign In</Link>
      </Button>
    </div>
  );
}
