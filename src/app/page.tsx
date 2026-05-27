'use client'

import { useCompanionStore, type ViewMode, type Screen } from '@/lib/companion-store'
import SmartDisplayFrame from '@/components/companion/SmartDisplayFrame'
import FamilyDashboard from '@/components/companion/FamilyDashboard'
import FamilyWeeklyReport from '@/components/companion/FamilyWeeklyReport'
import { Monitor, Smartphone, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const familyScreens: Record<string, React.ComponentType> = {
  'family-dashboard': FamilyDashboard,
  'family-weekly-report': FamilyWeeklyReport,
  'alerts': FamilyDashboard, // alerts shown in dashboard
  'call-screen': FamilyDashboard, // calls handled in dashboard
}

export default function Home() {
  const { viewMode, setViewMode, currentScreen } = useCompanionStore()

  const viewModes: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
    { mode: 'martha', label: "Martha's Display", icon: Monitor },
    { mode: 'james', label: "James's App", icon: Smartphone },
  ]

  // Determine what to render for James view
  const FamilyComponent = familyScreens[currentScreen] || FamilyDashboard

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-center border-b border-[var(--border)] bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--sage)] flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-[var(--foreground)]">
            AI Emotional Companion
          </h1>
          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline-block ml-1">
            Prototype
          </span>
        </div>
      </header>

      {/* View mode toggle */}
      <div className="flex items-center justify-center gap-1 my-4 px-4">
        <div className="flex items-center gap-1 p-1 bg-[var(--cream-dark)] rounded-xl">
          {viewModes.map((vm) => {
            const isActive = viewMode === vm.mode
            const Icon = vm.icon
            return (
              <button
                key={vm.mode}
                onClick={() => {
                  setViewMode(vm.mode)
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
                aria-label={`Switch to ${vm.label}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="viewModeBg"
                    className="absolute inset-0 bg-[var(--sage)] rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{vm.label}</span>
                <span className="relative z-10 sm:hidden">{vm.mode === 'martha' ? 'Martha' : 'James'}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-8">
        {viewMode === 'martha' ? (
          <SmartDisplayFrame />
        ) : (
          <motion.div
            key="james-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FamilyComponent />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-3 text-center text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] bg-white/40">
        Design Prototype · AI Emotional Companion · Group 13
      </footer>
    </div>
  )
}
