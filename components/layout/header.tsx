'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth/auth-context'
import { LogOut, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, appUser, signOut, signingOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    if (signingOut) return // Prevent multiple clicks
    
    try {
      await signOut()
      // Don't call router.push here - let the auth state change handle navigation
      // or the signOut function will handle it via window.location if needed
    } catch (error) {
      console.error('Error signing out:', error)
      // The signOut function now handles fallbacks, so we don't need additional error handling here
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center group">
          <div className="relative h-10 w-auto">
            <Image
              src="/logo.webp"
              alt="Gaming Awards Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="text-sm font-medium text-white/80 hover:text-red-primary transition-all duration-200 relative group py-2">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/nominees" className="text-sm font-medium text-white/80 hover:text-red-primary transition-all duration-200 relative group py-2">
            Nominees
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium text-white/80 hover:text-red-primary transition-all duration-200 relative group py-2">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all group-hover:w-full"></span>
          </Link>
          {user && (
            <Link href="/vote" className="text-sm font-medium text-white/80 hover:text-red-primary transition-all duration-200 relative group py-2">
              Vote
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all group-hover:w-full"></span>
            </Link>
          )}
          {appUser?.is_admin && (
            <Link href="/results" className="text-sm font-medium text-white/80 hover:text-red-primary transition-all duration-200 relative group py-2">
              Results
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all group-hover:w-full"></span>
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 text-white hover:text-red-primary hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {user && !signingOut ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full transition-none active:scale-100 hover:bg-transparent hover:text-white"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={appUser?.avatar_url || ''} 
                      alt={appUser?.display_name || 'User'} 
                    />
                    <AvatarFallback className="bg-background-secondary text-white font-semibold">
                      {appUser?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background-secondary border border-white/20 backdrop-blur-xl" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={appUser?.avatar_url || ''} 
                      alt={appUser?.display_name || 'User'} 
                    />
                    <AvatarFallback className="bg-red-primary text-white font-semibold">
                      {appUser?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-white">{appUser?.display_name}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {appUser?.is_admin && (
                  <DropdownMenuItem asChild className="text-white hover:text-red-primary hover:bg-white/10">
                    <Link href="/admin">
                      <Settings className="mr-3 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-white hover:text-red-primary hover:bg-white/10"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : signingOut ? (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <LogOut className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Signing out...</span>
            </div>
          ) : (
            <Button asChild variant="premium" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              className="block text-sm font-medium text-white/80 hover:text-red-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/nominees" 
              className="block text-sm font-medium text-white/80 hover:text-red-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nominees
            </Link>
            <Link 
              href="/about" 
              className="block text-sm font-medium text-white/80 hover:text-red-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {user && (
              <Link 
                href="/vote" 
                className="block text-sm font-medium text-white/80 hover:text-red-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vote
              </Link>
            )}
            {appUser?.is_admin && (
              <Link 
                href="/results" 
                className="block text-sm font-medium text-white/80 hover:text-red-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Results
              </Link>
            )}
            {!user && (
              <Link 
                href="/login" 
                className="block text-sm font-medium text-red-primary hover:text-red-secondary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
