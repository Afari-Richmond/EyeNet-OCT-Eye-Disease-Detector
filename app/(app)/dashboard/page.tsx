"use client";

import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Bell,
  Search,
  Flame,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Droplets,
  CircleDot,
  CheckCircle2,
  Clock,
  Star,
  Ticket,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  predictScan,
  listPatients,
  type Patient,
  type PredictResult,
} from "@/lib/api";
import { PreUploadWarningModal } from "@/components/dashboard/pre-upload-warning-modal";
import { ResultsModal } from "@/components/dashboard/results-modal";
import { HistoryTab } from "@/components/dashboard/history-tab";
import { ReportsTab } from "@/components/dashboard/reports-tab";
import { SettingsTab } from "@/components/dashboard/settings-tab";
import { PatientsTab } from "@/components/dashboard/patients-tab";
import { SampleScanPicker } from "@/components/dashboard/sample-scan-picker";

const TABS = ["Overview", "History", "Reports", "Settings", "Patients"] as const;
type Tab = (typeof TABS)[number];

const DIAGNOSIS_BREAKDOWN = [
  { label: "NORMAL", percent: 68, color: "var(--series-normal)" },
  { label: "CNV", percent: 14, color: "var(--series-cnv)" },
  { label: "DME", percent: 11, color: "var(--series-dme)" },
  { label: "DRUSEN", percent: 7, color: "var(--series-drusen)" },
];

const CONFIDENCE_TREND = [
  { label: "NORMAL", percent: 96.4, color: "var(--series-normal)" },
  { label: "DME", percent: 90.1, color: "var(--series-dme)" },
  { label: "CNV", percent: 88.7, color: "var(--series-cnv)" },
  { label: "DRUSEN", percent: 88.2, color: "var(--series-drusen)" },
];

const AVG_CONFIDENCE = (
  CONFIDENCE_TREND.reduce((sum, c) => sum + c.percent, 0) /
  CONFIDENCE_TREND.length
).toFixed(1);

type ScanEntry = {
  id: number;
  label: string;
  time: string;
  confidence: number;
  color: string;
  icon: typeof Activity;
};

const INITIAL_SCANS: ScanEntry[] = [
  {
    id: 1,
    label: "NORMAL",
    time: "Today, 09:14 AM",
    confidence: 96.4,
    color: "var(--series-normal)",
    icon: CheckCircle2,
  },
  {
    id: 2,
    label: "CNV Detected",
    time: "Yesterday, 2:30 PM",
    confidence: 88.1,
    color: "var(--series-cnv)",
    icon: Activity,
  },
  {
    id: 3,
    label: "DRUSEN Detected",
    time: "Apr 1, 2026",
    confidence: 90.2,
    color: "var(--series-drusen)",
    icon: CircleDot,
  },
  {
    id: 4,
    label: "DME Detected",
    time: "Mar 29, 2026",
    confidence: 89.5,
    color: "var(--series-dme)",
    icon: Droplets,
  },
];

