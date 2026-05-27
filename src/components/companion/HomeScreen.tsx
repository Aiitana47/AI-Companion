'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { Mic, ShieldAlert, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function getTimeGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return `Good morning, ${name}`
  if (hour >= 12 && hour < 18) return `Good afternoon, ${name}`
  if (hour >= 18 && hour < 21) return `Good evening, ${name}`
  return `Good night, ${name}`
}

export default function HomeScreen() {
  const { 
    userName, micState, setMicState, activateEmergency, 
    setAiChatMessage, setAiChatVisible, aiChatMessage, aiChatVisible,
    setScreen, showToast, showProactiveBanner, setShowProactiveBanner
  } = useCompanionStore()

  const [greeting, setGreeting] = useState(getTimeGreeting(userName))

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting(userName))
    }, 60000)
    return () => clearInterval(interval)
  }, [userName])

  // Show proactive banner after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProactiveBanner(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [setShowProactiveBanner])

  // Show medication reminder toast after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast({
        title: 'Time for your medication!',
        description: 'Blood Pressure Medication - 1 tablet',
        type: 'medication',
      })
    }, 15000)
    return () => clearTimeout(timer)
  }, [showToast])

  const handleMicClick = useCallback(async () => {
    // Dismiss any existing chat bubble
    if (aiChatVisible) {
      setAiChatVisible(false)
      setAiChatMessage(null)
      return
    }

    // Start listening state
    setMicState('listening')

    // After 2 seconds, switch to processing
    setTimeout(() => {
      setMicState('processing')

      // Call the API
      fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello Martha, how are you feeling today?',
          context: 'Martha just tapped the mic button on her smart display',
        }),
      })
        .then(res => res.json())
        .then(data => {
          setAiChatMessage(data.message || "I'm here for you, Martha. How can I help?")
          setAiChatVisible(true)
          setMicState('idle')

          // Auto-dismiss after 8 seconds
          setTimeout(() => {
            setAiChatVisible(false)
            setTimeout(() => setAiChatMessage(null), 300)
          }, 8000)
        })
        .catch(() => {
          setAiChatMessage("I'm here for you, Martha. Would you like to chat?")
          setAiChatVisible(true)
          setMicState('idle')

          setTimeout(() => {
            setAiChatVisible(false)
            setTimeout(() => setAiChatMessage(null), 300)
          }, 8000)
        })
    }, 2000)
  }, [aiChatVisible, setMicState, setAiChatMessage, setAiChatVisible])

  return (
    <div className="flex flex-col px-6 py-4 h-full">
      {/* Proactive check-in banner */}
      <AnimatePresence>
        {showProactiveBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => {
                setShowProactiveBanner(false)
                setScreen('proactive-suggestion')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--sage)]/10 border border-[var(--sage)]/20 hover:bg-[var(--sage)]/15 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--sage)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💬</span>
              </div>
              <p className="flex-1 text-sm text-[var(--sage-dark)] font-medium">
                You&apos;ve been quiet for a while. Would you like to chat?
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowProactiveBanner(false)
                }}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--cream-dark)] transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-[var(--foreground)] text-center mb-1"
      >
        {greeting}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-[var(--muted-foreground)] text-center mb-6"
      >
        How can I help you?
      </motion.p>

      {/* AI Chat bubble */}
      <AnimatePresence>
        {aiChatVisible && aiChatMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="bg-[var(--sage)] rounded-2xl p-4 shadow-md relative">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🤖</span>
                </div>
                <p className="text-base text-white leading-relaxed flex-1">
                  {aiChatMessage}
                </p>
              </div>
              {/* Bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--sage)] rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Microphone button with floating animation */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
          transition={{ 
            delay: 0.3, 
            scale: { type: 'spring', stiffness: 200 },
            opacity: { duration: 0.3 },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }
          }}
          onClick={handleMicClick}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center 
            bg-[var(--sage)] hover:bg-[var(--sage-dark)] 
            text-white shadow-lg transition-colors duration-200
            ${micState === 'listening' ? 'mic-pulse' : ''}
          `}
          aria-label={micState === 'listening' ? 'Listening' : micState === 'processing' ? 'Processing' : 'Start listening'}
          whileTap={{ scale: 0.9 }}
        >
          <Mic size={36} className={micState === 'listening' ? 'animate-pulse' : ''} />
        </motion.button>

        {/* Mic state text */}
        <div className="h-8 flex items-center justify-center mt-3">
          {micState === 'listening' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--sage)]"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                />
              ))}
              <span className="text-base text-[var(--sage)] font-medium ml-2">Listening</span>
            </motion.div>
          )}
          {micState === 'processing' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base text-[var(--muted-foreground)]"
            >
              Processing...
            </motion.p>
          )}
          {micState === 'idle' && !aiChatVisible && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base text-[var(--muted-foreground)]"
            >
              Tap or just speak
            </motion.p>
          )}
        </div>
      </div>

      {/* Emergency button - always visible at bottom */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={activateEmergency}
        className="emergency-pulse w-full py-4 rounded-2xl bg-[var(--emergency)] hover:bg-[#B04545] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors mt-2"
        aria-label="Emergency"
        whileTap={{ scale: 0.95 }}
      >
        <ShieldAlert size={28} />
        EMERGENCY
      </motion.button>
    </div>
  )
}
