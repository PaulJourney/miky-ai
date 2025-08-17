'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Check, Crown, Zap, CreditCard, X, AlertTriangle, Heart, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { Header } from '@/components/Header'
import { AuthModals } from '@/components/AuthModals'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Add a custom number formatter to avoid hydration issues
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function PricingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const t = useTranslations('pricing')
  const tFooter = useTranslations('footer')
  const tContact = useTranslations('contact')
  const tCta = useTranslations('cta')

  // Auth modal states
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  // Other states
  const [creditAmount, setCreditAmount] = useState(5000)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'upgrade' | 'downgrade' | 'credits'>('upgrade')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  // Define plans with translated names
  const plans = [
    {
      name: 'Free',
      displayName: t('plans.free.name'),
      price: 0,
      credits: 100,
      support: t('plans.free.support'),
      icon: <Check className="w-6 h-6" />,
      popular: false,
      color: 'bg-gray-600'
    },
    {
      name: 'Plus',
      displayName: t('plans.plus.name'),
      price: 19,
      credits: 1000,
      support: t('plans.plus.support'),
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      color: 'bg-blue-600'
    },
    {
      name: 'Pro',
      displayName: t('plans.pro.name'),
      price: 45,
      credits: 5000,
      support: t('plans.pro.support'),
      icon: <Crown className="w-6 h-6" />,
      popular: false,
      color: 'bg-blue-700'
    }
  ]

  // Create user object compatible with existing logic
  const userInfo = {
    isLoggedIn: !!user,
    currentPlan: profile?.subscription_plan ? profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1) : 'Free',
    credits: profile?.credits || 0,
    planExpiry: '2025-12-31' // This would come from subscription data in real implementation
  }

  // Simple range slider functionality
  const creditPrice = 0.019
  const minCredits = 1000
  const maxCredits = 100000
  const step = 1000

  const totalPrice = Math.round(creditAmount * creditPrice)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreditAmount(Number(e.target.value))
  }

  const getPlanIndex = (planName: string) => {
    return plans.findIndex(plan => plan.name === planName)
  }

  const isUpgrade = (planName: string) => {
    const currentIndex = getPlanIndex(userInfo.currentPlan)
    const newIndex = getPlanIndex(planName)
    return newIndex > currentIndex
  }

  const isDowngrade = (planName: string) => {
    const currentIndex = getPlanIndex(userInfo.currentPlan)
    const newIndex = getPlanIndex(planName)
    return newIndex < currentIndex
  }

  const handleSelectPlan = (planName: string) => {
    if (!userInfo.isLoggedIn) {
      setShowSignUpModal(true)
      return
    }

    if (planName === userInfo.currentPlan) {
      return // Already on this plan
    }

    setSelectedPlan(planName)

    if (planName === 'Free' || isDowngrade(planName)) {
      setActionType('downgrade')
      setShowConfirmModal(true)
    } else if (isUpgrade(planName)) {
      setActionType('upgrade')
      // Simulate redirect to Stripe
      handleStripeRedirect('plan', planName)
    }
  }

  const handleBuyCredits = () => {
    if (!userInfo.isLoggedIn) {
      setShowSignUpModal(true)
      return
    }
    setActionType('credits')
    // Simulate redirect to Stripe for credits
    handleStripeRedirect('credits', null)
  }

  const handleStripeRedirect = async (type: 'plan' | 'credits', planName?: string | null) => {
    try {
      console.log(`Redirecting to Stripe for ${type}...`)

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        setShowSignUpModal(true)
        return
      }

      const requestBody: any = {
        returnUrl: window.location.href
      }

      if (type === 'plan' && planName) {
        requestBody.planName = planName
      } else if (type === 'credits') {
        requestBody.credits = creditAmount
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }

    } catch (error) {
      console.error('Stripe redirect error:', error)
      alert('Failed to start checkout process. Please try again.')
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)

    // Simulate form submission for demo
    setTimeout(() => {
      setContactSuccess(true)
      setContactForm({ name: '', email: '', message: '' })
      setContactLoading(false)
    }, 1000)
  }

  const handleContactClose = () => {
    setShowContactModal(false)
    setContactSuccess(false)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <Header
        currentPage="pricing"
        onSignInClick={() => setShowSignInModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
      />

      {loading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        </div>
      ) : (
        <main className="relative z-10 max-w-6xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white border-blue-600">
                      {t('mostPopular')}
                    </Badge>
                  </div>
                )}

                <Card className={`h-full ${
                  userInfo.isLoggedIn && userInfo.currentPlan === plan.name
                    ? 'bg-gray-800 border-green-600/50 ring-2 ring-green-600/30'
                    : plan.popular
                    ? 'bg-gray-800 border-blue-600/50 ring-2 ring-blue-600/30'
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <CardHeader className="text-center pb-8">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${plan.color}`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{plan.displayName}</h3>

                    {/* Price Section */}
                    <div className="mt-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">{t('month')}</span>
                      </div>
                      <p className="text-blue-400 font-medium text-lg mt-2">
                        {formatNumber(plan.credits)} {t('credits')}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {plan.support} {t('support')}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col justify-end">
                    {userInfo.isLoggedIn && userInfo.currentPlan === plan.name ? (
                      <Button
                        disabled
                        className="w-full bg-green-600 hover:bg-green-600 cursor-default"
                      >
                        {t('currentPlan')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSelectPlan(plan.name)}
                        className={`w-full ${
                          plan.name === 'Free'
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        }`}
                      >
                        {!userInfo.isLoggedIn
                          ? (plan.name === 'Free' ? t('startFree') : `${t('select')} ${plan.displayName}`)
                          : userInfo.isLoggedIn && isUpgrade(plan.name)
                          ? `${t('upgrade')} ${plan.displayName}`
                          : userInfo.isLoggedIn && (plan.name === 'Free' || isDowngrade(plan.name))
                          ? `${t('downgrade')} ${plan.displayName}`
                          : `${t('select')} ${plan.displayName}`
                        }
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Credit Selector with Draggable Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
              <CardContent className="text-center p-8">
                <h3 className="text-2xl font-bold text-white mb-6">{t('customCredits.title')}</h3>
                <p className="text-gray-400 mb-6">
                  {t('customCredits.subtitle')}
                </p>

                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatNumber(creditAmount)}
                    </div>
                    <div className="text-sm text-gray-400">{t('credits')}</div>
                  </div>

                  <div className="relative px-4">
                    <input
                      type="range"
                      min={minCredits}
                      max={maxCredits}
                      step={step}
                      value={creditAmount}
                      onChange={handleSliderChange}
                      className="w-full h-3 bg-gray-700 rounded-full appearance-none slider-thumb cursor-pointer"
                      style={{
                        background: `linear-gradient(to right,
                          rgb(37 99 235) 0%,
                          rgb(8 145 178) ${((creditAmount - minCredits) / (maxCredits - minCredits)) * 100}%,
                          rgb(55 65 81) ${((creditAmount - minCredits) / (maxCredits - minCredits)) * 100}%,
                          rgb(55 65 81) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{(minCredits / 1000).toFixed(0)}K</span>
                      <span>{(maxCredits / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      ${totalPrice}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t('customCredits.totalCost')}
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyCredits}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('customCredits.buyCredits')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional spacing before footer */}
          <div className="py-16"></div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="md:col-span-2">
              <Logo size="sm" className="mb-4" />
              <p className="text-gray-400 text-sm">
                {tFooter('tagline')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tFooter('usefulLinks')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white">{tFooter('contact')}</button></li>
                <li><a href="/pricing" className="hover:text-white">{tFooter('pricing')}</a></li>
                <li><button onClick={() => setShowAdminModal(true)} className="hover:text-white transition-colors">{tFooter('admin')}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tFooter('social')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://instagram.com/miky.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{tFooter('instagram')}</a></li>
                <li><a href="https://twitter.com/mikyai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{tFooter('twitter')}</a></li>
                <li><a href="https://tiktok.com/@miky.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{tFooter('tiktok')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tFooter('legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/legal/terms" className="hover:text-white">{tFooter('termsOfService')}</a></li>
                <li><a href="/legal/privacy" className="hover:text-white">{tFooter('privacyPolicy')}</a></li>
                <li><a href="/legal/cookie" className="hover:text-white">{tFooter('cookiePolicy')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {tFooter('copyright')}
            </p>
            <p className="text-gray-500 text-sm">
              {tFooter('poweredBy')} OpenAI
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={handleContactClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSuccess ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{tContact('successTitle')}</h3>
                <p className="text-gray-400 mb-6">
                  {tContact('successMessage')}
                </p>
                <Button
                  onClick={handleContactClose}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {tContact('close')}
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tContact('title')}</h3>
                  <p className="text-gray-400">{tContact('subtitle')}</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder={tContact('namePlaceholder')}
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={tContact('emailPlaceholder')}
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={tContact('messagePlaceholder')}
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {contactLoading ? tContact('sendingButton') : tContact('sendButton')}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Admin Access</h3>
              <p className="text-gray-400">Enter admin credentials to continue</p>
            </div>

            <form className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Admin password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-red-500"
                />
              </div>
              <Button
                onClick={() => {
                  setShowAdminModal(false)
                  window.open('/admin', '_blank')
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
