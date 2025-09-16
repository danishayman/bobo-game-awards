"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Vote, Shield, Gamepad2, Heart, Calendar, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

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

const features = [
  {
    icon: Vote,
    title: "Community Voting",
    description: "Democratic voting system where every community member's voice matters in selecting the best games of the year."
  },
  {
    icon: Shield,
    title: "Secure & Fair",
    description: "Built with Supabase Row Level Security to ensure vote integrity and prevent manipulation."
  },
  {
    icon: Users,
    title: "For Spudins, By Spudins",
    description: "Created by the gaming community for the gaming community, celebrating our shared passion for great games."
  },
  {
    icon: Trophy,
    title: "Multiple Categories",
    description: "Comprehensive award categories covering all aspects of gaming, from gameplay to storytelling."
  }
];

const stats = [
  { label: "Award Categories", value: "10+" },
  { label: "Community Members", value: "500+" },
  { label: "Games Nominated", value: "100+" },
  { label: "Years Running", value: "1st" }
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-6xl mx-auto px-6 space-y-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/logo.webp"
                alt="Bobo Game Awards Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              About the Awards
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
            Welcome to the Bobo Game Awards 2025 - a community-driven celebration of gaming excellence 
            where every vote counts and every game has a chance to shine.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
            <div className="space-y-4 text-lg text-white/80 font-body leading-relaxed">
              <p>
                The Bobo Game Awards represents the authentic voice of the gaming community. 
                Unlike traditional industry awards, we put the power directly in the hands of players.
              </p>
              <p>
                <span className="text-red-primary font-semibold">Veli Nai Veli Premium</span>

              </p>
              <p>
                Created by Spudin for Spudins, this platform ensures every community member 
                can participate in honoring the year's most outstanding gaming achievements.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="glass rounded-2xl p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="h-6 w-6 text-red-primary" />
                <span className="text-xl font-semibold text-white">Community First</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-2xl md:text-3xl font-bold text-red-primary" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/70 font-body">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                What Makes Us Special
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass glass-hover rounded-xl p-6 space-y-4 nominee-card-hover"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-primary/20">
                    <feature.icon className="h-6 w-6 text-red-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-body">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed font-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Awards Timeline
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass glass-hover rounded-xl p-6 space-y-4 text-center nominee-card-hover">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-red-primary/20">
                  <Gamepad2 className="h-8 w-8 text-red-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white font-body">Nominations</h3>
              <p className="text-white/70 font-body">
                Community nominates their favorite games across multiple categories throughout the year.
              </p>
            </div>
            
            <div className="glass glass-hover rounded-xl p-6 space-y-4 text-center nominee-card-hover">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-red-primary/20">
                  <Vote className="h-8 w-8 text-red-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white font-body">Voting</h3>
              <p className="text-white/70 font-body">
                Registered community members vote for their favorites in each category during the voting period.
              </p>
            </div>
            
            <div className="glass glass-hover rounded-xl p-6 space-y-4 text-center nominee-card-hover">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-red-primary/20">
                  <Award className="h-8 w-8 text-red-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white font-body">Results</h3>
              <p className="text-white/70 font-body">
                Winners are announced and celebrated, showcasing the community's choice for gaming excellence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              Join the Community
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-body">
            Ready to make your voice heard? Join thousands of fellow gamers in celebrating 
            the best games of 2025.
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
