'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems: { icon: string; label: string; screen: Screen; color: string; bgColor: string }[] = [
  { icon: '💊', label: 'Medication', screen: 'medication-reminder', color: 'text-[var(--sage)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 hover:border-[var(--sage)]/40' },
  { icon: '👨‍👩‍👦', label: 'Family', screen: 'proactive-suggestion', color: 'text-[var(--warm-orange)]', bgColor: 'bg-[var(--warm-orange)]/10 hover:bg-[var(--warm-orange)]/20 hover:border-[var(--warm-orange)]/40' },
  { icon: '🏥', label: 'Doctor', screen: 'appointments', color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100 hover:border-purple-200' },
  { icon: '📅', label: 'Appointments', screen: 'appointments', color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100 hover:border-pink-200' },
  { icon: '🎵', label: 'Music', screen: 'music', color: 'text-[var(--sage-dark)]', bgColor: 'bg-[var(--sage)]/10 hover:bg-[var(--sage)]/20 hover:border-[var(--sage)]/40' },
  { icon: '🎯', label: 'Activities', screen: 'activities', color: 'text-[var(--warm-orange)]', bgColor: 'bg-[var(--warm-orange)]/10 hover:bg-[var(--warm-orange)]/20 hover:border-[var(--warm-orange)]/40' },
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
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setScreen(item.screen)}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-transparent transition-all min-h-[120px] shadow-sm ${item.bgColor}`}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -2 }}
            aria-label={item.label}
          >
            <span className="text-4xl">{item.icon}</span>
            <span className={`text-lg font-semibold ${item.color}`}>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
