'use client'

import { useTranslations } from 'next-intl'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CookiePolicyPage() {
  const t = useTranslations('legal.cookie')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8 text-white">{t('title')}</h1>
          <p className="text-xs text-gray-400 mb-8">{t('lastUpdated')}</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('introduction.title')}</h2>
              <p className="text-gray-300 mb-4">
                {t('introduction.content')}
              </p>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-4">
                <h3 className="text-blue-400 font-semibold mb-2">{t('introduction.whatAreCookies')}</h3>
                <p className="text-gray-300">
                  {t('introduction.whatAreCookies')}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('typesOfCookies.title')}</h2>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('typesOfCookies.essential.title')}</h3>
              <p className="text-gray-300 mb-2">{t('typesOfCookies.essential.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('typesOfCookies.essential.authentication')}</li>
                <li>{t('typesOfCookies.essential.security')}</li>
                <li>{t('typesOfCookies.essential.loadBalancing')}</li>
                <li>{t('typesOfCookies.essential.features')}</li>
                <li>{t('typesOfCookies.essential.credits')}</li>
                <li>{t('typesOfCookies.essential.aiSession')}</li>
              </ul>
              <p className="text-green-400 text-sm mb-4">{t('typesOfCookies.essential.legalBasis')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('typesOfCookies.functional.title')}</h3>
              <p className="text-gray-300 mb-2">{t('typesOfCookies.functional.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('typesOfCookies.functional.language')}</li>
                <li>{t('typesOfCookies.functional.theme')}</li>
                <li>{t('typesOfCookies.functional.aiPreferences')}</li>
                <li>{t('typesOfCookies.functional.interface')}</li>
                <li>{t('typesOfCookies.functional.accessibility')}</li>
                <li>{t('typesOfCookies.functional.notifications')}</li>
              </ul>
              <p className="text-green-400 text-sm mb-4">{t('typesOfCookies.functional.legalBasis')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('typesOfCookies.analytics.title')}</h3>
              <p className="text-gray-300 mb-2">{t('typesOfCookies.analytics.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('typesOfCookies.analytics.googleAnalytics')}</li>
                <li>{t('typesOfCookies.analytics.performance')}</li>
                <li>{t('typesOfCookies.analytics.featureUsage')}</li>
                <li>{t('typesOfCookies.analytics.conversion')}</li>
                <li>{t('typesOfCookies.analytics.abTesting')}</li>
                <li>{t('typesOfCookies.analytics.heatmap')}</li>
              </ul>
              <p className="text-orange-400 text-sm mb-4">{t('typesOfCookies.analytics.legalBasis')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('typesOfCookies.marketing.title')}</h3>
              <p className="text-gray-300 mb-2">{t('typesOfCookies.marketing.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('typesOfCookies.marketing.referral')}</li>
                <li>{t('typesOfCookies.marketing.campaign')}</li>
                <li>{t('typesOfCookies.marketing.retargeting')}</li>
                <li>{t('typesOfCookies.marketing.socialMedia')}</li>
                <li>{t('typesOfCookies.marketing.email')}</li>
                <li>{t('typesOfCookies.marketing.affiliate')}</li>
              </ul>
              <p className="text-orange-400 text-sm mb-4">{t('typesOfCookies.marketing.legalBasis')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('typesOfCookies.thirdParty.title')}</h3>
              <p className="text-gray-300 mb-2">{t('typesOfCookies.thirdParty.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('typesOfCookies.thirdParty.stripe')}</li>
                <li>{t('typesOfCookies.thirdParty.openai')}</li>
                <li>{t('typesOfCookies.thirdParty.support')}</li>
                <li>{t('typesOfCookies.thirdParty.cdn')}</li>
                <li>{t('typesOfCookies.thirdParty.email')}</li>
                <li>{t('typesOfCookies.thirdParty.security')}</li>
              </ul>
              <p className="text-yellow-400 text-sm mb-4">{t('typesOfCookies.thirdParty.note')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('cookieDuration.title')}</h2>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieDuration.session.title')}</h3>
              <p className="text-gray-300 mb-2">{t('cookieDuration.session.description')}</p>
              <p className="text-gray-300 mb-4">{t('cookieDuration.session.items')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieDuration.persistent.title')}</h3>
              <p className="text-gray-300 mb-2">{t('cookieDuration.persistent.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('cookieDuration.persistent.rememberMe')}</li>
                <li>{t('cookieDuration.persistent.preferences')}</li>
                <li>{t('cookieDuration.persistent.analytics')}</li>
                <li>{t('cookieDuration.persistent.marketing')}</li>
                <li>{t('cookieDuration.persistent.performance')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('howWeUseCookies.title')}</h2>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('howWeUseCookies.functionality.title')}</h3>
              <p className="text-gray-300 mb-4">{t('howWeUseCookies.functionality.content')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('howWeUseCookies.networkMarketing.title')}</h3>
              <p className="text-gray-300 mb-4">{t('howWeUseCookies.networkMarketing.content')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('howWeUseCookies.security.title')}</h3>
              <p className="text-gray-300 mb-4">{t('howWeUseCookies.security.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('cookieChoices.title')}</h2>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieChoices.browserControls.title')}</h3>
              <p className="text-gray-300 mb-2">{t('cookieChoices.browserControls.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('cookieChoices.browserControls.chrome')}</li>
                <li>{t('cookieChoices.browserControls.firefox')}</li>
                <li>{t('cookieChoices.browserControls.safari')}</li>
                <li>{t('cookieChoices.browserControls.edge')}</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieChoices.platformSettings.title')}</h3>
              <p className="text-gray-300 mb-2">{t('cookieChoices.platformSettings.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('cookieChoices.platformSettings.access')}</li>
                <li>{t('cookieChoices.platformSettings.toggle')}</li>
                <li>{t('cookieChoices.platformSettings.view')}</li>
                <li>{t('cookieChoices.platformSettings.download')}</li>
                <li>{t('cookieChoices.platformSettings.reset')}</li>
              </ul>

              <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4 mb-4">
                <p className="text-orange-400">{t('cookieChoices.importantNote')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('aiInteractions.title')}</h2>
              <p className="text-gray-300 mb-2">{t('aiInteractions.description')}</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                <li>{t('aiInteractions.context')}</li>
                <li>{t('aiInteractions.preferences')}</li>
                <li>{t('aiInteractions.optimization')}</li>
                <li>{t('aiInteractions.tracking')}</li>
                <li>{t('aiInteractions.metrics')}</li>
                <li>{t('aiInteractions.personalization')}</li>
              </ul>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-4">
                <p className="text-green-400">{t('aiInteractions.protection')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('cookieSecurity.title')}</h2>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieSecurity.measures.title')}</h3>
              <p className="text-gray-300 mb-4">{t('cookieSecurity.measures.content')}</p>

              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('cookieSecurity.minimization.title')}</h3>
              <p className="text-gray-300 mb-4">{t('cookieSecurity.minimization.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('policyUpdates.title')}</h2>
              <p className="text-gray-300 mb-4">{t('policyUpdates.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">{t('contact.title')}</h2>
              <p className="text-gray-300 mb-4">{t('contact.content')}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
