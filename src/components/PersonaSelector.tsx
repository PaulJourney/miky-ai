import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { 
  Scales, 
  Wrench, 
  TrendUp, 
  ChatCircle, 
  FirstAidKit, 
  Lightning,
  Info,
  GraduationCap,
  CurrencyDollar,
  Heart
} from '@phosphor-icons/react'
import type { Persona } from '../App'
import { useT } from '../contexts/TranslationContext'

interface PersonaSelectorProps {
  selectedPersona: Persona | null
  onPersonaSelect: (persona: Persona | null) => void
  userPlan: 'free' | 'plus' | 'business' | undefined
  onUpgradeToPlusRequest?: () => void
}

export function PersonaSelector({ selectedPersona, onPersonaSelect, userPlan, onUpgradeToPlusRequest }: PersonaSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedPersonaInfo, setSelectedPersonaInfo] = useState<Persona | null>(null)
  const { t } = useT()
  
  const personas: Array<{
    id: Persona
    name: string
    icon: React.ElementType
    description: string
    requiresPaid: boolean
    detailedDescription: string
  }> = [
    {
      id: 'academic',
      name: t('personas.academic.name'),
      icon: GraduationCap,
      description: t('personas.academic.description'),
      requiresPaid: false,
      detailedDescription: t('personas.academic.fullDescription')
    },
    {
      id: 'marketer',
      name: t('personas.marketer.name'),
      icon: TrendUp,
      description: t('personas.marketer.description'),
      requiresPaid: false,
      detailedDescription: t('personas.marketer.fullDescription')
    },
    {
      id: 'engineer',
      name: t('personas.engineer.name'), 
      icon: Wrench,
      description: t('personas.engineer.description'),
      requiresPaid: false,
      detailedDescription: t('personas.engineer.fullDescription')
    },
    {
      id: 'coach',
      name: t('personas.coach.name'),
      icon: ChatCircle,
      description: t('personas.coach.description'),
      requiresPaid: false,
      detailedDescription: t('personas.coach.fullDescription')
    },
    {
      id: 'richman',
      name: t('personas.richman.name'),
      icon: CurrencyDollar,
      description: t('personas.richman.description'),
      requiresPaid: false,
      detailedDescription: t('personas.richman.fullDescription')
    },
    {
      id: 'sensei',
      name: t('personas.sensei.name'),
      icon: Heart,
      description: t('personas.sensei.description'),
      requiresPaid: false,
      detailedDescription: t('personas.sensei.fullDescription')
    },
    {
      id: 'lawyer',
      name: t('personas.lawyer.name'),
      icon: Scales,
      description: t('personas.lawyer.description'),
      requiresPaid: true,
      detailedDescription: t('personas.lawyer.fullDescription')
    },
    {
      id: 'medical',
      name: t('personas.medical.name'),
      icon: FirstAidKit,
      description: t('personas.medical.description'),
      requiresPaid: true,
      detailedDescription: t('personas.medical.fullDescription')
    },
    {
      id: 'god-mode',
      name: t('personas.godMode.name'),
      icon: Lightning,
      description: t('personas.godMode.description'),
      requiresPaid: true,
      detailedDescription: t('personas.godMode.fullDescription')
    }
  ]

  const canUsePersona = (persona: typeof personas[0]) => {
    if (!persona.requiresPaid) return true
    return userPlan && userPlan !== 'free'
  }

  const handlePersonaClick = (persona: typeof personas[0]) => {
    if (canUsePersona(persona)) {
      onPersonaSelect(persona.id)
    } else if (persona.requiresPaid && userPlan === 'free') {
      setShowUpgradeModal(true)
    }
  }

  const handleUpgradeClick = () => {
    setShowUpgradeModal(false)
    onUpgradeToPlusRequest?.()
  }

  const handleInfoClick = (e: React.MouseEvent, persona: typeof personas[0]) => {
    e.stopPropagation()
    setSelectedPersonaInfo(persona.id)
    setShowInfoModal(true)
  }

  const getPersonaTitle = (persona: typeof personas[0]) => {
    // Special cases for specific persona titles
    if (persona.id === 'academic') return 'Professor Miky'
    if (persona.id === 'medical') return 'Doctor Miky'
    if (persona.id === 'god-mode') return 'God Miky'
    return `${persona.name} Miky`
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <div className="text-center mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">{t('homepage.choosePersona')}</h2>
      </div>
      
      <div className="space-y-4">
        {/* Desktop: 3 rows with 3 columns each, Mobile: stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id
          const canUse = canUsePersona(persona)
          const IconComponent = persona.icon
          
          return (
            <Button
              key={persona.id}
              variant={isSelected ? 'default' : 'outline'}
              className={`
                h-auto p-4 w-full flex items-center gap-3 text-left transition-all duration-200 group
                ${isSelected ? 'glow-effect ring-2 ring-primary/50' : ''}
                ${!canUse ? 'opacity-50' : 'hover:glow-effect'}
              `}
              onClick={() => handlePersonaClick(persona)}
              disabled={false}
            >
              <IconComponent 
                size={20} 
                className={`${isSelected ? 'text-black' : 'text-foreground group-hover:text-primary'} transition-colors duration-200 flex-shrink-0`} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm transition-colors duration-200 ${isSelected ? 'text-black' : 'group-hover:text-primary'}`}>{persona.name}</span>
                  {persona.requiresPaid && (
                    <Badge variant="secondary" className="text-xs px-2 py-0 flex-shrink-0 font-normal">
                      {t('plans.plus')}
                    </Badge>
                  )}
                </div>
                <p className={`text-xs mt-1 transition-colors duration-200 ${isSelected ? 'text-black font-normal' : 'text-muted-foreground'} leading-tight`}>
                  {persona.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto min-h-0 hover:bg-transparent group/info flex-shrink-0"
                onClick={(e) => handleInfoClick(e, persona)}
              >
                <Info 
                  size={16} 
                  className={`transition-colors duration-200 ${
                    isSelected 
                      ? 'text-muted-foreground' 
                      : 'text-muted-foreground group-hover/info:text-black'
                  }`}
                />
              </Button>
            </Button>
          )
        })}
        </div>
        
        {selectedPersona && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPersonaSelect(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t('homepage.generalChatMode')}
            </Button>
          </div>
        )}
      </div>

      {userPlan === 'free' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <button 
              onClick={onUpgradeToPlusRequest}
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              {t('modals.upgrade')}
            </button> {t('homepage.upgradeToUnlock')}
          </p>
        </div>
      )}

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t('modals.upgradePlan')}</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Upgrade now to unlock Medical, God Mode, and other advanced features.
            </p>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 group"
              >
                <span className="group-hover:text-primary transition-colors duration-200">
                  {t('modals.cancel')}
                </span>
              </Button>
              <Button 
                onClick={handleUpgradeClick}
                className="flex-1"
              >
                {t('pricing.upgradeTo', { plan: t('plans.plus') })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedPersonaInfo && getPersonaTitle(personas.find(p => p.id === selectedPersonaInfo)!)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {selectedPersonaInfo && (
              <div className="text-center">
                <div className="mb-4">
                  {(() => {
                    const persona = personas.find(p => p.id === selectedPersonaInfo)!
                    const IconComponent = persona.icon
                    return <IconComponent size={48} className="text-primary mx-auto" />
                  })()}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {personas.find(p => p.id === selectedPersonaInfo)?.detailedDescription}
                </p>
              </div>
            )}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setShowInfoModal(false)}
                className="px-8"
              >
                {t('modals.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}