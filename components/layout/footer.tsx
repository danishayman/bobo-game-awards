'use client'

import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

export function Footer() {
  const { appUser } = useAuth()
  return (
    <footer className="border-t border-white/10 bg-[var(--background-secondary)] mt-auto">
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-5 w-5 text-[var(--red-primary)]" />
              <span className="font-bold text-white">Gaming Awards</span>
            </div>
            <p className="text-sm text-white/70">
              Community-driven gaming awards celebrating the best games of the year.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Voting</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vote" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  Cast Your Vote
                </Link>
              </li>
              <li>
                <Link href="/nominees" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  View Nominees
                </Link>
              </li>
              {appUser?.is_admin && (
                <li>
                  <Link href="/results" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                    Results
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  Voting Rules
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-[var(--red-primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/70">
          <p>&copy; 2025 Gaming Awards. Built with ❤️ by Spudin 23</p>
        </div>
      </div>
    </footer>
  )
}
