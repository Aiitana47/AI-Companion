'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems: { icon: string; label: string; screen: Screen }[] = [
  { icon: '💊', label: 'Medication', screen: 'medication-reminder' },
  { icon: '👨‍👩‍👦', label: 'Family', screen: 'home' },
  { icon: '🏥', label: 'Doctor', screen: 'home' },
  { icon: '📅', label: 'Appointments', screen: 'home' },
  { icon: '🎵', label: 'Music', screen: 'home' },
  { icon: '🎯', label: 'Activities', screen: 'home' },
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
      <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-8">
        Menu
      </h2>

      {/* Grid of menu items */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setScreen(item.screen)}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-[var(--border)] hover:bg-[var(--sage-light)]/15 hover:border-[var(--sage)] transition-all min-h-[110px]"
            whileTap={{ scale: 0.93 }}
            aria-label={item.label}
          >
            <span className="text-4xl">{item.icon}</span>
            <span className="text-lg font-medium text-[var(--foreground)]">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
