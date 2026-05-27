'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { Menu, User, Bell, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import HomeScreen from './HomeScreen'
import MoodCheckinScreen from './MoodCheckinScreen'
import MedicationReminderScreen from './MedicationReminderScreen'
import NavigationMenuScreen from './NavigationMenuScreen'
import ProactiveSuggestionScreen from './ProactiveSuggestionScreen'
import ProfileScreen from './ProfileScreen'
import AlertsScreen from './AlertsScreen'
import EmergencyScreen from './EmergencyScreen'
import CallScreen from './CallScreen'

const screenComponents: Record<Screen, React.ComponentType> = {
  'home': HomeScreen,
  'mood-checkin': MoodCheckinScreen,
  'medication-reminder': MedicationReminderScreen,
  'menu': NavigationMenuScreen,
  'proactive-suggestion': ProactiveSuggestionScreen,
  'profile': ProfileScreen,
  'alerts': AlertsScreen,
  'emergency': EmergencyScreen,
  'family-dashboard': HomeScreen,
  'family-weekly-report': HomeScreen,
  'call-screen': CallScreen,
}

export default function SmartDisplayFrame() {
  const { currentScreen, currentTime, currentDate, setScreen, isEmergencyActive, alerts, viewMode } = useCompanionStore()

  const CurrentScreenComponent = screenComponents[currentScreen] || HomeScreen

  const unreadAlerts = alerts.filter(a => !a.read).length

  const navItems = [
    { screen: 'menu' as Screen, icon: Menu, label: 'Menu' },
    { screen: 'home' as Screen, icon: Home, label: 'Home' },
    { screen: 'profile' as Screen, icon: User, label: 'Profile' },
    { screen: 'alerts' as Screen, icon: Bell, label: 'Alerts', badge: unreadAlerts },
  ]

  // Emergency screen renders without the frame chrome
  if (isEmergencyActive && currentScreen === 'emergency') {
    return (
      <div className="w-full max-w-[480px] mx-auto">
        <EmergencyScreen />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Device bezel */}
      <div className="rounded-3xl bg-[#2D2D2D] p-2.5 sm:p-3 shadow-2xl">
        {/* Screen area */}
        <div className="rounded-2xl bg-[var(--cream)] overflow-hidden flex flex-col" style={{ minHeight: '640px' }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-[var(--cream-dark)]/60 border-b border-[var(--border)]/50">
            <span className="text-sm font-medium text-[var(--foreground)]">{currentTime}</span>
            <div className="flex items-center gap-2">
              {viewMode === 'martha' && (
                <span className="text-xs text-[var(--sage)] font-medium">●</span>
              )}
              <span className="text-sm text-[var(--muted-foreground)]">{currentDate}</span>
            </div>
          </div>

          {/* Screen content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="screen-enter"
            >
              <CurrentScreenComponent />
            </motion.div>
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-around bg-[var(--cream-dark)]/80 py-2.5 px-4 border-t border-[var(--border)]/50">
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen
              const Icon = item.icon
              return (
                <button
                  key={item.screen}
                  onClick={() => setScreen(item.screen)}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] min-h-[44px] justify-center relative transition-colors"
                  aria-label={item.label}
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-[var(--sage)]' : 'text-[var(--muted-foreground)]'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? 'text-[var(--sage)]' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-[var(--emergency)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[var(--sage)] rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
