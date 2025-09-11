'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { Gamepad2, Chrome, Twitch, Github } from 'lucide-react'

// Discord icon component since lucide-react doesn't have one
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
  </svg>
)

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'twitch' | 'discord' | 'github' | null>(null)
  const { signInWithGoogle, signInWithTwitch, signInWithDiscord, signInWithGithub } = useAuth()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      setLoading('google')
      await signInWithGoogle()
    } catch (error) {
      console.error('Error logging in with Google:', error)
      setLoading(null)
    }
  }

  const handleTwitchLogin = async () => {
    try {
      setLoading('twitch')
      await signInWithTwitch()
    } catch (error) {
      console.error('Error logging in with Twitch:', error)
      setLoading(null)
    }
  }

  const handleDiscordLogin = async () => {
    try {
      setLoading('discord')
      await signInWithDiscord()
    } catch (error) {
      console.error('Error logging in with Discord:', error)
      setLoading(null)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setLoading('github')
      await signInWithGithub()
    } catch (error) {
      console.error('Error logging in with GitHub:', error)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Gamepad2 className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Gaming Awards</CardTitle>
          <CardDescription>
            Sign in to vote for your favorite games of the year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full"
              variant="outline"
            >
              {loading === 'google' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <Chrome className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={handleTwitchLogin}
              disabled={loading !== null}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading === 'twitch' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Twitch className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDiscordLogin}
              disabled={loading !== null}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading === 'discord' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <DiscordIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={handleGithubLogin}
              disabled={loading !== null}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              {loading === 'github' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Github className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Choose your platform
              </span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            By signing in, you agree to participate in the community gaming awards
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
