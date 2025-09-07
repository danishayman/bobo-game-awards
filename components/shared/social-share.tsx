'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Share2, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface SocialShareProps {
  title?: string
  description?: string
  url?: string
  className?: string
}

export function SocialShare({ 
  title = "Community Gaming Awards",
  description = "Vote for your favorite games in the annual Community Gaming Awards",
  url = "",
  className 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  
  const shareData = {
    title,
    description,
    url: shareUrl
  }

  const handleShare = async (platform: string) => {
    let shareLink = ''
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share(shareData)
            return
          } catch (error) {
            // Fall back to copy link
          }
        }
        break
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400')
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share the Awards</span>
          </CardTitle>
          <CardDescription>
            Help spread the word about the Community Gaming Awards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-2"
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="flex items-center space-x-2"
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </Button>
          </div>
          
          {/* Native Share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('native')}
              className="w-full flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          )}
          
          {/* Copy Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="w-full flex items-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}



