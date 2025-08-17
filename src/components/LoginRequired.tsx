'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Users,
  ArrowRight
} from 'lucide-react'

interface LoginRequiredProps {
  page: 'chat' | 'refer'
  onSignIn: () => void
  onSignUp: () => void
}

export function LoginRequired({ page, onSignIn, onSignUp }: LoginRequiredProps) {
  // Uso traduzioni hardcoded per ora - funzionano su tutte le pagine
  const pageConfig = {
    chat: {
      icon: <MessageSquare className="w-12 h-12 text-blue-400" />,
      title: 'Start Your AI Conversation',
      description: 'Sign in to access your conversation history',
      features: [
        'Chat with 8 specialized AI personas',
        'Save and access conversation history',
        'Clean ocean water with every message'
      ]
    },
    refer: {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
      ),
      title: 'Access Your Referral Dashboard',
      description: 'Sign in to track your earnings',
      features: [
        'Track your referral earnings',
        'Monitor your network growth',
        'Access detailed commission reports'
      ]
    }
  }

  const config = pageConfig[page]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center"
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          {config.icon}
        </div>

        {/* Title and Description */}
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          {config.title}
        </h2>

        <p className="text-gray-400 mb-8 text-lg text-center">
          {config.description}
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-3 text-gray-300">
              <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons - matching homepage button styles */}
        <div className="space-y-4 flex flex-col items-center">
          <Button
            onClick={onSignUp}
            className="w-full max-w-md bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 text-base font-medium"
          >
            Get Started Free
          </Button>

          <Button
            variant="outline"
            onClick={onSignIn}
            className="w-full max-w-md border-gray-600 text-gray-300 hover:bg-gray-700/50 px-6 py-3 text-base font-medium"
          >
            Sign In
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          No credit card required • 100 free credits to start
        </p>
      </motion.div>
    </div>
  )
}
