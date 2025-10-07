// Global voting configuration
// You can modify this date/time to set when voting closes globally

export const VOTING_CONFIG = {
  // Set your voting deadline here
  // This is the deadline in GMT+8 time - the system will convert it properly
  // Format: YYYY-MM-DD HH:MM:SS (this will be interpreted as GMT+8 time)
  DEADLINE_YEAR: 2026,
  DEADLINE_MONTH: 1, // September (1-12)
  DEADLINE_DAY: 7,
  DEADLINE_HOUR: 23, // 11 PM
  DEADLINE_MINUTE: 59,
  DEADLINE_SECOND: 59,
  
  // Live voting start time (voting is locked until this time)
  // Only admins can vote before this time
  LIVE_VOTING_START_YEAR: 2025,
  LIVE_VOTING_START_MONTH: 10, // September (1-12)
  LIVE_VOTING_START_DAY: 1,
  LIVE_VOTING_START_HOUR: 0, // 6 PM
  LIVE_VOTING_START_MINUTE: 0,
  LIVE_VOTING_START_SECOND: 0,
  
  // Timezone offset from UTC (GMT+8 = +8 hours)
  TIMEZONE_OFFSET_HOURS: 8,
  
  // Timezone for display
  DISPLAY_TIMEZONE: 'Asia/Singapore', // More specific than 'GMT+8'
  
  // Enable/disable the countdown globally
  COUNTDOWN_ENABLED: true,
  
  // Show countdown even after voting ends (for display purposes)
  SHOW_COUNTDOWN_AFTER_END: true,
  
  // Enable/disable voting lock (set to false to allow all users to vote immediately)
  VOTING_LOCK_ENABLED: true,
} as const;

/**
 * Get the voting deadline as a Date object in GMT+8
 */
function getGMT8Deadline(): Date {
  // Create the deadline in GMT+8 by subtracting the offset from UTC
  const utcDeadline = new Date(Date.UTC(
    VOTING_CONFIG.DEADLINE_YEAR,
    VOTING_CONFIG.DEADLINE_MONTH - 1, // Month is 0-indexed in Date
    VOTING_CONFIG.DEADLINE_DAY,
    VOTING_CONFIG.DEADLINE_HOUR - VOTING_CONFIG.TIMEZONE_OFFSET_HOURS, // Subtract 8 hours to convert GMT+8 to UTC
    VOTING_CONFIG.DEADLINE_MINUTE,
    VOTING_CONFIG.DEADLINE_SECOND
  ));
  
  return utcDeadline;
}

/**
 * Get the live voting start time as a Date object in GMT+8
 */
function getGMT8LiveVotingStart(): Date {
  // Create the live voting start time in GMT+8 by subtracting the offset from UTC
  const utcLiveStart = new Date(Date.UTC(
    VOTING_CONFIG.LIVE_VOTING_START_YEAR,
    VOTING_CONFIG.LIVE_VOTING_START_MONTH - 1, // Month is 0-indexed in Date
    VOTING_CONFIG.LIVE_VOTING_START_DAY,
    VOTING_CONFIG.LIVE_VOTING_START_HOUR - VOTING_CONFIG.TIMEZONE_OFFSET_HOURS, // Subtract 8 hours to convert GMT+8 to UTC
    VOTING_CONFIG.LIVE_VOTING_START_MINUTE,
    VOTING_CONFIG.LIVE_VOTING_START_SECOND
  ));
  
  return utcLiveStart;
}

/**
 * Check if voting is currently active (before the global deadline)
 */
export function isVotingActive(): boolean {
  const now = new Date();
  return now < getGMT8Deadline();
}

/**
 * Get the global voting deadline
 */
export function getVotingDeadline(): Date {
  return getGMT8Deadline();
}

/**
 * Get the live voting start time
 */
export function getLiveVotingStart(): Date {
  return getGMT8LiveVotingStart();
}

/**
 * Check if live voting has started (anyone can vote)
 */
export function isLiveVotingActive(): boolean {
  if (!VOTING_CONFIG.VOTING_LOCK_ENABLED) {
    return true; // If voting lock is disabled, always allow voting
  }
  
  const now = new Date();
  return now >= getGMT8LiveVotingStart();
}

/**
 * Check if voting is locked (only admins can vote)
 */
export function isVotingLocked(): boolean {
  if (!VOTING_CONFIG.VOTING_LOCK_ENABLED) {
    return false; // If voting lock is disabled, never lock voting
  }
  
  return !isLiveVotingActive();
}

/**
 * Check if a user can vote (considers both general voting period and voting lock)
 * @param isAdmin - Whether the user is an admin
 */
export function canUserVote(isAdmin: boolean = false): boolean {
  // First check if voting is still active (hasn't ended)
  if (!isVotingActive()) {
    return false;
  }
  
  // If voting is locked, only admins can vote
  if (isVotingLocked()) {
    return isAdmin;
  }
  
  // If live voting is active, anyone can vote
  return true;
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
  const deadline = getGMT8Deadline().getTime();
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
 * Get time remaining until live voting starts
 */
export function getTimeUntilLiveVoting(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date().getTime();
  const liveStart = getGMT8LiveVotingStart().getTime();
  const distance = liveStart - now;

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
 * Format the deadline for display in GMT+8
 */
export function formatDeadlineForDisplay(): string {
  return getGMT8Deadline().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: VOTING_CONFIG.DISPLAY_TIMEZONE,
  });
}

/**
 * Get a user-friendly description of the deadline
 */
export function getDeadlineDescription(): string {
  return `${VOTING_CONFIG.DEADLINE_DAY} ${getMonthName(VOTING_CONFIG.DEADLINE_MONTH)} ${VOTING_CONFIG.DEADLINE_YEAR} at ${VOTING_CONFIG.DEADLINE_HOUR.toString().padStart(2, '0')}:${VOTING_CONFIG.DEADLINE_MINUTE.toString().padStart(2, '0')} GMT+8`;
}

/**
 * Format the live voting start time for display in GMT+8
 */
export function formatLiveVotingStartForDisplay(): string {
  return getGMT8LiveVotingStart().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: VOTING_CONFIG.DISPLAY_TIMEZONE,
  });
}

/**
 * Get a user-friendly description of the live voting start time
 */
export function getLiveVotingStartDescription(): string {
  return `${VOTING_CONFIG.LIVE_VOTING_START_DAY} ${getMonthName(VOTING_CONFIG.LIVE_VOTING_START_MONTH)} ${VOTING_CONFIG.LIVE_VOTING_START_YEAR} at ${VOTING_CONFIG.LIVE_VOTING_START_HOUR.toString().padStart(2, '0')}:${VOTING_CONFIG.LIVE_VOTING_START_MINUTE.toString().padStart(2, '0')} GMT+8`;
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
}
