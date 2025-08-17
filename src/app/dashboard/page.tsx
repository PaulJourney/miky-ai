'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ReactMarkdown from 'react-markdown'
import { DashboardTranslationProvider } from '@/components/DashboardTranslationProvider'
import { Header } from '@/components/Header'
import { LoginRequired } from '@/components/LoginRequired'
import { AuthModals } from '@/components/AuthModals'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import {
  Send,
  Mic,
  MicOff,
  User,
  Bot,
  MessageSquare,
  Settings,
  LogOut,
  Loader2,
  Plus,
  Copy,
  RotateCcw,
  GraduationCap,
  Code,
  TrendingUp,
  Heart,
  Scale,
  Stethoscope,
  DollarSign,
  Zap,
  Image as ImageIcon,
  Download,
  X,
  MoreVertical,
  Trash2,
  Crown
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: any[]
  persona?: string
  imageUrl?: string
}

export default function DashboardPage() {
  return (
    <DashboardTranslationProvider>
      <DashboardContent />
    </DashboardTranslationProvider>
  )
}

function DashboardContent() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth()
  const router = useRouter()
  const t = useTranslations('dashboard')

  // Auth modal states
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  // State
  const [currentPersona, setCurrentPersona] = useState<'generic' | 'academic' | 'engineer' | 'marketer' | 'coach' | 'lawyer' | 'medical' | 'biz-guru' | 'god-mode'>('generic')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [filePreview, setFilePreview] = useState<{file: File, preview: string}[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<{[key: string]: Message[]}>({})
  const [conversationTitles, setConversationTitles] = useState<{[key: string]: string}>({})
  const [currentConversationId, setCurrentConversationId] = useState<string>('default')
  const [waterAnimation, setWaterAnimation] = useState(false)
  const [showImagePrompt, setShowImagePrompt] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageGenerating, setImageGenerating] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Credits exhausted modal states
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [creditAmount, setCreditAmount] = useState(5000)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  // Profile state
  const [userCredits, setUserCredits] = useState(0)
  const [waterLiters, setWaterLiters] = useState(0)

  // Add state for editing titles
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [editTitleValue, setEditTitleValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Tooltip states
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Define PERSONAS using translations
  const PERSONAS = {
    generic: {
      name: t('personas.generic.name'),
      cost: 2,
      icon: Bot,
      color: 'from-gray-500/20 to-gray-600/20',
      description: t('personas.generic.description')
    },
    academic: {
      name: t('personas.academic.name'),
      cost: 3,
      icon: GraduationCap,
      color: 'from-blue-500/20 to-indigo-500/20',
      description: t('personas.academic.description')
    },
    engineer: {
      name: t('personas.engineer.name'),
      cost: 3,
      icon: Code,
      color: 'from-orange-500/20 to-red-500/20',
      description: t('personas.engineer.description')
    },
    marketer: {
      name: t('personas.marketer.name'),
      cost: 3,
      icon: TrendingUp,
      color: 'from-green-500/20 to-emerald-500/20',
      description: t('personas.marketer.description')
    },
    coach: {
      name: t('personas.coach.name'),
      cost: 3,
      icon: Heart,
      color: 'from-pink-500/20 to-purple-500/20',
      description: t('personas.coach.description')
    },
    lawyer: {
      name: t('personas.lawyer.name'),
      cost: 5,
      icon: Scale,
      color: 'from-yellow-500/20 to-amber-500/20',
      description: t('personas.lawyer.description')
    },
    medical: {
      name: t('personas.medical.name'),
      cost: 4,
      icon: Stethoscope,
      color: 'from-red-500/20 to-pink-500/20',
      description: t('personas.medical.description')
    },
    'biz-guru': {
      name: t('personas.biz-guru.name'),
      cost: 3,
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/20',
      description: t('personas.biz-guru.description')
    },
    'god-mode': {
      name: t('personas.god-mode.name'),
      cost: 4,
      icon: Zap,
      color: 'from-indigo-500/20 to-violet-500/20',
      description: t('personas.god-mode.description')
    }
  }

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('miky-conversations')
      const savedTitles = localStorage.getItem('miky-conversation-titles')

      if (savedConversations) {
        const conversations = JSON.parse(savedConversations)
        setConversationHistory(conversations)
      }

      if (savedTitles) {
        const titles = JSON.parse(savedTitles)
        setConversationTitles(titles)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(conversationHistory).length > 0) {
      localStorage.setItem('miky-conversations', JSON.stringify(conversationHistory))
    }
  }, [conversationHistory])

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      setConversationHistory(prev => {
        // Avoid duplicates by checking if the conversation already exists and is identical
        const existing = prev[currentConversationId]
        if (!existing || existing.length !== messages.length ||
            JSON.stringify(existing) !== JSON.stringify(messages)) {
          return {
            ...prev,
            [currentConversationId]: messages
          }
        }
        return prev
      })

      // Auto-generate title for new conversations
      if (messages.length === 2 && !conversationTitles[currentConversationId]) {
        const firstUserMessage = messages.find(m => m.role === 'user')
        if (firstUserMessage) {
          const autoTitle = generateChatTitle(firstUserMessage.content)
          setConversationTitles(prev => ({
            ...prev,
            [currentConversationId]: autoTitle
          }))
        }
      }
    }
  }, [messages, currentConversationId])

  useEffect(() => {
    if (profile) {
      setUserCredits(profile.credits || 0)
      setWaterLiters(profile.water_cleaned_liters || 0)
    }
  }, [profile])

  // Enhanced typing animation with smooth transitions
  useEffect(() => {
    const targetText = `${t('placeholders.askAnything')} ${PERSONAS[currentPersona].name}`
    let currentIndex = 0
    setIsTyping(true)

    setTypingText('')

    const typeInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setTypingText(targetText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setIsTyping(false)
          setTimeout(() => {
            setIsTyping(true)
            setTypingText('')
            currentIndex = 0
            const restartInterval = setInterval(() => {
              if (currentIndex <= targetText.length) {
                setTypingText(targetText.slice(0, currentIndex))
                currentIndex++
              } else {
                clearInterval(restartInterval)
                setIsTyping(false)
              }
            }, 80)
          }, 2000)
        }, 1000)
      }
    }, 80)

    return () => clearInterval(typeInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPersona, t])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageGenerating) return

    // Check credits before generating image
    if (!checkCreditsBeforeAction()) {
      return
    }

    setImageGenerating(true)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      const token = session?.access_token

      if (!token) {
        throw new Error('No authentication token available')
      }

      const requestBody = {
        messages: messages,
        persona: currentPersona,
        generateImage: true,
        imagePrompt: imagePrompt.trim()
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        const imageMessage: Message = {
          id: Date.now().toString() + '_image',
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          imageUrl: data.imageUrl
        }

        setMessages(prev => [...prev, imageMessage])

        setWaterAnimation(true)
        setTimeout(() => setWaterAnimation(false), 1000)

        if (!data.isMockProfile) {
          setUserCredits(data.newCredits)
          setWaterLiters(data.newWaterCleaned)
          await refreshProfile()
        } else {
          setUserCredits(prev => Math.max(0, prev - data.creditsUsed))
          setWaterLiters(prev => prev + 1)
        }

        setShowImagePrompt(false)
        setImagePrompt('')
      } else {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          try {
            const textResponse = await response.text()
            if (textResponse.includes('<!DOCTYPE')) {
              errorMessage = `Server error: API route not responding correctly (${response.status})`
            } else {
              errorMessage = `Server error: ${textResponse.substring(0, 100)}`
            }
          } catch (textError) {
            errorMessage = `Server error: Failed to parse response (${response.status})`
          }
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: t('messages.imageError', { error: error instanceof Error ? error.message : 'Unknown error' }),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setImageGenerating(false)
    }
  }

  // Check if user has enough credits
  const checkCreditsBeforeAction = () => {
    const requiredCredits = PERSONAS[currentPersona].cost
    const availableCredits = profile?.credits || userCredits || 0

    if (availableCredits < requiredCredits) {
      setShowCreditsModal(true)
      return false
    }
    return true
  }

  const handleSendMessage = async () => {
    if (!message.trim() || chatLoading) return

    // Check credits before sending message
    if (!checkCreditsBeforeAction()) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      persona: currentPersona
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setChatLoading(true)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      const token = session?.access_token

      if (!token) {
        throw new Error('No authentication token available')
      }

      const requestBody = {
        messages: [...messages, userMessage],
        persona: currentPersona
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()

        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, aiMessage])

        setWaterAnimation(true)
        setTimeout(() => setWaterAnimation(false), 1000)

        if (!data.isMockProfile) {
          setUserCredits(data.newCredits)
          setWaterLiters(data.newWaterCleaned)
          await refreshProfile()
        } else {
          setUserCredits(prev => Math.max(0, prev - data.creditsUsed))
          setWaterLiters(prev => prev + 1)
        }

        // Create new conversation if this is the first exchange and not already set
        if (messages.length === 1 && currentConversationId === 'default') {
          const newConversationId = `conversation-${Date.now()}`
          setCurrentConversationId(newConversationId)
        }
      } else {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          try {
            const textResponse = await response.text()
            if (textResponse.includes('<!DOCTYPE')) {
              errorMessage = `Server error: API route not responding correctly (${response.status})`
            } else {
              errorMessage = `Server error: ${textResponse.substring(0, 100)}`
            }
          } catch (textError) {
            errorMessage = `Server error: Failed to parse response (${response.status})`
          }
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      setMessages(prev => prev.slice(0, -1))

      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: t('messages.error', { error: error instanceof Error ? error.message : 'Unknown error' }),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetToPersonaSelection = () => {
    setMessages([])
    setShowPersonaSelector(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header
          currentPage="chat"
          onSignInClick={() => setShowSignInModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
        />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <AnimatedBackground />
        <Header
          currentPage="chat"
          onSignInClick={() => setShowSignInModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
        />

        <div className="relative z-10 pt-8">
          <LoginRequired
            page="chat"
            onSignIn={() => setShowSignInModal(true)}
            onSignUp={() => setShowSignUpModal(true)}
          />
        </div>

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
      </div>
    )
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    const newFiles = Array.from(files)
    const previews: {file: File, preview: string}[] = []

    for (const file of newFiles) {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file)
        previews.push({ file, preview })
      } else {
        // For non-images, create a generic preview
        previews.push({
          file,
          preview: `data:text/plain;base64,${btoa(file.name)}`
        })
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles])
    setFilePreview(prev => [...prev, ...previews])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreview(prev => {
      const removed = prev[index]
      if (removed && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const generateChatTitle = (firstMessage: string): string => {
    if (!firstMessage) return t('interface.newChat')

    // Clean the message
    const cleanMessage = firstMessage.trim().toLowerCase()

    // Common stop words to filter out
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'with', 'from', 'have', 'this', 'that', 'they', 'will', 'been', 'each', 'make', 'more', 'like', 'into', 'time', 'very', 'when', 'come', 'work', 'just', 'good', 'much', 'give', 'want', 'need']

    // Extract meaningful words
    const words = cleanMessage.split(' ').filter(word =>
      word.length > 2 &&
      !stopWords.includes(word) &&
      !/^\d+$/.test(word)
    )

    let title = ''

    // Pattern-based title generation
    if (cleanMessage.includes('?')) {
      if (cleanMessage.startsWith('how')) {
        const mainWords = words.slice(1, 4).join(' ')
        title = mainWords ? `How to ${mainWords}` : 'How-to Question'
      } else if (cleanMessage.startsWith('what')) {
        const mainWords = words.slice(1, 4).join(' ')
        title = mainWords ? `About ${mainWords}` : 'Question'
      } else if (cleanMessage.startsWith('why')) {
        const mainWords = words.slice(1, 4).join(' ')
        title = mainWords ? `Why ${mainWords}` : 'Why Question'
      } else if (cleanMessage.startsWith('where')) {
        title = 'Location Question'
      } else if (cleanMessage.startsWith('when')) {
        title = 'Time Question'
      } else {
        title = words.slice(0, 3).join(' ') || 'Question'
      }
    } else if (cleanMessage.includes('help')) {
      const mainWords = words.filter(w => w !== 'help').slice(0, 3).join(' ')
      title = mainWords ? `Help with ${mainWords}` : 'Help Request'
    } else if (cleanMessage.includes('create') || cleanMessage.includes('make') || cleanMessage.includes('build')) {
      const actionWords = words.slice(1, 4).join(' ')
      title = actionWords ? `Create ${actionWords}` : 'Creation Task'
    } else if (cleanMessage.includes('explain') || cleanMessage.includes('describe')) {
      const topicWords = words.slice(1, 3).join(' ')
      title = topicWords ? `Explain ${topicWords}` : 'Explanation'
    } else if (cleanMessage.includes('write')) {
      const contentWords = words.slice(1, 3).join(' ')
      title = contentWords ? `Write ${contentWords}` : 'Writing Task'
    } else {
      // Generic case: take first 3-4 meaningful words
      title = words.slice(0, 3).join(' ')
    }

    // Fallback to truncated original message
    if (!title || title.length < 3) {
      title = firstMessage.split(' ').slice(0, 4).join(' ')
      if (firstMessage.split(' ').length > 4) {
        title += '...'
      }
    }

    // Capitalize first letter and ensure reasonable length
    title = title.charAt(0).toUpperCase() + title.slice(1)

    // Limit title length for UI
    if (title.length > 30) {
      title = title.substring(0, 27) + '...'
    }

    return title || t('interface.newChat')
  }

  const updateConversationTitle = (conversationId: string, newTitle: string) => {
    const updatedTitles = {
      ...conversationTitles,
      [conversationId]: newTitle
    }
    setConversationTitles(updatedTitles)
    localStorage.setItem('miky-conversation-titles', JSON.stringify(updatedTitles))
  }

  const startEditingTitle = (convId: string, currentTitle: string) => {
    setEditingTitleId(convId)
    setEditTitleValue(currentTitle)
  }

  const saveTitle = (convId: string) => {
    if (editTitleValue.trim()) {
      updateConversationTitle(convId, editTitleValue.trim())
    }
    setEditingTitleId(null)
    setEditTitleValue('')
  }

  const handleDeleteConversation = (convId: string) => {
    setConversationToDelete(convId)
    setShowDeleteModal(true)
  }

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      // Remove from conversation history
      setConversationHistory(prev => {
        const updated = { ...prev }
        delete updated[conversationToDelete]
        return updated
      })

      // Remove from titles
      setConversationTitles(prev => {
        const updated = { ...prev }
        delete updated[conversationToDelete]
        return updated
      })

      // Update localStorage
      const updatedHistory = { ...conversationHistory }
      delete updatedHistory[conversationToDelete]
      localStorage.setItem('miky-conversations', JSON.stringify(updatedHistory))

      const updatedTitles = { ...conversationTitles }
      delete updatedTitles[conversationToDelete]
      localStorage.setItem('miky-conversation-titles', JSON.stringify(updatedTitles))

      // If we're deleting the current conversation, create a new one
      if (conversationToDelete === currentConversationId) {
        const newId = `conversation-${Date.now()}`
        setCurrentConversationId(newId)
        setMessages([])
        setCurrentPersona('generic')
      }
    }

    setShowDeleteModal(false)
    setConversationToDelete(null)
  }

  // Handle upgrade plan for Free/Plus users
  const handleUpgrade = async () => {
    setUpgradeLoading(true)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        setUpgradeLoading(false)
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
      setUpgradeLoading(false)
    }
  }

  // Handle buy credits for Pro users
  const handleBuyCredits = async () => {
    setUpgradeLoading(true)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        setUpgradeLoading(false)
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credits: creditAmount,
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
      console.error('Buy credits error:', error)
      alert('Failed to start purchase process. Please try again.')
    } finally {
      setUpgradeLoading(false)
    }
  }

  // Slider functionality for credits
  const minCredits = 1000
  const maxCredits = 100000
  const step = 1000
  const creditPrice = 0.019
  const totalPrice = Math.round(creditAmount * creditPrice)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreditAmount(Number(e.target.value))
  }

  // Tooltip handlers
  const handlePersonaMouseEnter = (personaKey: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }

    setHoveredPersona(personaKey)

    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 800) // 800ms delay
  }

  const handlePersonaMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }

    setShowTooltip(false)
    setHoveredPersona(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header
          currentPage="chat"
          onSignInClick={() => setShowSignInModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
        />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <AnimatedBackground />
        <Header
          currentPage="chat"
          onSignInClick={() => setShowSignInModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
        />

        <div className="relative z-10 pt-8">
          <LoginRequired
            page="chat"
            onSignIn={() => setShowSignInModal(true)}
            onSignUp={() => setShowSignUpModal(true)}
          />
        </div>

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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header
        currentPage="chat"
        waterAnimation={waterAnimation}
        onSignInClick={() => setShowSignInModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        overrideCredits={userCredits}
        overrideWaterLiters={waterLiters}
      />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="lg:hidden fixed top-32 left-4 z-40 w-10 h-10 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/90 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMobileSidebar(false)} />
        )}

        {/* Left Sidebar with Chat History - Mobile & Desktop */}
        <div className={`${showMobileSidebar ? 'fixed left-0 top-0 z-50' : 'hidden'} lg:flex w-80 bg-gray-900/95 lg:bg-gray-900/30 border-r border-gray-800 flex-col h-full lg:h-auto backdrop-blur-xl lg:backdrop-blur-none`}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">{t('interface.conversations')}</h2>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Tab */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20"
            >
              <MessageSquare className="w-4 h-4 mr-3" />
              {t('interface.chat')}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <Input
              placeholder={t('interface.searchConversations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-sm"
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-1">
              {Object.entries(conversationHistory)
                .filter(([convId]) => convId !== 'default' || conversationHistory[convId]?.length > 0)
                .filter(([convId, messages]) => {
                  if (!searchQuery) return true
                  const query = searchQuery.toLowerCase()
                  const title = conversationTitles[convId] || generateChatTitle(messages.find(m => m.role === 'user')?.content || t('interface.newChat'))
                  const lastMessage = messages[messages.length - 1]
                  const persona = messages.find(m => m.role === 'user')?.persona || 'generic'
                  const personaInfo = PERSONAS[persona as keyof typeof PERSONAS]
                  const personaName = personaInfo?.name || 'Miky'

                  return title.toLowerCase().includes(query) ||
                         personaName.toLowerCase().includes(query) ||
                         persona.toLowerCase().includes(query) ||
                         (lastMessage && lastMessage.content.toLowerCase().includes(query))
                })
                .sort(([, messagesA], [, messagesB]) => {
                  const lastA = messagesA[messagesA.length - 1]
                  const lastB = messagesB[messagesB.length - 1]
                  if (!lastA || !lastB) return 0
                  return new Date(lastB.timestamp).getTime() - new Date(lastA.timestamp).getTime()
                })
                .slice(0, 20)
                .map(([convId, messages]) => {
                  const title = conversationTitles[convId] || generateChatTitle(messages.find(m => m.role === 'user')?.content || t('interface.newChat'))
                  const isActive = currentConversationId === convId
                  const lastMessage = messages[messages.length - 1]
                  const persona = messages.find(m => m.role === 'user')?.persona || 'generic'
                  const personaInfo = PERSONAS[persona as keyof typeof PERSONAS]
                  const date = lastMessage ? new Date(lastMessage.timestamp).toLocaleDateString([], {month: 'short', day: 'numeric'}) : t('time.today')
                  const time = lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''

                  return (
                    <div key={convId}>
                      <button
                        onClick={() => {
                          try {
                            setCurrentConversationId(convId)
                            setMessages(conversationHistory[convId] || [])
                            setShowMobileSidebar(false)
                          } catch (error) {
                            console.error('Error switching conversation:', error)
                          }
                        }}
                        className={`w-full text-left p-2 rounded-md transition-colors border-l-2 group relative ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border-l-blue-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {React.createElement(personaInfo?.icon || Bot, { className: "w-3 h-3 flex-shrink-0" })}
                          {editingTitleId === convId ? (
                            <Input
                              value={editTitleValue}
                              onChange={(e) => setEditTitleValue(e.target.value)}
                              onBlur={() => saveTitle(convId)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  saveTitle(convId)
                                }
                                if (e.key === 'Escape') {
                                  setEditingTitleId(null)
                                  setEditTitleValue('')
                                }
                              }}
                              className="flex-1 bg-gray-800 border-gray-600 text-white text-xs h-4 p-1"
                              autoFocus
                            />
                          ) : (
                            <div
                              className="truncate font-medium flex-1 cursor-pointer hover:text-blue-300 text-xs"
                              onDoubleClick={() => startEditingTitle(convId, title)}
                              title={t('tooltips.doubleClickEdit')}
                            >
                              {title}
                            </div>
                          )}

                          {/* Delete button - only show on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConversation(convId)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-600/20 rounded text-red-400 hover:text-red-300"
                            title={t('buttons.deleteConversation')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="text-blue-400">{personaInfo?.name?.replace(' Miky', '') || 'Miky'}</span>
                          <span>•</span>
                          <span>{date}</span>
                          <span>{time}</span>
                        </div>
                      </button>
                    </div>
                  )
                })}

              {Object.keys(conversationHistory).length === 0 && (
                <div className="text-center py-6 text-gray-500 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{t('interface.noConversations')}</p>
                  <p>{t('interface.startNewChat')}</p>
                </div>
              )}
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-t border-gray-800">
            <Button
              onClick={() => {
                if (messages.length > 0) {
                  if (currentConversationId) {
                    setConversationHistory(prev => ({
                      ...prev,
                      [currentConversationId]: messages
                    }))
                  }
                  const newId = `conversation-${Date.now()}`
                  setCurrentConversationId(newId)
                  setMessages([])
                  setCurrentPersona('generic')
                }
                else {
                  setMessages([])
                  setCurrentPersona('generic')
                  if (!currentConversationId || currentConversationId === 'default') {
                    const newId = `conversation-${Date.now()}`
                    setCurrentConversationId(newId)
                  }
                }
                setShowMobileSidebar(false)
              }}
              variant="ghost"
              className="w-full text-blue-400 hover:bg-blue-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('interface.newChat')}
            </Button>
          </div>

          {/* Bottom actions */}
          <div className="p-4 space-y-2 border-t border-gray-800">
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-white/60 hover:text-white hover:bg-gray-700/50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t('interface.signOut')}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <div className="text-center max-w-2xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h1 className="text-2xl font-bold text-white mb-3">
                    {t('intro.title')} <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t('intro.highlight')}</span>
                  </h1>
                  <p className="text-sm text-white/50 leading-tight">
                    {t('intro.description')}
                  </p>
                </motion.div>

                {filePreview.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex flex-wrap gap-3 justify-center">
                      {filePreview.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="w-16 h-16 bg-gray-800/50 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                            {item.file.type.startsWith('image/') ? (
                              <img
                                src={item.preview}
                                alt={item.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400 text-xs text-center p-1">
                                {item.file.name.split('.').pop()?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                  ref={dragRef}
                >
                  <div className="relative max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-gray-600 transition-colors backdrop-blur-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-white p-1"
                        title={t('buttons.uploadFile')}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowImagePrompt(true)}
                        className="text-gray-400 hover:text-white p-1"
                        title={t('buttons.generateImage')}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </Button>

                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={message ? '' : (isTyping ? typingText : `${t('placeholders.askAnything')} ${PERSONAS[currentPersona].name}`)}
                        className="bg-transparent border-none text-white placeholder-gray-400 text-sm flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={chatLoading}
                        style={{ outline: 'none', boxShadow: 'none' }}
                      />

                      <Button
                        onClick={handleSendMessage}
                        disabled={chatLoading || !message.trim()}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-10 h-10 rounded-lg"
                        size="sm"
                      >
                        {chatLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(PERSONAS).map(([key, persona]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: currentPersona === key ? 1.05 : 1,
                          borderColor: currentPersona === key ? '#6B7280' : '#4B5563'
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.2
                        }}
                        onClick={() => setCurrentPersona(key as keyof typeof PERSONAS)}
                        onMouseEnter={() => handlePersonaMouseEnter(key)}
                        onMouseLeave={handlePersonaMouseLeave}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border relative overflow-hidden flex items-center gap-1 ${
                          currentPersona === key
                            ? 'bg-gray-600 text-white border-gray-500 shadow-lg'
                            : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/50 border-gray-600'
                        }`}
                      >
                        {currentPersona === key && (
                          <motion.div
                            layoutId="activePersonaBg"
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        <span className="relative z-10">
                          {React.createElement(persona.icon, { className: "w-3 h-3" })}
                        </span>
                        <span className="relative z-10">
                          {persona.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Persona Tooltip */}
                  <AnimatePresence>
                    {showTooltip && hoveredPersona && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 max-w-md w-80 z-50"
                      >
                        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 shadow-2xl">
                          <div className="text-center mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${PERSONAS[hoveredPersona as keyof typeof PERSONAS]?.color} flex items-center justify-center mx-auto mb-2`}>
                              {React.createElement(PERSONAS[hoveredPersona as keyof typeof PERSONAS]?.icon, {
                                className: "w-4 h-4 text-white"
                              })}
                            </div>
                            <h4 className="text-white font-semibold text-sm text-center">
                              {PERSONAS[hoveredPersona as keyof typeof PERSONAS]?.name}
                            </h4>
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed text-center">
                            {t(`personas.${hoveredPersona}.fullDescription`)}
                          </p>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
              <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`bg-gradient-to-r ${PERSONAS[currentPersona].color} border-gray-600 text-white px-3 py-1.5`}
                  >
                    <span className="mr-2">
                      {React.createElement(PERSONAS[currentPersona].icon, { className: "w-4 h-4" })}
                    </span>
                    {PERSONAS[currentPersona].name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToPersonaSelection}
                    className="text-gray-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('interface.changePersona')}
                  </Button>
                </div>
              </div>

              <div className="space-y-6 max-w-4xl mx-auto">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gray-700/60 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-gray-300" />
                        </div>
                      )}

                      <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                        <Card className={`${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500'
                            : 'bg-gray-800/50 text-gray-100 border-gray-700'
                        }`}>
                          <CardContent className="p-4">
                            <div className="text-sm leading-relaxed mb-3">
                              {msg.role === 'assistant' ? (
                                <ReactMarkdown
                                  components={{
                                    h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-sm font-bold mb-1 text-white">{children}</h3>,
                                    strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                                    em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                                    p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({children}) => <li className="text-gray-100">{children}</li>,
                                    code: ({children}) => <code className="bg-gray-700/50 px-1 py-0.5 rounded text-xs font-mono text-blue-300">{children}</code>,
                                    pre: ({children}) => <pre className="bg-gray-700/50 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2">{children}</pre>
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                              )}
                            </div>
                            {msg.imageUrl && typeof msg.imageUrl === 'string' && msg.imageUrl.trim() !== '' && (
                              <div className="mt-4">
                                <div className="text-center">
                                  <Button
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(msg.imageUrl!, {
                                          mode: 'cors'
                                        })
                                        const blob = await response.blob()
                                        const url = window.URL.createObjectURL(blob)
                                        const link = document.createElement('a')
                                        link.href = url
                                        link.download = `miky-generated-image-${Date.now()}.png`
                                        document.body.appendChild(link)
                                        link.click()
                                        document.body.removeChild(link)
                                        window.URL.revokeObjectURL(url)
                                      } catch (error) {
                                        window.open(msg.imageUrl!, '_blank')
                                      }
                                    }}
                                    size="sm"
                                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-600/30 hover:border-blue-600/50 transition-all duration-200"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('messages.downloadImage')}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <div className="text-xs text-gray-500 mt-2 px-1 flex items-center justify-between">
                          <span>{msg.timestamp.toLocaleTimeString()}</span>
                          {msg.role === 'assistant' && !msg.imageUrl && (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.content)
                                  setCopiedMessageId(msg.id)
                                  setTimeout(() => setCopiedMessageId(null), 2000)
                                }}
                                className="text-gray-500 hover:text-gray-300 transition-colors ml-2"
                                title={t('buttons.copyMessage')}
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {copiedMessageId === msg.id && (
                                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                  {t('messages.copied')}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-700/60 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gray-700/60 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-300" />
                    </div>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{PERSONAS[currentPersona].name} {t('messages.thinking')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div className="border-t border-gray-800 p-4 bg-gray-900">
              <div className="max-w-4xl mx-auto">
                {filePreview.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {filePreview.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="w-12 h-12 bg-gray-800/50 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                            {item.file.type.startsWith('image/') ? (
                              <img
                                src={item.preview}
                                alt={item.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400 text-xs">
                                {item.file.name.split('.').pop()?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-white"
                    title={t('buttons.uploadFile')}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImagePrompt(true)}
                    className="text-gray-400 hover:text-white"
                    title={t('buttons.generateImage')}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>

                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`${t('placeholders.askAnything')} ${PERSONAS[currentPersona].name}...`}
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0 p-0 text-base flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={chatLoading}
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !message.trim()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-10 h-10 rounded-lg"
                    size="sm"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,video/*,audio/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Image Generation Modal */}
      {showImagePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => {
                setShowImagePrompt(false)
                setImagePrompt('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('imageGeneration.title')}</h3>
              <p className="text-gray-400 text-sm">{t('imageGeneration.description', { persona: PERSONAS[currentPersona].name })}</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder={t('imageGeneration.placeholder')}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
              />

              <div className="text-sm text-gray-500">
                {t('imageGeneration.highQuality')}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowImagePrompt(false)
                    setImagePrompt('')
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  {t('imageGeneration.cancel')}
                </Button>
                <Button
                  onClick={handleGenerateImage}
                  disabled={!imagePrompt.trim() || imageGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {imageGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('imageGeneration.generating')}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {t('imageGeneration.generate')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">{t('deleteModal.title')}</h3>
              <p className="text-gray-400 mb-6 text-sm">
                {t('deleteModal.description')}
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setConversationToDelete(null)
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  {t('deleteModal.cancel')}
                </Button>
                <Button
                  onClick={confirmDeleteConversation}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('deleteModal.delete')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Credits Exhausted Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-orange-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">{t('creditsModal.title')}</h3>

              {(!profile?.subscription_plan || profile?.subscription_plan === 'free' || profile?.subscription_plan === 'plus') ? (
                <>
                  <p className="text-gray-400 mb-6 text-sm">
                    {t('creditsModal.description')}
                  </p>

                  <div className="space-y-4">
                    <Button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {upgradeLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('creditsModal.processing')}
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          {t('creditsModal.upgrade')} {(profile?.subscription_plan === 'free' || !profile?.subscription_plan) ? 'Plus' : 'Pro'}
                        </>
                      )}
                    </Button>

                    <button
                      onClick={() => {
                        setShowCreditsModal(false)
                        router.push('/pricing')
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      {t('creditsModal.viewAllPlans')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-400 mb-6 text-sm">
                    {t('creditsModal.descriptionPro')}
                  </p>

                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        {creditAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">{t('creditsModal.credits')}</div>
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
                      <div className="text-xl font-bold text-blue-400">
                        ${totalPrice}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t('creditsModal.totalCost')}
                      </div>
                    </div>

                    <Button
                      onClick={handleBuyCredits}
                      disabled={upgradeLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {upgradeLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('creditsModal.processing')}
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          {t('creditsModal.buyCredits')}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
