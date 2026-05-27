'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Phone, Video, MessageCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProactiveSuggestionScreen() {
  const { startCall, goBack, setScreen } = useCompanionStore()

  return (
    <div className="screen-enter flex flex-col items-center justify-center px-6 py-8 min-h-[540px]">
      {/* AI message with enhanced styling */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-2xl p-6 shadow-md border border-[var(--border)] mb-8 w-full relative overflow-hidden"
      >
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--sage)] via-[var(--warm-orange)] to-[var(--sage)]" />
        
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--sage)] to-[var(--sage-dark)] flex items-center justify-center text-white flex-shrink-0 shadow-md"
          >
            <Sparkles size={22} />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs text-[var(--sage)] font-semibold uppercase tracking-wide mb-1">AI Suggestion</p>
            <p className="text-xl text-[var(--foreground)] leading-relaxed">
              You&apos;ve been quiet for a while. Would you like to call James?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call buttons */}
      <div className="flex gap-4 w-full mb-4">
        <motion.button
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => startCall('audio', 'James')}
          className="flex-1 py-5 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors shadow-md"
          whileTap={{ scale: 0.95 }}
          aria-label="Audio call with James"
        >
          <Phone size={24} />
          Audio Call
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => startCall('video', 'James')}
          className="flex-1 py-5 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors shadow-md"
          whileTap={{ scale: 0.95 }}
          aria-label="Video call with James"
        >
          <Video size={24} />
          Video Call
        </motion.button>
      </div>

      {/* Additional option - Message */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => {
          goBack()
          setScreen('mood-checkin')
        }}
        className="w-full py-4 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--sage)]/40 text-[var(--foreground)] font-semibold text-lg flex items-center justify-center gap-3 transition-colors mb-3 shadow-sm"
        whileTap={{ scale: 0.98 }}
        aria-label="Mood check-in"
      >
        <MessageCircle size={22} className="text-[var(--sage)]" />
        How are you feeling?
      </motion.button>

      {/* Not now option */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={goBack}
        className="text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px] px-6 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        Not now
      </motion.button>
    </div>
  )
}
