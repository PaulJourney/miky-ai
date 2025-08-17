'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Get user's preferred language from localStorage or navigator
    const getPreferredLocale = () => {
      // First check if user has a stored preference
      const storedLocale = localStorage.getItem('preferred-locale')
      if (storedLocale && ['it', 'es', 'en'].includes(storedLocale)) {
        return storedLocale
      }

      // Then check browser language
      const browserLang = navigator.language.split('-')[0]
      if (['it', 'es'].includes(browserLang)) {
        return browserLang
      }

      // Default to English
      return 'en'
    }

    const locale = getPreferredLocale()

    // Redirect to the appropriate localized page
    if (locale === 'en') {
      router.replace('/en/pricing')
    } else {
      router.replace(`/${locale}/pricing`)
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  )
}
