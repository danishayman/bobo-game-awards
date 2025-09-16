"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Vote,
  Trophy,
  UserCheck,
  Eye,
  Gavel
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
    title: "Eligibility Requirements",
    rules: [
      "You must have a valid account registered through Google or Twitch authentication",
      "Only one vote per person per category - multiple accounts are prohibited",
      "You must be a member of the gaming community (no age restrictions)",
      "Account must be created before the voting period begins"
    ]
  },
  {
    icon: Clock,
    title: "Voting Timeline",
    rules: [
      "Voting opens on the announced start date and time",
      "Voting period typically lasts 2-3 weeks",
      "All votes must be submitted before the deadline",
      "Late submissions will not be accepted under any circumstances",
      "Winners are announced within 1 week after voting closes"
    ]
  },
  {
    icon: Vote,
    title: "How Voting Works",
    rules: [
      "Select your favorite nominee in each category you wish to vote in",
      "You can vote in all categories or just the ones you care about",
      "Review your selections in the summary before finalizing",
      "Once finalized, votes cannot be changed or undone",
      "Your vote is completely anonymous and secure"
    ]
  },
  {
    icon: Shield,
    title: "Voting Integrity",
    rules: [
      "All votes are encrypted and stored securely",
      "Vote manipulation or fraud attempts will result in disqualification",
      "Using bots, scripts, or automated voting tools is strictly prohibited",
      "Coordinated voting campaigns or brigading are not allowed",
      "We monitor for suspicious voting patterns and investigate anomalies"
    ]
  }
];

const prohibitedActions = [
  {
    icon: XCircle,
    title: "Creating Multiple Accounts",
    description: "Using multiple accounts to vote more than once per category is strictly forbidden."
  },
  {
    icon: XCircle,
    title: "Automated Voting",
    description: "Using bots, scripts, or any automated tools to cast votes is prohibited."
  },
  {
    icon: XCircle,
    title: "Vote Trading/Selling",
    description: "Buying, selling, or trading votes is not allowed and undermines the integrity of the awards."
  },
  {
    icon: XCircle,
    title: "Harassment or Intimidation",
    description: "Pressuring or harassing others to vote a certain way is unacceptable."
  },
  {
    icon: XCircle,
    title: "False Information",
    description: "Spreading misinformation about nominees or the voting process is prohibited."
  },
  {
    icon: XCircle,
    title: "System Exploitation",
    description: "Attempting to hack, exploit, or bypass security measures will result in immediate disqualification."
  }
];

const allowedActions = [
  {
    icon: CheckCircle,
    title: "Honest Voting",
    description: "Vote for games you genuinely believe deserve recognition based on your experience."
  },
  {
    icon: CheckCircle,
    title: "Community Discussion",
    description: "Engage in respectful discussions about nominees in community spaces."
  },
  {
    icon: CheckCircle,
    title: "Sharing Your Thoughts",
    description: "Share your voting choices and reasoning in a respectful manner."
  },
  {
    icon: CheckCircle,
    title: "Encouraging Participation",
    description: "Encourage others to participate in voting while respecting their autonomy."
  },
  {
    icon: CheckCircle,
    title: "Asking Questions",
    description: "Ask for clarification about rules, nominees, or the voting process."
  },
  {
    icon: CheckCircle,
    title: "Providing Feedback",
    description: "Share constructive feedback about the awards process or platform."
  }
];

