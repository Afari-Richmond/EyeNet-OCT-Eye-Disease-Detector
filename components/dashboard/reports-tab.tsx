"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { listScans, type Scan } from "@/lib/api";
import { GatedCard } from "./gated-card";
import { CLASS_COLOR_VAR } from "./class-color";
import { FileText } from "lucide-react";

export function ReportsTab() {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listScans({ report_generated: true })
      .then(setScans)
      .catch(() => setError("Couldn't load reports."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <GatedCard feature="Reports" />;

  return (
    <div className="rounded-3xl border bg-card p-6">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <FileText className="w-4 h-4 text-muted-foreground" />
        Generated Reports
      </span>

      {loading && (
        <p className="text-sm text-muted-foreground mt-4">Loading...</p>
      )}
      {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      {!loading && !error && scans.length === 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          No reports yet — download a PDF from a scan&apos;s result to see it here.
        </p>
      )}

      <ul className="mt-4 divide-y divide-border">
        {scans.map((scan) => (
          <li key={scan.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {scan.patient_name ?? "—"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(scan.created_at).toLocaleString()}
              </p>
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
