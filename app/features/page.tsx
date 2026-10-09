"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ScanEye,
  Cloud,
  ShieldCheck,
  Activity,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ScanEye,
    title: "AI-Powered Detection",
    description:
      "A deep learning model trained on retinal OCT scans classifies an uploaded image as CNV, DME, DRUSEN, or NORMAL in seconds.",
    color: "from-purple-500/20",
  },
  {
    icon: Activity,
    title: "Real-Time Analysis",
    description:
      "Get a prediction and confidence score the moment a scan is uploaded, with disease-specific recommendations included.",
    color: "from-pink-500/20",
  },
  {
    icon: Users,
    title: "Patient Records",
    description:
      "Keep a running list of patients and link each scan to one, so a patient's full scan history is always one click away.",
    color: "from-sky-500/20",
  },
  {
    icon: FileText,
    title: "PDF & Email Reports",
    description:
      "Generate a diagnosis report with doctor's remarks and a severity stage, then download it or share it by email.",
    color: "from-emerald-500/20",
  },
  {
    icon: Cloud,
    title: "Works Anywhere",
    description:
      "No specialist hardware or local GPU needed. Upload, analyze, and access results from any device with a browser.",
    color: "from-yellow-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Secure Accounts, Optional Guest Mode",
    description:
      "Sign in to save patients and scan history, or try a prediction instantly as a guest with no account required.",
    color: "from-orange-500/20",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl top-0 -left-20" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0" />
        </div>

        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything a clinic needs to screen OCT scans
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From a single prediction to a full patient record, EyeNet
              covers the whole workflow.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-10 px-4">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mt-3">
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-4">
        <Container className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            See it for yourself
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Upload a scan or try one of the built-in samples. No account
            required to take it for a spin.
          </p>
          <Button asChild size="lg" className="rounded-full cursor-pointer">
            <Link href="/dashboard">
              Try EyeNet <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
