"use client";
import { Ripple } from "@/components/magicui/ripple";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScanEye, Cloud, ShieldCheck, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-500/50" },
    { value: 25, label: "😊 Content", color: "from-green-500/50" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
    { value: 100, label: "✨ Excited", color: "from-pink-500/50" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  const features = [
    {
      icon: ScanEye,
      title: "AI-Powered Detection",
      description:
        "Leverages deep learning to detect retinal diseases from OCT scans with high accuracy.",
      color: "from-purple-500/20",
      delay: 0.2,
    },
    {
      icon: Cloud,
      title: "Cloud-Based Access",
      description:
        "Upload, analyze, and access diagnostic results from anywhere, anytime.",
      color: "from-sky-500/20",
      delay: 0.4,
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      description:
        "Your scans and data are encrypted and stored with industry-grade security.",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: Activity,
      title: "Real-Time Analysis",
      description:
        "Receive diagnostic feedback instantly with confidence scoring.",
      color: "from-pink-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out
            bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <Ripple className="opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 space-y-8 text-center"
        >
          {/* Enhanced badge with subtle animation */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
            <Waves className="w-4 h-4 animate-wave text-primary" />
            <span className="relative text-foreground/90 dark:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary/30 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
              👁️ EyeNet – Smarter Vision Diagnostics with AI
            </span>
          </div>

          {/* Enhanced main heading with smoother gradient */}
          <h1 className="text-4xl md:text-6xl lg:text-[80px] font-bold font-plus-jakarta tracking-tight -7 ">
            <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] hover:to-primary transition-all duration-300 leading-tight">
              Early Detection
            </span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent leading-[1.3]">
              Lifelong Vision
            </span>
          </h1>
          {/* Enhanced description with better readability */}
          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Experience a new era of eye care. EyeNet uses AI to detect eye
            diseases early, empowering you to protect your vision with
            confidence.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="relative group h-12 px-8 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30"
          >
            <span className="relative z-10 font-medium flex items-center gap-2 cursor-pointer">
              Upload OCT Scan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-size-200 bg-pos-0 group-hover:bg-pos-100" />
          </Button>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" /> */}

        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-4 text-white ">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              Smarter Eye Care with EyeNet
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg">
              Discover smarter eye diagnosticsn - fast, secure, and AI-driven
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-[200px] bg-card/30 dark:bg-card/80 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 dark:group-hover:opacity-30`}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                        <feature.icon className="w-5 h-5 text-primary dark:text-primary/90" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
