# Voting Countdown & Deadline Setup

This document explains how to configure and use the voting countdown and deadline system for the Bobo Game Awards.

## Overview

The system provides:
- ⏰ **Visual countdown timer** on the home page
- 🔒 **Automatic voting protection** when deadline passes
- 🚫 **API endpoint protection** to prevent vote submissions
- 🎯 **Configurable deadline** with easy date/time setting

## Configuration

### Setting the Voting Deadline

Edit the file `lib/config/voting.ts` to configure your voting deadline:

```typescript
export const VOTING_CONFIG = {
  // Set your voting deadline here
  // Format: YYYY-MM-DD HH:MM:SS in UTC
  GLOBAL_VOTING_DEADLINE: new Date('2025-01-15T23:59:59Z'), // Example: January 15, 2025 at 11:59 PM UTC
  
  // Timezone for display (optional - used for user-friendly display)
  DISPLAY_TIMEZONE: 'UTC',
  
  // Enable/disable the countdown globally
  COUNTDOWN_ENABLED: true,
  
  // Show countdown even after voting ends (for display purposes)
  SHOW_COUNTDOWN_AFTER_END: true,
} as const;
```

### Key Configuration Options

- **`GLOBAL_VOTING_DEADLINE`**: The exact date and time when voting closes
- **`DISPLAY_TIMEZONE`**: Timezone for user-friendly display (defaults to UTC)
- **`COUNTDOWN_ENABLED`**: Enable/disable the countdown timer on home page
- **`SHOW_COUNTDOWN_AFTER_END`**: Whether to show expired countdown message

## Features

### 1. Countdown Timer
- Shows on the home page with days, hours, minutes, and seconds
- Changes color as deadline approaches (blue → yellow → red)
- Shows urgency messages in final 24 hours and final hour
- Smooth animations and visual effects

### 2. Automatic Protection
When voting deadline passes:
- **Home page**: Button changes from "Start Voting" to "View Results"
- **Vote pages**: Show "Voting Has Ended" message with redirect options
- **API endpoints**: Return 403 error with clear message
- **Middleware**: Protects all voting routes automatically

### 3. Protected Routes
The following routes are automatically protected:
- `/vote` and all sub-pages
- `/api/votes` (vote submission)
- `/api/ballot/finalize` (ballot finalization)

## How It Works

### Client-Side Protection
- Home page checks voting status and updates UI accordingly
- Vote page shows appropriate message when voting has ended
- Real-time countdown updates every second

### Server-Side Protection
- Middleware intercepts requests to voting routes
- API endpoints validate voting deadline before processing
- Returns consistent error messages across all endpoints

### Timeline Display
The countdown shows:
- **Normal state**: Blue colors, standard countdown
- **24 hours remaining**: Yellow colors, urgency message
- **1 hour remaining**: Red colors, critical warning
- **After deadline**: "Voting Has Ended" message

## Usage Examples

### Example 1: Set deadline for specific date
```typescript
GLOBAL_VOTING_DEADLINE: new Date('2025-02-14T18:00:00Z'), // Feb 14, 2025 at 6 PM UTC
```

### Example 2: Set deadline for end of month
```typescript
GLOBAL_VOTING_DEADLINE: new Date('2025-01-31T23:59:59Z'), // Last day of January 2025
```

### Example 3: Disable countdown temporarily
```typescript
COUNTDOWN_ENABLED: false, // Hides countdown on home page
```

## Testing

To test the deadline functionality:

1. **Test future deadline**: Set deadline to a future time and verify countdown works
2. **Test past deadline**: Set deadline to a past time and verify protection works
3. **Test API protection**: Try making API calls after deadline expires
4. **Test route protection**: Try accessing `/vote` routes after deadline

## Important Notes

- **Time zones**: Always use UTC time for the deadline to avoid confusion
- **Caching**: Changes to the config require a server restart in production
- **Graceful degradation**: If countdown fails to load, voting functionality still works
- **Admin access**: Admins can still access results even if voting has ended

## Troubleshooting

### Countdown not showing
- Check that `COUNTDOWN_ENABLED` is `true`
- Verify the deadline is in the future
- Check browser console for JavaScript errors

### Voting still accessible after deadline
- Verify the deadline date/time is correct
- Check server time vs configured deadline
- Restart the server after config changes

### API calls still working after deadline
- Check middleware is properly configured
- Verify the route is in the protected paths list
- Check server logs for validation errors
