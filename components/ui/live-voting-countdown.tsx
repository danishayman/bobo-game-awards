"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Unlock } from 'lucide-react';
import { getTimeUntilLiveVoting, isLiveVotingActive } from '@/lib/config/voting';

interface LiveVotingCountdownProps {
  onLiveVotingStarted?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function LiveVotingCountdown({ onLiveVotingStarted, className = "" }: LiveVotingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isLiveStarted, setIsLiveStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = () => {
      if (isLiveVotingActive()) {
        setIsLiveStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        onLiveVotingStarted?.();
        return;
      }

      const timeUntilLive = getTimeUntilLiveVoting();
      setTimeLeft(timeUntilLive);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [onLiveVotingStarted, mounted]);

  // Don't render on server side to avoid hydration mismatch
  if (!mounted) {
    return (
      <motion.div 
        className={`text-center space-y-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3">
          <Clock className="h-8 w-8 text-yellow-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            Time Until Live Voting
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
          {/* Placeholder while loading */}
          <TimeUnit value={0} label="Days" isUrgent={false} isCritical={false} />
          <TimeUnit value={0} label="Hours" isUrgent={false} isCritical={false} />
          <TimeUnit value={0} label="Minutes" isUrgent={false} isCritical={false} />
          <TimeUnit value={0} label="Seconds" isUrgent={false} isCritical={false} animate={false} />
        </div>
      </motion.div>
    );
  }

  if (isLiveStarted) {
    return (
      <motion.div 
        className={`text-center space-y-4 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-green-500" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            Live Voting is Now Active!
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-lg text-green-400">
          <Unlock className="h-5 w-5" />
          <p>Everyone can now vote!</p>
        </div>
      </motion.div>
    );
  }

  // Determine if we're in the final 24 hours for urgency styling
  const isUrgent = timeLeft.total < (24 * 60 * 60 * 1000); // Less than 24 hours
  const isCritical = timeLeft.total < (60 * 60 * 1000); // Less than 1 hour

  return (
    <motion.div 
      className={`text-center space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Clock className={`h-8 w-8 ${isCritical ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-yellow-400'}`} />
        </motion.div>
        <h2 className={`text-2xl md:text-3xl font-bold ${isCritical ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-yellow-400'}`} style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
          Time Until Live Voting
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
        <TimeUnit 
          value={timeLeft.days} 
          label="Days" 
          isUrgent={isUrgent}
          isCritical={isCritical}
        />
        <TimeUnit 
          value={timeLeft.hours} 
          label="Hours" 
          isUrgent={isUrgent}
          isCritical={isCritical}
        />
        <TimeUnit 
          value={timeLeft.minutes} 
          label="Minutes" 
          isUrgent={isUrgent}
          isCritical={isCritical}
        />
        <TimeUnit 
          value={timeLeft.seconds} 
          label="Seconds" 
          isUrgent={isUrgent}
          isCritical={isCritical}
          animate={true}
        />
      </div>

      {isUrgent && (
        <motion.p 
          className={`text-lg font-semibold ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}
          animate={isCritical ? { scale: [1, 1.05, 1] } : undefined}
          transition={isCritical ? { duration: 1, repeat: Infinity } : undefined}
        >
          {isCritical ? 'Live voting starts very soon!' : 'Live voting starts soon!'}
        </motion.p>
      )}

    </motion.div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  isUrgent: boolean;
  isCritical: boolean;
  animate?: boolean;
}

function TimeUnit({ value, label, isUrgent, isCritical, animate = false }: TimeUnitProps) {
  const bgColor = isCritical ? 'bg-red-500/20 border-red-500/50' : 
                  isUrgent ? 'bg-yellow-500/20 border-yellow-500/50' : 
                  'bg-yellow-500/20 border-yellow-500/50';
  
  const textColor = isCritical ? 'text-red-300' : 
                    isUrgent ? 'text-yellow-300' : 
                    'text-yellow-300';

  return (
    <motion.div
      className={`${bgColor} border rounded-lg p-4 backdrop-blur-sm`}
      animate={animate && isCritical ? { scale: [1, 1.1, 1] } : undefined}
      transition={animate && isCritical ? { duration: 1, repeat: Infinity } : undefined}
    >
      <motion.div
        className={`text-2xl md:text-3xl font-bold ${textColor}`}
        animate={animate ? { opacity: [1, 0.5, 1] } : undefined}
        transition={animate ? { duration: 1, repeat: Infinity } : undefined}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <div className={`text-xs font-medium mt-1 ${textColor}`}>
        {label.toUpperCase()}
      </div>
    </motion.div>
  );
}
