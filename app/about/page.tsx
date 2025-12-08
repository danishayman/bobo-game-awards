"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Vote } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
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

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-4xl mx-auto px-6 space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              About the Awards
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body">
            A community-driven celebration of gaming excellence where every vote counts.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-8">
          <div className="space-y-6 text-white/80 font-body leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">What We&apos;re About</h2>
              <p>
                The Bobo Game Awards represents the authentic voice of the gaming community. Unlike traditional 
                industry awards, we put the power directly in the hands of players. <span className="text-red-primary font-semibold">Veli Nai Veli Premium</span> - 
                Created by Spudin for Spudins.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">How It Works</h2>
              <p>
                Every Spudin members can vote for their favorite games across multiple categories. 
                We use secure authentication and Row Level Security to ensure vote integrity and fairness. 
                One vote per person, per category—no manipulation, just genuine community choice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <p className="text-lg text-white/80 font-body">
            Ready to make your voice heard?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-red-primary hover:bg-red-secondary text-white px-8 py-4 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
            >
              <Link href="/vote">
                <Vote className="mr-3 h-5 w-5" />
                Start Voting
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 font-body"
            >
              <Link href="/nominees">
                <Trophy className="mr-3 h-5 w-5" />
                View Nominees
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
