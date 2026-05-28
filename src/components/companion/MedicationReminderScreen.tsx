'use client'

import { useState, useEffect, useRef } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Check, Mic, MapPin, Clock, Pill } from 'lucide-react'
import { motion } from 'framer-motion'

function ProgressRing({ progress, size = 64, strokeWidth = 5 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--cream-dark)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--sage)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
      />
    </svg>
  )
}

function ConfettiEffect() {
  const colors = ['bg-[var(--sage)]', 'bg-[var(--warm-orange)]', 'bg-pink-400', 'bg-purple-400', 'bg-yellow-400']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`confetti-dot absolute w-2 h-2 rounded-full ${colors[i % colors.length]}`}
          style={{
            left: `${15 + (i * 7) % 70}%`,
            bottom: '30%',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

function isTimePast(timeStr: string): boolean {
  const now = new Date()
  const [hours, minutes] = timeStr.split(':').map(Number)
  return now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes)
}

export default function MedicationReminderScreen() {
  const { medications, markMedicationTaken, goBack } = useCompanionStore()
  const [showConfetti, setShowConfetti] = useState(false)
  const prevAllTakenRef = useRef(false)

  // Find the next untaken medication to highlight
  const nextMedication = medications.find(m => !m.taken)
  const takenCount = medications.filter(m => m.taken).length
  const allTaken = takenCount === medications.length && medications.length > 0
  const progressPercent = medications.length > 0 ? (takenCount / medications.length) * 100 : 0

  // Show confetti when all medications transition to taken
  useEffect(() => {
    if (allTaken && !prevAllTakenRef.current) {
      const timer = setTimeout(() => setShowConfetti(true), 0)
      const hideTimer = setTimeout(() => setShowConfetti(false), 3000)
      prevAllTakenRef.current = true
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
    prevAllTakenRef.current = allTaken
  }, [allTaken])

  const handleMarkDone = (id: string) => {
    markMedicationTaken(id)
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

      {/* Current medication highlight */}
      {nextMedication && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-2xl p-6 shadow-md border-2 border-[var(--sage)]/30 mb-6 relative overflow-hidden"
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--sage)] to-[var(--sage-dark)]" />
          
          <div className="flex items-center gap-2 mb-3">
            <Pill size={18} className="text-[var(--sage)]" />
            <span className="text-xs font-semibold text-[var(--sage)] uppercase tracking-wide">Next Medication</span>
          </div>

          <p className="text-5xl font-bold text-[var(--sage)] text-center mb-2">
            {nextMedication.time}
          </p>
          <p className="text-xl text-[var(--foreground)] text-center mb-1">
            Take {nextMedication.name}
          </p>
          <p className="text-base text-[var(--muted-foreground)] text-center mb-6">
            {nextMedication.dosage}
          </p>

          {/* Done button with voice indicator */}
          <motion.button
            onClick={() => handleMarkDone(nextMedication.id)}
            className="w-full py-4 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors shadow-md"
            whileTap={{ scale: 0.95 }}
            aria-label="Mark medication as taken"
          >
            <Check size={24} />
            Done
            <Mic size={18} className="opacity-70" />
          </motion.button>
          <p className="text-sm text-[var(--muted-foreground)] text-center mt-2">
            Say &quot;Done&quot; to confirm
          </p>

          {/* Location hint */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[var(--warm-orange)]">
            <MapPin size={18} />
            <span className="text-base">Kitchen, top cupboard</span>
          </div>
        </motion.div>
      )}

      {/* All taken message with confetti */}
      {!nextMedication && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--sage)]/10 rounded-2xl p-6 text-center mb-6 border border-[var(--sage)]/20 relative overflow-hidden"
        >
          {showConfetti && <ConfettiEffect />}
          <span className="text-5xl block mb-3">🎉</span>
          <p className="text-xl font-bold text-[var(--sage-dark)]">All done!</p>
          <p className="text-base text-[var(--muted-foreground)] mt-1">You&apos;ve taken all your medications today</p>
        </motion.div>
      )}

      {/* All medications list */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Today&apos;s Medications
          </h3>
          <div className="flex items-center gap-2">
            {/* Progress ring */}
            <div className="relative">
              <ProgressRing progress={progressPercent} size={36} strokeWidth={3} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--sage)]">
                {takenCount}/{medications.length}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {medications.map((med, index) => {
            const pastDue = !med.taken && isTimePast(med.time)
            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  med.taken
                    ? 'bg-[var(--sage)]/5 opacity-60'
                    : med.id === nextMedication?.id
                    ? 'bg-white border-2 border-[var(--sage)]/30 shadow-sm'
                    : 'bg-white border border-[var(--border)]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    med.taken
                      ? 'bg-[var(--sage)] text-white'
                      : 'bg-[var(--cream-dark)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {med.taken ? <Check size={16} /> : <Clock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium ${med.taken ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>
                    {med.taken && <span className="text-[var(--sage)] mr-1">✓</span>}
                    {med.name}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">{med.dosage}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {pastDue && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" title="Past due" />
                  )}
                  <span className="text-sm text-[var(--muted-foreground)] font-mono">{med.time}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
