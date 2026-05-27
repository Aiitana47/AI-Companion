'use client'

import { useState, useEffect } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { PhoneOff, Phone, Video } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CallScreen() {
  const { callType, callWith, endCall } = useCompanionStore()
  const [isConnected, setIsConnected] = useState(false)

  // Simulate connection after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[540px] bg-[var(--cream)] px-6 py-8">
      {/* Call type indicator */}
      <div className="flex items-center gap-2 mb-6 text-[var(--muted-foreground)]">
        {callType === 'video' ? <Video size={20} /> : <Phone size={20} />}
        <span className="text-base font-medium capitalize">{callType} Call</span>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-[var(--sage)] flex items-center justify-center text-white text-4xl font-bold mb-4"
      >
        {callWith.charAt(0)}
      </motion.div>

      {/* Call status */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-[var(--foreground)] mb-2"
      >
        {isConnected ? callWith : `Calling ${callWith}...`}
      </motion.h2>

      {/* Ringing dots animation */}
      {!isConnected && (
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[var(--sage)]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Connected state */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <span className="text-lg text-[var(--sage)] font-medium">Connected</span>
        </motion.div>
      )}

      {/* End call button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={endCall}
        className="w-16 h-16 rounded-full bg-[var(--emergency)] hover:bg-[#B04545] text-white flex items-center justify-center shadow-lg transition-colors"
        whileTap={{ scale: 0.9 }}
        aria-label="End call"
      >
        <PhoneOff size={28} />
      </motion.button>
      <span className="text-sm text-[var(--muted-foreground)] mt-2">End Call</span>
    </div>
  )
}
