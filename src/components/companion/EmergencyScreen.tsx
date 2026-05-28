'use client'

import { useState, useEffect } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { X, Loader2, Phone, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmergencyScreen() {
  const { deactivateEmergency } = useCompanionStore()
  const [escalationStep, setEscalationStep] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Simulate escalation over time
  useEffect(() => {
    const timers = [
      setTimeout(() => setEscalationStep(1), 1000),
      setTimeout(() => setEscalationStep(2), 3000),
      setTimeout(() => setEscalationStep(3), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const steps = [
    { label: 'Loud check-in initiated', icon: '✅', detail: 'AI is calling out to Martha' },
    { label: 'Contacting James (son)', icon: '🔄', detail: 'Calling +44 7700 900123' },
    { label: 'Contacting neighbour (Margaret)', icon: '⬜', detail: 'Calling +44 7700 900456' },
    { label: 'Emergency services (999)', icon: '⬜', detail: 'Will call if no response' },
  ]

  return (
    <div className="screen-enter flex flex-col items-center justify-between min-h-[640px] bg-gradient-to-b from-[#C75B5B] to-[#A04040] text-white px-6 py-8 rounded-2xl relative overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Top section */}
      <div className="relative z-10 text-center">
        {/* Shield icon with pulse */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4"
        >
          <ShieldAlert size={32} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-5xl font-black tracking-wider mb-2"
        >
          EMERGENCY
        </motion.h1>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xl font-mono font-medium">Active · {formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Contacting status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mb-4 relative z-10"
      >
        {escalationStep === 1 ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-lg font-medium">Contacting James...</span>
          </>
        ) : escalationStep >= 2 ? (
          <>
            <Phone size={20} className="animate-pulse" />
            <span className="text-lg font-medium">
              {escalationStep === 2 ? 'No answer from James' : 'Escalating...'}
            </span>
          </>
        ) : (
          <span className="text-lg font-medium">Checking on Martha...</span>
        )}
      </motion.div>

      {/* Escalation steps */}
      <div className="w-full max-w-xs space-y-2 mb-6 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`flex items-start gap-3 py-3 px-4 rounded-xl ${
              index <= escalationStep
                ? 'bg-white/15'
                : 'bg-white/5 opacity-50'
            }`}
          >
            <span className="text-lg mt-0.5">
              {index < escalationStep
                ? '✅'
                : index === escalationStep
                ? '🔄'
                : '⬜'}
            </span>
            <div className="flex-1">
              <span className={`text-sm ${index <= escalationStep ? 'font-semibold' : 'font-normal'}`}>
                {step.label}
              </span>
              {index <= escalationStep && (
                <p className="text-xs text-white/60 mt-0.5">{step.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cancel button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={deactivateEmergency}
        className="w-full max-w-xs py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors relative z-10 backdrop-blur-sm"
        whileTap={{ scale: 0.95 }}
        aria-label="Cancel emergency"
      >
        <X size={24} />
        I&apos;m OK - Cancel
      </motion.button>
    </div>
  )
}
