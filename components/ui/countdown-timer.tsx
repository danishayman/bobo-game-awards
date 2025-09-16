"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  deadline: Date;
  onExpired?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({ deadline, onExpired, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        onExpired?.();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total: distance });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpired]);

  if (isExpired) {
    return (
      <motion.div 
        className={`text-center space-y-4 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-red-500" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
            Voting Has Ended
          </h2>
        </div>
        <p className="text-foreground-muted text-lg">
          The voting period has concluded. Thank you for your participation!
        </p>
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
          <Clock className={`h-8 w-8 ${isCritical ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-blue-400'}`} />
        </motion.div>
        <h2 className={`text-2xl md:text-3xl font-bold ${isCritical ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-blue-400'}`} style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
          Voting Ends In
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
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isCritical ? "⚠️ Final hour - Vote now!" : "⏰ Less than 24 hours remaining!"}
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
  return (
    <motion.div 
      className={`
        p-4 rounded-lg border transition-all duration-300
        ${isCritical 
          ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
          : isUrgent 
            ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
            : 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        }
      `}
      animate={animate ? { scale: [1, 1.05, 1] } : undefined}
      transition={animate ? { duration: 1, repeat: Infinity } : undefined}
    >
      <div className={`text-2xl md:text-3xl font-bold ${isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-blue-400'}`} style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-foreground-muted font-medium">
        {label}
      </div>
    </motion.div>
  );
}
