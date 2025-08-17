'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Bot, Droplets, Users, Zap, DollarSign, Heart, Globe, Star, CheckCircle, TrendingUp, Calculator, X, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'

export default function HowItWorksPage() {
  const router = useRouter()
  const t = useTranslations('howItWorks')
  const tFooter = useTranslations('footer')

  const [subscriberCount, setSubscriberCount] = useState(1000)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  // Simple range slider functionality
  const minSubscribers = 100
  const maxSubscribers = 10000
  const step = 100

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriberCount(Number(e.target.value))
  }

  const calculateEarnings = () => {
    // Use $4.58 per subscriber for earnings calculation
    const avgEarningsPerSubscriber = 4.58
    const totalEarnings = subscriberCount * avgEarningsPerSubscriber
    return totalEarnings
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

  const sliderPosition = ((subscriberCount - minSubscribers) / (maxSubscribers - minSubscribers)) * 100

  // Define the translated data arrays
  const aiServices = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: t('aiServices.service1.title'),
      description: t('aiServices.service1.description'),
      examples: [
        t('aiServices.service1.examples.0'),
        t('aiServices.service1.examples.1'),
        t('aiServices.service1.examples.2'),
        t('aiServices.service1.examples.3')
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('aiServices.service2.title'),
      description: t('aiServices.service2.description'),
      examples: [
        t('aiServices.service2.examples.0'),
        t('aiServices.service2.examples.1'),
        t('aiServices.service2.examples.2'),
        t('aiServices.service2.examples.3')
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('aiServices.service3.title'),
      description: t('aiServices.service3.description'),
      examples: [
        t('aiServices.service3.examples.0'),
        t('aiServices.service3.examples.1'),
        t('aiServices.service3.examples.2'),
        t('aiServices.service3.examples.3')
      ]
    }
  ]

  const oceanImpact = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: t('oceanImpact.impact1.title'),
      description: t('oceanImpact.impact1.description'),
      stat: t('oceanImpact.impact1.stat')
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('oceanImpact.impact2.title'),
      description: t('oceanImpact.impact2.description'),
      stat: t('oceanImpact.impact2.stat')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('oceanImpact.impact3.title'),
      description: t('oceanImpact.impact3.description'),
      stat: t('oceanImpact.impact3.stat')
    }
  ]

  const referralStructure = {
    plus: {
      total: 5,
      levels: [
        { level: 1, amount: 2, percentage: "40%" },
        { level: 2, amount: 1.5, percentage: "30%" },
        { level: 3, amount: 0.8, percentage: "16%" },
        { level: 4, amount: 0.5, percentage: "10%" },
        { level: 5, amount: 0.2, percentage: "4%" }
      ]
    },
    pro: {
      total: 15,
      levels: [
        { level: 1, amount: 6.00, percentage: "40%" },
        { level: 2, amount: 4.05, percentage: "27%" },
        { level: 3, amount: 2.40, percentage: "16%" },
        { level: 4, amount: 1.35, percentage: "9%" },
        { level: 5, amount: 1.20, percentage: "8%" }
      ]
    }
  }

  const faqs = Array.from({ length: 8 }, (_, i) => ({
    question: t(`faq.questions.${i}.question`),
    answer: t(`faq.questions.${i}.answer`)
  }))

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow1 8s ease-in-out infinite'
        }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow2 10s ease-in-out infinite 2s'
        }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/8 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow3 12s ease-in-out infinite 4s'
        }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow4 9s ease-in-out infinite 1s'
        }} />
        <div className="absolute top-3/4 right-1/6 w-56 h-56 bg-blue-300/6 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow5 11s ease-in-out infinite 3s'
        }} />
        <div className="absolute top-1/6 right-1/3 w-48 h-48 bg-cyan-300/6 rounded-full blur-3xl animate-pulse" style={{
          animation: 'glow6 7s ease-in-out infinite 5s'
        }} />
      </div>

      <style jsx>{`
        @keyframes glow1 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @keyframes glow2 {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes glow3 {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes glow4 {
          0%, 100% { transform: scale(1); opacity: 0.28; }
          50% { transform: scale(1.35); opacity: 0.55; }
        }
        @keyframes glow5 {
          0%, 100% { transform: scale(1); opacity: 0.22; }
          50% { transform: scale(1.25); opacity: 0.45; }
        }
        @keyframes glow6 {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
      `}</style>
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            {t('title')} <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{t('titleHighlight')}</span> {t('titleEnd')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* AI Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('aiServices.title')}</h2>
            <p className="text-gray-400 text-lg">
              {t('aiServices.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-600/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-white mb-4">{t('aiServices.capabilities.title')}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">{t('aiServices.capabilities.academic.title')}</h5>
                    <p className="text-gray-300 text-sm">{t('aiServices.capabilities.academic.description')}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">{t('aiServices.capabilities.business.title')}</h5>
                    <p className="text-gray-300 text-sm">{t('aiServices.capabilities.business.description')}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">{t('aiServices.capabilities.development.title')}</h5>
                    <p className="text-gray-300 text-sm">{t('aiServices.capabilities.development.description')}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">{t('aiServices.capabilities.legal.title')}</h5>
                    <p className="text-gray-300 text-sm">{t('aiServices.capabilities.legal.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Ocean Cleanup Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('oceanImpact.title')}</h2>
            <p className="text-gray-400 text-lg">
              {t('oceanImpact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {oceanImpact.map((impact, index) => (
              <motion.div
                key={impact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-cyan-900/20 border-cyan-600/30 h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 mx-auto">
                      {impact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{impact.title}</h3>
                    <p className="text-gray-400 mb-4">{impact.description}</p>
                    <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30">
                      {impact.stat}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl p-8 text-center"
          >
            <h4 className="text-2xl font-bold text-white mb-6">{t('oceanImpact.individualImpact.title')}</h4>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{t('oceanImpact.individualImpact.example1.messages')}</div>
                <div className="text-gray-300">= {t('oceanImpact.individualImpact.example1.cleaned')}</div>
                <div className="text-sm text-gray-400 mt-1">{t('oceanImpact.individualImpact.example1.equivalent')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{t('oceanImpact.individualImpact.example2.messages')}</div>
                <div className="text-gray-300">= {t('oceanImpact.individualImpact.example2.cleaned')}</div>
                <div className="text-sm text-gray-400 mt-1">{t('oceanImpact.individualImpact.example2.equivalent')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{t('oceanImpact.individualImpact.example3.messages')}</div>
                <div className="text-gray-300">= {t('oceanImpact.individualImpact.example3.cleaned')}</div>
                <div className="text-sm text-gray-400 mt-1">{t('oceanImpact.individualImpact.example3.equivalent')}</div>
              </div>
            </div>
            <p className="text-gray-400 mt-6">
              {t('oceanImpact.individualImpact.community')} <span className="text-cyan-400 font-bold">{t('oceanImpact.individualImpact.communityAmount')}</span> {t('oceanImpact.individualImpact.communityEnd')}
            </p>
          </motion.div>
        </motion.section>

        {/* Referral Program Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('referralProgram.title')}</h2>
            <p className="text-gray-400 text-lg">
              {t('referralProgram.subtitle')}
            </p>
          </div>

          {/* Interactive Earnings Calculator with Draggable Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-600/30">
              <CardHeader>
                <CardTitle className="text-green-400 text-center flex items-center justify-center gap-2">
                  <Calculator className="w-6 h-6" />
                  {t('referralProgram.calculator.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Draggable Slider */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {subscriberCount}
                    </div>
                    <div className="text-sm text-gray-400">{t('referralProgram.calculator.networkSize')}</div>
                  </div>

                  <div className="relative px-4">
                    <input
                      type="range"
                      min={minSubscribers}
                      max={maxSubscribers}
                      step={step}
                      value={subscriberCount}
                      onChange={handleSliderChange}
                      className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right,
                          rgb(34 197 94) 0%,
                          rgb(5 150 105) ${((subscriberCount - minSubscribers) / (maxSubscribers - minSubscribers)) * 100}%,
                          rgb(55 65 81) ${((subscriberCount - minSubscribers) / (maxSubscribers - minSubscribers)) * 100}%,
                          rgb(55 65 81) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{minSubscribers.toLocaleString()}</span>
                      <span>{(maxSubscribers / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ${calculateEarnings().toFixed(0)}/month
                  </div>
                  <div className="text-sm text-gray-400">
                    {t('referralProgram.calculator.estimatedEarnings')} {subscriberCount.toLocaleString()} {t('referralProgram.calculator.members')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-600/30 h-full">
                <CardHeader>
                  <CardTitle className="text-green-400">{t('referralProgram.howItWorks.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">1</div>
                    <div>
                      <div className="font-semibold text-white">{t('referralProgram.howItWorks.step1.title')}</div>
                      <div className="text-sm text-gray-400">{t('referralProgram.howItWorks.step1.description')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">2</div>
                    <div>
                      <div className="font-semibold text-white">{t('referralProgram.howItWorks.step2.title')}</div>
                      <div className="text-sm text-gray-400">{t('referralProgram.howItWorks.step2.description')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">3</div>
                    <div>
                      <div className="font-semibold text-white">{t('referralProgram.howItWorks.step3.title')}</div>
                      <div className="text-sm text-gray-400">{t('referralProgram.howItWorks.step3.description')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 h-full">
                <CardHeader>
                  <CardTitle className="text-yellow-400">{t('referralProgram.examples.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">$458</div>
                      <div className="text-sm text-gray-400">{t('referralProgram.examples.example1')}</div>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">$2,290</div>
                        <div className="text-sm text-gray-400">{t('referralProgram.examples.example2')}</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">$9,160</div>
                        <div className="text-sm text-gray-400">{t('referralProgram.examples.example3')}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="text-xl font-bold text-white mb-6 text-center">{t('referralProgram.commissionStructure')}</h4>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Plus Plan */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400 text-center">{t('referralProgram.plusPlan')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {referralStructure.plus.levels.map((level) => (
                    <div key={level.level} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                          L{level.level}
                        </Badge>
                        <span className="text-white">${level.amount}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{level.percentage}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400 text-center">{t('referralProgram.proPlan')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {referralStructure.pro.levels.map((level) => (
                    <div key={level.level} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                          L{level.level}
                        </Badge>
                        <span className="text-white">${level.amount}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{level.percentage}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('faq.title')}</h2>
            <p className="text-gray-400 text-lg">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-white mb-3">{faq.question}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-600/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">{t('cta.title')}</h3>
              <p className="text-gray-400 mb-6">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  onClick={() => setShowSignInModal(true)}
                >
                  {t('cta.signIn')}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 px-8"
                  onClick={() => setShowSignUpModal(true)}
                >
                  {t('cta.getStarted')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

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

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
              <p className="text-gray-400">Sign in to your Miky.ai account</p>
            </div>

            <form className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Sign In
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignInModal(false)
                    setShowSignUpModal(true)
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Get Started Free</h3>
              <p className="text-gray-400">Create your account and get 100 free credits</p>
            </div>

            <form className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Referral code (optional)"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Create Account
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignUpModal(false)
                    setShowSignInModal(true)
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}

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
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-gray-400 mb-6">
                  Your message has been successfully sent. Our team will get back to you shortly.
                </p>
                <Button
                  onClick={handleContactClose}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Contact Us</h3>
                  <p className="text-gray-400">Send us a message and we'll get back to you</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your message"
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
                    {contactLoading ? 'Sending...' : 'Send Message'}
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
