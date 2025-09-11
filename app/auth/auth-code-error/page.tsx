'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem signing you in. This could be due to:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>The authentication process was cancelled</li>
              <li>An invalid or expired authentication code</li>
              <li>Network connectivity issues</li>
              <li>Provider-specific authentication problems</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            If the problem persists, please contact support or try a different authentication method.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