const consequences = [
  {
    severity: "Warning",
    color: "text-yellow-400",
    actions: ["First-time minor violations", "Unintentional rule breaches"],
    result: "Account warning with educational information"
  },
  {
    severity: "Vote Disqualification",
    color: "text-orange-400", 
    actions: ["Multiple account creation", "Suspicious voting patterns"],
    result: "Specific votes removed from current awards"
  },
  {
    severity: "Account Suspension",
    color: "text-red-400",
    actions: ["Repeated violations", "Harassment of community members"],
    result: "Temporary or permanent account suspension"
  },
  {
    severity: "Community Ban",
    color: "text-red-600",
    actions: ["Serious fraud attempts", "Malicious system attacks"],
    result: "Permanent ban from all Bobo Game Awards activities"
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
              Fair play is essential to the integrity of our community-driven awards. 
              Please read these rules carefully to ensure your vote counts and our process remains transparent.
            </p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Our Commitment to Fair Voting</h2>
          </div>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              The Bobo Game Awards represents the authentic voice of the gaming community. 
              To maintain the integrity and fairness of our awards, we've established these 
              comprehensive rules that all participants must follow.
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

        {/* What's Allowed vs What's Not */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-6" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Do's and Don'ts
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allowed Actions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400 font-body flex items-center">
                <CheckCircle className="mr-3 h-6 w-6" />
                What's Encouraged
              </h3>
              <div className="space-y-4">
                {allowedActions.map((action, index) => (
                  <div key={index} className="glass rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <h4 className="font-semibold text-white font-body">{action.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm font-body leading-relaxed pl-8">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prohibited Actions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-red-400 font-body flex items-center">
                <XCircle className="mr-3 h-6 w-6" />
                What's Prohibited
              </h3>
              <div className="space-y-4">
                {prohibitedActions.map((action, index) => (
                  <div key={index} className="glass rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <h4 className="font-semibold text-white font-body">{action.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm font-body leading-relaxed pl-8">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Consequences Section */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-6" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                Rule Enforcement
              </span>
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto font-body leading-relaxed">
              We take rule violations seriously to maintain the integrity of our awards. 
              Here's what happens when rules are broken:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consequences.map((consequence, index) => (
              <div key={index} className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-6 w-6 ${consequence.color}`} />
                  <h3 className={`text-xl font-semibold font-body ${consequence.color}`}>
                    {consequence.severity}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 font-body mb-2">
                      Triggers:
                    </h4>
                    <ul className="space-y-1">
                      {consequence.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-white/70 text-sm font-body flex items-start">
                          <span className="text-red-primary mr-2 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 font-body mb-1">
                      Result:
                    </h4>
                    <p className="text-white/80 text-sm font-body">
                      {consequence.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appeals Process */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Gavel className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Appeals Process</h2>
          </div>
          <div className="space-y-4 text-white/80 font-body leading-relaxed">
            <p>
              If you believe your account has been unfairly penalized or if you have questions 
              about a rule enforcement action, you can appeal the decision:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span>Contact us within 7 days of the enforcement action</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span>Provide detailed information about your situation</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span>Include any evidence that supports your case</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-primary mr-3 mt-2">•</span>
                <span>We will review your appeal within 3-5 business days</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Reporting Violations */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-red-primary" />
            <h2 className="text-2xl font-semibold text-white font-body">Reporting Violations</h2>
          </div>
          <div className="text-white/80 font-body leading-relaxed space-y-4">
            <p>
              Help us maintain a fair voting environment by reporting suspected rule violations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold">What to Report:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Suspicious voting patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Multiple account usage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Vote buying/selling attempts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Harassment or intimidation</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold">How to Report:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Use the contact form with details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Include evidence if available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>Reports are kept confidential</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-primary mr-2 mt-1">•</span>
                    <span>False reports may be penalized</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              Ready to Vote Fairly?
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto font-body leading-relaxed">
            Now that you understand the rules, join thousands of fellow gamers in celebrating 
            the best games of 2025. Your fair and honest vote makes a difference!
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

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8 text-center space-y-6">
          <h3 className="text-2xl font-semibold text-white font-body">Questions About the Rules?</h3>
          <p className="text-white/80 font-body leading-relaxed max-w-2xl mx-auto">
            If you need clarification about any voting rules or have questions about the process, 
            don't hesitate to reach out. We're here to help ensure fair play for everyone.
          </p>
          <Button 
            asChild 
            variant="outline" 
            className="border-red-primary/30 text-red-primary hover:bg-red-primary hover:text-white transition-all duration-300 font-body"
          >
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
