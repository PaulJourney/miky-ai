'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn, signUp, resetPassword } from '@/lib/supabase'
import {
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

interface AuthModalsProps {
  showSignInModal: boolean
  showSignUpModal: boolean
  onClose: () => void
  onSignInSuccess?: () => void
  onSignUpSuccess?: () => void
  onSwitchToSignUp?: () => void
  onSwitchToSignIn?: () => void
}

export function AuthModals({
  showSignInModal,
  showSignUpModal,
  onClose,
  onSignInSuccess,
  onSignUpSuccess,
  onSwitchToSignUp,
  onSwitchToSignIn
}: AuthModalsProps) {
  const t = useTranslations('auth')

  // Auth states
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [signUpForm, setSignUpForm] = useState({ fullName: '', email: '', password: '', referralCode: '' })
  const [resetPasswordForm, setResetPasswordForm] = useState({ email: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [passwordResetSent, setPasswordResetSent] = useState(false)

  const resetAuthModals = () => {
    onClose()
    setShowForgotPassword(false)
    setPasswordResetSent(false)
    setAuthError('')
    setAuthSuccess('')
    setSignInForm({ email: '', password: '' })
    setSignUpForm({ fullName: '', email: '', password: '', referralCode: '' })
    setResetPasswordForm({ email: '' })
  }

  // Auth handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    const { error } = await signIn(signInForm.email, signInForm.password)

    if (error) {
      setAuthError(error.message)
      setAuthLoading(false)
    } else {
      resetAuthModals()
      setAuthLoading(false)
      setAuthSuccess('Welcome back! You have been signed in successfully.')
      onSignInSuccess?.()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    if (signUpForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters long')
      setAuthLoading(false)
      return
    }

    const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName, signUpForm.referralCode)

    if (error) {
      setAuthError(error.message)
      setAuthLoading(false)
    } else {
      resetAuthModals()
      setAuthLoading(false)
      setAuthSuccess('Account created! Please check your email to verify your account.')
      onSignUpSuccess?.()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    const { error } = await resetPassword(resetPasswordForm.email)

    if (error) {
      setAuthError(error.message)
      setAuthLoading(false)
    } else {
      setPasswordResetSent(true)
      setAuthLoading(false)
    }
  }

  if (!showSignInModal && !showSignUpModal) return null

  return (
    <>
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
              onClick={resetAuthModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {showForgotPassword ? (
              passwordResetSent ? (
                // Password reset confirmation
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('resetPassword.success')}</h3>
                  <p className="text-gray-400 mb-6">
                    We've sent password reset instructions to <strong>{resetPasswordForm.email}</strong>
                  </p>
                  <Button
                    onClick={resetAuthModals}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                // Password reset form
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('resetPassword.title')}</h3>
                    <p className="text-gray-400">{t('resetPassword.subtitle')}</p>
                  </div>

                  {authError && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder={t('resetPassword.email')}
                        value={resetPasswordForm.email}
                        onChange={(e) => setResetPasswordForm({ email: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('resetPassword.loading')}
                        </>
                      ) : (
                        t('resetPassword.sendReset')
                      )}
                    </Button>
                  </form>

                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      ← {t('resetPassword.backToSignIn')}
                    </button>
                  </div>
                </>
              )
            ) : (
              // Sign in form
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t('signIn.title')}</h3>
                  <p className="text-gray-400">{t('signIn.subtitle')}</p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder={t('signIn.email')}
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('signIn.password')}
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {t('signIn.forgotPassword')}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('signIn.loading')}
                      </>
                    ) : (
                      t('signIn.signInButton')
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    {t('signIn.noAccount')}{' '}
                    <button
                      onClick={() => {
                        onSwitchToSignUp?.()
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {t('signIn.signUp')}
                    </button>
                  </p>
                </div>
              </>
            )}
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
              onClick={resetAuthModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{t('signUp.title')}</h3>
              <p className="text-gray-400">{t('signUp.subtitle')}</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{authError}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder={t('signUp.firstName')}
                  value={signUpForm.fullName}
                  onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder={t('signUp.email')}
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('signUp.password')}
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder={t('signUp.referralCode')}
                  value={signUpForm.referralCode}
                  onChange={(e) => setSignUpForm({ ...signUpForm, referralCode: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('signUp.loading')}
                  </>
                ) : (
                  t('signUp.signUpButton')
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                {t('signUp.alreadyHaveAccount')}{' '}
                <button
                  onClick={() => {
                    onSwitchToSignIn?.()
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {t('signUp.signIn')}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Toast */}
      {authSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 flex items-center gap-3 backdrop-blur-xl max-w-sm"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">{authSuccess}</span>
            <button
              onClick={() => setAuthSuccess('')}
              className="text-green-400 hover:text-green-300 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}
