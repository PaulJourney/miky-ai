'use client'

import { useState, useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'

interface DashboardTranslationProviderProps {
  children: React.ReactNode
}

export function DashboardTranslationProvider({ children }: DashboardTranslationProviderProps) {
  const [locale, setLocale] = useState('en')
  const [messages, setMessages] = useState<any>(null)

  useEffect(() => {
    // Detect user's preferred language
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

    const detectedLocale = getPreferredLocale()
    setLocale(detectedLocale)

    // Load messages for the detected locale
    import(`../i18n/messages/${detectedLocale}.json`)
      .then((messages) => {
        setMessages(messages.default)
      })
      .catch(() => {
        // Fallback to English if locale file not found
        import(`../i18n/messages/en.json`)
          .then((messages) => {
            setMessages(messages.default)
            setLocale('en')
          })
      })
  }, [])

  if (!messages) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
