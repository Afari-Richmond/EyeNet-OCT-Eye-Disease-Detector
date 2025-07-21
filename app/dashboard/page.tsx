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

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background ">
      <Container className="pt-20 pb-8 space-y-6 ">
        {/* Header Section */}
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon"></Button>
          </div>
        </div>

        {/* Main Grid Layout - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Card - Left Side */}
          <Card className="border-primary/10 relative overflow-hidden group pt-[-300px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
            <CardContent className="p-6 relative">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Quick Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Your eye care journey starts here
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 ">
                  <Button
                    variant="default"
                    className={cn(
                      "w-full justify-between items-center p-6 h-auto group/button",
                      "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
                      "transition-all duration-200 group-hover:translate-y-[-2px] cursor-pointer "
                    )}
                  >
                    <div className="flex items-center gap-3 ">
                      <div className="w-8 h-8 rounded-full bg-green-50  flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 " />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#0A1014]">
                          Start Prediction
                        </div>
                        <div className="text-xs  text-[#0A1014]">
                          Upload OCT Scan
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover/button:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#0A1014]" />
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Card - Right Side */}
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
                </label>
                <input
                  id="oct-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
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
                    onClick={() => alert("Predicting scan...")}
                    className="cursor-pointer"
                  >
                    Predict Scan
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      handleCancel();

                      document.getElementById("oct-upload").value = null;
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
