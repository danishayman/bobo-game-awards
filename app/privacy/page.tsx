"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
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

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-3xl mx-auto px-6 space-y-12"
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
            
            <h1 className="text-4xl md:text-6xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body">
              Your privacy matters. Here&apos;s how we handle your information.
            </p>

            <div className="text-sm text-white/60 font-body">
              Last updated: December 2025
            </div>
          </div>
        </motion.div>

        {/* Main Privacy Content */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">What You Should Know</h2>
          </div>
          
          <div className="space-y-6 text-white/80 font-body leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Information We Collect</h3>
              <p>
                When you sign in with Google or Twitch, we collect your display name, email, and profile picture. 
                We also collect your voting choices and basic technical information for security purposes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">How We Use It</h3>
              <p>
                We use your information to run the voting platform, prevent fraud, and communicate about the awards. 
                We don&apos;t sell your data to anyone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Security & Protection</h3>
              <p>
                All data is stored securely using Supabase with encryption. We use industry-standard security 
                measures and restrict access to authorized personnel only.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
              <p>
                You can request access to your data, ask us to correct or delete it, or get a copy in a portable format. 
                Just reach out if you need anything.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Third-Party Services</h3>
              <p>
                We use Supabase for our database, and Google/Twitch for sign-in authentication. 
                Each service has its own privacy policy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Policy Updates */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-white/70 font-body leading-relaxed">
            We may update this policy occasionally. Changes will be posted here with an updated date.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
