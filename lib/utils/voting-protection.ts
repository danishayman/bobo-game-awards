import { NextResponse } from 'next/server';
import { isVotingActive } from '@/lib/config/voting';

/**
 * Middleware utility to check if voting is still active
 * Returns an error response if voting has ended
 */
export function checkVotingDeadline(): NextResponse | null {
  if (!isVotingActive()) {
    return NextResponse.json(
      { 
        error: 'Voting has ended',
        message: 'The global voting period has concluded. No new votes can be submitted.',
        code: 'VOTING_ENDED'
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Check if voting is active and return appropriate response
 * Use this in API routes that handle voting operations
 */
export function validateVotingPeriod(): { isActive: boolean; response?: NextResponse } {
  const votingActive = isVotingActive();
  
  if (!votingActive) {
    return {
      isActive: false,
      response: NextResponse.json(
        { 
          error: 'Voting has ended',
          message: 'The global voting period has concluded. No new votes can be submitted.',
          code: 'VOTING_ENDED'
        },
        { status: 403 }
      )
    };
  }
  
  return { isActive: true };
}
