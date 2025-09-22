import { NextResponse } from 'next/server';
import { isVotingActive, canUserVote } from '@/lib/config/voting';

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
 * @param isAdmin - Whether the user is an admin (admins can bypass voting lock)
 */
export function validateVotingPeriod(isAdmin: boolean = false): { isActive: boolean; response?: NextResponse } {
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
  
  const userCanVote = canUserVote(isAdmin);
  
  if (!userCanVote) {
    return {
      isActive: false,
      response: NextResponse.json(
        { 
          error: 'Voting is locked',
          message: 'Live voting has not started yet. Only administrators can vote at this time.',
          code: 'VOTING_LOCKED'
        },
        { status: 403 }
      )
    };
  }
  
  return { isActive: true };
}

/**
 * Check if a specific user can vote (considering admin status and voting lock)
 * Returns an error response if user cannot vote
 * @param isAdmin - Whether the user is an admin
 */
export function checkUserVotingPermission(isAdmin: boolean = false): NextResponse | null {
  const validation = validateVotingPeriod(isAdmin);
  
  if (!validation.isActive && validation.response) {
    return validation.response;
  }
  
  return null;
}
