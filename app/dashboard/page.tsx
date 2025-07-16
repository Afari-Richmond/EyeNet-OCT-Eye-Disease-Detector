"use client";

import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  MessageSquare,
  Heart,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-20 pb-8 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">
              Welcome 
            </h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
             
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Actions Card */}
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

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        
                        className={cn(
                          "flex flex-col h-[120px] px-4 py-3 group/mood hover:border-primary/50 ",
                          "justify-center items-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px] cursor-pointer bg-[#04090B] hover:bg-[#0D1E26]"
                        )}
                     
                      >
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
                          <Heart className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-white">Track Mood</div>
                          <div className="text-xs mt-0.5 text-white">
                            How are you feeling?
                          </div>
                        </div>
                      </Button>

                      <Button
                        
                        className={cn(
                          "flex flex-col h-[120px] px-4 py-3 group/ai hover:border-primary/50",
                          "justify-center items-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px] cursor-pointer bg-[#04090B] hover:bg-[#0D1E26]"
                        )}
                       
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <BrainCircuit className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-sm  text-white">Check-in</div>
                          <div className="text-xs  text-white mt-0.5">
                            Quick wellness check
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

           
           

          
          </div>

        
          
        </div>
      </Container>

      

     
    </div>
  );
}
