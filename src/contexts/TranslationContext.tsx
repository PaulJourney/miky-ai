import React, { createContext, useContext, ReactNode } from 'react'
import { Language, useTranslation, detectBrowserLanguage } from '../lib/i18n'
import { useKV } from '@github/spark/hooks'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string, replacements?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useKV<Language>('user-language', detectBrowserLanguage())
  const { t } = useTranslation(language)

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useT() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useT must be used within a TranslationProvider')
  }
  return context
}