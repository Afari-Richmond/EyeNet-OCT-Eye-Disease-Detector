"use client";

import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ConfirmModal from "@/components/confirmModal";
import LoadingModal from "@/components/loadingModal";
import PredictionResultModal from "@/components/predictionResult";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowModal(true);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    setLoading(false);
  };

  const handleConfirm = () => {
    setShowModal(false);
  };

  const handleReject = () => {
    setShowModal(false);
    setPreviewUrl(null);
    setFile(null);
  };

 const handlePredict = async () => {
  if (!file) {
    alert("Please upload an OCT scan for prediction");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://52.91.239.151:8000/api/predict-scan/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      console.log(data);

      // ✅ Ensure correct shape
      setPredictionResult({
        prediction: data.prediction,
        confidence: Number(data.confidence) || 0,
      });
      setResultModalOpen(true);
    } else {
      alert("Prediction failed: " + data.message);
    }
  } catch (error: any) {
    setPredictionResult({
      prediction: "Error during prediction",
      confidence: 0,
    });
    setResultModalOpen(true);
  }
  setLoading(false);
};


  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-20 pb-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="border-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
            <CardContent className="p-6 relative">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Prediction History
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access your past predictions and reports
                    </p>
                  </div>
                </div>
                 {/* Prediction History */}
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="border-primary/10 relative overflow-hidden group max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Upload OCT Scan</CardTitle>
              <CardDescription className="text-muted-foreground">
                Send a scan to the AI model for prediction
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all 
          ${dragActive ? "border-green-400 bg-blue-50" : "border-gray-300"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="oct-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  {previewUrl ? (
                    <div>
                      <Image
                        src={previewUrl}
                        alt="OCT Scan Preview"
                        width={192}
                        height={192}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-10 h-10 text-primary/60"
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
                      <span className="text-xs text-gray-400">
                        Only image files allowed
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="oct-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files![0])}
                />
              </div>

              {file && (
                <div className="mt-4 text-center text-sm text-[#9bc9b2] font-medium">
                  Selected: <span>{file.name}</span>
                </div>
              )}

              {file && (
                <div className="mt-6 flex justify-between ">
                  <Button
                    variant="default"
                    onClick={handlePredict}
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    Predict Scan
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
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
            </CardContent>

            <ConfirmModal
              isOpen={showModal}
              onConfirm={handleConfirm}
              onCancel={handleReject}
            />

            <LoadingModal isOpen={loading} />
            <PredictionResultModal
              isOpen={resultModalOpen}
              onClose={() => setResultModalOpen(false)}
              predictionResult={predictionResult}
            />
          </Card>
        </div>
      </Container>
    </div>
  );
}
