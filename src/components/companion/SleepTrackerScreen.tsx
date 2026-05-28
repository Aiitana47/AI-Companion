'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Moon, Clock, Sun, Sunrise } from 'lucide-react'
import { motion } from 'framer-motion'

interface SleepDay {
  day: string
  hours: number
  quality: 'good' | 'moderate' | 'poor'
}

const sleepWeekData: SleepDay[] = [
  { day: 'Mon', hours: 6.8, quality: 'moderate' },
  { day: 'Tue', hours: 7.2, quality: 'good' },
  { day: 'Wed', hours: 7.5, quality: 'good' },
  { day: 'Thu', hours: 6.5, quality: 'poor' },
  { day: 'Fri', hours: 7.8, quality: 'good' },
  { day: 'Sat', hours: 8.0, quality: 'good' },
  { day: 'Sun', hours: 7.3, quality: 'moderate' },
]

const sleepTips = [
  { icon: Moon, text: 'Avoid screens 30 minutes before bed' },
  { icon: Clock, text: 'Keep a consistent bedtime schedule' },
  { icon: Sunrise, text: 'Get morning sunlight to reset your rhythm' },
]

function getQualityLabel(quality: SleepDay['quality']): { text: string; color: string } {
  switch (quality) {
    case 'good':
      return { text: 'Good', color: 'text-[var(--sage-dark)]' }
    case 'moderate':
      return { text: 'Moderate', color: 'text-[var(--warm-orange)]' }
    case 'poor':
      return { text: 'Poor', color: 'text-[var(--emergency)]' }
  }
}

function getBarColor(hours: number): string {
  if (hours >= 7.5) return 'bg-[var(--sage)]'
  if (hours >= 6.5) return 'bg-[var(--warm-orange)]'
  return 'bg-[var(--emergency)]'
}

export default function SleepTrackerScreen() {
  const { goBack } = useCompanionStore()

  const sleepScore = 72
  const lastNightHours = 7.33 // 7h 20m
  const lastNightQuality: SleepDay['quality'] = 'good'
  const qualityInfo = getQualityLabel(lastNightQuality)

  const maxHours = 9
  const circumference = 2 * Math.PI * 45
  const scoreOffset = circumference - (sleepScore / 100) * circumference

  return (
    <div className="flex flex-col px-6 py-6 min-h-[540px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-5"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[var(--sage)] hover:text-[var(--sage-dark)] transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Sleep Tracker</h1>
        <div className="w-[70px]" />
      </motion.div>

      {/* Last Night's Sleep Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-5 rounded-2xl p-5 bg-white border border-[var(--border)] shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Moon size={20} className="text-[var(--sage)]" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">Last Night</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-[var(--foreground)]">
              7h <span className="text-2xl">20m</span>
            </p>
            <p className={`text-base font-semibold mt-1 ${qualityInfo.color}`}>
              Quality: {qualityInfo.text}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
              <Sun size={14} className="text-[var(--warm-orange)]" />
              <span>22:30</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
              <Sunrise size={14} className="text-[var(--sage)]" />
              <span>05:50</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Sleep Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mb-5 rounded-2xl p-4 bg-white border border-[var(--border)]"
      >
        <p className="text-sm font-semibold text-[var(--foreground)] mb-3">This Week</p>
        <div className="flex items-end justify-between gap-2" style={{ height: '100px' }}>
          {sleepWeekData.map((day, index) => {
            const barHeight = Math.max(20, (day.hours / maxHours) * 80)
            return (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${barHeight}px` }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.07, ease: 'easeOut' }}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
                  {day.hours}h
                </span>
                <div
                  className={`w-full rounded-t-lg ${getBarColor(day.hours)} transition-colors`}
                  style={{ minHeight: '4px' }}
                />
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  {day.day}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Sleep Score Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex justify-center mb-5"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="128" height="128" viewBox="0 0 128 128">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="var(--cream-dark)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="var(--sage)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: scoreOffset }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="text-center z-10">
            <p className="text-3xl font-bold text-[var(--foreground)]">{sleepScore}%</p>
            <p className="text-xs text-[var(--muted-foreground)]">Sleep Score</p>
          </div>
        </div>
      </motion.div>

      {/* Tips for Better Sleep */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.45 }}
        className="rounded-2xl p-4 bg-[var(--sage)]/5 border border-[var(--sage)]/15"
      >
        <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Tips for Better Sleep</p>
        <div className="space-y-2.5">
          {sleepTips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--sage)]/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[var(--sage-dark)]" />
                </div>
                <p className="text-sm text-[var(--foreground)] leading-snug">{tip.text}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
