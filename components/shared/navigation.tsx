'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'
import { Trophy, Vote, BarChart3, Settings } from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-lg md:text-xl font-bold hidden sm:inline">Community Gaming Awards</span>
          <span className="text-lg md:text-xl font-bold sm:hidden">CGA</span>
        </Link>

        <div className="flex items-center space-x-4">
          {status === 'authenticated' && session?.user && (
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/vote">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Vote className="h-4 w-4" />
                  <span>Vote</span>
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Results</span>
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile Navigation */}
          {status === 'authenticated' && session?.user && (
            <div className="flex md:hidden items-center space-x-1">
              <Link href="/vote">
                <Button variant="ghost" size="sm">
                  <Vote className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          <ThemeToggle />

          {status === 'loading' ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : status === 'authenticated' ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {session?.user?.name}
              </span>
              <Button onClick={() => signOut()} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => signIn()} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
