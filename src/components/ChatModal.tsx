import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Microphone, 
  Paperclip, 
  PaperPlaneTilt, 
  User, 
  Robot, 
  ClockCounterClockwise,
  Scales, 
  Wrench, 
  TrendUp, 
  ChatCircle, 
  FirstAidKit, 
  Lightning,
  GraduationCap,
  CurrencyDollar,
  Heart
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useT } from '../contexts/TranslationContext'
import type { Conversation, Persona } from '../App'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  conversation: Conversation | null
  selectedPersona: Persona | null
  onSendMessage: (message: string) => void
  onVoiceInput: () => void
  isRecording: boolean
  disabled?: boolean
  user: any
  isLoading?: boolean
  onViewHistory?: () => void
}

export function ChatModal({ 
  isOpen, 
  onClose, 
  conversation, 
  selectedPersona,
  onSendMessage, 
  onVoiceInput, 
  isRecording, 
  disabled,
  user,
  isLoading = false,
  onViewHistory
}: ChatModalProps) {
  const { t } = useT()
  const [inputValue, setInputValue] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Typing animation effect for placeholder
  useEffect(() => {
    if (!isOpen || inputValue) {
      setIsAnimating(false)
      return
    }

    // No animation in modal - just set static placeholder
    setAnimatedPlaceholder(getStaticPlaceholder())
    setIsAnimating(false)
  }, [isOpen, selectedPersona, inputValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || disabled) return
    
    onSendMessage(inputValue)
    setInputValue('')
    setShowTyping(true)
    
    // Hide typing indicator after response
    setTimeout(() => setShowTyping(false), 2000)
  }

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

  const getPersonaIcon = (persona: string) => {
    const iconMap = {
      academic: GraduationCap,
      marketer: TrendUp,
      engineer: Wrench,
      coach: ChatCircle,
      sensei: Heart,
      richman: CurrencyDollar,
      lawyer: Scales,
      medical: FirstAidKit,
      'god-mode': Lightning
    }
    return iconMap[persona as keyof typeof iconMap] || Robot
  }

  const getPersonaName = (persona: Persona | null) => {
    if (!persona) return 'Miky'
    
    const names = {
      academic: t('chat.chatWith', { persona: 'Professor' }),
      marketer: t('chat.chatWith', { persona: t('personas.marketer.name') }),
      engineer: t('chat.chatWith', { persona: t('personas.engineer.name') }),
      coach: t('chat.chatWith', { persona: t('personas.coach.name') }),
      sensei: t('chat.chatWith', { persona: t('personas.sensei.name') }),
      richman: t('chat.chatWith', { persona: t('personas.richman.name') }),
      lawyer: t('chat.chatWith', { persona: t('personas.lawyer.name') }),
      medical: t('chat.chatWith', { persona: 'Doctor' }),
      'god-mode': t('chat.chatWith', { persona: 'God' })
    }
    return names[persona] || 'Miky'
  }

  const getPersonaDisplayName = (persona: string) => {
    const names = {
      academic: t('chat.technical'), // Using existing technical label for academic
      marketer: t('chat.marketing'),
      engineer: t('chat.technical'),
      coach: t('chat.coaching'),
      sensei: t('chat.coaching'), // Using existing coaching label for relationships
      richman: t('chat.marketing'), // Using existing marketing label for business
      lawyer: t('chat.legal'),
      medical: t('chat.medical'),
      'god-mode': t('chat.philosophical')
    }
    return names[persona as keyof typeof names] || t('chat.general')
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getPlaceholder = () => {
    if (inputValue) return '' // Hide placeholder when user is typing
    return getStaticPlaceholder()
  }

  const getStaticPlaceholder = () => {
    if (!selectedPersona) return t('chat.placeholderGeneral')
    
    const placeholders = {
      academic: t('chat.placeholderPersona', { persona: 'Professor' }),
      marketer: t('chat.placeholderPersona', { persona: t('personas.marketer.name') }),
      engineer: t('chat.placeholderPersona', { persona: t('personas.engineer.name') }),
      coach: t('chat.placeholderPersona', { persona: t('personas.coach.name') }),
      sensei: t('chat.placeholderPersona', { persona: t('personas.sensei.name') }),
      richman: t('chat.placeholderPersona', { persona: t('personas.richman.name') }),
      lawyer: t('chat.placeholderPersona', { persona: t('personas.lawyer.name') }),
      medical: t('chat.placeholderPersona', { persona: 'Doctor' }),
      'god-mode': t('chat.placeholderPersona', { persona: 'God' })
    }
    return placeholders[selectedPersona] || t('chat.placeholderGeneral')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="chat-modal p-0 bg-background border-border overflow-hidden [&>button]:hidden w-[95vw] max-w-7xl h-[90vh] max-h-[90vh] md:w-[90vw] md:h-[85vh]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                  {selectedPersona ? (() => {
                    const IconComponent = getPersonaIcon(selectedPersona)
                    return <IconComponent className="w-5 h-5 text-primary" />
                  })() : <Robot className="w-5 h-5 text-primary" />}
                </div>
              </Avatar>
              <div>
                {/* Hide title on mobile, show on desktop */}
                <h2 className="font-semibold text-base hidden md:block">
                  {conversation?.title || t('chat.newConversation')}
                </h2>
                <div className="flex items-center gap-2 mt-1 md:mt-1">
                  <span className="text-sm text-muted-foreground">
                    {getPersonaName(selectedPersona)}
                  </span>
                  {selectedPersona && (
                    <Badge variant="outline" className="text-xs hidden md:inline-flex">
                      {getPersonaDisplayName(selectedPersona)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Hide conversations link on mobile, show on desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewHistory}
                className="h-8 px-3 text-sm text-muted-foreground hover:text-primary hidden md:flex"
              >
                <ClockCounterClockwise className="w-4 h-4 mr-2" />
                {t('chat.history')}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 relative overflow-hidden">
            <div 
              ref={messagesContainerRef}
              className="absolute inset-0 overflow-y-auto p-4 space-y-4"
              style={{ 
                height: '100%', 
                overflowY: 'auto',
                overscrollBehavior: 'contain'
              }}
            >
              {conversation?.messages.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  {t('chat.placeholderPersona', { persona: getPersonaName(selectedPersona) })}
                </div>
              )}
              
              {conversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Robot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </Avatar>

                  <div className={`flex-1 space-y-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`
                        inline-block px-4 py-3 rounded-md text-sm max-w-[80%]
                        ${message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted text-foreground'
                        }
                      `}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(new Date(message.timestamp))}
                    </div>
                  </div>
                </div>
              ))}

              {(showTyping || isLoading) && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                      <Robot className="w-4 h-4 text-primary" />
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block px-4 py-3 rounded-md text-sm bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-card shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-10 w-10 p-0 flex-shrink-0"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder()}
                  disabled={disabled}
                  className="pr-12 h-12 text-sm md:text-base italic placeholder:italic"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onVoiceInput}
                  disabled={disabled}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                    isRecording ? 'text-red-500 animate-pulse' : ''
                  }`}
                >
                  <Microphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={!inputValue.trim() || disabled}
                className="h-12 w-12 rounded-full p-0"
              >
                <PaperPlaneTilt className="w-4 h-4" />
              </Button>
            </form>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            
            {disabled && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('chat.notEnoughCredits')}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}