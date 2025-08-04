import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, EyeSlash, CheckCircle, Envelope, Lock, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useT } from '../contexts/TranslationContext'
import { useAuth } from '../contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeSwitch: () => void
  onAuthSuccess: (isNewUser?: boolean) => void
  referralCode?: string
}

export function AuthModal({ isOpen, onClose, mode, onModeSwitch, onAuthSuccess, referralCode }: AuthModalProps) {
  const { t } = useT()
  const { signIn, signUp, verifyEmail, forgotPassword, resetPassword, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    referralCode: referralCode || ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [referralVerified, setReferralVerified] = useState(false)
  const [referrerName, setReferrerName] = useState('')
  const [isVerifyingReferral, setIsVerifyingReferral] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any previous auth error
    setAuthError('')
    
    // Basic form validation
    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        toast.error(t('auth.pleaseFieldRequired'))
        return
      }
      if (!formData.lastName.trim()) {
        toast.error(t('auth.pleaseFieldRequired'))
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('auth.passwordsDoNotMatch'))
        return
      }
    }
    
    if (!formData.email.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }
    
    if (!formData.password.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }

    try {
      if (mode === 'signup' && !emailSent) {
        // Sign up user
        await signUp({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          referralCode: formData.referralCode || undefined
        })
        
        // Check if email verification is needed
        setEmailSent(true)
        toast.success(t('auth.confirmationEmailSent'))
        return
      }
      
      if (mode === 'signup' && emailSent) {
        // Verify email with confirmation code
        await verifyEmail(confirmationCode)
        onAuthSuccess(true) // Mark as new user
        toast.success(referralVerified ? t('auth.accountCreatedBonus') : t('auth.accountCreatedSuccess'))
        onClose()
        return
      }
      
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        onAuthSuccess(false)
        onClose()
        return
      }
    } catch (error) {
      console.error('Authentication error:', error)
      const errorMessage = error instanceof Error ? error.message : t('auth.authenticationFailed')
      setAuthError(errorMessage)
      toast.error(errorMessage)
      // Don't close modal on error - stay open to show error message
      return
    }
  }
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }
    
    try {
      await forgotPassword(formData.email)
      setResetEmailSent(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resetCode.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }
    
    if (!newPassword.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }
    
    if (!confirmNewPassword.trim()) {
      toast.error(t('auth.pleaseFieldRequired'))
      return
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error(t('auth.passwordsDoNotMatch'))
      return
    }
    
    if (newPassword.length < 6) {
      toast.error(t('auth.passwordMinLength'))
      return
    }
    
    try {
      await resetPassword(resetCode, newPassword)
      setShowForgotPassword(false)
      setResetEmailSent(false)
      setResetCode('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password')
    }
  }

  const handleVerifyReferral = async () => {
    if (!formData.referralCode.trim()) return
    
    setIsVerifyingReferral(true)
    
    // Mock verification for now - this would normally be an API call
    setTimeout(() => {
      if (formData.referralCode === 'SUPPORT123' || formData.referralCode.length >= 6) {
        setReferralVerified(true)
        const mockReferrerName = 'Marco'
        setReferrerName(mockReferrerName)
        toast.success(t('referral.referralVerified', { name: mockReferrerName }))
      } else {
        toast.error(t('auth.invalidReferralCode'))
      }
      setIsVerifyingReferral(false)
    }, 1000)
  }

  const handleConfirmEmail = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      referralCode: referralCode || ''
    })
    setEmailSent(false)
    setConfirmationCode('')
    setShowForgotPassword(false)
    setResetEmailSent(false)
    setResetCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setReferralVerified(false)
    setReferrerName('')
    setAuthError('')
  }

  const handleModeSwitch = () => {
    resetForm()
    onModeSwitch()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showForgotPassword ? 
              (resetEmailSent ? t('auth.resetPassword') : t('auth.lostPassword')) :
              mode === 'signin' ? t('modals.welcomeBack') : 
              emailSent ? t('auth.confirmEmail') : t('auth.createAccount')}
          </DialogTitle>
        </DialogHeader>
        
        {showForgotPassword ? (
          resetEmailSent ? (
            // Password reset form
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('auth.resetPasswordTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.resetCodeMessage')} {formData.email}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetCode">{t('auth.resetCode')}</Label>
                  <Input
                    id="resetCode"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder=""
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('auth.password')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('auth.newPasswordPlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || resetCode.length !== 6 || !newPassword || !confirmNewPassword}
                >
                  {isLoading ? t('auth.resetting') : t('auth.resetPasswordButton')}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setResetEmailSent(false)
                      setResetCode('')
                      setNewPassword('')
                      setConfirmNewPassword('')
                    }}
                    className="text-muted-foreground"
                  >
                    ← {t('auth.backToSignIn')}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            // Request password reset
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('auth.lostPasswordTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.lostPasswordMessage')}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">{t('auth.email')}</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('auth.emailPlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !formData.email}
                >
                  {isLoading ? t('auth.sending') : t('auth.sendResetCode')}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-muted-foreground"
                  >
                    ← {t('auth.backToSignIn')}
                  </Button>
                </div>
              </form>
            </div>
          )
        ) : mode === 'signup' && emailSent ? (
          // Email confirmation step
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Envelope className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t('auth.checkEmailMessage')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('auth.emailConfirmationSent')} {formData.email}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleConfirmEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationCode">{t('auth.confirmationCode')}</Label>
                <Input
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder=""
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full hover:bg-primary hover:text-primary-foreground" 
                variant="outline"
                disabled={isLoading || confirmationCode.length !== 6}
              >
                {isLoading ? t('auth.verifying') : t('auth.verifyButton')}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setEmailSent(false)
                    setConfirmationCode('')
                  }}
                  className="text-muted-foreground"
                >
                  ← {t('auth.backToSignup')}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          // Regular signin/signup form
          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{authError}</p>
              </div>
            )}
            
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder={t('auth.firstNamePlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder={t('auth.lastNamePlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('auth.emailPlaceholder')}
                className="md:placeholder:text-sm placeholder:text-xs"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="pr-10 md:placeholder:text-sm placeholder:text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="md:placeholder:text-sm placeholder:text-xs"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">
                    {t('referral.referralCode')} <span className="text-muted-foreground">({t('auth.referralCodePlaceholder').split(' ')[1]})</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                      placeholder={t('auth.referralCodePlaceholder')}
                      disabled={referralVerified}
                      className={`${referralVerified ? 'bg-primary/10 border-primary' : ''} md:placeholder:text-sm placeholder:text-xs`}
                    />
                    {formData.referralCode && !referralVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleVerifyReferral}
                        disabled={isVerifyingReferral}
                        className="px-3 whitespace-nowrap group hover:text-primary transition-colors duration-200"
                      >
                        <span className="group-hover:text-primary transition-colors duration-200">
                          {isVerifyingReferral ? t('auth.verifying') : t('referral.verifyReferral')}
                        </span>
                      </Button>
                    )}
                    {referralVerified && (
                      <div className="flex items-center justify-center px-3">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('auth.signUpReferralBonus')}
                  </p>
                  {referralVerified && (
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-xs text-primary font-medium">
                        {t('referral.referralVerified', { name: referrerName })}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {referralCode && mode === 'signup' && !formData.referralCode && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  🎉 Referral bonus: You'll receive 300 free credits!
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? t('modals.processing') : mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
            </Button>
            
            {mode === 'signin' && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-muted-foreground"
                >
                  {t('auth.lostPassword')}?
                </Button>
              </div>
            )}
            
            <div className="text-center text-sm text-muted-foreground">
              {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleModeSwitch}
                className="p-0 ml-1 h-auto text-primary"
              >
                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}