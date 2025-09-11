import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-5 w-5 text-purple-600" />
              <span className="font-bold">Gaming Awards</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Community-driven gaming awards celebrating the best games of the year.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Voting</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vote" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cast Your Vote
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-muted-foreground hover:text-foreground transition-colors">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-muted-foreground hover:text-foreground transition-colors">
                  Voting Rules
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Gaming Awards. Built with ❤️ by the gaming community.</p>
        </div>
      </div>
    </footer>
  )
}
