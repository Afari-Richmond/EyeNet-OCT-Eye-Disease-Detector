"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe2, Users, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const classes = [
  {
    name: "CNV",
    description:
      "Choroidal neovascularization: abnormal blood vessel growth under the retina.",
  },
  {
    name: "DME",
    description:
      "Diabetic macular edema: fluid buildup caused by diabetic retinopathy.",
  },
  {
    name: "DRUSEN",
    description:
      "Early age-related macular degeneration, marked by deposits under the retina.",
  },
  {
    name: "NORMAL",
    description: "No signs of the above conditions detected.",
  },
];

const points = [
  {
    icon: Globe2,
    title: "A global shortage, unevenly felt",
    description:
      "Specialist ophthalmologists and OCT equipment are concentrated in major cities. Rural clinics across Africa and other resource-constrained regions often have neither, leaving treatable conditions undiagnosed until vision loss is advanced or irreversible.",
  },
  {
    icon: Zap,
    title: "Early detection changes outcomes",
    description:
      "Conditions like CNV and DME are far more treatable when caught early. A model that can flag a likely diagnosis in seconds gives clinics without an on-site specialist a way to triage and refer patients before it's too late.",
  },
  {
    icon: Users,
    title: "Built for the clinic, not just the lab",
    description:
      "EyeNet is designed to run wherever a scan and an internet connection exist. No specialist hardware, no local GPU, no dedicated IT staff required.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl top-0 -left-20" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0" />
        </div>

        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5">
              <Eye className="w-4 h-4 text-primary" />
              <span>About EyeNet</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Early detection, anywhere a scan can reach
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              EyeNet puts AI-assisted OCT screening within reach of
              resource-constrained healthcare settings, from rural clinics in
              Africa to overstretched regional hospitals, helping catch
              sight-threatening conditions early enough to prevent avoidable
              blindness.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 px-4">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {points.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full border border-primary/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <point.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mt-3">
                      {point.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              What the model looks for
            </h2>
            <p className="text-muted-foreground">
              EyeNet classifies an uploaded OCT scan into one of four
              categories, trained on the Kermany et al. retinal OCT dataset.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {classes.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-primary/10 bg-card p-5"
              >
                <p className="font-semibold text-primary">{c.name}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-8">
            Training data and sample scans: Kermany, D.S. et al. (2018),
            &quot;Labeled Optical Coherence Tomography (OCT) and Chest X-Ray
            Images for Classification,&quot; via{" "}
            <a
              href="https://www.kaggle.com/datasets/paultimothymooney/kermany2018"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Kaggle
            </a>
            , licensed CC BY-NC-SA 4.0.
          </p>
        </Container>
      </section>

      <section className="py-20 px-4">
        <Container className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to try it?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Upload a scan and see a prediction in seconds. No account
            required to try it as a guest.
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
