'use client'

import { useState, useEffect } from 'react'
import { useCompanionStore, type MoodType } from '@/lib/companion-store'
import { ArrowLeft, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const moodOptions: { mood: MoodType; emoji: string; label: string; color: string; bgColor: string }[] = [
  { mood: 'happy', emoji: '😊', label: 'Happy', color: 'text-[var(--sage-dark)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 border-[var(--sage)]/30' },
  { mood: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-[var(--muted-foreground)]', bgColor: 'bg-[var(--cream-dark)]/50 hover:bg-[var(--cream-dark)] border-[var(--border)]' },
  { mood: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { mood: 'angry', emoji: '😤', label: 'Frustrated', color: 'text-[var(--emergency)]', bgColor: 'bg-[var(--emergency)]/10 hover:bg-[var(--emergency)]/20 border-[var(--emergency)]/30' },
]

const moodMessages: Record<Exclude<MoodType, null>, { text: string; emoji: string }> = {
  happy: { text: "Thank you, Martha. I'm glad you're feeling happy today!", emoji: '🌟' },
  neutral: { text: "Thank you, Martha. I hope your day gets even better.", emoji: '🌈' },
  sad: { text: "I'm sorry to hear that, Martha. Would you like to talk or listen to some music?", emoji: '💜' },
  angry: { text: "I understand, Martha. Take a deep breath. I'm here if you need to talk.", emoji: '🤗' },
}

export default function MoodCheckinScreen() {
  const { setMood, goBack, userName, setIsListening, isListening } = useCompanionStore()
  const [selectedMood, setSelectedMood] = useState<MoodType>(null)
  const [showMessage, setShowMessage] = useState(false)

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood)
    setMood(mood)
    setShowMessage(true)

    // Auto-navigate back after 2.5 seconds
    setTimeout(() => {
      setShowMessage(false)
      setSelectedMood(null)
      goBack()
    }, 2500)
  }

  const handleMicToggle = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000)
    }
  }

  return (
    <div className="screen-enter flex flex-col px-6 py-6 min-h-[540px]">
      {/* Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 min-h-[44px] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-[var(--foreground)] text-center mb-2"
      >
        How are you feeling
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-[var(--muted-foreground)] text-center mb-8"
      >
        right now?
      </motion.p>

      <AnimatePresence mode="wait">
        {showMessage ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.span
                className="text-6xl block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {selectedMood ? moodMessages[selectedMood].emoji : ''}
              </motion.span>
              <p className="text-xl text-[var(--sage-dark)] text-center font-medium leading-relaxed px-4">
                {selectedMood ? moodMessages[selectedMood].text : ''}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="emojis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center"
          >
            {/* Emoji buttons with larger cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
              {moodOptions.map((option, index) => (
                <motion.button
                  key={option.mood}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleMoodSelect(option.mood)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl min-h-[110px] justify-center transition-all border-2 ${
                    selectedMood === option.mood
                      ? 'border-[var(--sage)] bg-[var(--sage)]/15 shadow-md'
                      : `border-transparent ${option.bgColor}`
                  }`}
                  aria-label={`Feeling ${option.label}`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -2 }}
                >
                  <span className="text-5xl">{option.emoji}</span>
                  <span className={`text-base font-semibold ${option.color}`}>{option.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Voice option */}
            <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
              <span className="text-lg">or just say it</span>
              <button
                onClick={handleMicToggle}
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-[var(--sage)] text-white transition-transform ${
                  isListening ? 'mic-pulse scale-110' : 'hover:scale-105'
                }`}
                aria-label="Say how you feel"
              >
                <Mic size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
