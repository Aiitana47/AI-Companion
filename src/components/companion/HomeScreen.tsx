'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { Mic, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomeScreen() {
  const { userName, isListening, setIsListening, activateEmergency } = useCompanionStore()

  const handleMicToggle = () => {
    setIsListening(!isListening)
    // Simulate listening state auto-reset after 3 seconds
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
      }, 3000)
    }
  }

  return (
    <div className="screen-enter flex flex-col items-center justify-center px-6 py-8 min-h-[540px]">
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold text-[var(--foreground)] text-center mb-2"
      >
        Welcome, {userName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-[var(--muted-foreground)] mb-10"
      >
        How can I help you?
      </motion.p>

      {/* Microphone button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        onClick={handleMicToggle}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center 
          bg-[var(--sage)] hover:bg-[var(--sage-dark)] 
          text-white shadow-lg transition-all duration-200
          ${isListening ? 'mic-pulse' : ''}
        `}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
        whileTap={{ scale: 0.9 }}
      >
        <Mic size={36} className={isListening ? 'animate-pulse' : ''} />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-[var(--muted-foreground)] mt-4"
      >
        {isListening ? 'Listening...' : 'Tap or just speak'}
      </motion.p>

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Emergency button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={activateEmergency}
        className="emergency-pulse w-full max-w-xs py-4 rounded-2xl bg-[var(--emergency)] hover:bg-[#B04545] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors"
        aria-label="Emergency"
        whileTap={{ scale: 0.95 }}
      >
        <ShieldAlert size={28} />
        EMERGENCY
      </motion.button>
    </div>
  )
}
