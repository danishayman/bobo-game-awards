// Global voting configuration
// You can modify this date/time to set when voting closes globally

export const VOTING_CONFIG = {
  // Set your voting deadline here
  // Format: YYYY-MM-DD HH:MM:SS in UTC
  GLOBAL_VOTING_DEADLINE: new Date('2025-09-20T23:59:59Z'), // Example: January 15, 2025 at 11:59 PM UTC
  
  // Timezone for display (optional - used for user-friendly display)
  DISPLAY_TIMEZONE: 'GMT+8',
  
  // Enable/disable the countdown globally
  COUNTDOWN_ENABLED: true,
  
  // Show countdown even after voting ends (for display purposes)
  SHOW_COUNTDOWN_AFTER_END: true,
} as const;

/**
 * Check if voting is currently active (before the global deadline)
 */
export function isVotingActive(): boolean {
  const now = new Date();
  return now < VOTING_CONFIG.GLOBAL_VOTING_DEADLINE;
}

/**
 * Get the global voting deadline
 */
export function getVotingDeadline(): Date {
  return VOTING_CONFIG.GLOBAL_VOTING_DEADLINE;
}

/**
 * Get time remaining until voting ends
 */
export function getTimeRemaining(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date().getTime();
  const deadline = VOTING_CONFIG.GLOBAL_VOTING_DEADLINE.getTime();
  const distance = deadline - now;

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: distance };
}

/**
 * Format the deadline for display
 */
export function formatDeadlineForDisplay(): string {
  return VOTING_CONFIG.GLOBAL_VOTING_DEADLINE.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: VOTING_CONFIG.DISPLAY_TIMEZONE,
  });
}
