'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { PhoneOff, Phone, Video, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CallScreen() {
  const { callType, callWith, endCall } = useCompanionStore()
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(true)

  // Simulate connection after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Call timer
  useEffect(() => {
    if (!isConnected) return
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isConnected])

  const formatDuration = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[540px] bg-[var(--cream)] px-6 py-8 relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sage)]/5 to-transparent pointer-events-none" />

      {/* Call type indicator */}
      <div className="flex items-center gap-2 mb-4 text-[var(--muted-foreground)] relative z-10">
        {callType === 'video' ? <Video size={18} /> : <Phone size={18} />}
        <span className="text-sm font-medium capitalize">{callType} Call</span>
      </div>

      {/* Avatar with ring animation */}
      <div className="relative mb-4">
        {!isConnected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--sage)]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-[var(--sage)] flex items-center justify-center text-white text-4xl font-bold shadow-lg"
        >
          {callWith.charAt(0)}
        </motion.div>
      </div>

      {/* Call status */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-[var(--foreground)] mb-1 relative z-10"
      >
        {callWith}
      </motion.h2>

      {/* Status line */}
      <div className="h-6 flex items-center justify-center mb-6 relative z-10">
        {!isConnected ? (
          <div className="flex items-center gap-2">
            {/* Ringing dots animation */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[var(--sage)]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
            <span className="text-base text-[var(--sage)] font-medium ml-2">Calling...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--sage)] font-medium">Connected</span>
            <span className="text-xs text-[var(--muted-foreground)]">·</span>
            <span className="text-sm text-[var(--muted-foreground)] font-mono">{formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      {/* Audio waveform visualization when connected */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-[3px] h-12 mb-6 relative z-10"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-[var(--sage)]"
              animate={{
                height: isMuted ? [4, 4] : [8, Math.random() * 32 + 8, 8],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Call controls */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 mb-8 relative z-10"
        >
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-[var(--emergency)] text-white' : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--cream-dark)]'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Speaker toggle */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isSpeaker ? 'bg-[var(--sage)] text-white' : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--cream-dark)]'
            }`}
            aria-label={isSpeaker ? 'Speaker on' : 'Speaker off'}
          >
            {isSpeaker ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </motion.div>
      )}

      {/* End call button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={endCall}
        className="w-16 h-16 rounded-full bg-[var(--emergency)] hover:bg-[#B04545] text-white flex items-center justify-center shadow-lg transition-colors relative z-10"
        whileTap={{ scale: 0.9 }}
        aria-label="End call"
      >
        <PhoneOff size={28} />
      </motion.button>
      <span className="text-sm text-[var(--muted-foreground)] mt-2 relative z-10">End Call</span>
    </div>
  )
}
