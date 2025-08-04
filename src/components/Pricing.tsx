import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { CheckCircle, Lightning, Crown, Coins, CreditCard } from '@phosphor-icons/react'
import type { User } from '../App'
import { toast } from 'sonner'
import { useState } from 'react'
import { useT } from '../contexts/TranslationContext'

interface PricingProps {
  user: User | null
  onPlanSelect: (plan: 'free' | 'plus' | 'business') => void
  onCreditPurchase: (credits: number) => void
  onAuthRequest: (mode: 'signin' | 'signup') => void
}

export function Pricing({ user, onPlanSelect, onCreditPurchase, onAuthRequest }: PricingProps) {
  const { t } = useT()
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false)
  const [creditsToBuy, setCreditsToBuy] = useState([500])
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const [upgradedPlan, setUpgradedPlan] = useState<string>('')
  const [targetPlan, setTargetPlan] = useState<'free' | 'plus' | 'business'>('free')
  const getFeatures = (planType: 'free' | 'plus' | 'business'): string[] => {
    const { language } = useT()
    const translations = {
      en: {
        free: ['100 credits/month', 'Text input', 'Basic support', 'Conversation history'],
        plus: ['1,000 credits/month', 'Voice input', 'File uploads', 'Priority support'],
        business: ['5,000 credits/month', 'All features', 'Priority support', 'Advanced analytics']
      },
      it: {
        free: ['100 crediti/mese', 'Input testo', 'Supporto base', 'Cronologia chat'],
        plus: ['1.000 crediti/mese', 'Input vocale', 'Upload file', 'Supporto prioritario'],
        business: ['5.000 crediti/mese', 'Tutte le funzioni', 'Supporto prioritario', 'Analisi avanzate']
      },
      es: {
        free: ['100 créditos/mes', 'Entrada texto', 'Soporte básico', 'Historial chat'],
        plus: ['1.000 créditos/mes', 'Entrada voz', 'Subida archivos', 'Soporte prioritario'],
        business: ['5.000 créditos/mes', 'Todas las funciones', 'Soporte prioritario', 'Análisis avanzados']
      },
      de: {
        free: ['100 Credits/Monat', 'Text-Eingabe', 'Basis-Support', 'Chat-Verlauf'],
        plus: ['1.000 Credits/Monat', 'Sprach-Eingabe', 'Datei-Upload', 'Prioritäts-Support'],
        business: ['5.000 Credits/Monat', 'Alle Funktionen', 'Prioritäts-Support', 'Erweiterte Analysen']
      }
    }
    return translations[language]?.[planType] || translations.en[planType]
  }

  const plans = [
    {
      id: 'free' as const,
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      period: '',
      credits: '100',
      icon: CheckCircle,
      features: getFeatures('free')
    },
    {
      id: 'plus' as const,
      name: t('pricing.plus.name'),
      price: t('pricing.plus.price'),
      period: '',
      credits: '1,000',
      icon: Lightning,
      popular: true,
      features: getFeatures('plus')
    },
    {
      id: 'business' as const,
      name: t('pricing.business.name'),
      price: t('pricing.business.price'),
      period: '',
      credits: '5,000',
      icon: Crown,
      features: getFeatures('business')
    }
  ]

  const calculateCreditPrice = (credits: number): number => {
    return Math.round(credits * 0.02) // $0.02 per credit
  }

  const formatNextBillingDate = (): string => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleSelectPlan = (planId: 'free' | 'plus' | 'business') => {
    if (!user) {
      onAuthRequest('signup')
      return
    }
    
    if (planId === user.plan) {
      toast.info('You are already on this plan')
      return
    }

    // Check if it's a downgrade
    if ((planId === 'free' && user.plan !== 'free') || 
        (planId === 'plus' && user.plan === 'business')) {
      setTargetPlan(planId)
      setShowDowngradeDialog(true)
      return
    }

    // Mock payment flow - in real implementation, integrate Stripe
    if (planId !== 'free') {
      const planName = plans.find(p => p.id === planId)?.name || ''
      toast.success(`Redirecting to payment for ${planName} plan...`)
      // Here you would integrate with Stripe
      setTimeout(() => {
        onPlanSelect(planId)
        setUpgradedPlan(planName)
        setShowUpgradeSuccess(true)
      }, 2000)
    } else {
      onPlanSelect(planId)
      toast.success('Downgraded to Free plan')
    }
  }

  const handleDowngradeConfirm = () => {
    setShowDowngradeDialog(false)
    onPlanSelect(targetPlan)
    const planName = plans.find(p => p.id === targetPlan)?.name || ''
    toast.success(`Downgraded to ${planName} plan`)
  }

  const handleBuyCredits = () => {
    const credits = creditsToBuy[0]
    const price = calculateCreditPrice(credits)
    
    // Mock payment processing
    toast.success(t('modals.paymentProcessing'))
    
    setTimeout(() => {
      setPurchasedCredits(credits)
      setShowBuyCreditsDialog(false)
      setShowPaymentSuccess(true)
      
      // Actually add credits to user account
      onCreditPurchase(credits)
    }, 2000)
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground pricing-title-mobile">
          {t('pricing.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = user?.plan === plan.id
          
          // Determine button text based on current plan and target plan
          const getButtonText = () => {
            if (!user) return t('pricing.selectPlan', { plan: plan.name })
            if (isCurrentPlan) return t('pricing.currentPlan')
            
            // Check for upgrades
            if (user.plan === 'free' && (plan.id === 'plus' || plan.id === 'business')) {
              return t('pricing.upgradeTo', { plan: plan.name })
            }
            if (user.plan === 'plus' && plan.id === 'business') {
              return t('pricing.upgradeTo', { plan: plan.name })
            }
            
            // Check for downgrades
            if (plan.id === 'free') {
              return t('pricing.downgradeTo', { plan: plan.name })
            }
            if (plan.id === 'plus' && user.plan === 'business') {
              return t('pricing.downgradeTo', { plan: plan.name })
            }
            
            // Default fallback
            return t('pricing.selectPlan', { plan: plan.name })
          }
          
          // Determine if this is a downgrade action
          const isDowngrade = () => {
            return user && ((plan.id === 'free' && user.plan !== 'free') || 
                   (plan.id === 'plus' && user.plan === 'business'))
          }

          const handlePlanClick = () => {
            if (!user) {
              onAuthRequest('signup')
              return
            }
            handleSelectPlan(plan.id)
          }
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg pricing-card-mobile ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">{t('pricing.plus.popular')}</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <CardDescription className="text-primary font-medium">
                  {plan.credits} {t('pricing.creditsMonth')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pricing-card-content-mobile">
                <div className="space-y-3 hidden md:block">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-1 md:pt-6 pricing-card-footer-mobile">
                <Button
                  className={`w-full ${
                    (!plan.popular && !isCurrentPlan) || isDowngrade() 
                      ? 'border-border hover:border-primary/50 hover:bg-muted/50 hover:text-foreground' 
                      : ''
                  }`}
                  variant={
                    isCurrentPlan 
                      ? 'secondary' 
                      : isDowngrade() 
                        ? 'outline' 
                        : plan.popular 
                          ? 'default' 
                          : 'outline'
                  }
                  onClick={handlePlanClick}
                  disabled={isCurrentPlan}
                >
                  {getButtonText()}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t('pricing.needMoreCredits')}</h3>
              <p className="text-muted-foreground mb-6 pricing-buy-credits-text-mobile">
                {t('pricing.buyAdditional')}
              </p>
              <Button 
                onClick={() => user ? setShowBuyCreditsDialog(true) : onAuthRequest('signup')}
                className="bg-primary hover:bg-primary/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {t('pricing.buyCredits')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downgrade Confirmation Dialog */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('modals.confirmDowngrade')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('modals.downgradeConfirmation')}
            </p>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="font-medium">{t('pricing.billingInformation')}:</div>
              <div className="text-sm text-muted-foreground">
                {t('modals.downgradeMessage', {
                  date: formatNextBillingDate(),
                  price: plans.find(p => p.id === targetPlan)?.price,
                  plan: plans.find(p => p.id === targetPlan)?.name
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDowngradeDialog(false)}>
              {t('modals.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDowngradeConfirm}>
              {t('modals.confirmDowngrade')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Credits Dialog */}
      <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {t('pricing.buyCreditsModal.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="bg-card/50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{t('pricing.buyCreditsModal.totalCost')}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ${calculateCreditPrice(creditsToBuy[0])}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{t('pricing.buyCreditsModal.selectAmount')}:</span>
                  <span className="text-muted-foreground">{creditsToBuy[0].toLocaleString()} {t('modals.credits')}</span>
                </div>
                <div className="relative">
                  <Slider
                    value={creditsToBuy}
                    onValueChange={setCreditsToBuy}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>100</span>
                    <span>5,000</span>
                    <span>10,000</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button
                  variant={creditsToBuy[0] === 500 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreditsToBuy([500])}
                  className={`text-xs ${creditsToBuy[0] !== 500 ? 'hover:text-primary' : ''}`}
                >
                  {t('pricing.buyCreditsModal.credits500')}
                </Button>
                <Button
                  variant={creditsToBuy[0] === 1000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreditsToBuy([1000])}
                  className={`text-xs ${creditsToBuy[0] !== 1000 ? 'hover:text-primary' : ''}`}
                >
                  {t('pricing.buyCreditsModal.credits1000')}
                </Button>
                <Button
                  variant={creditsToBuy[0] === 2000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreditsToBuy([2000])}
                  className={`text-xs ${creditsToBuy[0] !== 2000 ? 'hover:text-primary' : ''}`}
                >
                  {t('pricing.buyCreditsModal.credits2000')}
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="font-medium text-sm">{t('pricing.buyCreditsModal.creditsNeverExpire')}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('pricing.buyCreditsModal.useAnytime')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowBuyCreditsDialog(false)} className="hover:text-primary">
              {t('pricing.buyCreditsModal.cancel')}
            </Button>
            <Button onClick={handleBuyCredits} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('pricing.buyCreditsModal.purchase')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t('modals.paymentSuccess')}</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold">
                {purchasedCredits.toLocaleString()} {t('modals.creditsAdded')}
              </div>
              <div className="text-muted-foreground">
                {t('modals.creditsPurchaseSuccess')}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => setShowPaymentSuccess(false)} className="w-auto">
              {t('modals.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Success Dialog */}
      <Dialog open={showUpgradeSuccess} onOpenChange={setShowUpgradeSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t('modals.planUpgraded')}</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold">
                {upgradedPlan === 'Business' ? t('modals.welcomeToBusiness') : `Welcome to ${upgradedPlan}!`}
              </div>
              <div className="text-muted-foreground">
                {t('modals.planUpgraded')}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => setShowUpgradeSuccess(false)} className="w-auto">
              {t('modals.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}