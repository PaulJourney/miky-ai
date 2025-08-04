import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Microphone, PaperPlaneRight, Paperclip } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Persona } from '../App'
import { useT } from '../contexts/TranslationContext'

interface MainInputProps {
  onSendMessage: (message: string) => void
  onVoiceInput: () => void
  isRecording: boolean
  disabled: boolean
  selectedPersona: Persona | null
  onOpenChat?: () => void
  showChatModal?: boolean
  isAuthenticated?: boolean
}

export function MainInput({ 
  onSendMessage, 
  onVoiceInput, 
  isRecording, 
  disabled, 
  selectedPersona,
  onOpenChat,
  showChatModal = false,
  isAuthenticated = false
}: MainInputProps) {
  const [message, setMessage] = useState('')
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [isAnimating, setIsAnimating] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [personaPlaceholder, setPersonaPlaceholder] = useState('')
  const [isPersonaAnimating, setIsPersonaAnimating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useT()

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ')
      toast.success(`Files attached: ${fileNames}`)
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      // Only open chat modal if user is authenticated
      if (isAuthenticated) {
        onOpenChat?.()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getPlaceholder = () => {
    if (disabled) return t('chat.notEnoughCredits')
    if (!selectedPersona) {
      // Return animated placeholder for general mode
      if (isAnimating && !isFocused) {
        return animatedPlaceholder
      }
      return t('chat.askAnything')
    }
    
    // Return animated placeholder for persona mode
    if (isPersonaAnimating && !isFocused) {
      return personaPlaceholder
    }
    
    const getPersonaName = (persona: Persona) => {
      if (persona === 'academic') return 'Professor'
      if (persona === 'medical') return 'Doctor'
      if (persona === 'god-mode') return 'God'
      return t(`personas.${persona}.name`)
    }
    
    return t('chat.placeholderPersona', { persona: getPersonaName(selectedPersona) })
  }

  // Typing animation effect for general mode
  useEffect(() => {
    if (selectedPersona || isFocused || disabled) {
      setIsAnimating(false)
      return
    }

    const fullText = t('chat.askAnything')
    let currentIndex = 0
    let isDeleting = false
    let timeoutId: NodeJS.Timeout

    const animate = () => {
      if (isDeleting) {
        if (currentIndex > 0) {
          setAnimatedPlaceholder(fullText.substring(0, currentIndex - 1))
          currentIndex--
          timeoutId = setTimeout(animate, 50) // Faster deletion
        } else {
          isDeleting = false
          timeoutId = setTimeout(animate, 1000) // Pause before typing again
        }
      } else {
        if (currentIndex < fullText.length) {
          setAnimatedPlaceholder(fullText.substring(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(animate, 60) // Faster typing speed
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true
            animate()
          }, 2000) // Pause at end before deleting
        }
      }
    }

    setIsAnimating(true)
    animate()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [selectedPersona, isFocused, disabled, t])

  // Typing animation effect for persona mode
  useEffect(() => {
    if (!selectedPersona || isFocused || disabled) {
      setIsPersonaAnimating(false)
      return
    }

    const getPersonaName = (persona: Persona) => {
      if (persona === 'academic') return 'Professor'
      if (persona === 'medical') return 'Doctor'
      if (persona === 'god-mode') return 'God'
      return t(`personas.${persona}.name`)
    }
    
    const fullText = t('chat.placeholderPersona', { persona: getPersonaName(selectedPersona) })
    let currentIndex = 0
    let isDeleting = false
    let timeoutId: NodeJS.Timeout

    const animate = () => {
      if (isDeleting) {
        if (currentIndex > 0) {
          setPersonaPlaceholder(fullText.substring(0, currentIndex - 1))
          currentIndex--
          timeoutId = setTimeout(animate, 50) // Faster deletion
        } else {
          isDeleting = false
          timeoutId = setTimeout(animate, 1000) // Pause before typing again
        }
      } else {
        if (currentIndex < fullText.length) {
          setPersonaPlaceholder(fullText.substring(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(animate, 60) // Faster typing speed
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true
            animate()
          }, 2000) // Pause at end before deleting
        }
      }
    }

    setIsPersonaAnimating(true)
    animate()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [selectedPersona, isFocused, disabled, t])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`transform transition-all duration-300 ${showChatModal ? 'scale-105 opacity-50' : 'scale-100 opacity-100'}`}>
        <Card className="p-4 bg-card/50 backdrop-blur border-border">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={getPlaceholder()}
                className="min-h-[80px] pr-20 text-sm resize-none focus:ring-primary focus:ring-2 focus:ring-offset-0 border-input placeholder:italic"
                disabled={disabled}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onVoiceInput}
                  className={`p-2 ${isRecording ? 'voice-recording text-primary' : ''}`}
                  disabled={disabled}
                >
                  <Microphone className={`w-4 h-4 ${isRecording ? 'text-primary' : ''}`} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFileUpload}
                  className="p-2"
                  disabled={disabled}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {selectedPersona ? (
                  <span>
                    Ultra-skilled: <span className="text-primary font-medium capitalize">
                      {selectedPersona === 'god-mode' ? t('personas.godMode.name') : t(`personas.${selectedPersona}.name`)}
                    </span>
                  </span>
                ) : (
                  <span>{t('homepage.generalChatMode')}</span>
                )}
              </div>
              <Button 
                type="submit" 
                size="sm" 
                disabled={!message.trim() || disabled}
                className="hover:glow-effect text-xs"
              >
                <PaperPlaneRight className="w-4 h-4 mr-1" />
                {t('chat.send')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}