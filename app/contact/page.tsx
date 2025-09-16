"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, ArrowLeft, Users, Clock, MapPin } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

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

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll get back to you within 24-48 hours.",
    info: "contact@bobogameawards.com",
    action: "mailto:contact@bobogameawards.com"
  },
  {
    icon: MessageSquare,
    title: "Community Discord",
    description: "Join our Discord community for real-time support and discussions.",
    info: "discord.gg/bobogameawards",
    action: "https://discord.gg/bobogameawards"
  },
  {
    icon: Users,
    title: "Community Forums",
    description: "Connect with other community members and get help from moderators.",
    info: "Visit Community Hub",
    action: "/community"
  }
];

const contactReasons = [
  "Technical support or voting issues",
  "Questions about voting rules or categories",
  "Game nomination suggestions",
  "Partnership or collaboration inquiries",
  "Privacy policy or data questions", 
  "Reporting inappropriate behavior",
  "General feedback or suggestions"
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    reason: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        reason: ""
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                Get in Touch
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-body">
              Have questions, feedback, or need support? We&apos;re here to help! 
              Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-6" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                How to Reach Us
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass glass-hover rounded-xl p-8 space-y-6 text-center nominee-card-hover"
              >
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-red-primary/20">
                    <method.icon className="h-8 w-8 text-red-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white font-body">
                    {method.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed font-body">
                    {method.description}
                  </p>
                  <div className="pt-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="border-red-primary/30 text-red-primary hover:bg-red-primary hover:text-white transition-all duration-300 font-body"
                    >
                      <Link href={method.action}>
                        {method.info}
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-4" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                  Send Us a Message
                </span>
              </h2>
              <p className="text-white/70 font-body leading-relaxed">
                Fill out the form below and we&apos;ll get back to you within 24-48 hours.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                className="glass rounded-xl p-8 text-center space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <Send className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white font-body">Message Sent!</h3>
                <p className="text-white/70 font-body">
                  Thank you for contacting us. We&apos;ll get back to you soon!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white font-body">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-red-primary focus:outline-none transition-colors font-body"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white font-body">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-red-primary focus:outline-none transition-colors font-body"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium text-white font-body">
                    Reason for Contact
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-red-primary focus:outline-none transition-colors font-body"
                  >
                    <option value="">Select a reason (optional)</option>
                    {contactReasons.map((reason, index) => (
                      <option key={index} value={reason} className="bg-background-secondary">
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-white font-body">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-red-primary focus:outline-none transition-colors font-body"
                    placeholder="Brief subject line"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-white font-body">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-red-primary focus:outline-none transition-colors resize-none font-body"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-primary hover:bg-red-secondary text-white px-8 py-4 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-body"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-3 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Information & FAQ */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Quick Info */}
            <div className="glass rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-white font-body">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <div className="text-white font-semibold font-body">Response Time</div>
                    <div className="text-white/70 text-sm font-body">24-48 hours for most inquiries</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <div className="text-white font-semibold font-body">Community</div>
                    <div className="text-white/70 text-sm font-body">Global gaming community</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <div className="text-white font-semibold font-body">Support Team</div>
                    <div className="text-white/70 text-sm font-body">Dedicated community moderators</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Topics */}
            <div className="glass rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-white font-body">Common Contact Reasons</h3>
              <div className="space-y-3">
                {contactReasons.slice(0, 5).map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-red-primary mt-2">•</span>
                    <span className="text-white/80 font-body">{reason}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 font-body"
                >
                  <Link href="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="glass rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-white font-body">Before You Contact Us</h3>
              <div className="space-y-4 text-white/80 font-body leading-relaxed">
                <p>
                  <strong className="text-white">Check our FAQ:</strong> Many common questions are answered in our documentation and community forums.
                </p>
                <p>
                  <strong className="text-white">Be specific:</strong> The more details you provide, the faster we can help resolve your issue.
                </p>
                <p>
                  <strong className="text-white">Stay respectful:</strong> Our team is here to help, and we appreciate kind communication.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-normal tracking-tight" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              Join Our Community
            </span>
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto font-body leading-relaxed">
            Connect with fellow gamers, stay updated on voting periods, and be part of the 
            conversation about the best games of the year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold rounded-full transition-all duration-300 font-body"
            >
              <Link href="/vote">
                Start Voting
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 font-semibold rounded-full transition-all duration-300 font-body"
            >
              <Link href="/about">
                About the Awards
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
