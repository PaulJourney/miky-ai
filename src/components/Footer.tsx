'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Heart, Shield } from 'lucide-react'

interface ContactForm {
  name: string
  email: string
  message: string
}

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('footer')
  const tContact = useTranslations('contact')

  // Detect current locale from pathname
  const currentLocale = pathname.split('/')[1]
  const isLocalized = ['it', 'es'].includes(currentLocale)
  const localePrefix = isLocalized ? `/${currentLocale}` : ''

  const [showContactModal, setShowContactModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [contactForm, setContactForm] = useState<ContactForm>({ name: '', email: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (response.ok) {
        setContactSuccess(true)
        setContactForm({ name: '', email: '', message: '' })
      } else {
        throw new Error(data.error || 'Failed to send message')
      }

    } catch (error) {
      console.error('Contact form error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setContactLoading(false)
    }
  }

  const handleContactClose = () => {
    setShowContactModal(false)
    setContactSuccess(false)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <>
      <footer className="border-t border-gray-800 px-6 py-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="md:col-span-2">
              <Logo size="sm" className="mb-4" />
              <p className="text-gray-400 text-sm">
                {t('tagline')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('usefulLinks')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">{t('contact')}</button></li>
                <li><button onClick={() => router.push(`${localePrefix}/pricing`)} className="hover:text-white transition-colors">{t('pricing')}</button></li>
                <li><button onClick={() => setShowAdminModal(true)} className="hover:text-white transition-colors">{t('admin')}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('social')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://instagram.com/miky.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('instagram')}</a></li>
                <li><a href="https://twitter.com/mikyai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('twitter')}</a></li>
                <li><a href="https://tiktok.com/@miky.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('tiktok')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => router.push(`${localePrefix}/legal/terms`)} className="hover:text-white transition-colors">{t('termsOfService')}</button></li>
                <li><button onClick={() => router.push(`${localePrefix}/legal/privacy`)} className="hover:text-white transition-colors">{t('privacyPolicy')}</button></li>
                <li><button onClick={() => router.push(`${localePrefix}/legal/cookie`)} className="hover:text-white transition-colors">{t('cookiePolicy')}</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {t('copyright')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('poweredBy')} OpenAI
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={handleContactClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSuccess ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{tContact('successTitle')}</h3>
                <p className="text-gray-400 mb-6">
                  {tContact('successMessage')}
                </p>
                <Button
                  onClick={handleContactClose}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {tContact('close')}
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tContact('title')}</h3>
                  <p className="text-gray-400">{tContact('subtitle')}</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder={tContact('namePlaceholder')}
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={tContact('emailPlaceholder')}
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={tContact('messagePlaceholder')}
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {contactLoading ? tContact('sendingButton') : tContact('sendButton')}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Admin Access</h3>
              <p className="text-gray-400">Enter admin credentials to continue</p>
            </div>

            <form className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Admin password"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-red-500"
                />
              </div>
              <Button
                onClick={() => {
                  setShowAdminModal(false)
                  window.open('/admin', '_blank')
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}
