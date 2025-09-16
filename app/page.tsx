"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { isVotingActive, getVotingDeadline, VOTING_CONFIG } from "@/lib/config/voting";
import { useEffect, useState } from "react";
import { CountdownBanner } from "@/components/ui/countdown-banner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export default function Home() {
  const [votingActive, setVotingActive] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVotingActive(isVotingActive());
  }, []);

  // Don't render countdown until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative text-center space-y-12 px-6 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-lg mx-auto mb-8"></div>
            <div className="h-20 bg-white/10 rounded mb-4"></div>
            <div className="h-12 bg-white/10 rounded mb-8"></div>
            <div className="h-12 w-48 bg-white/10 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {VOTING_CONFIG.COUNTDOWN_ENABLED && (
        <CountdownBanner 
          deadline={getVotingDeadline()}
          title="VOTING ENDS IN"
        />
      )}
      <div className="flex items-center justify-center relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative text-center space-y-12 px-6 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/logo.webp"
              alt="Bobo Game Awards Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
              priority
            />
          </div>
        </motion.div>
        
        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent block">
              Bobo Game
            </span>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent block">
              Awards
            </span>
          </h1>
        </motion.div>
        
        {/* Year */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              2025
            </span>
          </div>
        </motion.div>

        
        {/* Subtitle */}
        <motion.div variants={itemVariants} className="space-y-8 mt-12">
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body">
            Community-driven awards by Spudin, for Spudins. 
            <br />
            Veli Nai Veli Premium
            </p>
          
          {/* Call to Action */}
          {votingActive ? (
            <Button 
              asChild 
              size="lg" 
              className="bg-red-primary hover:bg-red-secondary text-white px-12 py-6 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
            >
              <Link href="/vote">
                <Vote className="mr-3 h-6 w-6" />
                Start Voting
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-white/20 text-white hover:text-red-primary hover:border-red-primary/50 px-12 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 font-body"
            >
              <Link href="/results">
                <Vote className="mr-3 h-6 w-6" />
                View Results
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
