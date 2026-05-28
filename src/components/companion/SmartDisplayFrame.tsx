'use client'

import { useCompanionStore, type Screen } from '@/lib/companion-store'
import { Menu, User, Bell, Home, Cloud, Sun, CloudRain, Music, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import HomeScreen from './HomeScreen'
import MoodCheckinScreen from './MoodCheckinScreen'
import MedicationReminderScreen from './MedicationReminderScreen'
import NavigationMenuScreen from './NavigationMenuScreen'
import ProactiveSuggestionScreen from './ProactiveSuggestionScreen'
import ProfileScreen from './ProfileScreen'
import AlertsScreen from './AlertsScreen'
import EmergencyScreen from './EmergencyScreen'
import CallScreen from './CallScreen'
import MusicScreen from './MusicScreen'
import ActivitiesScreen from './ActivitiesScreen'
import AppointmentsScreen from './AppointmentsScreen'
import WellnessTipsScreen from './WellnessTipsScreen'
import SleepTrackerScreen from './SleepTrackerScreen'
import PhotoGalleryScreen from './PhotoGalleryScreen'
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
  'music': MusicScreen,
  'activities': ActivitiesScreen,
  'appointments': AppointmentsScreen,
  'wellness-tips': WellnessTipsScreen,
  'sleep-tracker': SleepTrackerScreen,
  'photo-gallery': PhotoGalleryScreen,
  'family-messages': HomeScreen,
  'family-settings': HomeScreen,
}

// Mock weather data
const weatherInfo = {
  icon: Sun,
  temp: '18°C',
  label: 'Sunny',
}

export default function SmartDisplayFrame() {
  const { currentScreen, setScreen, isEmergencyActive, alerts, viewMode, navigationDirection, isPlaying, currentTrack } = useCompanionStore()

  // Real-time clock - updates every second for smooth clock hands
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // Subscribe to timer updates - setNow in the interval callback is fine
    // (only the synchronous setNow in the effect body is problematic)
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    // Set initial time via a microtask to avoid synchronous setState in effect
    queueMicrotask(() => setNow(new Date()))
    return () => clearInterval(interval)
  }, [])

  const timeStr = now ? now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'
  const dateStr = now ? now.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }) : ''
  const hours = now ? now.getHours() : 0
  const minutes = now ? now.getMinutes() : 0
  // Clock hand angles
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6

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
              <div className="flex items-center gap-2">
                {/* Mini analog clock */}
                <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
                  <circle cx="10" cy="10" r="9" fill="none" stroke="var(--sage)" strokeWidth="1" opacity="0.4" />
                  {/* Hour markers */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                    <line
                      key={angle}
                      x1="10" y1="2" x2="10" y2="3"
                      stroke="var(--muted-foreground)" strokeWidth="0.5"
                      transform={`rotate(${angle} 10 10)`}
                    />
                  ))}
                  {/* Hour hand */}
                  <line
                    x1="10" y1="10" x2="10" y2="5"
                    stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round"
                    transform={`rotate(${hourAngle} 10 10)`}
                  />
                  {/* Minute hand */}
                  <line
                    x1="10" y1="10" x2="10" y2="3.5"
                    stroke="var(--sage-dark)" strokeWidth="1" strokeLinecap="round"
                    transform={`rotate(${minuteAngle} 10 10)`}
                  />
                  {/* Center dot */}
                  <circle cx="10" cy="10" r="1" fill="var(--sage)" />
                </svg>
                <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">{timeStr}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Weather icon and temperature */}
                <div className="flex items-center gap-1">
                  <WeatherIcon size={14} className="text-[var(--warm-orange)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">{weatherInfo.temp}</span>
                </div>
                {/* Mini music indicator */}
                {isPlaying && currentTrack && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setScreen('music') }}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--sage)]/15 hover:bg-[var(--sage)]/25 transition-colors"
                  >
                    <Music size={10} className="text-[var(--sage)]" />
                    <span className="text-[9px] font-medium text-[var(--sage-dark)]">{currentTrack.title}</span>
                  </button>
                )}
                {viewMode === 'martha' && !isPlaying && (
                  <span className="text-xs text-[var(--sage)] font-medium">●</span>
                )}
                <span className="text-sm text-[var(--muted-foreground)]">{dateStr}</span>
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
