'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import {
  ChevronDown,
  Menu,
  X,
  Droplets,
  Zap,
  Crown,
  Edit3,
  Users,
  DollarSign,
  Save,
  Loader2,
  CheckCircle
} from 'lucide-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
]

interface HeaderProps {
  transparent?: boolean
  currentPage?: 'home' | 'chat' | 'pricing' | 'refer'
  waterAnimation?: boolean
  onSignInClick?: () => void
  onSignUpClick?: () => void
  overrideCredits?: number
  overrideWaterLiters?: number
}

export function Header({ transparent = false, currentPage = 'home', waterAnimation = false, onSignInClick, onSignUpClick, overrideCredits, overrideWaterLiters }: HeaderProps) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('header')

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  // Detect current language from URL and localStorage
  useEffect(() => {
    const currentLocale = pathname.split('/')[1]
    const foundLanguage = languages.find(lang => lang.code === currentLocale)

    if (foundLanguage) {
      setCurrentLanguage(foundLanguage)
      // Store preference when navigating to localized pages
      localStorage.setItem('preferred-locale', foundLanguage.code)
    } else {
      // If not on localized page, try to get from localStorage
      const storedLocale = localStorage.getItem('preferred-locale')
      const storedLanguage = languages.find(lang => lang.code === storedLocale)
      if (storedLanguage) {
        setCurrentLanguage(storedLanguage)
      }
    }
  }, [pathname])

  // Handle language change with redirect
  const handleLanguageChange = (lang: typeof languages[0]) => {
    // Store user's language preference
    localStorage.setItem('preferred-locale', lang.code)

    const currentLocale = pathname.split('/')[1]
    const currentPath = pathname.replace(`/${currentLocale}`, '') || ''

    // Determine target URL based on current page
    let targetUrl = ''

    if (languages.some(l => l.code === currentLocale)) {
      // Currently on a localized page, maintain the same page but change locale
      if (lang.code === 'en') {
        targetUrl = `/en${currentPath}`
      } else {
        targetUrl = `/${lang.code}${currentPath}`
      }
    } else {
      // Currently on a non-localized page, go to homepage of selected language
      if (lang.code === 'en') {
        targetUrl = '/en'
      } else {
        targetUrl = `/${lang.code}`
      }
    }

    router.push(targetUrl)
    setCurrentLanguage(lang)
    setShowLanguageDropdown(false)
  }

  // Profile editing states
  const [editingName, setEditingName] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)

  const handleAuthAction = (action: 'signin' | 'signup') => {
    if (action === 'signin' && onSignInClick) {
      onSignInClick()
    } else if (action === 'signup' && onSignUpClick) {
      onSignUpClick()
    } else {
      // Fallback to the original event dispatch for homepage
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-modal', { detail: { action } }))
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleUpdateProfile = async (field: 'name' | 'email') => {
    setUpdateLoading(true)

    try {
      // Qui dovrebbe esserci l'API call per aggiornare il profilo
      // Per ora simulo l'aggiornamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (field === 'name') {
        setEditingName(false)
        // Aggiorna il profilo locale se necessario
      } else {
        setEditingEmail(false)
        // Aggiorna l'email se necessario
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const startEditingName = () => {
    setEditedName(profile?.full_name || '')
    setEditingName(true)
  }

  const startEditingEmail = () => {
    setEditedEmail(user?.email || '')
    setEditingEmail(true)
  }

  // Get current locale from pathname or use selected language
  const currentLocale = pathname.split('/')[1]
  const isOnLocalizedPage = ['it', 'es'].includes(currentLocale)
  const selectedLocale = currentLanguage.code

  // Use selected language for building links, but handle user state properly
  const useLocalizedLinks = selectedLocale !== 'en'
  const linkLocale = useLocalizedLinks ? selectedLocale : ''

  const navigationItems = [
    {
      label: 'Home',
      href: useLocalizedLinks ? `/${linkLocale}` : '/',
      key: 'home'
    },
    {
      label: 'Chat',
      href: user
        ? '/dashboard' // Authenticated users always go to dashboard
        : useLocalizedLinks ? `/${linkLocale}/chat` : '/chat',
      key: 'chat'
    },
    {
      label: 'Pricing',
      href: useLocalizedLinks ? `/${linkLocale}/pricing` : '/pricing',
      key: 'pricing'
    },
    {
      label: 'Refer',
      href: useLocalizedLinks ? `/${linkLocale}/refer` : '/refer',
      key: 'refer'
    }
  ]

  return (
    <>
      <header className={`${
        transparent
          ? 'absolute top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-white/10'
          : 'border-b border-gray-800 bg-gray-950 sticky top-0 z-50'
      } px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - sempre reindirizza alla homepage */}
          <button onClick={() => router.push('/')}>
            <Logo size="md" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Menu - Always visible */}
            <nav className="flex items-center gap-6">
              {navigationItems.map((item) => {
                const isActive = currentPage === item.key
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className={`transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Language Dropdown - senza icona mondo */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white/80 px-3 py-2 text-sm"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {currentLanguage.code.toUpperCase()}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>

              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                        currentLanguage.code === lang.code
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      <span className="text-xs text-white/60">{lang.code.toUpperCase()}</span>
                      {currentLanguage.code === lang.code && (
                        <CheckCircle className="w-4 h-4 ml-auto text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Water Cleaned Counter with Tooltip and Animation */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50 text-sm group relative"
                  title={t('tooltips.oceanWaterCleaned')}
                >
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 font-medium min-w-[40px] text-right">
                    {(overrideWaterLiters ?? profile?.water_cleaned_liters)?.toLocaleString() || '0'}L
                  </span>
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-700 z-50">
                    {t('tooltips.oceanWaterCleaned')}
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>

                {/* Credits Counter with Tooltip */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50 text-sm group relative"
                  title={t('tooltips.availableCredits')}
                >
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 font-medium min-w-[40px] text-right">
                    {(overrideCredits ?? profile?.credits)?.toLocaleString() || '0'}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-700 z-50">
                    {t('tooltips.availableCredits')}
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>

                {/* User Avatar */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  {getInitials(profile?.full_name || user?.email || 'U')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleAuthAction('signin')}
                  className="border-white/20 text-white hover:bg-white/10 px-4 py-2 text-sm"
                >
                  {t('navigation.signIn')}
                </Button>
                <Button
                  onClick={() => handleAuthAction('signup')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 text-sm"
                >
                  {t('navigation.getStarted')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-white/10 p-2"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={showMobileMenu ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-xl rounded-b-lg border-t border-white/10 mt-4"
        >
          <div className="p-6 space-y-4">
            {/* Navigation for mobile */}
            <div className="space-y-2 pb-4 border-b border-white/10">
              {navigationItems.map((item) => {
                const isActive = currentPage === item.key
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href)
                      setShowMobileMenu(false)
                    }}
                    className={`block w-full text-left py-2 transition-colors ${
                      isActive
                        ? 'text-blue-400 font-medium'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* User Stats - Mobile */}
            {user && (
              <div className="pb-4 border-b border-white/10">
                <p className="text-white/60 text-sm mb-3">Your Stats</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      <span className="text-white/80 text-sm">Water Cleaned</span>
                    </div>
                    <span className="text-cyan-400 font-semibold text-sm">
                      {(overrideWaterLiters ?? profile?.water_cleaned_liters)?.toLocaleString() || '0'}L
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80 text-sm">AI Credits</span>
                    </div>
                    <span className="text-blue-400 font-semibold text-sm">
                      {(overrideCredits ?? profile?.credits)?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Language Selection - Future Proof */}
            <div className="pb-4 border-b border-white/10">
              <p className="text-white/60 text-sm mb-3">Language</p>
              <div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang)
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
                      currentLanguage.code === lang.code
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{lang.label}</div>
                      <div className="text-xs text-white/60">{lang.code.toUpperCase()}</div>
                    </div>
                    {currentLanguage.code === lang.code && (
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3">
              {user ? (
                <>
                  <Button
                    onClick={() => {
                      setShowProfileModal(true)
                      setShowMobileMenu(false)
                    }}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={() => {
                      signOut()
                      setShowMobileMenu(false)
                      // Redirect to homepage maintaining language
                      const currentLocale = pathname.split('/')[1]
                      const isLocalized = ['it', 'es'].includes(currentLocale)
                      router.push(isLocalized ? `/${currentLocale}` : '/')
                    }}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    {t('profile.signOut')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      handleAuthAction('signin')
                      setShowMobileMenu(false)
                    }}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    {t('navigation.signIn')}
                  </Button>
                  <Button
                    onClick={() => {
                      handleAuthAction('signup')
                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {t('navigation.getStarted')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-6 relative"
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                {getInitials(profile?.full_name || user?.email || 'U')}
              </div>

              {/* Editable Name */}
              <div className="mb-3">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-center text-lg font-bold"
                      disabled={updateLoading}
                    />
                    <button
                      onClick={() => handleUpdateProfile('name')}
                      disabled={updateLoading}
                      className="text-green-400 hover:text-green-300"
                    >
                      {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-lg font-bold text-white">{profile?.full_name || 'User'}</h3>
                    <button
                      onClick={startEditingName}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Editable Email */}
              <div className="mb-4">
                {editingEmail ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-center text-sm"
                      disabled={updateLoading}
                    />
                    <button
                      onClick={() => handleUpdateProfile('email')}
                      disabled={updateLoading}
                      className="text-green-400 hover:text-green-300"
                    >
                      {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <button
                      onClick={startEditingEmail}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">{t('profile.plan')}</span>
                  <span className="text-blue-400 flex items-center gap-1 text-sm">
                    <Crown className="w-3 h-3" />
                    {profile?.subscription_plan?.toUpperCase() || 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">{t('profile.credits')}</span>
                  <span className="text-blue-400 font-semibold text-sm">{(overrideCredits ?? profile?.credits)?.toLocaleString() || 0}</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">{t('profile.waterCleaned')}</span>
                  <span className="text-cyan-400 font-semibold text-sm">{(overrideWaterLiters ?? profile?.water_cleaned_liters)?.toLocaleString() || 0}L</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {t('profile.totalEarnings')}
                  </span>
                  <span className="text-green-400 font-semibold text-sm">${profile?.total_referral_earnings?.toLocaleString() || 0}</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {t('profile.networkSize')}
                  </span>
                  <span className="text-purple-400 font-semibold text-sm">{Math.floor((profile?.total_referral_earnings || 0) / 5) || 0} {t('profile.people')}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {/* Show Upgrade Plan only for Free and Plus users */}
                {(!profile?.subscription_plan || profile?.subscription_plan === 'free' || profile?.subscription_plan === 'plus') && (
                  <Button
                    onClick={async () => {
                      try {
                        setUpdateLoading(true)

                        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                        if (sessionError || !session?.access_token) {
                          setUpdateLoading(false)
                          return
                        }

                        const currentPlan = profile?.subscription_plan || 'free'
                        const nextPlan = currentPlan === 'free' ? 'plus' : 'pro'

                        const response = await fetch('/api/stripe/checkout', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            planName: nextPlan,
                            returnUrl: window.location.href
                          })
                        })

                        const data = await response.json()

                        if (response.ok && data.checkoutUrl) {
                          window.location.href = data.checkoutUrl
                        } else {
                          throw new Error(data.error || 'Failed to create checkout session')
                        }

                      } catch (error) {
                        console.error('Upgrade error:', error)
                        alert('Failed to start upgrade process. Please try again.')
                      } finally {
                        setUpdateLoading(false)
                      }
                    }}
                    disabled={updateLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('profile.processing')}
                      </>
                    ) : (
                      `${t('profile.upgradeTo')} ${(!profile?.subscription_plan || profile?.subscription_plan === 'free') ? 'Plus' : 'Pro'}`
                    )}
                  </Button>
                )}

                {/* Sign out as simple text */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      signOut()
                      // Redirect to homepage maintaining language
                      const currentLocale = pathname.split('/')[1]
                      const isLocalized = ['it', 'es'].includes(currentLocale)
                      router.push(isLocalized ? `/${currentLocale}` : '/')
                    }}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    {t('profile.signOut')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showLanguageDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguageDropdown(false)}
        />
      )}
    </>
  )
}
