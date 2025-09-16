"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownBannerProps {
  deadline: Date;
  onExpired?: () => void;
  title?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownBanner({ deadline, onExpired, title = "VOTING ENDS IN" }: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

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
  }, [deadline, onExpired, mounted]);

  // Don't render on server side to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="text-xs font-bold tracking-wider">{title}</div>
            <div className="flex items-center space-x-3">
              {/* Placeholder while loading */}
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs font-medium mt-0.5">DAYS</div>
              </div>
              <div className="text-xl font-bold">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs font-medium mt-0.5">HOURS</div>
              </div>
              <div className="text-xl font-bold">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs font-medium mt-0.5">MINS</div>
              </div>
              <div className="text-xl font-bold">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs font-medium mt-0.5">SECS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <motion.div 
        className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <Clock className="h-4 w-4" />
            <div className="text-xs font-bold tracking-wider">VOTING HAS ENDED</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Determine urgency level for color changes
  const isUrgent = timeLeft.total < (24 * 60 * 60 * 1000); // Less than 24 hours
  const isCritical = timeLeft.total < (60 * 60 * 1000); // Less than 1 hour

  const backgroundClass = isCritical 
    ? "from-red-600 via-red-500 to-red-600 text-white" 
    : isUrgent 
      ? "from-orange-600 via-orange-500 to-orange-600 text-white"
      : "from-yellow-600 via-yellow-500 to-yellow-600 text-black";

  return (
    <motion.div 
      className={`w-full bg-gradient-to-r ${backgroundClass} py-2 shadow-lg`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-1">
          <motion.div 
            className="text-xs font-bold tracking-wider"
            animate={isCritical ? { scale: [1, 1.05, 1] } : undefined}
            transition={isCritical ? { duration: 1, repeat: Infinity } : undefined}
          >
            {title}
          </motion.div>
          
          <div className="flex items-center space-x-3">
            <TimeUnit 
              value={timeLeft.days} 
              label="DAYS" 
              animate={isCritical}
            />
            <Separator animate={isCritical} />
            <TimeUnit 
              value={timeLeft.hours} 
              label="HOURS" 
              animate={isCritical}
            />
            <Separator animate={isCritical} />
            <TimeUnit 
              value={timeLeft.minutes} 
              label="MINS" 
              animate={isCritical}
            />
            <Separator animate={isCritical} />
            <TimeUnit 
              value={timeLeft.seconds} 
              label="SECS" 
              animate={true} // Always animate seconds
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  animate?: boolean;
}

function TimeUnit({ value, label, animate = false }: TimeUnitProps) {
  return (
    <motion.div 
      className="text-center"
      animate={animate ? { scale: [1, 1.1, 1] } : undefined}
      transition={animate ? { duration: 1, repeat: Infinity } : undefined}
    >
      <div className="text-2xl font-bold leading-none">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs font-medium mt-0.5 tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

function Separator({ animate = false }: { animate?: boolean }) {
  return (
    <motion.div 
      className="text-xl font-bold"
      animate={animate ? { opacity: [1, 0.3, 1] } : undefined}
      transition={animate ? { duration: 1, repeat: Infinity } : undefined}
    >
      :
    </motion.div>
  );
}
