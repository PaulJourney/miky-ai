'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LoginRequiredLocalized } from '@/components/LoginRequiredLocalized'
import { AuthModals } from '@/components/AuthModals'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <AnimatedBackground />
        <Header transparent={true} currentPage="chat" />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login required if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header
          currentPage="chat"
          onSignInClick={() => setShowSignInModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="relative min-h-[80vh]">
            <AnimatedBackground />
            <div className="relative z-10 space-y-8">
              <div className="pt-8">
                <LoginRequiredLocalized
                  page="chat"
                  onSignIn={() => setShowSignInModal(true)}
                  onSignUp={() => setShowSignUpModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />

        <AuthModals
          showSignInModal={showSignInModal}
          showSignUpModal={showSignUpModal}
          onClose={() => {
            setShowSignInModal(false)
            setShowSignUpModal(false)
          }}
          onSignInSuccess={() => router.push('/dashboard')}
          onSignUpSuccess={() => router.push('/dashboard')}
          onSwitchToSignUp={() => {
            setShowSignInModal(false)
            setShowSignUpModal(true)
          }}
          onSwitchToSignIn={() => {
            setShowSignUpModal(false)
            setShowSignInModal(true)
          }}
        />
      </div>
    )
  }

  // This shouldn't be reached due to redirect above, but just in case
  return null
}
