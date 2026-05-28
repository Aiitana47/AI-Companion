'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems: { icon: string; label: string; description: string; screen: Screen; color: string; bgColor: string }[] = [
  { icon: '💊', label: 'Medication', description: "Today's pills", screen: 'medication-reminder', color: 'text-[var(--sage)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 hover:border-[var(--sage)]/40' },
  { icon: '👨‍👩‍👦', label: 'Family', description: 'Call & messages', screen: 'proactive-suggestion', color: 'text-[var(--warm-orange)]', bgColor: 'bg-[var(--warm-orange)]/10 hover:bg-[var(--warm-orange)]/20 hover:border-[var(--warm-orange)]/40' },
  { icon: '📅', label: 'Appointments', description: 'Upcoming visits', screen: 'appointments', color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100 hover:border-purple-200' },
  { icon: '🎵', label: 'Music', description: 'Listen & relax', screen: 'music', color: 'text-[var(--sage-dark)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 hover:border-[var(--sage)]/40' },
  { icon: '🎯', label: 'Activities', description: 'Stay active', screen: 'activities', color: 'text-[var(--warm-orange)]', bgColor: 'bg-[var(--warm-orange)]/10 hover:bg-[var(--warm-orange)]/20 hover:border-[var(--warm-orange)]/40' },
  { icon: '💤', label: 'Sleep', description: 'Rest tracker', screen: 'sleep-tracker', color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200' },
  { icon: '🌿', label: 'Wellness', description: 'Daily tips', screen: 'wellness-tips', color: 'text-emerald-600', bgColor: 'bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200' },
  { icon: '📷', label: 'Photos', description: 'Family memories', screen: 'photo-gallery', color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100 hover:border-pink-200' },
  { icon: '😊', label: 'Mood', description: 'How you feel', screen: 'mood-checkin', color: 'text-[var(--sage-dark)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 hover:border-[var(--sage)]/40' },
]

export default function NavigationMenuScreen() {
  const { setScreen, goBack } = useCompanionStore()

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
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[var(--foreground)] text-center mb-8"
      >
        Menu
      </motion.h2>

      {/* Grid of menu items */}
      <div className="grid grid-cols-3 gap-3">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setScreen(item.screen)}
            className={`card-gradient-overlay menu-card-glow flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border border-transparent transition-all min-h-[100px] shadow-sm ${item.bgColor}`}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -2 }}
            aria-label={item.label}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
            <span className="text-[10px] text-[var(--muted-foreground)]">{item.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
