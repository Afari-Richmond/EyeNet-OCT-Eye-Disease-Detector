"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { listScans, type Scan } from "@/lib/api";
import { GatedCard } from "./gated-card";
import { CLASS_COLOR_VAR } from "./class-color";
import { Clock } from "lucide-react";

export function HistoryTab() {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listScans()
      .then(setScans)
      .catch(() => setError("Couldn't load scan history."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <GatedCard feature="History" />;

  return (
    <div className="rounded-3xl border bg-card p-6">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Clock className="w-4 h-4 text-muted-foreground" />
        Scan History
      </span>

      {loading && (
        <p className="text-sm text-muted-foreground mt-4">Loading...</p>
      )}
      {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      {!loading && !error && scans.length === 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          No scans yet. Predictions you run while signed in will show up here.
        </p>
      )}

      <ul className="mt-4 divide-y divide-border">
        {scans.map((scan) => (
          <li key={scan.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              {scan.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={scan.image}
                  alt="Scan thumbnail"
                  className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {scan.patient_name ?? "No patient"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(scan.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: CLASS_COLOR_VAR[scan.prediction] }}
              >
                {scan.prediction}
              </span>
              <span className="text-xs text-muted-foreground">
                {scan.confidence.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
