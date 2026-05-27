'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { Menu, User, Bell, Home, Cloud, Sun, CloudRain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import HomeScreen from './HomeScreen'
import MoodCheckinScreen from './MoodCheckinScreen'
import MedicationReminderScreen from './MedicationReminderScreen'
import NavigationMenuScreen from './NavigationMenuScreen'
import ProactiveSuggestionScreen from './ProactiveSuggestionScreen'
import ProfileScreen from './ProfileScreen'
import AlertsScreen from './AlertsScreen'
import EmergencyScreen from './EmergencyScreen'
import CallScreen from './CallScreen'
import CompanionToast from './CompanionToast'

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

// Mock weather data
const weatherInfo = {
  icon: Sun,
  temp: '18°C',
  label: 'Sunny',
}

export default function SmartDisplayFrame() {
  const { currentScreen, currentTime, currentDate, setScreen, isEmergencyActive, alerts, viewMode, navigationDirection } = useCompanionStore()

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

  const slideDirection = navigationDirection === 'forward' ? 1 : navigationDirection === 'backward' ? -1 : 0

  const WeatherIcon = weatherInfo.icon

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Soft glow effect behind the device */}
      <div className="relative">
        <div className="absolute -inset-4 bg-[var(--sage)]/10 rounded-[2.5rem] blur-2xl" />
        
        {/* Device bezel with fabric-like texture */}
        <div 
          className="relative rounded-3xl p-2.5 sm:p-3 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #3A3A3A 0%, #2D2D2D 30%, #252525 70%, #2D2D2D 100%)',
          }}
        >
          {/* Speaker grille and camera area at top */}
          <div className="flex items-center justify-center gap-6 py-1.5 px-4">
            {/* Camera dot */}
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#444]" />
              <div className="absolute top-0 left-0 w-1 h-1 rounded-full bg-[#333]" />
            </div>
            {/* Speaker grille */}
            <div className="flex items-center gap-[3px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[2px] h-[2px] rounded-full bg-[#444]" />
              ))}
            </div>
            {/* Sensor dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-[#3a3a3a]" />
          </div>

          {/* Screen area */}
          <div className="rounded-2xl bg-[var(--cream)] overflow-hidden flex flex-col" style={{ height: '640px' }}>
            {/* Status bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 bg-[var(--cream-dark)]/60 border-b border-[var(--border)]/50">
              <span className="text-sm font-medium text-[var(--foreground)]">{currentTime}</span>
              <div className="flex items-center gap-3">
                {/* Weather icon and temperature */}
                <div className="flex items-center gap-1">
                  <WeatherIcon size={14} className="text-[var(--warm-orange)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">{weatherInfo.temp}</span>
                </div>
                {viewMode === 'martha' && (
                  <span className="text-xs text-[var(--sage)] font-medium">●</span>
                )}
                <span className="text-sm text-[var(--muted-foreground)]">{currentDate}</span>
              </div>
            </div>

            {/* Toast notification area */}
            <CompanionToast />

            {/* Screen content - scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="min-h-full"
              >
                <CurrentScreenComponent />
              </motion.div>
            </div>

            {/* Bottom navigation - always visible */}
            <div className="flex-shrink-0 flex items-center justify-around bg-[var(--cream-dark)]/80 py-2.5 px-4 border-t border-[var(--border)]/50">
              {navItems.map((item) => {
                const isActive = currentScreen === item.screen
                const Icon = item.icon
                return (
                  <button
                    key={item.screen}
                    onClick={(e) => {
                      e.stopPropagation()
                      setScreen(item.screen)
                    }}
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
    </div>
  )
}
