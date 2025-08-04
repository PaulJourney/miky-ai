import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { 
  CheckCircle, 
  ChatCircle, 
  Users, 
  CreditCard, 
  ArrowRight, 
  Sparkle,
  X
} from '@phosphor-icons/react'

interface WelcomeTutorialProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export function WelcomeTutorial({ isOpen, onClose, userName }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const steps = [
    {
      title: "Welcome to Miky.ai!",
      description: `Hi ${userName || 'there'}! 🎉 You've successfully joined the future of AI assistance. Let's show you how to get the most out of your ultra-skilled AI personas.`,
      icon: <Sparkle className="w-8 h-8 text-primary" />,
      highlight: null
    },
    {
      title: "Choose Your AI Persona",
      description: "Select from 6 specialized AI personas, each with unique skills. From legal advice to creative coaching - pick the right expert for your needs.",
      icon: <Users className="w-8 h-8 text-primary" />,
      highlight: "personas"
    },
    {
      title: "Start Chatting",
      description: "Type your question or use voice input to communicate with your chosen AI persona. Each response is tailored to their expertise.",
      icon: <ChatCircle className="w-8 h-8 text-primary" />,
      highlight: "input"
    },
    {
      title: "Manage Your Credits",
      description: "Every interaction uses credits. Monitor your balance in the top-right corner and upgrade your plan for more credits and advanced features.",
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      highlight: "credits"
    }
  ]

  useEffect(() => {
    if (isOpen && currentStep > 0) {
      setShowTooltip(true)
      const timer = setTimeout(() => {
        setShowTooltip(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const currentStepData = steps[currentStep]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute -top-2 -right-2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex flex-col items-center text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {currentStepData.icon}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">{currentStepData.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-primary' 
                        : index < currentStep 
                          ? 'bg-primary/50' 
                          : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip Tutorial
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overlay tooltips for UI elements */}
      {showTooltip && currentStepData.highlight && (
        <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none">
          {currentStepData.highlight === 'personas' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Card className="p-4 bg-background border-primary animate-pulse">
                <div className="text-sm font-medium text-primary">
                  👆 Choose your AI persona here
                </div>
              </Card>
            </div>
          )}
          
          {currentStepData.highlight === 'input' && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Card className="p-4 bg-background border-primary animate-pulse">
                <div className="text-sm font-medium text-primary">
                  👆 Type your questions here
                </div>
              </Card>
            </div>
          )}
          
          {currentStepData.highlight === 'credits' && (
            <div className="absolute top-6 right-6">
              <Card className="p-4 bg-background border-primary animate-pulse">
                <div className="text-sm font-medium text-primary">
                  👆 Your credits are shown here
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  )
}