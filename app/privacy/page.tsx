"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Database, Cookie, Eye, ArrowLeft } from "lucide-react";
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

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "When you sign in with Google, Twitch, or Discord, we collect your display name, email address, and profile picture.",
      "We collect voting data including your game preferences and category selections.",
      "We automatically collect technical information such as IP address, browser type, and device information for security and analytics purposes.",
      "We may collect additional information you voluntarily provide when contacting us or participating in community features."
    ]
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To provide and maintain the voting platform and user accounts.",
      "To process and tabulate votes for the gaming awards.",
      "To prevent fraud and ensure voting integrity.",
      "To communicate with you about the awards, voting periods, and results.",
      "To improve our platform and develop new features.",
      "To comply with legal obligations and protect our rights."
    ]
  },
  {
    icon: Shield,
    title: "Data Protection & Security",
    content: [
      "We use industry-standard security measures to protect your personal information.",
      "All data is stored securely using Supabase with encryption in transit and at rest.",
      "Access to your personal information is limited to authorized personnel only.",
      "We implement Row Level Security (RLS) policies to ensure data isolation.",
      "Regular security audits and updates are performed to maintain protection standards."
    ]
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your login session and platform functionality.",
      "Analytics cookies help us understand how users interact with our platform.",
      "We do not sell or share your data with third-party advertisers.",
      "You can control cookie preferences through your browser settings.",
      "Some features may not work properly if essential cookies are disabled."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden py-20 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-4xl mx-auto px-6 space-y-16"
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
                Privacy Policy
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-body">
              Your privacy is important to us. This policy explains how we collect, use, and protect 
              your information when you use the Bobo Game Awards platform.
            </p>

            <div className="text-sm text-white/60 font-body">
              Last updated: September 2025
            </div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Our Commitment to Privacy</h2>
          </div>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              At Bobo Game Awards, we believe in transparency and respect for your privacy. 
              This Privacy Policy describes how we handle your personal information when you use our 
              community-driven gaming awards platform.
            </p>
            <p>
              By using our platform, you agree to the collection and use of information in accordance 
              with this policy. We will not use or share your information with anyone except as described 
              in this Privacy Policy.
            </p>
          </div>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
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
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-white/80 leading-relaxed font-body flex items-start">
                    <span className="text-red-primary mr-3 mt-2">•</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Rights Section */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Your Data Rights</h2>
          <div className="space-y-4 text-white/80 font-body leading-relaxed">
            <p>
              <strong className="text-white">Access:</strong> You can request access to the personal information we hold about you.
            </p>
            <p>
              <strong className="text-white">Correction:</strong> You can request that we correct any inaccurate personal information.
            </p>
            <p>
              <strong className="text-white">Deletion:</strong> You can request that we delete your personal information, subject to certain exceptions.
            </p>
            <p>
              <strong className="text-white">Data Portability:</strong> You can request a copy of your personal information in a structured, machine-readable format.
            </p>
          </div>
        </motion.div>

        {/* Third Party Services */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Third-Party Services</h2>
          <div className="space-y-4 text-white/80 font-body leading-relaxed">
            <p>
              Our platform integrates with the following third-party services:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span><strong className="text-white">Supabase:</strong> Database and authentication services (covered by their privacy policy)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span><strong className="text-white">Google OAuth:</strong> For Google sign-in authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span><strong className="text-white">Twitch OAuth:</strong> For Twitch sign-in authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span><strong className="text-white">Discord OAuth:</strong> For Discord sign-in authentication</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-red-primary/20">
              <Mail className="h-8 w-8 text-red-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white font-body">Questions or Concerns?</h2>
          <p className="text-white/80 font-body leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us. We&apos;re committed to addressing your concerns promptly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              className="bg-red-primary hover:bg-red-secondary text-white px-6 py-3 font-semibold rounded-full transition-all duration-300 font-body"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Policy Updates */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white font-body">Policy Updates</h3>
          <p className="text-white/70 font-body leading-relaxed max-w-2xl mx-auto">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
