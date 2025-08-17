'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get token from URL query parameters
        const token = searchParams.get('token')

        if (!token) {
          setStatus('error')
          setMessage('Invalid verification link. No token provided.')
          return
        }

        // Call our verification API
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setStatus('success')
          setMessage(result.message || 'Email verified successfully! Welcome to Miky.ai.')

          // Redirect to sign in page after 3 seconds
          setTimeout(() => {
            router.push('/?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.error || 'Failed to verify email. Please try again.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleEmailVerification()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Logo size="lg" className="mb-8 justify-center" />

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold">Verifying Your Email</h1>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold">Email Verified!</h1>
              <p className="text-gray-400">{message}</p>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mt-6">
                <p className="text-green-400 text-sm">
                  You'll be redirected to your dashboard in a few seconds...
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-gray-400">{message}</p>
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mt-6">
                <p className="text-red-400 text-sm">
                  If you continue to have issues, please contact support@miky.ai
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="text-center space-y-4">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {status === 'success' && (
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
