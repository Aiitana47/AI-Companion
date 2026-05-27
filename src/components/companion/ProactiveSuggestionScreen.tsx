'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Phone, Video } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProactiveSuggestionScreen() {
  const { startCall, goBack } = useCompanionStore()

  return (
    <div className="screen-enter flex flex-col items-center justify-center px-6 py-8 min-h-[540px]">
      {/* AI message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] mb-8 w-full"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--sage)] flex items-center justify-center text-white flex-shrink-0 mt-0.5">
            <span className="text-lg">💬</span>
          </div>
          <p className="text-xl text-[var(--foreground)] leading-relaxed">
            You&apos;ve been quiet for a while. Would you like to call James?
          </p>
        </div>
      </motion.div>

      {/* Call buttons */}
      <div className="flex gap-4 w-full mb-6">
        <motion.button
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => startCall('audio', 'James')}
          className="flex-1 py-5 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors"
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
          className="flex-1 py-5 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label="Video call with James"
        >
          <Video size={24} />
          Video Call
        </motion.button>
      </div>

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
