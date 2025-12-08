import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isVotingActive } from '@/lib/config/voting'

export async function proxy(request: NextRequest) {
  // Handle auth session updates first
  const response = await updateSession(request)
  
  // Check if this is a voting-related route and if voting has ended
  const { pathname } = request.nextUrl
  
  // Protect voting routes when voting has ended
  if (!isVotingActive() && isVotingRoute(pathname)) {
    // For API routes, return JSON error
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { 
          error: 'Voting has ended',
          message: 'The global voting period has concluded. No new votes can be submitted.',
          code: 'VOTING_ENDED'
        },
        { status: 403 }
      );
    }
    
    // For page routes, redirect to results or home with a message
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('message', 'voting-ended')
    return NextResponse.redirect(url)
  }
  
  return response
}

/**
 * Check if the current route is voting-related
 */
function isVotingRoute(pathname: string): boolean {
  const votingPaths = [
    '/vote',
    '/api/votes',
    '/api/ballot/finalize',
  ];
  
  return votingPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
