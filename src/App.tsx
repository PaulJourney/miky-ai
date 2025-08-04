import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { MainInput } from './components/MainInput'
import { PersonaSelector } from './components/PersonaSelector'
import { ChatModal } from './components/ChatModal'
import { ConversationHistory } from './components/ConversationHistory'
import { AdminDashboard } from './components/AdminDashboard'
import { Pricing } from './components/Pricing'
import { Footer } from './components/Footer'
import { LegalPages } from './components/LegalPages'
import { AuthModal } from './components/AuthModal'
import { WelcomeTutorial } from './components/WelcomeTutorial'
import { ThemeProvider } from './components/ThemeProvider'
import { TranslationProvider, useT } from './contexts/TranslationContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useConversations } from './hooks/useConversations'
import { Toaster } from 'sonner'

export type Persona = 'academic' | 'marketer' | 'engineer' | 'coach' | 'sensei' | 'lawyer' | 'medical' | 'god-mode' | 'richman' | 'general'

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const { t } = useT()
  const { user, isLoading: authLoading, signOut } = useAuth()
  const {
    conversations,
    currentConversation,
    isSending,
    setCurrentConversation,
    loadConversations,
    sendMessage,
    loadConversation,
    updateConversation,
    deleteConversation,
  } = useConversations()

  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'admin' | 'pricing' | 'legal'>('chat')
  const [currentLegalPage, setCurrentLegalPage] = useState<'terms' | 'privacy' | 'cookies'>('terms')
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [referralCode, setReferralCode] = useState<string | undefined>()
  const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
      setAuthMode('signup')
      setShowAuthModal(true)
    }
  }, [])

  const handlePersonaSelect = (persona: Persona | null) => {
    setSelectedPersona(persona)
    // Reset current conversation when changing persona to ensure new conversations are created
    setCurrentConversation(null)
  }

  const handleAuthSuccess = (isNewUser = false) => {
    setShowAuthModal(false)
    
    // Show welcome tutorial for new users
    if (isNewUser) {
      setTimeout(() => {
        setShowWelcomeTutorial(true)
      }, 500)
    }
  }

  const handleAuthRequest = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSendMessage = async (content: string) => {
    if (!user) {
      handleAuthRequest('signup')
      return
    }
    
    if (user.credits <= 0) return

    // Use the real API to send message
    const result = await sendMessage(
      content,
      selectedPersona || 'general',
      currentConversation?.id
    )

    if (result && !showChatModal) {
      // Open chat modal when sending from homepage
      setCurrentConversation(result.conversation)
      setShowChatModal(true)
    }
  }

  const handleVoiceInput = () => {
    if (!user) {
      handleAuthRequest('signup')
      return
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      handleSendMessage(transcript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      alert('Voice recognition failed. Please try again.')
    }

    recognition.start()
  }

  const handleLegalPageSelect = (page: 'terms' | 'privacy' | 'cookies') => {
    setCurrentLegalPage(page)
    setCurrentView('legal')
  }

  const handleUpdateUser = (updates: any) => {
    // This is handled by the AuthContext now
    console.log('User updates:', updates)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-['Inter'] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground font-['Inter']">
        <AdminDashboard onClose={() => setCurrentView('chat')} />
        <Toaster />
      </div>
    )
  }

  if (currentView === 'legal') {
    return (
      <>
        <LegalPages 
          currentPage={currentLegalPage}
          onBack={() => setCurrentView('chat')}
        />
        <Toaster />
      </>
    )
  }

  return (
      <div className="min-h-screen bg-background text-foreground font-['Inter'] flex flex-col">
        <Header 
          user={user} 
          onViewChange={setCurrentView}
          currentView={currentView}
          onSignOut={signOut}
          onAuthRequest={handleAuthRequest}
          onUpdateUser={handleUpdateUser}
        />
        
        <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
          {currentView === 'chat' && (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {t('homepage.title').split(' ').map((word, index) => 
                      word === 'Miky' ? (
                        <span key={index} className="text-primary">{word}</span>
                      ) : (
                        <span key={index}>{word} </span>
                      )
                    )}
                  </h1>
                </div>
                
                <MainInput 
                  onSendMessage={handleSendMessage}
                  onVoiceInput={handleVoiceInput}
                  isRecording={isRecording}
                  disabled={user && user.credits <= 0}
                  selectedPersona={selectedPersona}
                  onOpenChat={() => setShowChatModal(true)}
                  showChatModal={showChatModal}
                  isAuthenticated={!!user}
                />
                
                <div className="pt-4">
                  <PersonaSelector 
                    selectedPersona={selectedPersona}
                    onPersonaSelect={handlePersonaSelect}
                    userPlan={user?.plan || 'free'}
                    onUpgradeToPlusRequest={() => setCurrentView('pricing')}
                  />
                </div>
                
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    <button 
                      onClick={() => handleAuthRequest('signup')}
                      className="text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      {t('auth.signUp')}
                    </button> {t('homepage.signUpPrompt')}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentView === 'history' && (
            <ConversationHistory 
              conversations={user ? conversations : []}
              onSelectConversation={(conv) => {
                setCurrentConversation(conv)
                setSelectedPersona(conv.persona === 'general' ? null : conv.persona as Persona)
                setCurrentView('chat')
              }}
              onContinueConversation={(conv) => {
                setCurrentConversation(conv)
                setSelectedPersona(conv.persona === 'general' ? null : conv.persona as Persona)
                setShowChatModal(true)
              }}
              onDeleteConversation={deleteConversation}
              onRenameConversation={(id, newTitle) => updateConversation(id, { title: newTitle })}
              isAuthenticated={!!user}
              onAuthRequest={handleAuthRequest}
              loadConversations={loadConversations}
            />
          )}

          {currentView === 'pricing' && (
            <Pricing 
              user={user}
              onPlanSelect={() => {}} // This will be handled by actual payment integration
              onCreditPurchase={() => {}} // This will be handled by actual payment integration
              onAuthRequest={handleAuthRequest}
            />
          )}
        </main>

        <Footer 
          onAdminAccess={() => setCurrentView('admin')} 
          onLegalPageSelect={handleLegalPageSelect}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeSwitch={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          onAuthSuccess={handleAuthSuccess}
          referralCode={referralCode}
        />
        
        <WelcomeTutorial
          isOpen={showWelcomeTutorial}
          onClose={() => setShowWelcomeTutorial(false)}
          userName={user?.firstName}
        />
        
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false)
            // Reset current conversation when closing modal to ensure new conversations are created
            setCurrentConversation(null)
          }}
          conversation={currentConversation}
          selectedPersona={selectedPersona}
          onSendMessage={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          isRecording={isRecording}
          disabled={!user || user.credits <= 0}
          user={user}
          isLoading={isSending}
          onViewHistory={() => {
            setShowChatModal(false)
            setCurrentView('history')
          }}
        />
        
        <Toaster />
      </div>
  )
}

export default App