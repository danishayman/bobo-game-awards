/**
 * Client-side validation utilities for faster user feedback
 * These checks happen before making API calls to reduce latency
 */

import { isVotingActive, canUserVote, isVotingLocked } from '@/lib/config/voting'

export interface ValidationResult {
  isValid: boolean
  error?: string
  errorCode?: string
}

/**
 * Validate if a user can submit a vote (client-side check)
 * This provides immediate feedback without a server round-trip
 */
export function validateVoteSubmission(isAdmin: boolean = false): ValidationResult {
  // Check if voting is still active
  if (!isVotingActive()) {
    return {
      isValid: false,
      error: 'Voting has ended. The voting period has concluded.',
      errorCode: 'VOTING_ENDED'
    }
  }

  // Check if voting is locked and user is not admin
  if (isVotingLocked() && !isAdmin) {
    return {
      isValid: false,
      error: 'Live voting has not started yet. Only administrators can vote at this time.',
      errorCode: 'VOTING_LOCKED'
    }
  }

  // Check if user can vote
  if (!canUserVote(isAdmin)) {
    return {
      isValid: false,
      error: 'You do not have permission to vote at this time.',
      errorCode: 'NO_PERMISSION'
    }
  }

  return { isValid: true }
}

/**
 * Validate vote data before submission
 */
export function validateVoteData(categoryId: string | undefined, nomineeId: string | undefined): ValidationResult {
  if (!categoryId) {
    return {
      isValid: false,
      error: 'Category is required',
      errorCode: 'MISSING_CATEGORY'
    }
  }

  if (!nomineeId) {
    return {
      isValid: false,
      error: 'Please select a nominee',
      errorCode: 'MISSING_NOMINEE'
    }
  }

  return { isValid: true }
}

/**
 * Comprehensive validation for vote submission
 * Combines all validation checks
 */
export function validateCompleteVote(
  categoryId: string | undefined,
  nomineeId: string | undefined,
  isAdmin: boolean = false
): ValidationResult {
  // First check data validity
  const dataValidation = validateVoteData(categoryId, nomineeId)
  if (!dataValidation.isValid) {
    return dataValidation
  }

  // Then check voting period and permissions
  const submissionValidation = validateVoteSubmission(isAdmin)
  if (!submissionValidation.isValid) {
    return submissionValidation
  }

  return { isValid: true }
}

