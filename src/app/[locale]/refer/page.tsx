'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { LoginRequiredLocalized } from '@/components/LoginRequiredLocalized'
import { AuthModals } from '@/components/AuthModals'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import {
  Users,
  DollarSign,
  Copy,
  CheckCircle,
  Gift,
  TrendingUp,
  Star,
  Share2,
  CheckCircle2,
  Download,
  X,
  Loader2,
  CreditCard,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Crown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Mail,
  Send,
  Linkedin,
  Twitter,
  ArrowLeft,
  ArrowRight,
  Info
} from 'lucide-react'

export default function ReferPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const t = useTranslations('refer')

  // States
  const [copied, setCopied] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(25)
  const [paypalEmail, setPaypalEmail] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [currentChartMonth, setCurrentChartMonth] = useState(2) // Start at current month (Jan 2025)
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false)
  const [showUpgradeRequiredModal, setShowUpgradeRequiredModal] = useState(false)

  // Auto-show how it works modal when user first visits refer page
  useEffect(() => {
    if (user && !loading) {
      const hasSeenReferralInfo = localStorage.getItem('miky-referral-info-seen')
      if (!hasSeenReferralInfo) {
        setShowHowItWorksModal(true)
        localStorage.setItem('miky-referral-info-seen', 'true')
      }
    }
  }, [user, loading])

  // Referral data
  const referralCode = profile?.referral_code || 'MIKY2024'
  const referralLink = `https://miky.ai?ref=${referralCode}`
  const isUserActive = profile?.subscription_plan === 'plus' || profile?.subscription_plan === 'pro'

  // Commission structure from image
  const commissionStructure = {
    plus: {
      total: 5,
      levels: [
        { level: 1, amount: 2, percentage: 40 },
        { level: 2, amount: 1.5, percentage: 30 },
        { level: 3, amount: 0.8, percentage: 16 },
        { level: 4, amount: 0.5, percentage: 10 },
        { level: 5, amount: 0.2, percentage: 4 }
      ]
    },
    pro: {
      total: 15,
      levels: [
        { level: 1, amount: 6, percentage: 40 },
        { level: 2, amount: 4.05, percentage: 27 },
        { level: 3, amount: 2.4, percentage: 16 },
        { level: 4, amount: 1.35, percentage: 9 },
        { level: 5, amount: 1.2, percentage: 8 }
      ]
    }
  }

  // Mock realistic referral data
  const referralStats = {
    totalEarnings: 2847.50,
    availableForWithdraw: 1250.75,
    pendingEarnings: 325.25,
    lostEarningsWhileFree: 892.40,
    totalReferrals: 47,
    thisMonthEarnings: 423.80,
    lastMonthEarnings: 376.25,
    networkLevels: [
      { level: 1, users: 12, earnings: 1240.50, thisMonth: 180.25 },
      { level: 2, users: 8, earnings: 567.75, thisMonth: 98.50 },
      { level: 3, users: 15, earnings: 432.25, thisMonth: 89.75 },
      { level: 4, users: 7, earnings: 298.60, thisMonth: 35.20 },
      { level: 5, users: 5, earnings: 308.40, thisMonth: 20.10 }
    ],
    recentTransactions: [
      { date: '2025-01-15', amount: 6.00, level: 1, type: 'pro', user: 'Marco Rossi' },
      { date: '2025-01-12', amount: 2.00, level: 1, type: 'plus', user: 'Sarah Kim' },
      { date: '2025-01-10', amount: 4.05, level: 2, type: 'pro', user: 'Alex Mitchell' },
      { date: '2025-01-08', amount: 1.50, level: 2, type: 'plus', user: 'Lisa Parker' },
      { date: '2025-01-05', amount: 2.40, level: 3, type: 'pro', user: 'David Lopez' },
      { date: '2025-01-03', amount: 1.50, level: 2, type: 'plus', user: 'Emma Taylor' },
      { date: '2024-12-28', amount: 6.00, level: 1, type: 'pro', user: 'James Wilson' },
      { date: '2024-12-25', amount: 2.00, level: 1, type: 'plus', user: 'Sofia Chen' },
      { date: '2024-12-22', amount: 4.05, level: 2, type: 'pro', user: 'Lucas Brown' },
      { date: '2024-12-18', amount: 0.8, level: 3, type: 'plus', user: 'Maya Foster' },
      { date: '2024-12-15', amount: 2.40, level: 3, type: 'pro', user: 'Noah Garcia' },
      { date: '2024-12-12', amount: 1.50, level: 2, type: 'plus', user: 'Zoe Harris' },
      { date: '2024-12-10', amount: 6.00, level: 1, type: 'pro', user: 'Ethan Ivanov' },
      { date: '2024-12-08', amount: 2.00, level: 1, type: 'plus', user: 'Mia Johnson' },
      { date: '2024-12-05', amount: 1.35, level: 4, type: 'pro', user: 'Ryan Kumar' },
      { date: '2024-12-02', amount: 0.5, level: 4, type: 'plus', user: 'Aria Lee' },
      { date: '2024-11-28', amount: 4.05, level: 2, type: 'pro', user: 'Owen Martinez' },
      { date: '2024-11-25', amount: 2.40, level: 3, type: 'pro', user: 'Luna Newman' },
      { date: '2024-11-20', amount: 1.2, level: 5, type: 'pro', user: 'Tyler Oliver' },
      { date: '2024-11-18', amount: 0.2, level: 5, type: 'plus', user: 'Ivy Palmer' }
    ],
    monthlyEarnings: [
      { month: 'Nov 2024', earnings: 156.75, referrals: 5 },
      { month: 'Dec 2024', earnings: 287.90, referrals: 12 },
      { month: 'Jan 2025', earnings: 423.80, referrals: 15 }
    ]
  }

  // Calculate withdrawal limits
  const minWithdraw = 25
  const maxWithdraw = Math.floor(referralStats.availableForWithdraw)
  const canWithdraw = referralStats.availableForWithdraw >= minWithdraw

  useEffect(() => {
    setWithdrawAmount(Math.max(minWithdraw, Math.min(maxWithdraw, withdrawAmount)))
  }, [maxWithdraw])

  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share referral link
  const shareReferralLink = async () => {
    setShowShareModal(true)
  }

  // Share via specific platform
  const shareVia = (platform: string) => {
    const message = t('shareModal.shareMessage')

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + '\n\n' + referralLink)}`, '_blank')
        break
      case 'email':
        const subject = t('shareModal.emailSubject')
        const body = t('shareModal.emailBody', { link: referralLink })
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
        break
      case 'twitter':
        const tweetText = t('shareModal.tweetText')
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralLink)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank')
        break
      case 'copy':
        copyReferralLink()
        break
    }
    setShowShareModal(false)
  }

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!paypalEmail || withdrawAmount < minWithdraw) return

    setWithdrawLoading(true)

    try {
      // Send email to support
      const response = await fetch('/api/withdrawal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          paypalEmail,
          amount: withdrawAmount,
          userStats: referralStats
        })
      })

      if (response.ok) {
        setShowWithdrawModal(false)
        // Show success modal
        alert(t('withdrawModal.successMessage', { amount: withdrawAmount }))
        setPaypalEmail('')
        setWithdrawAmount(minWithdraw)
      }
    } catch (error) {
      alert(t('withdrawModal.errorMessage'))
    } finally {
      setWithdrawLoading(false)
    }
  }

  // Chart navigation
  const previousMonth = () => {
    setCurrentChartMonth(Math.max(0, currentChartMonth - 1))
  }

  const nextMonth = () => {
    setCurrentChartMonth(Math.min(referralStats.monthlyEarnings.length - 1, currentChartMonth + 1))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header
        currentPage="refer"
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {user ? (
            <div className="space-y-8">
              {/* Hero Stats - Improved horizontal alignment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-4 gap-6"
              >
                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-600/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm font-medium">{t('stats.totalEarnings')}</p>
                        <p className="text-2xl font-bold text-white">${referralStats.totalEarnings.toLocaleString()}</p>
                        <div className="h-4 flex items-center">
                          <p className="text-green-400 text-xs flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            {t('stats.monthlyGrowth')}
                          </p>
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-600/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm font-medium">{t('stats.availableForWithdraw')}</p>
                        <p className="text-2xl font-bold text-white">${referralStats.availableForWithdraw.toLocaleString()}</p>
                        <div className="h-4 flex items-center">
                          <p className="text-blue-400 text-xs">{t('stats.readyForPayout')}</p>
                        </div>
                      </div>
                      <Wallet className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-600/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-400 text-sm font-medium">{t('stats.networkSize')}</p>
                        <p className="text-2xl font-bold text-white">{referralStats.totalReferrals}</p>
                        <div className="h-4 flex items-center">
                          <p className="text-purple-400 text-xs">{t('stats.activeReferrals')}</p>
                        </div>
                      </div>
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-600/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-400 text-sm font-medium">{t('stats.thisMonth')}</p>
                        <p className="text-2xl font-bold text-white">${referralStats.thisMonthEarnings.toLocaleString()}</p>
                        <div className="h-4 flex items-center">
                          <p className="text-orange-400 text-xs flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            {t('stats.vsLastMonth', { amount: referralStats.lastMonthEarnings })}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* User Status Alert - Updated for active users */}
              {isUserActive ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-green-400 font-semibold text-lg mb-2">{t('stats.activePlan')}</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {t('stats.activePlanDescription', { plan: profile?.subscription_plan?.toUpperCase() })}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {t('stats.inactivePeriodMessage', { amount: referralStats.lostEarningsWhileFree.toLocaleString() })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-600/30 rounded-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-orange-400 font-semibold text-lg mb-2">{t('stats.activateAccount')}</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {t('stats.activateAccountDescription', { amount: referralStats.lostEarningsWhileFree.toLocaleString() })}
                      </p>
                      <Button
                        onClick={() => router.push('/pricing')}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        {t('stats.upgradeToStartEarning')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Referral Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-blue-400" />
                          {t('referralLink.title')}
                          <button
                            onClick={() => setShowHowItWorksModal(true)}
                            className="text-gray-400 hover:text-blue-400 transition-colors ml-2"
                            title={t('referralLink.howReferralsWork')}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Input
                            value={referralLink}
                            readOnly
                            className="bg-gray-900/50 border-gray-600 text-white flex-1 text-sm"
                          />
                          <div className="relative">
                            <Button
                              onClick={copyReferralLink}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                            >
                              {copied ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            {copied && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                {t('referralLink.copied')}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={shareReferralLink}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            size="sm"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {t('referralLink.share')}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Gift className="w-4 h-4" />
                          <span>{t('referralLink.referralCode')} <code className="bg-gray-700/50 px-2 py-1 rounded text-blue-400">{referralCode}</code></span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Network Breakdown - Always show this month earnings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          {t('networkBreakdown.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 min-h-[480px] flex flex-col">
                        {referralStats.networkLevels.map((level, index) => (
                          <motion.div
                            key={level.level}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-gray-900/30 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                                  L{level.level}
                                </Badge>
                                <span className="text-white font-medium">{level.users} {t('networkBreakdown.users')}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-green-400 font-semibold">${level.earnings.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">+${level.thisMonth} {t('networkBreakdown.thisMonth')}</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(level.earnings / referralStats.totalEarnings) * 100}%` }}
                              />
                            </div>
                          </motion.div>
                        ))}
                        <div className="flex-1"></div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent Transactions - Improved and wider */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          {t('recentEarnings.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                          {referralStats.recentTransactions.map((transaction, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.02 }}
                              className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50 hover:bg-gray-900/50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`w-3 h-3 rounded-full ${transaction.type === 'pro' ? 'bg-purple-400' : 'bg-blue-400'}`} />
                                  <div className="flex-1">
                                    <div className="text-white text-sm font-medium">{transaction.user}</div>
                                    <div className="text-gray-400 text-xs">{t('recentEarnings.level')} {transaction.level} • {transaction.type.toUpperCase()}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-gray-400 text-xs">{new Date(transaction.date).toLocaleDateString()}</div>
                                  <div className="text-green-400 font-semibold min-w-[60px] text-right">+${transaction.amount}</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-8 flex flex-col h-full">
                  {/* Withdrawal Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-600/30">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          {t('withdrawEarnings.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-2">
                            ${referralStats.availableForWithdraw.toLocaleString()}
                          </div>
                          <p className="text-green-400 text-sm">{t('withdrawEarnings.availableForWithdrawal')}</p>
                        </div>

                        {canWithdraw ? (
                          <Button
                            onClick={() => {
                              if (!isUserActive) {
                                setShowUpgradeRequiredModal(true)
                              } else {
                                setShowWithdrawModal(true)
                              }
                            }}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            {t('withdrawEarnings.withdrawToPaypal')}
                          </Button>
                        ) : (
                          <div className="text-center">
                            <p className="text-gray-400 text-sm mb-3">{t('withdrawEarnings.minimumWithdrawal')}</p>
                            <Button disabled className="w-full bg-gray-700 text-gray-400">
                              {t('withdrawEarnings.insufficientBalance')}
                            </Button>
                          </div>
                        )}


                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Commission Structure - Added more spacing to align with Network Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          {t('commissionStructure.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 flex-1 flex flex-col">
                        {/* Plus Plan */}
                        <div>
                          <h4 className="text-blue-400 font-medium mb-4">{t('commissionStructure.plusPlan')}</h4>
                          <div className="space-y-3">
                            {commissionStructure.plus.levels.map((level) => (
                              <div key={level.level} className="flex items-center justify-between text-sm p-3 bg-gray-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                                    L{level.level}
                                  </Badge>
                                  <span className="text-white">${level.amount}</span>
                                </div>
                                <span className="text-gray-400">{level.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pro Plan */}
                        <div>
                          <h4 className="text-purple-400 font-medium mb-4">{t('commissionStructure.proPlan')}</h4>
                          <div className="space-y-3">
                            {commissionStructure.pro.levels.map((level) => (
                              <div key={level.level} className="flex items-center justify-between text-sm p-3 bg-gray-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                                    L{level.level}
                                  </Badge>
                                  <span className="text-white">${level.amount}</span>
                                </div>
                                <span className="text-gray-400">{level.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Spacer per allineare l'altezza */}
                        <div className="flex-1"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[80vh]">
              <AnimatedBackground />
              <div className="relative z-10 space-y-8">
                <div className="pt-8">
                  <LoginRequiredLocalized
                    page="refer"
                    onSignIn={() => setShowSignInModal(true)}
                    onSignUp={() => setShowSignUpModal(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Withdrawal Modal - Improved */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('withdrawModal.title')}</h3>
                <p className="text-gray-400">{t('withdrawModal.available', { amount: referralStats.availableForWithdraw.toLocaleString() })}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('withdrawModal.paypalEmail')}</label>
                  <Input
                    type="email"
                    placeholder="your-paypal@email.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('withdrawModal.withdrawalAmount')}</label>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        ${withdrawAmount}
                      </div>
                    </div>

                    <input
                      type="range"
                      min={minWithdraw}
                      max={maxWithdraw}
                      step={5}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full h-3 bg-gray-700 rounded-full appearance-none slider-thumb cursor-pointer"
                      style={{
                        background: `linear-gradient(to right,
                          rgb(34 197 94) 0%,
                          rgb(5 150 105) ${((withdrawAmount - minWithdraw) / (maxWithdraw - minWithdraw)) * 100}%,
                          rgb(55 65 81) ${((withdrawAmount - minWithdraw) / (maxWithdraw - minWithdraw)) * 100}%,
                          rgb(55 65 81) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>${minWithdraw}</span>
                      <span>${maxWithdraw}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 text-sm text-blue-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">{t('withdrawModal.withdrawalInformation')}</p>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li>• {t('withdrawModal.confirmationEmail')}</li>
                        <li>• {t('withdrawModal.paypalTransfer')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={!paypalEmail || withdrawAmount < minWithdraw || withdrawLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {withdrawLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('withdrawModal.processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t('withdrawModal.requestWithdrawal')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* How It Works Modal - New */}
      <AnimatePresence>
        {showHowItWorksModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-4xl p-8 relative"
            >
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t('howItWorksModal.title')}</h3>
                <p className="text-gray-400">{t('howItWorksModal.subtitle')}</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                    <h4 className="text-blue-400 font-semibold text-lg mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      {t('howItWorksModal.forNewUsers.title')}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {t('howItWorksModal.forNewUsers.description')}
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                    <h4 className="text-green-400 font-semibold text-lg mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {t('howItWorksModal.forYou.title')}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      {t('howItWorksModal.forYou.description')}
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span><strong>{t('howItWorksModal.forYou.plusPlan')}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span><strong>{t('howItWorksModal.forYou.proPlan')}</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4 md:col-span-2">
                  <h4 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    {t('howItWorksModal.importantNote.title')}
                  </h4>
                  <p className="text-gray-300 text-xs">
                    {t('howItWorksModal.importantNote.description')}
                  </p>
                </div>
                <Button
                  onClick={() => setShowHowItWorksModal(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {t('howItWorksModal.gotIt')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Required Modal - New */}
      <AnimatePresence>
        {showUpgradeRequiredModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => setShowUpgradeRequiredModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-8 h-8 text-orange-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4">{t('upgradeRequired.title')}</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  {t('upgradeRequired.description')}
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowUpgradeRequiredModal(false)
                      router.push('/pricing')
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {t('upgradeRequired.upgradeYourPlan')}
                  </Button>

                  <button
                    onClick={() => setShowUpgradeRequiredModal(false)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {t('upgradeRequired.maybeLater')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal - New */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('shareModal.title')}</h3>
                <p className="text-gray-400">{t('shareModal.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={() => shareVia('whatsapp')}
                  className="bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.whatsapp')}</span>
                </Button>

                <Button
                  onClick={() => shareVia('email')}
                  className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.email')}</span>
                </Button>

                <Button
                  onClick={() => shareVia('twitter')}
                  className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 text-cyan-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.twitter')}</span>
                </Button>

                <Button
                  onClick={() => shareVia('linkedin')}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/30 text-indigo-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.linkedin')}</span>
                </Button>

                <Button
                  onClick={() => shareVia('telegram')}
                  className="bg-sky-600/20 hover:bg-sky-600/30 border border-sky-600/30 text-sky-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <Send className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.telegram')}</span>
                </Button>

                <Button
                  onClick={() => shareVia('copy')}
                  className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 text-gray-400 h-16 flex-col gap-2"
                  variant="outline"
                >
                  <Copy className="w-5 h-5" />
                  <span className="text-xs">{t('shareModal.copyLink')}</span>
                </Button>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-2">{t('shareModal.yourReferralLink')}</p>
                <p className="text-xs text-blue-400 font-mono break-all">{referralLink}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />

      <AuthModals
        showSignInModal={showSignInModal}
        showSignUpModal={showSignUpModal}
        onClose={() => {
          setShowSignInModal(false)
          setShowSignUpModal(false)
        }}
        onSignInSuccess={() => router.push('/refer')}
        onSignUpSuccess={() => router.push('/refer')}
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
