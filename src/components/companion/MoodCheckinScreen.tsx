'use client'

import { useState, useEffect } from 'react'
import { useCompanionStore, type MoodType } from '@/lib/companion-store'
import { ArrowLeft, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const moodOptions: { mood: MoodType; emoji: string; label: string }[] = [
  { mood: 'happy', emoji: '😊', label: 'Happy' },
  { mood: 'neutral', emoji: '😐', label: 'Neutral' },
  { mood: 'sad', emoji: '😢', label: 'Sad' },
  { mood: 'angry', emoji: '😤', label: 'Frustrated' },
]

const moodMessages: Record<Exclude<MoodType, null>, string> = {
  happy: "Thank you, Martha. I'm glad you're feeling happy today!",
  neutral: "Thank you, Martha. I hope your day gets even better.",
  sad: "I'm sorry to hear that, Martha. Would you like to talk or listen to some music?",
  angry: "I understand, Martha. Take a deep breath. I'm here if you need to talk.",
}

export default function MoodCheckinScreen() {
  const { setMood, goBack, userName, setIsListening, isListening } = useCompanionStore()
  const [selectedMood, setSelectedMood] = useState<MoodType>(null)
  const [showMessage, setShowMessage] = useState(false)

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood)
    setMood(mood)
    setShowMessage(true)

    // Auto-navigate back after 2 seconds
    setTimeout(() => {
      setShowMessage(false)
      setSelectedMood(null)
      goBack()
    }, 2000)
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
      <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8">
        How are you feeling right now?
      </h2>

      <AnimatePresence mode="wait">
        {showMessage ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-xl text-[var(--sage-dark)] text-center font-medium leading-relaxed px-4">
              {selectedMood ? moodMessages[selectedMood] : ''}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="emojis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center"
          >
            {/* Emoji buttons */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.mood}
                  onClick={() => handleMoodSelect(option.mood)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[80px] min-h-[100px] justify-center transition-all ${
                    selectedMood === option.mood
                      ? 'border-3 border-[var(--sage)] bg-[var(--sage-light)]/20'
                      : 'border-2 border-transparent hover:bg-[var(--cream-dark)]'
                  }`}
                  aria-label={`Feeling ${option.label}`}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-5xl">{option.emoji}</span>
                  <span className="text-base font-medium text-[var(--foreground)]">{option.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Voice option */}
            <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
              <span className="text-lg">or just say it</span>
              <button
                onClick={handleMicToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-[var(--sage)] text-white ${
                  isListening ? 'mic-pulse' : ''
                }`}
                aria-label="Say how you feel"
              >
                <Mic size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
