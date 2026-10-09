"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { X, Download, Mail, RefreshCcw, AlertCircle } from "lucide-react";
import { markReportGenerated, type PredictResult } from "@/lib/api";
import { CLASS_COLOR_VAR } from "./class-color";

const DISEASE_RECOMMENDATIONS: Record<string, string[]> = {
  CNV: [
    "Schedule a comprehensive retinal exam with OCT follow-up.",
    "Discuss anti-VEGF therapy options with a retina specialist.",
    "Avoid smoking and manage cardiovascular risk factors.",
    "Monitor vision changes and report any distortion promptly.",
  ],
  DME: [
    "Optimize blood glucose, blood pressure, and lipid levels.",
    "Ask your ophthalmologist about anti-VEGF or steroid therapy.",
    "Have regular dilated eye exams as advised.",
    "Maintain a diabetes-friendly diet and regular exercise.",
  ],
  DRUSEN: [
    "Adopt a diet rich in leafy greens and omega-3s.",
    "Wear UV-protective eyewear outdoors.",
    "Avoid smoking to reduce progression risk.",
    "Discuss AREDS2 supplements with your doctor if appropriate.",
  ],
  NORMAL: [
    "No abnormalities detected. Continue routine eye checkups.",
    "Practice the 20-20-20 rule for screen use.",
    "Maintain a balanced diet and stay hydrated.",
    "Protect your eyes from UV exposure.",
  ],
};

export function ResultsModal({
  isOpen,
  onClose,
  result,
  patientName,
  onUploadNew,
}: {
  isOpen: boolean;
  onClose: () => void;
  result: PredictResult | null;
  patientName?: string;
  onUploadNew: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formPatientName, setFormPatientName] = useState(patientName ?? "");
  const [remarks, setRemarks] = useState("");
  const [stage, setStage] = useState("Moderate");

  useEffect(() => {
    if (isOpen) setFormPatientName(patientName ?? "");
  }, [isOpen, patientName]);

  if (!isOpen || !result) return null;

  const isWarning = "warning" in result;
  const prediction = !isWarning ? result.prediction : null;
  const color = prediction ? CLASS_COLOR_VAR[prediction] : "var(--ink-secondary)";
  const recommendations = prediction ? DISEASE_RECOMMENDATIONS[prediction] ?? [] : [];

  const generatePdf = async () => {
    if (!formPatientName || !remarks) {
      alert("Please fill in patient name and remarks before generating the report.");
      return;
    }

    const doc = new jsPDF();
    const now = new Date();

    doc.setFontSize(18);
    doc.text(`${formPatientName} Diagnosis Report`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${now.toLocaleDateString()}`, 20, 35);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 120, 35);
    doc.text(`Patient Name: ${formPatientName}`, 20, 55);
    doc.text(`Disease: ${prediction ?? "Low confidence"}`, 20, 65);
    doc.text(`Confidence: ${result.confidence.toFixed(2)}%`, 20, 75);

    const stageColors: Record<string, string> = {
      Critical: "#d03b3b",
      Moderate: "#eda100",
      Early: "#000000",
    };
    doc.setTextColor(stageColors[stage] ?? "#000000");
    doc.text(`Stage: ${stage}`, 20, 85);
    doc.setTextColor(0, 0, 0);

    doc.text("Doctor's Remarks:", 20, 100);
    doc.text(doc.splitTextToSize(remarks, 170), 20, 110);

    let y = 130;
    doc.text("Recommendations & Tips:", 20, y);
    y += 10;
    const recs = recommendations.length
      ? recommendations
      : ["Follow up with a licensed ophthalmologist.", "Maintain a healthy lifestyle with proper diet and exercise."];
    recs.forEach((tip) => {
      const wrapped = doc.splitTextToSize(`- ${tip}`, 170);
      doc.text(wrapped, 25, y);
      y += wrapped.length * 8;
    });

    doc.save(`${formPatientName}_Diagnosis_Report.pdf`);
    setShowForm(false);

    if (!isWarning && result.scan_id) {
      try {
        await markReportGenerated(result.scan_id);
      } catch {
        // non-critical, the PDF already downloaded successfully
      }
    }
  };

  const handleSendReport = () => {
    const subject = encodeURIComponent("OCT Scan Diagnosis Report");
    const lines = isWarning
      ? [`Low-confidence prediction (${result.confidence.toFixed(2)}%). Please review manually.`]
      : [
          `Prediction: ${prediction}`,
          `Confidence: ${result.confidence.toFixed(2)}%`,
          `Date: ${new Date().toLocaleString()}`,
        ];
    lines.push("", "Please attach the downloaded PDF report to this email before sending.");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="rounded-3xl bg-card border p-8 max-w-md w-full shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isWarning ? (
          <div className="text-center pt-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="font-semibold text-lg text-foreground mt-4">
              Low Confidence Result
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {result.warning} ({result.confidence.toFixed(2)}% confidence)
            </p>
            <Button
              onClick={onUploadNew}
              className="mt-6 rounded-full cursor-pointer"
            >
              Try Another Image
            </Button>
          </div>
        ) : (
          <div className="text-center pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              AI Prediction Result
            </p>
            <h2
              className="text-2xl font-bold mt-2"
              style={{ color }}
            >
              {prediction}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Confidence: {result.confidence.toFixed(2)}%
            </p>

            {recommendations.length > 0 && (
              <ul className="mt-5 text-left space-y-2 text-sm text-muted-foreground bg-muted rounded-2xl p-4">
                {recommendations.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span style={{ color }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => setShowForm(true)}
                className="rounded-full cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Report (PDF)
              </Button>
              <Button
                variant="outline"
                onClick={handleSendReport}
                className="rounded-full cursor-pointer"
              >
                <Mail className="w-4 h-4" /> Send Report
              </Button>
              <Button
                variant="ghost"
                onClick={onUploadNew}
                className="rounded-full cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" /> Upload New Scan
              </Button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
            <div className="bg-card border rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="font-semibold text-foreground mb-4">
                Enter Patient Details
              </h3>
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full border border-border rounded-lg p-2 mb-3 text-sm bg-background text-foreground placeholder:text-muted-foreground"
                value={formPatientName}
                onChange={(e) => setFormPatientName(e.target.value)}
              />
              <textarea
                placeholder="Doctor's Remarks"
                rows={3}
                className="w-full border border-border rounded-lg p-2 mb-3 text-sm bg-background text-foreground placeholder:text-muted-foreground"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <select
                className="w-full border border-border rounded-lg p-2 mb-4 text-sm bg-background text-foreground"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option>Critical</option>
                <option>Moderate</option>
                <option>Early</option>
              </select>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button className="rounded-full cursor-pointer" onClick={generatePdf}>
                  Generate PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
