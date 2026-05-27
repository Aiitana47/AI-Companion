'use client'

import { useState } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Bell, Shield, Volume2, Smartphone, Clock, Heart, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function SettingToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={enabled ? 'Enabled' : 'Disabled'}
    >
      {enabled ? (
        <ToggleRight size={28} className="text-[var(--sage)]" />
      ) : (
        <ToggleLeft size={28} className="text-[var(--muted-foreground)]" />
      )}
    </button>
  )
}

export default function FamilySettingsScreen() {
  const { goBack } = useCompanionStore()

  const [settings, setSettings] = useState({
    medicationAlerts: true,
    moodAlerts: true,
    emergencyAlerts: true,
    dailySummary: true,
    weeklyReport: true,
    soundEnabled: true,
    locationSharing: true,
    activityTracking: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'medicationAlerts' as const, label: 'Medication Alerts', description: 'Get notified when medications are taken or missed' },
        { key: 'moodAlerts' as const, label: 'Mood Alerts', description: 'Receive alerts about significant mood changes' },
        { key: 'emergencyAlerts' as const, label: 'Emergency Alerts', description: 'Immediate alerts for emergencies', alwaysOn: true },
      ],
    },
    {
      title: 'Reports',
      icon: Clock,
      items: [
        { key: 'dailySummary' as const, label: 'Daily Summary', description: 'Receive a daily summary at 9 PM' },
        { key: 'weeklyReport' as const, label: 'Weekly Report', description: 'Get a detailed report every Sunday' },
      ],
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { key: 'locationSharing' as const, label: 'Location Sharing', description: "Share Martha's location data" },
        { key: 'activityTracking' as const, label: 'Activity Tracking', description: 'Track daily activities and patterns' },
      ],
    },
  ]

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[var(--cream)]/90 backdrop-blur-sm px-5 pt-4 pb-3 border-b border-[var(--cream-dark)]"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[var(--cream-dark)] hover:bg-[var(--cream-dark)] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Settings</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Configure your preferences</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5 pb-8">
        {/* Companion Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--cream-dark)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--sage)] flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-[var(--foreground)]">Martha&apos;s Companion</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Smart Display · Living Room</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--sage)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--sage)]" />
                </span>
                <span className="text-[10px] font-medium text-[var(--sage-dark)]">Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {sections.map((section, sectionIndex) => {
          const SectionIcon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + sectionIndex * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <SectionIcon className="w-4 h-4 text-[var(--sage)]" />
                <h2 className="text-sm font-semibold text-[var(--foreground)]">{section.title}</h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--cream-dark)] overflow-hidden divide-y divide-[var(--cream-dark)]">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{item.description}</p>
                    </div>
                    {item.alwaysOn ? (
                      <ToggleRight size={28} className="text-[var(--sage)] flex-shrink-0" />
                    ) : (
                      <SettingToggle
                        enabled={settings[item.key]}
                        onToggle={() => toggleSetting(item.key)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* Sound Setting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-[var(--sage)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Sound</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cream-dark)] px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--foreground)]">Notification Sounds</span>
              <SettingToggle
                enabled={settings.soundEnabled}
                onToggle={() => toggleSetting('soundEnabled')}
              />
            </div>
            {settings.soundEnabled && (
              <div>
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-[var(--muted-foreground)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">Volume</span>
                  <span className="text-xs text-[var(--muted-foreground)] ml-auto">70%</span>
                </div>
                <div className="h-1.5 bg-[var(--cream-dark)] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[var(--sage)] rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Device Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-[var(--sage)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Device</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cream-dark)] overflow-hidden divide-y divide-[var(--cream-dark)]">
            {[
              { label: 'Device Name', value: 'Living Room Display' },
              { label: 'Firmware', value: 'v2.4.1' },
              { label: 'Last Sync', value: '2 minutes ago' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-[var(--muted-foreground)]">{item.label}</span>
                <span className="text-sm font-medium text-[var(--foreground)]">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <p className="text-center text-[10px] text-[var(--muted-foreground)] py-2">
          AI Emotional Companion v1.0.0 · Group 13
        </p>
      </div>
    </div>
  )
}
