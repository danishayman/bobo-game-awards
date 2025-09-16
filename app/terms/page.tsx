"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, UserCheck, Shield, AlertTriangle, Gavel, ArrowLeft, Mail } from "lucide-react";
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

const termsSections = [
  {
    icon: UserCheck,
    title: "Acceptance of Terms",
    content: [
      "By accessing and using the Bobo Game Awards platform, you accept and agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, you may not access or use our platform.",
      "We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.",
      "You must be at least 13 years old to use this platform, or have parental consent if younger."
    ]
  },
  {
    icon: Scale,
    title: "Platform Rules & Conduct",
    content: [
      "You agree to use the platform only for its intended purpose: voting in gaming awards.",
      "One vote per user per category - creating multiple accounts to vote multiple times is prohibited.",
      "You may not attempt to manipulate, hack, or interfere with the voting system or platform security.",
      "Harassment, hate speech, or inappropriate conduct towards other community members is not tolerated.",
      "You are responsible for maintaining the confidentiality of your account credentials."
    ]
  },
  {
    icon: Shield,
    title: "Voting Integrity",
    content: [
      "All votes must be cast honestly and reflect your genuine gaming preferences.",
      "Vote manipulation, bot voting, or coordinated voting campaigns are strictly prohibited.",
      "We reserve the right to investigate suspicious voting patterns and disqualify fraudulent votes.",
      "Votes are final once submitted during the voting period - changes cannot be made after finalization.",
      "We may implement additional security measures to ensure fair voting without prior notice."
    ]
  },
  {
    icon: Gavel,
    title: "Intellectual Property",
    content: [
      "The Bobo Game Awards platform, including its design, features, and content, is our intellectual property.",
      "Game titles, images, and descriptions are the property of their respective publishers and developers.",
      "You retain ownership of any content you submit, but grant us license to use it for platform operations.",
      "You may not copy, modify, distribute, or create derivative works of our platform without permission.",
      "All trademarks and logos are the property of their respective owners."
    ]
  }
];

const prohibitedActivities = [
  "Creating multiple accounts to vote multiple times",
  "Using automated tools, bots, or scripts to vote",
  "Attempting to hack, exploit, or compromise platform security",
  "Sharing false or misleading information about games or voting",
  "Harassing other users or disrupting the community",
  "Violating any applicable local, state, national, or international laws"
];

export default function TermsPage() {
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
                Terms of Service
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-body">
              These terms govern your use of the Bobo Game Awards platform. 
              Please read them carefully to understand your rights and responsibilities.
            </p>

            <div className="text-sm text-white/60 font-body">
              Last updated: September 2025
            </div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Welcome to Bobo Game Awards</h2>
          </div>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Bobo Game Awards 
              platform, a community-driven gaming awards voting system. These Terms constitute a 
              legally binding agreement between you and us.
            </p>
            <p>
              <span className="text-red-primary font-semibold">Veli Nai Veli Premium</span> - 
              Our commitment to quality extends to maintaining a fair, secure, and enjoyable 
              platform for all community members.
            </p>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {termsSections.map((section, index) => (
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

        {/* Prohibited Activities */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Prohibited Activities</h2>
          </div>
          <p className="text-white/80 font-body leading-relaxed">
            The following activities are strictly prohibited and may result in immediate account suspension or termination:
          </p>
          <div className="space-y-3">
            {prohibitedActivities.map((activity, index) => (
              <p key={index} className="text-white/80 leading-relaxed font-body flex items-start">
                <span className="text-red-primary mr-3 mt-2">×</span>
                <span>{activity}</span>
              </p>
            ))}
          </div>
        </motion.div>

        {/* Account Termination */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Account Termination</h2>
          <div className="space-y-4 text-white/80 font-body leading-relaxed">
            <p>
              <strong className="text-white">Your Right to Terminate:</strong> You may delete your account at any time by contacting us. 
              Upon termination, your voting data will be anonymized but preserved for award integrity.
            </p>
            <p>
              <strong className="text-white">Our Right to Terminate:</strong> We reserve the right to suspend or terminate accounts 
              that violate these Terms, engage in fraudulent voting, or compromise platform security.
            </p>
            <p>
              <strong className="text-white">Effect of Termination:</strong> Upon account termination, you lose access to the platform, 
              but your votes during active voting periods remain valid for award calculations.
            </p>
          </div>
        </motion.div>

        {/* Disclaimers */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Disclaimers</h2>
          <div className="space-y-4 text-white/80 font-body leading-relaxed">
            <p>
              <strong className="text-white">Platform Availability:</strong> We strive to maintain platform availability but cannot 
              guarantee uninterrupted service. Maintenance and updates may temporarily affect access.
            </p>
            <p>
              <strong className="text-white">Award Results:</strong> Award results are based on community votes and reflect the 
              preferences of participating voters. Results are final once announced.
            </p>
            <p>
              <strong className="text-white">Third-Party Content:</strong> Game information, images, and descriptions are provided 
              for informational purposes. We are not responsible for the accuracy of third-party content.
            </p>
          </div>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Limitation of Liability</h2>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              To the fullest extent permitted by law, the Bobo Game Awards platform and its operators 
              shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            <p>
              Our total liability to you for all claims arising from your use of the platform shall not 
              exceed the amount you paid us in the past twelve months (which is $0 for our free platform).
            </p>
          </div>
        </motion.div>

        {/* Governing Law */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white font-body">Governing Law</h2>
          <div className="text-white/80 font-body leading-relaxed">
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. 
              Any disputes arising from these Terms or your use of the platform shall be resolved 
              through binding arbitration or in courts of competent jurisdiction.
            </p>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-red-primary/20">
              <Mail className="h-8 w-8 text-red-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white font-body">Questions About These Terms?</h2>
          <p className="text-white/80 font-body leading-relaxed">
            If you have any questions about these Terms of Service or need clarification 
            on any policies, please don&apos;t hesitate to contact us.
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

        {/* Agreement */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white font-body">Agreement Acknowledgment</h3>
          <p className="text-white/70 font-body leading-relaxed max-w-2xl mx-auto">
            By using the Bobo Game Awards platform, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