function ProgressRing({
  percent,
  color,
  size = 136,
  stroke = 12,
}: {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--chart-track)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { user, isGuest } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [samplePickerOpen, setSamplePickerOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictResult | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const [showExactCount, setShowExactCount] = useState(true);
  const [idCopied, setIdCopied] = useState(false);
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [pendingReviewed, setPendingReviewed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      setPatients([]);
      setSelectedPatientId(null);
      return;
    }
    // Also refetch on returning to Overview, so a patient added from the
    // Patients tab shows up in this dropdown without a page reload.
    if (activeTab === "Overview") {
      listPatients().then(setPatients).catch(() => {});
    }
  }, [user, activeTab]);

  const finalizeFileSelect = (selected: File) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
    setFile(selected);
  };

  const handleFileSelect = (selected: File) => {
    if (selected && selected.type.startsWith("image/")) {
      setPendingFile(selected);
      setWarningOpen(true);
    }
  };

  const handleUseSample = async (src: string) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const name = src.split("/").pop() ?? "sample.jpeg";
    const sampleFile = new File([blob], name, { type: blob.type || "image/jpeg" });
    // Curated samples are verified real OCT scans, so skip the non-OCT warning.
    finalizeFileSelect(sampleFile);
    setSamplePickerOpen(false);
  };

  const handleProceedWarning = () => {
    if (pendingFile) finalizeFileSelect(pendingFile);
    setPendingFile(null);
    setWarningOpen(false);
  };

  const handleCancelWarning = () => {
    setPendingFile(null);
    setWarningOpen(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleCancel = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    setPredictError(null);
    setLoading(false);
  };

  const handleUploadNew = () => {
    handleCancel();
    setPredictionResult(null);
    setResultsOpen(false);
    const input = document.getElementById("oct-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setPredictError(null);
    try {
      const result = await predictScan(file, selectedPatientId);
      setPredictionResult(result);
      setResultsOpen(true);
    } catch {
      setPredictError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyPatientId = () => {
    navigator.clipboard.writeText("EYN-00249-OCT");
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 1500);
  };

  const dismissScan = (id: number) => {
    setScans((prev) => prev.filter((s) => s.id !== id));
  };

  const dominant = DIAGNOSIS_BREAKDOWN[0];

  return (
    <div className="oct-dash min-h-screen bg-background">
      <style jsx>{`
        .oct-dash {
          --series-cnv: #2a78d6;
          --series-dme: #eb6834;
          --series-drusen: #1baf7a;
          --series-normal: #eda100;
          --chart-track: #e1e0d9;
          --ink-secondary: #52514e;
        }
        :global(.dark) .oct-dash {
          --series-cnv: #3987e5;
          --series-dme: #d95926;
          --series-drusen: #199e70;
          --series-normal: #c98500;
          --chart-track: #2c2c2a;
          --ink-secondary: #c3c2b7;
        }
      `}</style>

      <Container className="pt-20 pb-10 space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
              EN
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Hello, {isGuest ? "Guest" : user?.first_name || "there"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/60 rounded-full p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] leading-4 text-white text-center">
                {scans.length}
              </span>
            </Button>
          </div>
        </motion.div>

        {activeTab === "History" ? (
          <HistoryTab />
        ) : activeTab === "Reports" ? (
          <ReportsTab />
        ) : activeTab === "Settings" ? (
          <SettingsTab />
        ) : activeTab === "Patients" ? (
          <PatientsTab />
        ) : (
          <>
            {/* Upload Section - primary focus, above the stat cards */}
            <div
              id="upload-section"
              className="rounded-3xl border bg-card p-8 w-full scroll-mt-24"
            >
              <h3 className="font-semibold text-2xl text-foreground">
                Upload New Scan
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Send an OCT image to the AI model for prediction
              </p>

              <div className="mt-4">
                <button
                  onClick={() => setSamplePickerOpen(true)}
                  className="text-xs font-medium text-primary hover:underline cursor-pointer"
                >
                  No scan handy? Browse sample scans →
                </button>
              </div>

              {user && patients.length > 0 && (
                <div className="mt-4 max-w-xs">
                  <label className="text-xs text-muted-foreground">
                    Patient (optional)
                  </label>
                  <select
                    className="mt-1 w-full border border-border rounded-lg p-2 text-sm bg-background text-foreground"
                    value={selectedPatientId ?? ""}
                    onChange={(e) =>
                      setSelectedPatientId(e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">No patient selected</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center transition-all flex flex-col items-center justify-center min-h-[300px]",
                    dragActive ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <label
                    htmlFor="oct-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <svg
                      className="w-12 h-12 text-primary/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3.5 7.5M7 4l3.5 3.5M17 16v4m0 0l3.5-3.5M17 20l-3.5-3.5"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      Click or drag and drop to upload
                    </p>
                    <span className="text-xs text-muted-foreground/70">
                      Only image files allowed
                    </span>
                  </label>
                  <input
                    id="oct-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files![0])}
                  />

                  {file && (
                    <div className="mt-4 text-center text-sm text-primary font-medium">
                      Selected: <span>{file.name}</span>
                    </div>
                  )}

                  {predictError && (
                    <div className="mt-2 text-center text-sm text-destructive">
                      {predictError}
                    </div>
                  )}

                  {file && (
                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="default"
                        onClick={handlePredict}
                        disabled={loading}
                        className="cursor-pointer rounded-full"
                      >
                        Predict Scan
                      </Button>
                      <Button
                        className="cursor-pointer rounded-full"
                        variant="outline"
                        disabled={loading}
                        onClick={() => {
                          handleCancel();
                          const input = document.getElementById(
                            "oct-upload"
                          ) as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-muted min-h-[300px] flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Selected OCT scan preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center px-6">
                      <Eye className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-3">
                        Your scan preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 1: Total Scans + Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border bg-card p-6 relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1 bg-muted rounded-full p-1 text-xs font-medium">
                    {["Week", "Month", "Year"].map((p, i) => (
                      <span
                        key={p}
                        className={cn(
                          "px-3 py-1 rounded-full",
                          i === 1
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={copyPatientId}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <span>
                      Patient ID <span className="font-semibold text-foreground">EYN-00249-OCT</span>
                    </span>
                    {idCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-4xl font-bold text-foreground">
                      {showExactCount ? "128" : "•••"}
                    </span>
                    <button
                      onClick={() => setShowExactCount((v) => !v)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showExactCount ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    <Button
                      onClick={scrollToUpload}
                      className="rounded-full cursor-pointer"
                    >
                      Run New Scan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("History")}
                      className="rounded-full cursor-pointer"
                    >
                      View History
                    </Button>
                  </div>
                  <button
                    onClick={scrollToUpload}
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 cursor-pointer"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-[#1baf7a] to-[#0d7a53] text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-black/20 rounded-full px-3 py-1 text-xs font-semibold">
                    <Flame className="w-3.5 h-3.5" />
                    STREAK
                  </span>
                  <MoreHorizontal className="w-4 h-4 opacity-70" />
                </div>

                <div className="mt-6">
                  <p className="text-sm text-white/80">Current Streak</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-4xl font-bold">12 Days</span>
                    <span className="text-[11px] bg-white/20 rounded-full px-2 py-0.5">
                      +3 this week
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-white/15 rounded-2xl p-3">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> Accuracy Score
                      </span>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <p className="mt-1 font-semibold">94.2%</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-3">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" /> Scans Done
                      </span>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <p className="mt-1 font-semibold">128</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Diagnosis Breakdown, Confidence Trend, Recent Scans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Diagnosis Breakdown */}
              <div className="rounded-3xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    Diagnosis Breakdown
                  </span>
                  <span className="text-xs bg-muted rounded-full px-2.5 py-1 text-muted-foreground">
                    This Month
                  </span>
                </div>

                <div className="flex flex-col items-center mt-4">
                  <div className="relative">
                    <ProgressRing
                      percent={dominant.percent}
                      color={dominant.color}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">
                        {dominant.percent}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {dominant.label}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {DIAGNOSIS_BREAKDOWN.map((d) => (
                    <li
                      key={d.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        {d.label}
                      </span>
                      <span className="text-muted-foreground">
                        {d.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confidence Trend */}
              <div className="rounded-3xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    Avg. Confidence
                  </span>
                  <span className="text-xs text-[color:var(--series-normal)] font-semibold">
                    +2.3%
                  </span>
                </div>

                <p className="text-3xl font-bold text-foreground mt-3">
                  {AVG_CONFIDENCE}%
                </p>
                <p className="text-xs text-muted-foreground">
                  vs last month
                </p>

                <ul className="mt-5 space-y-3">
                  {CONFIDENCE_TREND.map((c) => (
                    <li key={c.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">
                          {c.label}
                        </span>
                        <span className="text-muted-foreground">
                          {c.percent}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.percent}%`,
                            backgroundColor: c.color,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Scans */}
              <div className="rounded-3xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Recent Scans
                  </span>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>

                <ul className="mt-4 space-y-3">
                  {!pendingReviewed && (
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Scan Processing
                          </p>
                          <p className="text-[11px] text-[color:var(--series-dme)]">
                            Awaiting confirmation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPendingReviewed(true)}
                          className="w-7 h-7 rounded-full bg-primary/20 text-primary-foreground flex items-center justify-center cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPendingReviewed(true)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  )}

                  {scans.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${s.color}1a` }}
                        >
                          <s.icon
                            className="w-4 h-4"
                            style={{ color: s.color }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {s.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {s.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: s.color }}
                        >
                          {s.confidence}%
                        </span>
                        <button
                          onClick={() => dismissScan(s.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </Container>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl bg-card border p-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-foreground">
                Scanning your OCT image
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Running the AI model, this only takes a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <PreUploadWarningModal
        isOpen={warningOpen}
        onProceed={handleProceedWarning}
        onCancel={handleCancelWarning}
      />

      <ResultsModal
        isOpen={resultsOpen}
        onClose={() => setResultsOpen(false)}
        result={predictionResult}
        patientName={
          selectedPatientId
            ? patients.find((p) => p.id === selectedPatientId)?.full_name
            : undefined
        }
        onUploadNew={handleUploadNew}
      />

      <SampleScanPicker
        isOpen={samplePickerOpen}
        onClose={() => setSamplePickerOpen(false)}
        onSelect={handleUseSample}
      />
    </div>
  );
}
