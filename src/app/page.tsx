'use client'

import { useCompanionStore, type ViewMode } from '@/lib/companion-store'
import SmartDisplayFrame from '@/components/companion/SmartDisplayFrame'
import FamilyDashboard from '@/components/companion/FamilyDashboard'
import FamilyWeeklyReport from '@/components/companion/FamilyWeeklyReport'
import FamilyMessagesScreen from '@/components/companion/FamilyMessagesScreen'
import FamilySettingsScreen from '@/components/companion/FamilySettingsScreen'
import { Monitor, Smartphone, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const familyScreens: Record<string, React.ComponentType> = {
  'family-dashboard': FamilyDashboard,
  'family-weekly-report': FamilyWeeklyReport,
  'family-messages': FamilyMessagesScreen,
  'family-settings': FamilySettingsScreen,
  'alerts': FamilyDashboard,
  'call-screen': FamilyDashboard,
}

export default function Home() {
  const { viewMode, setViewMode, currentScreen } = useCompanionStore()

  const viewModes: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
    { mode: 'martha', label: "Martha's Display", icon: Monitor },
    { mode: 'james', label: "James's App", icon: Smartphone },
  ]

  const FamilyComponent = familyScreens[currentScreen] || FamilyDashboard

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background with warm radial gradients and wave pattern */}
      <div className="fixed inset-0 -z-10">
        {/* Base warm gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(143, 174, 139, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(232, 145, 90, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(250, 246, 240, 1) 0%, rgba(240, 232, 220, 0.5) 100%)'
        }} />
        {/* SVG wave pattern overlay */}
        <svg className="absolute bottom-0 left-0 w-full opacity-[0.03]" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '40vh' }}>
          <path fill="#8FAE8B" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg className="absolute top-0 left-0 w-full opacity-[0.02] rotate-180" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '30vh' }}>
          <path fill="#E8915A" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        {/* Subtle floating orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(143, 174, 139, 0.06) 0%, transparent 70%)', top: '10%', right: '5%' }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(232, 145, 90, 0.05) 0%, transparent 70%)', bottom: '20%', left: '10%' }}
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-center border-b border-[var(--border)] bg-white/60 backdrop-blur-sm relative z-10">
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
      <div className="flex items-center justify-center gap-1 my-4 px-4 relative z-10">
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
      <main className="flex-1 flex items-start justify-center px-4 pb-8 relative z-10">
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
      <footer className="mt-auto py-3 text-center text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] bg-white/40 relative z-10">
        Design Prototype · AI Emotional Companion · Group 13
      </footer>
    </div>
  )
}
