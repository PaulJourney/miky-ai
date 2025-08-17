'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthModals } from '@/components/AuthModals'
import { useAuth } from '@/hooks/useAuth'
import {
  Zap,
  Droplets,
  Users,
  Star,
  ArrowRight,

  MessageSquare,
  Bot,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Scale,
  Stethoscope,
  Code,
  DollarSign,
  Heart,
  X,

  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Menu
} from 'lucide-react'

// Features will be defined inside the component to access translations

// Personas will be defined inside the component to access translations

// Stats will be defined inside the component to access translations



export default function HomePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const t = useTranslations()
  const tContact = useTranslations('contact')
  const tCta = useTranslations('cta')
  const [hoveredPersona, setHoveredPersona] = useState<number | null>(null)
  const [modalPersona, setModalPersona] = useState<typeof personas[0] | null>(null)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)



  // Define translated content
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: t('features.aiSpecialists.title'),
      description: t('features.aiSpecialists.description')
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: t('features.oceanImpact.title'),
      description: t('features.oceanImpact.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('features.referralRewards.title'),
      description: t('features.referralRewards.description')
    }
  ]

  const stats = [
    { value: "50K+", label: t('stats.activeUsers'), icon: <Users className="w-5 h-5" /> },
    { value: "1M+", label: t('stats.waterCleaned'), icon: <Droplets className="w-5 h-5" /> },
    { value: "8", label: t('stats.specialists'), icon: <Bot className="w-5 h-5" /> }
  ]

  const personas = [
    {
      key: 'academic',
      name: t('specialists.academic.name'),
      icon: <GraduationCap className="w-6 h-6" />,
      description: t('specialists.academic.description'),
      fullDescription: t('specialists.academic.fullDescription'),
      color: 'from-blue-500/20 to-indigo-500/20'
    },
    {
      key: 'marketer',
      name: t('specialists.marketer.name'),
      icon: <TrendingUp className="w-6 h-6" />,
      description: t('specialists.marketer.description'),
      fullDescription: t('specialists.marketer.fullDescription'),
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      key: 'engineer',
      name: t('specialists.engineer.name'),
      icon: <Code className="w-6 h-6" />,
      description: t('specialists.engineer.description'),
      fullDescription: t('specialists.engineer.fullDescription'),
      color: 'from-orange-500/20 to-red-500/20'
    },
    {
      key: 'coach',
      name: t('specialists.coach.name'),
      icon: <Briefcase className="w-6 h-6" />,
      description: t('specialists.coach.description'),
      fullDescription: t('specialists.coach.fullDescription'),
      color: 'from-pink-500/20 to-purple-500/20'
    },
    {
      key: 'lawyer',
      name: t('specialists.lawyer.name'),
      icon: <Scale className="w-6 h-6" />,
      description: t('specialists.lawyer.description'),
      fullDescription: t('specialists.lawyer.fullDescription'),
      color: 'from-yellow-500/20 to-amber-500/20'
    },
    {
      key: 'medical',
      name: t('specialists.medical.name'),
      icon: <Stethoscope className="w-6 h-6" />,
      description: t('specialists.medical.description'),
      fullDescription: t('specialists.medical.fullDescription'),
      color: 'from-red-500/20 to-pink-500/20'
    },
    {
      key: 'biz-guru',
      name: t('specialists.bizGuru.name'),
      icon: <DollarSign className="w-6 h-6" />,
      description: t('specialists.bizGuru.description'),
      fullDescription: t('specialists.bizGuru.fullDescription'),
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      key: 'god-mode',
      name: t('specialists.godMode.name'),
      icon: <Zap className="w-6 h-6" />,
      description: t('specialists.godMode.description'),
      fullDescription: t('specialists.godMode.fullDescription'),
      color: 'from-indigo-500/20 to-violet-500/20'
    }
  ]

  // Listen for auth actions from Header component
  useEffect(() => {
    const handleAuthModal = (event: CustomEvent) => {
      if (event.detail.action === 'signin') {
        setShowSignInModal(true)
      } else if (event.detail.action === 'signup') {
        setShowSignUpModal(true)
      }
    }

    window.addEventListener('auth-modal', handleAuthModal as EventListener)
    return () => window.removeEventListener('auth-modal', handleAuthModal as EventListener)
  }, [])

  // Handle URL query parameters for authentication
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const action = urlParams.get('action')

    if (action === 'signin') {
      setShowSignInModal(true)
      // Clean URL
      window.history.replaceState({}, '', '/')
    } else if (action === 'signup') {
      setShowSignUpModal(true)
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Redirect to dashboard after login
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

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
    <div className="min-h-screen bg-gray-950 text-white">
      <Header transparent={true} currentPage="home" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
            alt="Sea turtle swimming in ocean with fish"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-blue-600/20 text-blue-400 border-blue-600/30 px-4 py-2 backdrop-blur-md hover:text-white transition-colors cursor-default">
              <Droplets className="w-4 h-4 mr-2" />
              {t('hero.badge')}
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              {t('hero.title')}
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => user ? window.location.href = '/dashboard' : setShowSignUpModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 text-sm"
              >
{user ? tCta('goToDashboard') : t('hero.cta')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md px-4 py-2 text-sm"
                onClick={() => {
                  const currentLocale = window.location.pathname.split('/')[1]
                  const locale = ['en', 'it', 'es'].includes(currentLocale) ? currentLocale : 'en'
                  window.location.href = `/${locale}/how-it-works`
                }}
              >
                {t('hero.demo')}
              </Button>
            </div>

            {/* Stats - Centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-8 max-w-2xl">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="text-cyan-400">{stat.icon}</div>
                      <div className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Powered by OpenAI */}
        <div className="absolute bottom-[2.4375rem] left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="text-xs">{t('footer.poweredBy')}</span>
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
              </svg>
              <span className="font-medium">OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('features.title')} <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{t('features.titleHighlight')}</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 max-w-sm mx-auto"
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full hover:bg-gray-800/70 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 text-blue-400 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Personas */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-3000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('specialists.title')} <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{t('specialists.titleHighlight')}</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('specialists.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredPersona(index)}
                onMouseLeave={() => setHoveredPersona(null)}
                onClick={() => setModalPersona(persona)}
                className="relative group"
              >
                <Card className={`bg-gradient-to-br ${persona.color} backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/10`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:bg-white/15 transition-colors">
                      {persona.icon}
                    </div>
                    <h4 className="font-semibold text-white text-base mb-2">{persona.name}</h4>
                    <p className="text-white/70 text-sm">{persona.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => user ? window.location.href = '/dashboard' : setShowSignUpModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 text-sm"
            >
{user ? tCta('startChatting') : t('specialists.cta')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="px-6 py-20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Droplets className="w-12 h-12 text-cyan-400" />
            </div>

            <h2 className="text-4xl font-bold mb-6">{t('impact.title')} <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{t('impact.titleHighlight')}</span></h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              {t('impact.subtitle')}
            </p>

            <div className="flex items-center justify-center gap-2 text-cyan-400 text-base font-medium mb-8">
              <Heart className="w-5 h-5" />
              <span>{t('impact.badge')}</span>
              <Droplets className="w-5 h-5" />
            </div>

            {/* Added Sign In and Get Started buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 text-sm"
                >
                  {tCta('startMakingImpact')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowSignInModal(true)}
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md px-4 py-2 text-sm"
                  >
                    {t('impact.signin')}
                  </Button>
                  <Button
                    onClick={() => setShowSignUpModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 text-sm"
                  >
                    {t('impact.getStarted')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Persona Modal */}
      {modalPersona && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-lg p-8 relative text-center"
          >
            <button
              onClick={() => setModalPersona(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-24 h-24 bg-gradient-to-br ${modalPersona.color} backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
              {modalPersona.icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">{modalPersona.name}</h3>

            <p className="text-gray-300 text-base leading-relaxed mb-8">
              {modalPersona.fullDescription}
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setModalPersona(null)
                  if (user) {
                    window.location.href = '/dashboard'
                  } else {
                    setShowSignUpModal(true)
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3"
              >
                {user ? 'Chat Now' : 'Try Now'}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
                onClick={() => setModalPersona(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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
