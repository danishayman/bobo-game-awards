"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft } from "lucide-react";
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

export default function TermsPage() {
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
                Terms of Service
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body">
              The rules for using the Bobo Game Awards platform.
            </p>

            <div className="text-sm text-white/60 font-body">
              Last updated: December 2025
            </div>
          </div>
        </motion.div>

        {/* Main Terms Content */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-8">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">The Basics</h2>
          </div>
          
          <div className="space-y-6 text-white/80 font-body leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Using the Platform</h3>
              <p>
                By using Bobo Game Awards, you agree to these terms. You must be at least 13 years old. 
                Use the platform for voting in gaming awards—one vote per user per category. No cheating, 
                vote manipulation, or creating multiple accounts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">What&apos;s Not Allowed</h3>
              <p>
                Don&apos;t create multiple accounts, use bots or automated tools, hack or exploit the system, 
                harass other users, or try to manipulate voting. Votes are final once submitted—you can&apos;t 
                change them after finalization.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Your Account</h3>
              <p>
                Keep your login credentials secure. You can delete your account anytime (your votes will stay 
                anonymized for award integrity). We can suspend or terminate accounts that break these rules 
                or compromise platform security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Content & Ownership</h3>
              <p>
                The platform and its design are our intellectual property. Game info belongs to their respective 
                publishers. You keep ownership of content you submit but give us permission to use it for 
                running the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Disclaimers</h3>
              <p>
                We aim for 100% uptime but can&apos;t guarantee it—maintenance happens. Award results are based 
                on community votes and are final. We&apos;re not responsible for third-party game information 
                accuracy. The platform is provided &quot;as is&quot; without warranties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Changes to Terms</h3>
              <p>
                We may update these terms. Continued use of the platform means you accept any changes. 
                We&apos;ll update the date above when changes are made.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Agreement */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-white/70 font-body leading-relaxed">
            By using the platform, you agree to these terms and our Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
