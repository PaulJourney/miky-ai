'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Zap, TrendingUp } from 'lucide-react'

interface AnimatedCountersProps {
  waterLiters: number
  credits: number
  referralEarnings: number
  onWaterChange?: (newValue: number) => void
  onCreditsChange?: (newValue: number) => void
}

export function AnimatedCounters({
  waterLiters,
  credits,
  referralEarnings,
  onWaterChange,
  onCreditsChange
}: AnimatedCountersProps) {
  const [displayWater, setDisplayWater] = useState(waterLiters)
  const [displayCredits, setDisplayCredits] = useState(credits)
  const [showWaterAnimation, setShowWaterAnimation] = useState(false)
  const [showCreditsAnimation, setShowCreditsAnimation] = useState(false)

  // Animate water counter when it changes
  useEffect(() => {
    if (waterLiters !== displayWater) {
      setShowWaterAnimation(true)

      // Animate the number change
      const startValue = displayWater
      const endValue = waterLiters
      const duration = 800
      const startTime = Date.now()

      const animateValue = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentValue = Math.round(startValue + (endValue - startValue) * progress)
        setDisplayWater(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animateValue)
        } else {
          setShowWaterAnimation(false)
          onWaterChange?.(endValue)
        }
      }

      requestAnimationFrame(animateValue)
    }
  }, [waterLiters, displayWater, onWaterChange])

  // Animate credits counter when it changes
  useEffect(() => {
    if (credits !== displayCredits) {
      setShowCreditsAnimation(true)

      const startValue = displayCredits
      const endValue = credits
      const duration = 600
      const startTime = Date.now()

      const animateValue = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentValue = Math.round(startValue + (endValue - startValue) * progress)
        setDisplayCredits(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animateValue)
        } else {
          setShowCreditsAnimation(false)
          onCreditsChange?.(endValue)
        }
      }

      requestAnimationFrame(animateValue)
    }
  }, [credits, displayCredits, onCreditsChange])

  return (
    <div className="flex items-center gap-6">
      {/* Water Counter */}
      <motion.div
        className="flex items-center gap-2 bg-cyan-600/20 px-4 py-2 rounded-full border border-cyan-600/30"
        animate={showWaterAnimation ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0px rgba(34, 211, 238, 0)',
            '0 0 20px rgba(34, 211, 238, 0.3)',
            '0 0 0px rgba(34, 211, 238, 0)'
          ]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={showWaterAnimation ? {
            y: [0, -3, 0],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.8, type: 'spring', stiffness: 300 }}
        >
          <Droplets className="w-5 h-5 text-cyan-400" />
        </motion.div>

        <div className="flex items-center gap-1">
          <motion.span
            key={displayWater}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-bold text-lg"
          >
            {displayWater.toLocaleString()}
          </motion.span>
          <span className="text-cyan-300 text-sm">L</span>
        </div>

        <AnimatePresence>
          {showWaterAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="absolute"
            >
              <span className="text-cyan-400 font-bold text-sm">+1L</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Credits Counter */}
      <motion.div
        className="flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full border border-blue-600/30"
        animate={showCreditsAnimation ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0px rgba(59, 130, 246, 0)',
            '0 0 20px rgba(59, 130, 246, 0.3)',
            '0 0 0px rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={showCreditsAnimation ? {
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <Zap className="w-5 h-5 text-blue-400" />
        </motion.div>

        <motion.span
          key={displayCredits}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-blue-400 font-bold text-lg"
        >
          {displayCredits.toLocaleString()}
        </motion.span>

        <AnimatePresence>
          {showCreditsAnimation && credits < displayCredits && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="absolute"
            >
              <span className="text-red-400 font-bold text-sm">
                -{displayCredits - credits}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Referral Earnings */}
      <motion.div
        className="flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-full border border-green-600/30"
        whileHover={{ scale: 1.02 }}
      >
        <TrendingUp className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-bold text-lg">
          ${referralEarnings.toFixed(2)}
        </span>
      </motion.div>
    </div>
  )
}

// Hook for triggering water animation from chat
export function useWaterAnimation() {
  const [triggerWater, setTriggerWater] = useState(0)

  const addWaterDrop = () => {
    setTriggerWater(prev => prev + 1)
  }

  return { triggerWater, addWaterDrop }
}

// Individual animated water drop component
export function WaterDropAnimation({ onComplete }: { onComplete?: () => void }) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0, scale: 0 }}
      animate={{
        y: 0,
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.2, 0.8, 1],
        ease: "easeOut",
        onComplete
      }}
      className="absolute z-10 pointer-events-none"
    >
      <div className="w-8 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
        <Droplets className="w-4 h-4 text-white" />
      </div>
    </motion.div>
  )
}
