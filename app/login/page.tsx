"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { Chrome, Twitch } from "lucide-react";
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

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'twitch' | null>(null);
  const { signInWithGoogle, signInWithTwitch } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading('google');
      await signInWithGoogle();
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setLoading(null);
    }
  };

  const handleTwitchLogin = async () => {
    try {
      setLoading('twitch');
      await signInWithTwitch();
    } catch (error) {
      console.error('Error logging in with Twitch:', error);
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden py-20">
      {/* Background Effects - matching landing page */}
      <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <motion.div 
        className="relative text-center space-y-12 px-6 max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
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
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
              Reporting for duty!
            </span>
          </h1>
          <p className="text-lg text-white/80 font-body">
            Sign in to vote for your favorite games
          </p>
        </motion.div>
        
        {/* Login Buttons */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full bg-white hover:bg-gray-100 text-black px-6 py-4 text-lg font-semibold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-105 font-body flex items-center justify-center gap-3"
          >
            {loading === 'google' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            ) : (
              <>
                <Chrome className="h-5 w-5" />
                Continue with Google
              </>
            )}
          </Button>
          
          <Button
            onClick={handleTwitchLogin}
            disabled={loading !== null}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 text-lg font-semibold rounded-full shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300 transform hover:scale-105 font-body flex items-center justify-center gap-3"
          >
            {loading === 'twitch' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Twitch className="h-5 w-5" />
                Continue with Twitch
              </>
            )}
          </Button>
        </motion.div>

        {/* Footer Text */}
        <motion.div variants={itemVariants} className="text-center text-sm text-white/60 font-body">
          By signing in, you agree to participate in the<br />
          Bobo Game Awards 2025
        </motion.div>
      </motion.div>
    </div>
  );
}
