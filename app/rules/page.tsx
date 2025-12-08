"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Vote,
  Trophy,
  UserCheck
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const votingRules = [
  {
    icon: UserCheck,
    title: "Eligibility",
    rules: [
      "One vote per person per category",
      "Valid Google or Twitch account required",
      "No multiple accounts"
    ]
  },
  {
    icon: Vote,
    title: "How to Vote",
    rules: [
      "Choose your favorite in each category",
      "Review your selections before finalizing",
      "Once submitted, votes cannot be changed"
    ]
  },
  {
    icon: Shield,
    title: "Fair Play",
    rules: [
      "No bots or automated voting",
      "No vote buying or selling",
      "Vote manipulation results in disqualification"
    ]
  }
];

const prohibitedActions = [
  {
    icon: XCircle,
    title: "Multiple Accounts",
    description: "Don't create extra accounts to vote more than once."
  },
  {
    icon: XCircle,
    title: "Bots & Scripts",
    description: "No automated voting tools allowed."
  },
  {
    icon: XCircle,
    title: "Vote Trading",
    description: "Don't buy, sell, or trade votes."
  }
];

const allowedActions = [
  {
    icon: CheckCircle,
    title: "Vote Honestly",
    description: "Choose games you genuinely believe deserve to win."
  },
  {
    icon: CheckCircle,
    title: "Discuss & Share",
    description: "Talk about your picks and encourage others to vote."
  },
  {
    icon: CheckCircle,
    title: "Ask Questions",
    description: "Reach out if you need help or clarification."
  }
];

const consequences = [
  {
    severity: "Vote Removal",
    color: "text-orange-400", 
    actions: ["Multiple accounts", "Suspicious patterns"],
    result: "Your votes will be removed"
  },
  {
    severity: "Account Ban",
    color: "text-red-400",
    actions: ["Repeated violations", "Fraud attempts"],
    result: "Permanent ban from voting"
  }
];

export default function RulesPage() {
  return (
    <div className="relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-6xl mx-auto px-6 space-y-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Back Button */}
          <Button 
            asChild 
            variant="ghost" 
            className="text-white/70 hover:text-red-primary hover:bg-white/10 p-2"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center space-y-6">
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
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Voting Rules
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
              Simple rules to keep voting fair for everyone.
            </p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Keep It Fair</h2>
          </div>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              Your vote represents the voice of the gaming community. Follow these simple rules to ensure everyone gets a fair say.
            </p>
          </div>
        </motion.div>

        {/* Voting Rules Sections */}
        <div className="space-y-8">
          {votingRules.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass glass-hover rounded-xl p-8 space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-primary/20">
                  <section.icon className="h-6 w-6 text-red-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-white font-body">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-3">
                {section.rules.map((rule, ruleIndex) => (
                  <p key={ruleIndex} className="text-white/80 leading-relaxed font-body flex items-start">
                    <span className="text-red-primary mr-3 mt-2">•</span>
                    <span>{rule}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
          



        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              Ready to Vote Fairly?
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto font-body leading-relaxed">
            Join thousands of gamers in celebrating the best games of 2025!
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
