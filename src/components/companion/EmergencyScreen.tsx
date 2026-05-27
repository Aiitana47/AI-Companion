'use client'

import { useState, useEffect } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmergencyScreen() {
  const { deactivateEmergency } = useCompanionStore()
  const [escalationStep, setEscalationStep] = useState(0)

  // Simulate escalation over time
  useEffect(() => {
    const timers = [
      setTimeout(() => setEscalationStep(1), 1000),
      setTimeout(() => setEscalationStep(2), 3000),
      setTimeout(() => setEscalationStep(3), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const steps = [
    { label: 'Loud check-in initiated', icon: '✅' },
    { label: 'Contacting James (son)', icon: '🔄' },
    { label: 'Contacting neighbour (Margaret)', icon: '⬜' },
    { label: 'Emergency services', icon: '⬜' },
  ]

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[640px] bg-[#C75B5B] text-white px-6 py-8 rounded-2xl">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-5xl font-black tracking-wider mb-4"
      >
        EMERGENCY
      </motion.h1>

      {/* Contacting status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mb-8"
      >
        <Loader2 size={24} className="animate-spin" />
        <span className="text-xl font-medium">Contacting James...</span>
      </motion.div>

      {/* Escalation steps */}
      <div className="w-full max-w-xs space-y-3 mb-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl ${
              index <= escalationStep
                ? 'bg-white/15'
                : 'bg-white/5 opacity-50'
            }`}
          >
            <span className="text-xl">
              {index < escalationStep
                ? '✅'
                : index === escalationStep
                ? '🔄'
                : '⬜'}
            </span>
            <span className={`text-base ${index <= escalationStep ? 'font-medium' : ''}`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Cancel button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={deactivateEmergency}
        className="w-full max-w-xs py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors"
        whileTap={{ scale: 0.95 }}
        aria-label="Cancel emergency"
      >
        <X size={24} />
        Cancel
      </motion.button>
    </div>
  )
}
